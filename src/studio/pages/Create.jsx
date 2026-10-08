import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { disciplines } from '../data';
import PageIntro from '../components/PageIntro';
import UploadField from '../components/UploadField';
import NotFound from './NotFound';
async function prepareImage(file) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Usá imágenes JPG, PNG o WebP.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Cada imagen debe pesar menos de 15 MB.');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  return { id: crypto.randomUUID(), title: file.name.replace(/\.[^.]+$/, ''), src: canvas.toDataURL('image/jpeg', .76) };
}

export default function Create({ user, onCreate, albums, onUpdate }) {
  const { id } = useParams(); const existing = albums?.find(a => a.id === id && a.local);
  const navigate = useNavigate(); const [photos, setPhotos] = useState(existing?.photos || []); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function select(event) { const files = [...event.target.files]; setBusy(true); setError(''); try { if (photos.length + files.length > 12) throw new Error('Podés cargar hasta 12 imágenes por serie en esta versión local.'); const next = await Promise.all(files.map(prepareImage)); setPhotos(prev => [...prev, ...next]); } catch (e) { setError(e.message); } finally { setBusy(false); event.target.value = ''; } }
  if (id && !existing) return <NotFound />;
  function submit(event) { event.preventDefault(); if (!photos.length) { setError('Agregá al menos una imagen.'); return; } const form = new FormData(event.currentTarget); const album = { id: existing?.id || crypto.randomUUID(), title: form.get('title').trim(), description: form.get('description').trim(), discipline: form.get('discipline'), visibility: 'private', author: user.name || user.email.split('@')[0], location: form.get('location').trim(), tags: [...new Set(form.get('tags').split(',').map(t => t.trim()).filter(Boolean))], photos, cover: photos[0].src, date: existing?.date || new Date().toISOString().slice(0,10), local: true }; if (!album.title) { setError('Escribí un título.'); return; } try { if (existing) onUpdate(album); else onCreate(album); navigate(`/album/${album.id}`); } catch { setError('No hay espacio suficiente en este navegador. Quitá imágenes o eliminá una serie anterior.'); } }
  return <><PageIntro eyebrow="TU ESTUDIO" title={existing ? 'Afiná tu serie.' : 'Una serie nueva.'}>Seleccioná imágenes que dialoguen entre sí. La primera será tu portada.</PageIntro><form className="studio-form" onSubmit={submit}><label>Título<input name="title" defaultValue={existing?.title} required maxLength={100} placeholder="El nombre de tu serie" /></label><label>Descripción<textarea name="description" defaultValue={existing?.description} maxLength={1500} rows={4} placeholder="¿Qué querías contar con estas imágenes?" /></label><div className="form-columns"><label>Disciplina<select name="discipline" defaultValue={existing?.discipline}>{disciplines.slice(1).map(d => <option key={d}>{d}</option>)}</select></label><label>Ubicación<input name="location" defaultValue={existing?.location} maxLength={100} placeholder="Ciudad, región o estudio" /></label></div><label>Etiquetas<input name="tags" defaultValue={existing?.tags.join(", ")} maxLength={200} placeholder="Luz natural, Montaña, Retrato" /></label><UploadField photos={photos} busy={busy} onSelect={select} onChange={setPhotos} /><p className="local-note">Se guarda en este navegador, como archivo privado. Para publicar o invitar personas conectaremos el servidor. Se guardan copias optimizadas, no los originales.</p>{error && <p role="alert" className="form-error">{error}</p>}<button className="solid-button" disabled={busy} type="submit">{existing ? 'Guardar cambios' : 'Guardar serie'} <FaArrowRight /></button></form></>;
}
