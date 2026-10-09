import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { authErrorMessage } from '../../lib/authErrors';
import './Auth.css';
export default function ForgotPassword() {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [sent, setSent] = useState(false);
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    const email = new FormData(event.currentTarget).get('email').trim(); setBusy(true); setError('');
    try { await sendPasswordResetEmail(auth, email); setSent(true); }
    catch (err) { if (err.code === 'auth/user-not-found') setSent(true); else setError(authErrorMessage(err)); }
    finally { setBusy(false); }
  }
  return <main className="Auth-container"><div className="Login-container"><h1 className="Auth-title">Recuperá tu acceso.</h1>{sent ? <p role="status" className="local-note">Si existe una cuenta con ese correo, recibirás un enlace para elegir una nueva contraseña. Revisá también spam.</p> : <form onSubmit={submit}><label className="Input-group" htmlFor="reset-email">Correo<div className="Input-box"><input id="reset-email" className="input-form" name="email" type="email" required autoComplete="email" placeholder="tu@email.com" /></div></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="btn btn--primary" disabled={busy}>{busy ? 'Enviando…' : 'Enviar enlace'}</button></form>}<Link className="text-link" to="/login">Volver al acceso</Link></div></main>;
}
