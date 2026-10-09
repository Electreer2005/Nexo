import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { authErrorMessage } from '../lib/authErrors';
import { read, profileKey } from '../studio/storage';

function account(firebaseUser) {
  if (!firebaseUser) return null;
  const local = read(profileKey(firebaseUser.email || firebaseUser.uid), {});
  return { id:firebaseUser.uid, uid:firebaseUser.uid, emailVerified:firebaseUser.emailVerified, email:firebaseUser.email || '', name:firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Artista', bio:local.bio || '', location:local.location || '', discipline:local.discipline || '' };
}
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let generation=0;let active=true;
    const stop=onAuthStateChanged(auth, async current => {
      const own=++generation;const base=account(current);setUser(base);setLoading(false);
      if(current) try { const {readRemoteProfile}=await import('../lib/cloudArchive');const profile=await readRemoteProfile(current.uid);if(active&&own===generation)setUser({...base,...profile,name:auth.currentUser?.displayName || profile.name || base.name,uid:current.uid,id:current.uid,email:current.email}); }
      catch { if(active&&own===generation)setError('No se pudo cargar el perfil de Firestore. Revisá configuración y permisos.'); }
    },err=>{setError(authErrorMessage(err));setLoading(false);});
    return()=>{active=false;stop();};
  }, []);
  async function login(email, password) { const result = await signInWithEmailAndPassword(auth, email.trim(), password); setUser(account(result.user)); }
  async function register(name, email, password) {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    try { await updateProfile(result.user, { displayName:name.trim() }); }
    catch { setError('Tu cuenta se creó, pero no se pudo guardar el nombre. Podés volver a editarlo desde tu perfil.'); }
    setUser(account(result.user));
  }
  async function updateUser(next) {
    if (!next) { await signOut(auth); setUser(null); return; }
    if (!auth.currentUser) throw new Error('La sesión expiró.');
    await updateProfile(auth.currentUser, { displayName:next.name });
    const {saveRemoteProfile}=await import('../lib/cloudArchive');
    await saveRemoteProfile(user.uid,next);
    setUser({...account(auth.currentUser),bio:next.bio,location:next.location,discipline:next.discipline});
  }
  return { user, loading, error, login, register, updateUser };
}
