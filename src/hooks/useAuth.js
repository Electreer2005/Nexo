import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { authErrorMessage } from '../lib/authErrors';
import { read, profileKey } from '../studio/storage';

function account(firebaseUser) {
  if (!firebaseUser) return null;
  const local = read(profileKey(firebaseUser.email || firebaseUser.uid), {});
  return { id:firebaseUser.uid, uid:firebaseUser.uid, email:firebaseUser.email || '', name:firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Artista', bio:local.bio || '', location:local.location || '', discipline:local.discipline || '' };
}
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => onAuthStateChanged(auth, current => { setUser(account(current)); setLoading(false); }, err => { setError(authErrorMessage(err)); setLoading(false); }), []);
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
    localStorage.setItem(profileKey(user.email), JSON.stringify(next));
    setUser(account(auth.currentUser));
  }
  return { user, loading, error, login, register, updateUser };
}
