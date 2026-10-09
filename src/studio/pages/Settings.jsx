import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro';
import { exportCloudArchive } from '../../lib/backup';
export default function Settings({ user, albums, saved, onImport, onImportLocal }) {
  const [message,setMessage]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  async function operation(task) {
    if (busy) return; setBusy(true);setError('');setMessage('Procesando archivo…');
    try { await task(); } catch (err) { setError(err.message || 'No se pudo completar la operación.');setMessage(''); } finally { setBusy(false); }
  }
  function exportArchive() {
    return operation(async () => {
      const data=await exportCloudArchive(albums,saved);const blob=new Blob([JSON.stringify(data)],{type:'application/json'});
      const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='nexo-archivo.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage('Copia preparada para descargar.');
    });
  }
  async function importArchive(event) {
    const file=event.target.files[0];if (!file) return;
    await operation(async () => { if(file.size>100*1024*1024) throw new Error('La copia no puede superar 100 MB.');const count=await onImport(JSON.parse(await file.text()),setMessage);setMessage(`${count} series importadas a Firebase. Las existentes no se reemplazaron.`); });event.target.value='';
  }
  return <><PageIntro eyebrow="AJUSTES" title="Cuidá tu archivo.">Tu trabajo se guarda en tu cuenta. Podés llevarte una copia y recuperar tu archivo anterior.</PageIntro><div className="settings-grid"><section className="info-panel"><h2>Tu cuenta</h2><p>{user.email}</p><Link className="text-link" to="/perfil/editar">Editar mi perfil →</Link><p>El acceso usa Firebase Authentication. Tu perfil se guarda en Firestore.</p></section><section className="info-panel"><h2>Archivo en Firebase</h2><p>{albums.length} series · {albums.reduce((sum,a)=>sum+a.photos.length,0)} imágenes · {saved.length} guardados</p><p>Se guardan copias optimizadas. Conservá tus originales por separado.</p><button className="outline-button" disabled={busy} onClick={exportArchive}>Descargar copia del archivo</button><label className="import-label">Restaurar copia JSON<input type="file" accept="application/json,.json" disabled={busy} onChange={importArchive} /></label></section><section className="info-panel"><h2>Tu archivo anterior</h2><p>Importá las series y guardados de este navegador a tu cuenta. Las copias locales se conservan y las series existentes no se reemplazan.</p><button className="outline-button" disabled={busy} onClick={()=>operation(async()=>{const count=await onImportLocal(setMessage);setMessage(`${count} series locales importadas.`);})}>Importar archivo local</button><p>Las series nuevas son privadas. Las invitaciones y la publicación llegarán en la siguiente etapa.</p></section></div><p className="status-message" role="status">{message}</p>{error&&<p role="alert" className="form-error">{error}</p>}</>;
}
