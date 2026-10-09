import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getMetadata, uploadBytes, deleteObject } from 'firebase/storage';
let env;
before(async()=>{env=await initializeTestEnvironment({projectId:'demo-nexo',firestore:{host:'127.0.0.1',port:8080,rules:await readFile('firestore.rules','utf8')},storage:{host:'127.0.0.1',port:9199,rules:await readFile('storage.rules','utf8')}});});
after(async()=>{await env?.cleanup();});
function record(){return {ownerId:'alice',title:'Prueba',description:'',discipline:'Paisaje',location:'',tags:[],date:'2026-10-09',visibility:'private',photos:[{id:'photo',title:'Foto',path:'users/alice/albums/work/photo.jpg'}],revision:1,updatedAt:serverTimestamp()};}
test('Firestore: solo el dueño puede crear, leer y modificar su serie',async()=>{
 const alice=env.authenticatedContext('alice').firestore();const bob=env.authenticatedContext('bob').firestore();const anon=env.unauthenticatedContext().firestore();
 await assertSucceeds(setDoc(doc(alice,'users/alice/albums/work'),record()));
 await assertSucceeds(getDoc(doc(alice,'users/alice/albums/work')));
 await assertFails(getDoc(doc(bob,'users/alice/albums/work')));
 await assertFails(getDoc(doc(anon,'users/alice/albums/work')));
 await assertFails(setDoc(doc(bob,'users/alice/albums/work'),{...record(),revision:2}));
 await assertFails(setDoc(doc(alice,'users/alice/albums/work'),record()));
 await assertSucceeds(setDoc(doc(alice,'users/alice/albums/work'),{...record(),revision:2}));
});
test('Firestore: no permite publicar ni cambiar el dueño',async()=>{
 const alice=env.authenticatedContext('alice').firestore();
 await assertFails(setDoc(doc(alice,'users/alice/albums/public'),{...record(),visibility:'public'}));
 await assertFails(setDoc(doc(alice,'users/alice/albums/foreign'),{...record(),ownerId:'bob'}));
});
test('Firestore: perfil y guardados permanecen privados',async()=>{
 const alice=env.authenticatedContext('alice').firestore();const bob=env.authenticatedContext('bob').firestore();
 await assertSucceeds(setDoc(doc(alice,'users/alice'),{name:'Artista',bio:'',location:'',discipline:''}));
 await assertFails(getDoc(doc(bob,'users/alice')));
 await assertSucceeds(setDoc(doc(alice,'users/alice/preferences/saved'),{ids:['sur']}));
 await assertFails(getDoc(doc(bob,'users/alice/preferences/saved')));
});
test('Storage: dueño autorizado y otras cuentas rechazadas',async()=>{
 const alice=env.authenticatedContext('alice').storage();const bob=env.authenticatedContext('bob').storage();const anon=env.unauthenticatedContext().storage();
 const path='users/alice/albums/work/owner.jpg';
 await assertSucceeds(uploadBytes(ref(alice,path),new Uint8Array([1,2,3]),{contentType:'image/jpeg'}));
 await assertSucceeds(getMetadata(ref(alice,path)));
 await assertFails(getMetadata(ref(bob,path)));
 await assertFails(getMetadata(ref(anon,path)));
 await assertFails(deleteObject(ref(bob,path)));
 await assertFails(uploadBytes(ref(bob,'users/alice/albums/work/bob.jpg'),new Uint8Array([1]),{contentType:'image/jpeg'}));
});
test('Storage: rechaza tipos no admitidos, archivos grandes y sobrescritura',async()=>{
 const alice=env.authenticatedContext('alice').storage();
 await assertFails(uploadBytes(ref(alice,'users/alice/albums/work/file.txt'),new Uint8Array([1]),{contentType:'text/plain'}));
 await assertFails(uploadBytes(ref(alice,'users/alice/albums/work/big.jpg'),new Uint8Array(5*1024*1024),{contentType:'image/jpeg'}));
 await assertFails(uploadBytes(ref(alice,'users/alice/albums/work/owner.jpg'),new Uint8Array([1]),{contentType:'image/jpeg'}));
 await assertSucceeds(deleteObject(ref(alice,'users/alice/albums/work/owner.jpg')));
});
