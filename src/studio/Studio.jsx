import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { collections } from './data';
import { read, profileKey } from './storage';
import { validateArchive } from './archive';
import StudioHeader from './components/StudioHeader';
import StudioFooter from './components/StudioFooter';
import CollectionPage from './pages/CollectionPage';
import Detail from './pages/Detail';
import Create from './pages/Create';
import Author from './pages/Author';
import NotFound from './pages/NotFound';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Learn from './pages/Learn';
import './studio.css';

export default function Studio({ user, setUser }) {
  const location = useLocation();
  const scope = encodeURIComponent(user.email.toLowerCase()); const key = `nexo:studio:${scope}`; const savedKey = `nexo:saved:${scope}`;
  const [localAlbums, setLocalAlbums] = useState(() => read(key, [])); const [saved, setSaved] = useState(() => read(savedKey, [])); const [notice, setNotice] = useState('');
  const albums = [...localAlbums.map(a => ({ ...a, author: user.name || user.email.split("@")[0] })), ...collections];
  function save(id) { const next = saved.includes(id) ? saved.filter(v => v !== id) : [...saved, id]; try { localStorage.setItem(savedKey, JSON.stringify(next)); setSaved(next); } catch { setNotice('No se pudo guardar el favorito en este navegador.'); } }
  function create(album) { const next = [album, ...localAlbums]; localStorage.setItem(key, JSON.stringify(next)); setLocalAlbums(next); }
  function update(album) { const next = localAlbums.map(a => a.id === album.id ? album : a); localStorage.setItem(key, JSON.stringify(next)); setLocalAlbums(next); }
  function updateProfile(next) { localStorage.setItem(profileKey(user.email), JSON.stringify(next)); setUser(next); }
  function importArchive(data) {
    const archive = validateArchive(data);
    if (archive.albums.some(a => collections.some(item => item.id === a.id))) throw new Error("La copia contiene identificadores reservados para las series de ejemplo.");
    const next = [...localAlbums, ...archive.albums.filter(a => !localAlbums.some(item => item.id === a.id))].map(a => ({ ...a, author: user.name || user.email.split('@')[0] }));
    const nextSaved = [...new Set([...saved, ...archive.saved])].filter(id => [...next,...collections].some(a => a.id === id));
    const before = localStorage.getItem(key);
    try { localStorage.setItem(key, JSON.stringify(next)); localStorage.setItem(savedKey, JSON.stringify(nextSaved)); }
    catch { if (before === null) localStorage.removeItem(key); else localStorage.setItem(key, before); throw new Error('No hay espacio suficiente para restaurar esta copia.'); }
    setLocalAlbums(next); setSaved(nextSaved);
  }
  function remove(id) { try { const next = localAlbums.filter(a => a.id !== id); localStorage.setItem(key, JSON.stringify(next)); setLocalAlbums(next); return true; } catch { setNotice('No se pudo eliminar la serie.'); return false; } }
  return <div className="studio-shell"><a className="skip-link" href="#studio-main">Saltar al contenido</a><StudioHeader user={user} onLogout={() => setUser(null)} /><main id="studio-main" className="studio-main"><p role="status" className="status-message">{notice}</p><Routes><Route path="/" element={<CollectionPage albums={albums} saved={saved} onSave={save} />} /><Route path="/explorar" element={<CollectionPage albums={albums} saved={saved} onSave={save} />} /><Route path="/mis-albumes" element={<CollectionPage albums={albums} saved={saved} onSave={save} mode="mine" />} /><Route path="/favoritos" element={<CollectionPage albums={albums} saved={saved} onSave={save} mode="saved" />} /><Route path="/crear" element={<Create user={user} onCreate={create} />} /><Route path="/album/:id" element={<Detail key={location.pathname} albums={albums} saved={saved} onSave={save} onDelete={remove} />} /><Route path="/album/:id/editar" element={<Create key={location.pathname} user={user} albums={albums} onUpdate={update} />} /><Route path="/perfil/editar" element={<EditProfile user={user} onUpdate={updateProfile} />} /><Route path="/ajustes" element={<Settings user={user} albums={localAlbums} saved={saved} onImport={importArchive} />} /><Route path="/aprender" element={<Learn />} /><Route path="/aprender/:id" element={<Learn />} /><Route path="/autor/:name" element={<Author albums={albums} user={user} />} /><Route path="/perfil" element={<Author albums={albums} user={user} />} /><Route path="*" element={<NotFound />} /></Routes></main><StudioFooter /></div>;
}
