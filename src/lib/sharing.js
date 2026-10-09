import { collection, collectionGroup, deleteDoc, doc, getFirestore, onSnapshot, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { getIdToken, reload, sendEmailVerification } from 'firebase/auth';
import { app, auth } from './firebase';
const db = () => getFirestore(app);
function emailId(email) {
  const value = email.trim().toLowerCase();
  if (value.length > 254 || !/^[^\s/@]+@[^\s/@]+\.[^\s/@]+$/.test(value)) throw new Error('Ingresá un correo válido.');
  return value;
}
export function watchInvitations(uid, albumId, next, error) {
  return onSnapshot(collection(db(),'users',uid,'albums',albumId,'albumInvitations'), snapshot => next(snapshot.docs.map(item => ({...item.data(),id:item.id}))),error);
}
export async function inviteToAlbum(uid, albumId, email) {
  const recipient = emailId(email);
  if (recipient === auth.currentUser?.email?.toLowerCase()) throw new Error('Ya sos el dueño de esta serie.');
  await runTransaction(db(), async transaction => {
    const target = doc(db(),'users',uid,'albums',albumId); const snapshot = await transaction.get(target);
    if (!snapshot.exists()) throw new Error('La serie ya no existe.');
    const album = snapshot.data(); const shareKey = album.shareKey || crypto.randomUUID();
    if (!album.shareKey) transaction.update(target,{shareKey,revision:album.revision+1,updatedAt:serverTimestamp()});
    transaction.set(doc(target,'albumInvitations',recipient),{recipientEmail:recipient,ownerId:uid,albumId,shareKey,title:album.title,createdAt:serverTimestamp()});
  });
}
export function revokeInvitation(uid,albumId,email) { return deleteDoc(doc(db(),'users',uid,'albums',albumId,'albumInvitations',emailId(email))); }
export function watchReceived(email,next,error) {
  return onSnapshot(query(collectionGroup(db(),'albumInvitations'),where('recipientEmail','==',emailId(email))), snapshot => next(snapshot.docs.map(item=>({...item.data(),id:item.ref.path}))),error);
}
export function watchSharedAlbum(ownerId,albumId,next,error) {
  return onSnapshot(doc(db(),'users',ownerId,'albums',albumId), snapshot=>next(snapshot.exists()?{...snapshot.data(),id:snapshot.id,owned:false,shared:true,author:'Archivo compartido'}:null),error);
}
export async function verifyEmail() { if (!auth.currentUser) throw new Error('Iniciá sesión primero.'); await sendEmailVerification(auth.currentUser); }
export async function refreshVerification() { await reload(auth.currentUser); await getIdToken(auth.currentUser,true); return auth.currentUser.emailVerified; }
