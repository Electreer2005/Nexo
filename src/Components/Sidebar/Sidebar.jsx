import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaHeart, FaTimes } from 'react-icons/fa';
import { BiPhotoAlbum, BiWorld } from 'react-icons/bi';

const links = [
  { to: '/', label: 'Inicio', icon: FaHome },
  { to: '/mis-albumes', label: 'Mis Álbumes', icon: BiPhotoAlbum },
  { to: '/favoritos', label: 'Mis Favoritos', icon: FaHeart },
  { to: '/explorar', label: 'Explorar', icon: BiWorld },
];

export default function Sidebar({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);
 
  if (!open) return null;

  function handleNavigation() {
    // En teléfono, cerrar el menú después de elegir una página.
    if (window.matchMedia('(max-width: 768px)').matches) {
      onClose();
    }
  }

  return (
    <>
      <button
        className="sidebar-backdrop"
        type="button"
        onClick={onClose}
        aria-label="Cerrar menú lateral"
      />

      <aside
        id="app-sidebar"
        className="sidebar sidebar--open"
        aria-label="Menú lateral"
      >
        <div className="sidebar__heading">
          <strong className="sidebar__heading-title">Tu espacio</strong>

          <button
            type="button"
            className="sidebar__close"
            onClick={onClose}
            aria-label="Cerrar menú lateral"
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegación principal">
          <p className="sidebar__section-title">Explorar</p>

          <ul className="sidebar__nav">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `sidebar__link${
                      isActive ? ' sidebar__link--active' : ''
                    }`
                  }
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="sidebar__section-title">Etiquetas</p>

          <div className="sidebar__tags">
            {['Montaña', 'Playa', 'Bosque', 'Atardecer'].map((tag) => (
              <NavLink
                key={tag}
                to={`/explorar?etiqueta=${encodeURIComponent(tag)}`}
                onClick={handleNavigation}
                className="sidebar__tag"
              >
                {tag}
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
