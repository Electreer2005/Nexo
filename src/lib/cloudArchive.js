import { collection, doc, getDoc, getFirestore, onSnapshot, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { deleteObject, getBlob, getStorage, ref, uploadString } from 'firebase/storage';
import { app } from './firebase';
const getDatabase = async () => getFirestore(app);
const getPhotoStorage = async () => getStorage(app);

export function cloudError(error) {
  if (error?.code === 'permission-denied' || error?.code === 'storage/unauthorized') return 'No tenés permiso. Revisá que las reglas de Firestore y Storage estén publicadas.';
  if (error?.code === 'unavailable' || error?.code === 'storage/retry-limit-exceeded') return 'No se pudo conectar con Firebase. Revisá tu conexión y volvé a intentar.';
  return error?.message || 'No se pudo completar la operación.';
}
function safeId(value) { if (!/^[A-Za-z0-9_-]{1,100}$/.test(value)) throw new Error('Identificador de archivo inválido.'); return value; }
function photoPath(uid, albumId, value) { const prefix = `users/${uid}/albums/${albumId}/`; if (!value?.startsWith(prefix) || value.slice(prefix.length).includes('/')) throw new Error('Ruta de imagen inválida.'); return value; }

export async function watchAlbums(uid, onData, onError) {
  const db = await getDatabase();
  return onSnapshot(collection(db, 'users', uid, 'albums'), snapshot => {
    onData(snapshot.docs.map(item => ({ ...item.data(), id:item.id, owned:true })).sort((a,b) => b.date.localeCompare(a.date)));
  }, onError);
}
export async function photoBlob(path) { return getBlob(ref(await getPhotoStorage(), path), 5 * 1024 * 1024); }

export async function saveAlbum(uid, album, previous, onProgress = () => {}) {
  safeId(album.id);
  if (!album.photos.length || album.photos.length > 12) throw new Error('Agregá entre 1 y 12 fotos.');
  const db = await getDatabase(); const storage = await getPhotoStorage();
  const uploaded = []; const photos = []; let committing = false;
  try {
    for (let i=0; i<album.photos.length; i++) {
      const photo = album.photos[i]; safeId(photo.id);
      let path;
      if (photo.src?.startsWith('data:image/')) {
        path = `users/${uid}/albums/${album.id}/${crypto.randomUUID()}.jpg`;
        await uploadString(ref(storage,path), photo.src, 'data_url'); uploaded.push(path);
      } else {
        path = photoPath(uid,album.id,photo.path);
        if (!previous?.photos.some(p => p.path === path)) throw new Error('Esta imagen no pertenece a la versión actual de la serie.');
      }
      photos.push({ id:photo.id, title:photo.title.slice(0,100), path });
      onProgress(`Preparando foto ${i+1} de ${album.photos.length}…`);
    }
    const record = { ownerId:uid, title:album.title, description:album.description, discipline:album.discipline, location:album.location, tags:album.tags, date:album.date, visibility:'private', photos, revision:(previous?.revision || 0)+1, updatedAt:serverTimestamp() };
    committing = true;
    await runTransaction(db, async transaction => {
      const target = doc(db,'users',uid,'albums',album.id); const current = await transaction.get(target);
      if ((!previous && current.exists()) || (previous && (!current.exists() || current.data().revision !== previous.revision))) throw new Error('La serie cambió en otro dispositivo. Recargá antes de guardar.');
      transaction.set(target, record);
    });
    const retired = (previous?.photos || []).filter(p => !photos.some(next => next.path === p.path));
    await Promise.allSettled(retired.map(p => deleteObject(ref(storage, photoPath(uid,album.id,p.path)))));
    return { ...record, id:album.id, owned:true };
  } catch (error) {
    // Si la respuesta de la escritura se perdió, sus fotos pueden estar referenciadas.
    if (!committing) await Promise.allSettled(uploaded.map(path => deleteObject(ref(storage,path))));
    throw new Error(cloudError(error), {cause:error});
  }
}
export async function deleteAlbum(uid, album) {
  const db = await getDatabase(); const storage = await getPhotoStorage();
  await runTransaction(db, async transaction => {
    const target = doc(db,'users',uid,'albums',safeId(album.id)); const current = await transaction.get(target);
    if (!current.exists()) return;
    if (current.data().revision !== album.revision) throw new Error('La serie cambió. Recargá antes de eliminarla.');
    transaction.delete(target);
  });
  const results = await Promise.allSettled(album.photos.map(p => deleteObject(ref(storage, photoPath(uid,album.id,p.path)))));
  return results.every(r => r.status === 'fulfilled' || r.reason?.code === 'storage/object-not-found');
}
export async function watchSaved(uid, onData, onError) {
  const db = await getDatabase();
  return onSnapshot(doc(db,'users',uid,'preferences','saved'), snapshot => onData(snapshot.data()?.ids || []), onError);
}
export async function toggleSaved(uid, id) {
  const db = await getDatabase();
  await runTransaction(db, async transaction => {
    const target = doc(db,'users',uid,'preferences','saved'); const snapshot = await transaction.get(target); const ids = snapshot.data()?.ids || [];
    transaction.set(target, { ids:ids.includes(id) ? ids.filter(v => v !== id) : [...ids,id] });
  });
}
export async function mergeSaved(uid, incoming) {
  const db = await getDatabase();
  await runTransaction(db, async transaction => {
    const target = doc(db,'users',uid,'preferences','saved'); const snapshot = await transaction.get(target);
    transaction.set(target, { ids:[...new Set([...(snapshot.data()?.ids || []),...incoming])] });
  });
}
export async function saveRemoteProfile(uid, profile) {
  await setDoc(doc(await getDatabase(),'users',uid), { name:profile.name, bio:profile.bio || '', location:profile.location || '', discipline:profile.discipline || '' });
}
export async function readRemoteProfile(uid) { const snapshot = await getDoc(doc(await getDatabase(),'users',uid)); return snapshot.data() || {}; }
