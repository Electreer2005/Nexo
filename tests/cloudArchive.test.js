import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks=vi.hoisted(()=>({ upload:vi.fn(),remove:vi.fn(),transaction:vi.fn(),get:vi.fn(),set:vi.fn(),del:vi.fn() }));
vi.mock('../src/lib/firebase',()=>({app:{}}));
vi.mock('firebase/storage',()=>({ getStorage:()=>({}),ref:(_,path)=>path,uploadString:mocks.upload,deleteObject:mocks.remove,getBlob:vi.fn() }));
vi.mock('firebase/firestore',()=>({ getFirestore:()=>({}),collection:vi.fn(),doc:(_, ...path)=>path.join('/'),getDoc:vi.fn(),onSnapshot:vi.fn(),runTransaction:mocks.transaction,serverTimestamp:()=> 'server-time',setDoc:vi.fn() }));
import { deleteAlbum, saveAlbum, toggleSaved } from '../src/lib/cloudArchive';
const input=()=>({id:'series',title:'Trabajo',description:'',discipline:'Paisaje',location:'',tags:[],date:'2026-10-09',photos:[{id:'photo',title:'Foto',src:'data:image/jpeg;base64,YQ=='}]});
beforeEach(()=>{
 vi.clearAllMocks();mocks.upload.mockResolvedValue({});mocks.remove.mockResolvedValue({});
 mocks.get.mockResolvedValue({exists:()=>false});mocks.transaction.mockImplementation((_,callback)=>callback({get:mocks.get,set:mocks.set,delete:mocks.del}));
});
describe('Archivo privado remoto',()=>{
 it('sube fotos a la ruta del dueño y guarda solo metadatos',async()=>{
  const result=await saveAlbum('alice',input());
  expect(mocks.upload.mock.calls[0][0]).toMatch(/^users\/alice\/albums\/series\//);
  expect(mocks.set.mock.calls[0][0]).toBe('users/alice/albums/series');
  expect(result.ownerId).toBe('alice');expect(result.visibility).toBe('private');expect(result.revision).toBe(1);
  expect(result.photos[0]).not.toHaveProperty('src');expect(result.photos[0].path).toMatch(/^users\/alice\//);
 });
 it('conserva imágenes existentes y elimina retiradas después de confirmar la escritura',async()=>{
  const retained='users/alice/albums/series/keep.jpg', retired='users/alice/albums/series/old.jpg';
  const previous={revision:2,photos:[{path:retained},{path:retired}]};
  mocks.get.mockResolvedValue({exists:()=>true,data:()=>({revision:2})});
  const album={...input(),photos:[{id:'photo',title:'Nueva leyenda',path:retained}]};
  const result=await saveAlbum('alice',album,previous);expect(result.revision).toBe(3);
  expect(mocks.upload).not.toHaveBeenCalled();expect(mocks.remove).toHaveBeenCalledWith(retired);
  expect(mocks.remove.mock.invocationCallOrder[0]).toBeGreaterThan(mocks.set.mock.invocationCallOrder[0]);
 });
 it('rechaza ediciones obsoletas y evita borrar fotos ante un fallo durante el commit',async()=>{
  mocks.get.mockResolvedValue({exists:()=>true,data:()=>({revision:3})});
  await expect(saveAlbum('alice',input(),{revision:2,photos:[]})).rejects.toThrow('otro dispositivo');
  expect(mocks.set).not.toHaveBeenCalled();expect(mocks.remove).not.toHaveBeenCalled();
 });
 it('limpia subidas previas si falla otra imagen antes de escribir',async()=>{
  const album=input();album.photos.push({...album.photos[0],id:'second'});
  mocks.upload.mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('sin conexión'));
  await expect(saveAlbum('alice',album)).rejects.toThrow('sin conexión');expect(mocks.remove).toHaveBeenCalledTimes(1);expect(mocks.transaction).not.toHaveBeenCalled();
 });
 it('rechaza una referencia a las fotos de otra cuenta',async()=>{
  const album={...input(),photos:[{id:'photo',title:'Foto',path:'users/bob/albums/series/private.jpg'}]};
  await expect(saveAlbum('alice',album,{revision:1,photos:[]})).rejects.toThrow('Ruta de imagen inválida');expect(mocks.set).not.toHaveBeenCalled();
 });
 it('no elimina imágenes si la eliminación del documento falla',async()=>{
  mocks.transaction.mockRejectedValue(new Error('permisos'));
  await expect(deleteAlbum('alice',{id:'series',revision:1,photos:[{path:'users/alice/albums/series/a.jpg'}]})).rejects.toThrow('permisos');expect(mocks.remove).not.toHaveBeenCalled();
 });
 it('informa una limpieza incompleta después de borrar el documento',async()=>{
  mocks.get.mockResolvedValue({exists:()=>true,data:()=>({revision:1})});mocks.remove.mockRejectedValue(new Error('sin conexión'));
  expect(await deleteAlbum('alice',{id:'series',revision:1,photos:[{path:'users/alice/albums/series/a.jpg'}]})).toBe(false);expect(mocks.del).toHaveBeenCalled();
 });
 it('actualiza guardados leyendo su valor dentro de una transacción',async()=>{
  mocks.get.mockResolvedValue({data:()=>({ids:['sur','series']})});await toggleSaved('alice','sur');expect(mocks.set).toHaveBeenCalledWith('users/alice/preferences/saved',{ids:['series']});
 });
});
