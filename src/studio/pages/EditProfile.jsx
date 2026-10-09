import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageIntro from '../components/PageIntro';
export default function EditProfile({ user, onUpdate }) {
  const navigate = useNavigate(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const name = form.get('name').trim();
    if (!name) { setError('Escribí el nombre que querés mostrar.'); return; }
    setBusy(true);
    try { await onUpdate({ ...user, name, bio: form.get('bio').trim(), location: form.get('location').trim(), discipline: form.get('discipline').trim() }); navigate('/perfil'); }
    catch { setError('No se pudo guardar el perfil. Revisá tu conexión y volvé a intentar.'); } finally { setBusy(false); }
  }
  return <><PageIntro eyebrow="IDENTIDAD" title="Tu firma en el archivo.">Contá quién sos y qué te mueve a crear.</PageIntro><form className="studio-form" onSubmit={submit}><label>Nombre artístico<input name="name" defaultValue={user.name} required maxLength={80} autoComplete="nickname" /></label><label>Biografía<textarea name="bio" defaultValue={user.bio || ''} rows={4} maxLength={600} /></label><div className="form-columns"><label>Ubicación<input name="location" defaultValue={user.location || ''} maxLength={100} /></label><label>Especialidad<input name="discipline" defaultValue={user.discipline || ''} placeholder="Fotografía documental, ilustración…" maxLength={100} /></label></div><p className="local-note">Tu nombre y perfil se guardan en Firebase y se recuperan al entrar desde otro dispositivo.</p>{error && <p role="alert" className="form-error">{error}</p>}<div className="detail-actions"><button className="solid-button" type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar perfil"}</button><Link className="outline-button" to="/perfil">Cancelar</Link></div></form></>;
}
