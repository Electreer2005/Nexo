import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="welcome-container">
      {/* Fondo con orbes animados */}
      <div className="welcome-orb welcome-orb--1" aria-hidden="true" />
      <div className="welcome-orb welcome-orb--2" aria-hidden="true" />
      <div className="welcome-orb welcome-orb--3" aria-hidden="true" />

      <div className="welcome-content">
        <div className="Welcome-logo-wrapper animate-zoom-rotate">
          <img
            src={Logo}
            alt="Logo de Nexo"
            className="Welcome-logo"
          />
        </div>

        <h1 className="welcome-title animate-fade-up delay-1">
          Bienvenido a <span className="welcome-title__accent">Nexo</span>
        </h1>

        <p className="welcome-subtitle animate-fade-up delay-2">
          Creá, organizá y compartí los mejores álbumes de tu vida.
        </p>

        <button
          type="button"
          className="btn btn--primary welcome-cta animate-fade-up delay-3"
          onClick={handleLogin}
        >
          Ingresar
          <span className="welcome-cta__arrow" aria-hidden="true">→</span>
        </button>

        <p className="welcome-footnote animate-fade-up delay-4">
          Tu próxima historia empieza acá ✨
        </p>
      </div>
    </div>
  );
}
