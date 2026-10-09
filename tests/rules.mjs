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

test('Invitaciones: lectura verificada, consulta por destinatario y revocación',async()=>{
 const {collectionGroup,query,where,getDocs,deleteDoc,writeBatch}=await import('firebase/firestore');
 const alice=env.authenticatedContext('alice',{email:'alice@test.com',email_verified:true}).firestore();
 const bobContext=env.authenticatedContext('bob',{email:'Bob@test.com',email_verified:true});const bob=bobContext.firestore();
 const unverified=env.authenticatedContext('bob-unverified',{email:'bob@test.com',email_verified:false}).firestore();
 const charlie=env.authenticatedContext('charlie',{email:'charlie@test.com',email_verified:true}).firestore();
 const album='users/alice/albums/shared';const invitation=album+'/albumInvitations/bob@test.com';
 await assertSucceeds(setDoc(doc(alice,album),{...record(),shareKey:'unique-generation'}));
 await assertSucceeds(setDoc(doc(alice,invitation),{recipientEmail:'bob@test.com',ownerId:'alice',albumId:'shared',shareKey:'unique-generation',title:'Prueba',createdAt:serverTimestamp()}));
 await assertSucceeds(getDoc(doc(bob,album)));await assertFails(getDoc(doc(unverified,album)));await assertFails(getDoc(doc(charlie,album)));
 await assertSucceeds(getDocs(query(collectionGroup(bob,'albumInvitations'),where('recipientEmail','==','bob@test.com'))));
 await assertFails(getDocs(collectionGroup(bob,'albumInvitations')));
 await assertFails(setDoc(doc(bob,album),{...record(),shareKey:'unique-generation',revision:2}));await assertFails(deleteDoc(doc(bob,invitation)));
 const storage=env.authenticatedContext('alice').storage();const path='users/alice/albums/shared/photo.jpg';
 await assertSucceeds(uploadBytes(ref(storage,path),new Uint8Array([1]),{contentType:'image/jpeg'}));
 await assertSucceeds(getMetadata(ref(bobContext.storage(),path)));
 await assertFails(deleteObject(ref(bobContext.storage(),path)));
 await assertSucceeds(deleteDoc(doc(alice,invitation)));await assertFails(getDoc(doc(bob,album)));await assertFails(getMetadata(ref(bobContext.storage(),path)));
 // Una invitación vieja no debe abrir una serie recreada con el mismo ID.
 await setDoc(doc(alice,invitation),{recipientEmail:'bob@test.com',ownerId:'alice',albumId:'shared',shareKey:'unique-generation',title:'Prueba',createdAt:serverTimestamp()});
 await deleteDoc(doc(alice,album));await setDoc(doc(alice,album),{...record(),shareKey:'new-generation'});await assertFails(getDoc(doc(bob,album)));await assertFails(getMetadata(ref(bobContext.storage(),path)));
 // Migración atómica de los álbumes anteriores, sin shareKey.
 const legacy='users/alice/albums/legacy';await setDoc(doc(alice,legacy),record());const batch=writeBatch(alice);
 batch.update(doc(alice,legacy),{shareKey:'legacy-key',revision:2,updatedAt:serverTimestamp()});batch.set(doc(alice,legacy+'/albumInvitations/bob@test.com'),{recipientEmail:'bob@test.com',ownerId:'alice',albumId:'legacy',shareKey:'legacy-key',title:'Prueba',createdAt:serverTimestamp()});
 await assertSucceeds(batch.commit());await assertSucceeds(getDoc(doc(bob,legacy)));
});
