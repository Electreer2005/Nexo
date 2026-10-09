import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { collections } from './data';
import { read } from './storage';
import { validateArchive } from './archive';
import useCloudArchive from '../hooks/useCloudArchive';
import { cloudError, deleteAlbum, mergeSaved, saveAlbum, toggleSaved } from '../lib/cloudArchive';
import StudioHeader from './components/StudioHeader';
import StudioFooter from './components/StudioFooter';
import CollectionPage from './pages/CollectionPage';
import Detail from './pages/Detail';
import Create from './pages/Create';
import Author from './pages/Author';
import NotFound from './pages/NotFound';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import Shared, { SharedDetail } from './pages/Shared';
import Learn from './pages/Learn';
import './studio.css';

export default function Studio({ user, setUser }) {
  const location = useLocation();
  const cloud = useCloudArchive(user.uid);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const albums = [...cloud.albums.map(a => ({ ...a, author:user.name })), ...collections];
  async function save(id) { try { await toggleSaved(user.uid,id); } catch (err) { setError(cloudError(err)); } }
  async function create(album, progress) { cloud.upsert(await saveAlbum(user.uid,album,null,progress)); }
  async function update(album, progress) { cloud.upsert(await saveAlbum(user.uid,album,cloud.albums.find(a => a.id === album.id),progress)); }
  async function logout() { try { await setUser(null); } catch { setError('No se pudo cerrar la sesión. Volvé a intentar.'); } }
  async function importArchive(data, progress) {
    const archive = validateArchive(data);
    if (archive.albums.some(a => collections.some(item => item.id === a.id))) throw new Error('La copia contiene identificadores reservados para las series de ejemplo.');
    const known = new Set(cloud.albums.map(a => a.id)); let imported=0;
    try {
      for (const album of archive.albums) {
        if (known.has(album.id)) continue;
        progress?.(`Importando serie ${imported+1}…`);
        await saveAlbum(user.uid,album,null); imported++; known.add(album.id);
      }
      await mergeSaved(user.uid,archive.saved.filter(id => known.has(id) || collections.some(a => a.id === id)));
    } catch (err) { throw new Error(`Se importaron ${imported} series. ${cloudError(err)} Podés reintentar; las series existentes no se reemplazan.`, {cause:err}); }
    return imported;
  }
  function importLocal(progress) {
    const scope=encodeURIComponent(user.email.toLowerCase());
    return importArchive({version:1,albums:read(`nexo:studio:${scope}`,[]),saved:read(`nexo:saved:${scope}`,[])},progress);
  }
  async function remove(id) {
    try {
      const album=cloud.albums.find(a => a.id === id); if (!album) return false;
      const clean=await deleteAlbum(user.uid,album);
      setNotice(clean ? 'Serie eliminada.' : 'Serie eliminada. Algunas imágenes no pudieron borrarse de Storage; requieren limpieza.'); return true;
    } catch (err) { setError(cloudError(err)); return false; }
  }
  const archiveUnavailable = cloud.loading || cloud.error;
  return <div className="studio-shell"><a className="skip-link" href="#studio-main">Saltar al contenido</a><StudioHeader user={user} onLogout={logout} /><main id="studio-main" className="studio-main">
    <p role="status" className="status-message">{notice}</p>{(error || cloud.error) && <div className="cloud-error" role="alert"><p>{error || cloud.error}</p><button className="outline-button" onClick={() => window.location.reload()}>Volver a cargar</button></div>}
    {archiveUnavailable ? <div role="status" className="empty-collection">{cloud.loading ? 'Cargando tu archivo de Firebase…' : 'Tu archivo no pudo cargarse. Revisá la configuración y volvé a intentar.'}</div> : <Routes>
      <Route path="/" element={<CollectionPage albums={albums} saved={cloud.saved} onSave={save} />} />
      <Route path="/explorar" element={<CollectionPage albums={albums} saved={cloud.saved} onSave={save} />} />
      <Route path="/mis-albumes" element={<CollectionPage albums={albums} saved={cloud.saved} onSave={save} mode="mine" />} />
      <Route path="/favoritos" element={<CollectionPage albums={albums} saved={cloud.saved} onSave={save} mode="saved" />} />
      <Route path="/compartidos" element={<Shared user={user} />} />
      <Route path="/compartido/:ownerId/:albumId" element={<SharedDetail key={location.pathname} />} />
      <Route path="/crear" element={<Create user={user} onCreate={create} />} />
      <Route path="/album/:id" element={<Detail key={location.pathname} albums={albums} saved={cloud.saved} onSave={save} onDelete={remove} user={user} />} />
      <Route path="/album/:id/editar" element={<Create key={location.pathname} user={user} albums={albums} onUpdate={update} />} />
      <Route path="/perfil/editar" element={<EditProfile user={user} onUpdate={setUser} />} />
      <Route path="/ajustes" element={<Settings user={user} albums={cloud.albums} saved={cloud.saved} onImport={importArchive} onImportLocal={importLocal} />} />
      <Route path="/aprender" element={<Learn />} /><Route path="/aprender/:id" element={<Learn />} />
      <Route path="/autor/:name" element={<Author albums={albums} user={user} />} /><Route path="/perfil" element={<Author albums={albums} user={user} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>}
  </main><StudioFooter /></div>;
}
