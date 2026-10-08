import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import {
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

export default function Header({
  user,
  setUser,
  onMenuClick,
  sidebarOpen,
  menuButtonRef,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate = useNavigate();

  const name = user?.name || user?.email?.split('@')[0] || 'Usuario';

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  useEffect(() => {
    if (!menuOpen) return;

    function handleOutsideClick(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        avatarRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  function handleLogout() {
    setMenuOpen(false);
    setUser(null);
    navigate('/', { replace: true });
  }

  return (
    <header className={`header ${sidebarOpen ? 'header--sidebar-open' : ''}`}>
      <div className="header__left">
        {/* Botón hamburguesa */}
        <button
          ref={menuButtonRef}
          type="button"
          className="header__menu-btn"
          onClick={onMenuClick}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar"
        >
          {sidebarOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>

        <div className="header__brand">
          <div className="header__logo">
            <img src={Logo} alt="" />
          </div>
          <span className="header__title">Nexo</span>
        </div>
      </div>

      <div className="header__search">
        <input
          className="header__search-input"
          placeholder="Buscar paisajes, lugares..."
          aria-label="Buscar paisajes y lugares"
        />
        <span className="header__search-icon">
          <FaSearch aria-hidden="true" />
        </span>
      </div>

      <div className="header__actions">
        <button
          type="button"
          className="header__icon-btn"
          aria-label="Notificaciones"
        >
          <FaBell aria-hidden="true" />
          <span className="header__badge" aria-hidden="true" />
        </button>

        <div className="header__user" ref={menuRef}>
          <button
            ref={avatarRef}
            type="button"
            className="header__avatar"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Opciones de usuario"
            aria-expanded={menuOpen}
            aria-controls="header-user-menu"
          >
            {initials}
          </button>

          {menuOpen && (
            <div id="header-user-menu" className="header__user-menu animate-fade-down">
              <div className="header__user-info">
                <strong>{name}</strong>
                <span>{user?.email}</span>
              </div>

              <button
                type="button"
                className="header__logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt aria-hidden="true" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
