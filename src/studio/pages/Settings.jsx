import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';
export default function Settings({ user, albums, saved, onImport }) {
  const [message, setMessage] = useState(''); const [error, setError] = useState('');
  function exportArchive() {
    const blob = new Blob([JSON.stringify({ version: 1, albums, saved }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'nexo-archivo.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setMessage('Copia del archivo preparada para descargar.');
  }
  async function importArchive(event) {
    const file = event.target.files[0]; if (!file) return;
    setError(''); setMessage('');
    try { if (file.size > 10 * 1024 * 1024) throw new Error('La copia no puede superar 10 MB.'); const data = JSON.parse(await file.text()); onImport(data); setMessage('Series y guardados incorporados a tu archivo.'); }
    catch (err) { setError(err.message || 'No se pudo importar esta copia.'); }
    finally { event.target.value = ''; }
  }
  return <><PageIntro eyebrow="AJUSTES" title="Cuidá tu archivo.">Administrá tu perfil y llevate una copia de tu trabajo.</PageIntro><div className="settings-grid"><section className="info-panel"><h2>Tu cuenta</h2><p>{user.email}</p><Link className="text-link" to="/perfil/editar">Editar mi perfil →</Link><p>El acceso usa Firebase Authentication. Podés recuperar tu contraseña desde la pantalla de acceso.</p></section><section className="info-panel"><h2>Archivo local</h2><p>{albums.length} series · {albums.reduce((sum,a) => sum + a.photos.length,0)} imágenes · {saved.length} guardados</p><p>Las fotos son copias optimizadas. Conservá tus originales por separado; borrar los datos del navegador elimina este archivo.</p><button className="outline-button" onClick={exportArchive}>Descargar copia del archivo</button><label className="import-label">Restaurar copia JSON<input type="file" accept="application/json,.json" onChange={importArchive} /></label></section><section className="info-panel"><h2>Compartir y publicar</h2><p>Las series nuevas son privadas y locales. Las invitaciones, la publicación y la sincronización entre dispositivos llegarán con el backend.</p></section></div><p className="status-message" role="status">{message}</p>{error && <p role="alert" className="form-error">{error}</p>}</>;
}
