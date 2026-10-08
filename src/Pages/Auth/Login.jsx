import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import Logo from '../../assets/Logo.png';
import './Auth.css';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    // Acceso simulado: cualquier correo válido y contraseña no vacía.
    setUser({
      id: 'usuario-prueba',
      email: email.trim(),
      name: 'Usuario de prueba',
    });

    navigate('/', { replace: true });
  }

  return (
    <div className="Auth-container ">
      <img src={Logo} alt="" className='Auth-logo animate-float-slow' width={250} height={100}/>
      <div className="Login-container glass animate-fade-up delay-1">
        <h2 className='Auth-title'>Acceso</h2>

        <form onSubmit={handleSubmit}>
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
                placeholder="Contraseña"
                autoComplete="current-password"
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

          <div className="forgot-password">
            <Link to="/forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn btn--primary">
            Ingresar
          </button>

          <div className="RegisterLink">
            <p className="RegisterText">
              ¿No tenés cuenta?{' '}
              <Link to="/register">Registrate</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}