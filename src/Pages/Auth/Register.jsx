import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
} from 'react-icons/fa';
import Logo from '../../assets/Logo.png';
import './Auth.css';
import { authErrorMessage } from '../../lib/authErrors';

export default function Register({ onRegister }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    async function handleSubmit(e) {
        e.preventDefault(); if (loading) return;
        if (!name.trim()) { setError('Escribí tu nombre.'); return; }
        setLoading(true); setError('');
        try { await onRegister(name, email, password); navigate('/', { replace:true }); }
        catch (err) { setError(authErrorMessage(err)); }
        finally { setLoading(false); }
    }

    return (
        <div className="Auth-container ">
            <img src={Logo} alt="" className='Auth-logo animate-float-slow' width={250} height={100}/>
            <div className="Register-container animate-fade-up glass">
                <h2 className='Auth-title'>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <div className="Input-group">
                        <label htmlFor="login-name">Nombre</label>

                        <div className="Input-box">
                            <FaUser className="Icon" aria-hidden="true" />

                            <input
                                id="login-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="tu nombre"
                                autoComplete="name"
                                required
                                className="input-form"
                            />
                        </div>
                    </div>
                    <div className="Input-group">
                        <label htmlFor="login-email">Correo</label>

                        <div className="Input-box">
                            <FaEnvelope className="Icon" aria-hidden="true" />

                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                autoComplete="email"
                                required
                                className="input-form"
                            />
                        </div>
                    </div>

                    <div className="Input-group">
                        <label htmlFor="login-password">Contraseña</label>

                        <div className="Input-box">
                            <FaLock className="Icon" aria-hidden="true" />

                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Al menos 6 caracteres"
                                autoComplete="new-password"
                                minLength={6}
                                required
                                className="input-form"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((value) => !value)}
                                aria-label={
                                    showPassword
                                        ? 'Ocultar contraseña'
                                        : 'Mostrar contraseña'
                                }
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="Icon" />
                                ) : (
                                    <FaEye className="Icon" />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <p role="alert" className="form-error">{error}</p>}
                    <button type="submit" disabled={loading} className="btn btn--secondary">
                        {loading ? "Creando cuenta…" : "Crear cuenta"}
                    </button>

                    <div className="RegisterLink">
                        <p className="RegisterText">
                            ¿Tenés cuenta?{' '}
                            <Link to="/login">Accede</Link>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    );
}