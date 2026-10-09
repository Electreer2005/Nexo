import { useRef, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaPlus, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
export default function StudioHeader({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function outside(event) { if (!ref.current?.contains(event.target)) setOpen(false); }
    function escape(event) { if (event.key === 'Escape') { setOpen(false); ref.current?.querySelector('button')?.focus(); } }
    if (open) { document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape); }
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <header className="studio-header"><Link className="wordmark" to="/">nexo<span>estudio</span></Link><nav aria-label="Navegación principal"><NavLink to="/" end>Descubrir</NavLink><NavLink to="/mis-albumes">Mi archivo</NavLink><NavLink to="/compartidos">Compartidos</NavLink><NavLink to="/favoritos">Guardados</NavLink><NavLink to="/aprender">Aprender</NavLink></nav><Link className="header-create" to="/crear"><FaPlus /><span>Nueva serie</span></Link><div className="account-menu" ref={ref}><button className="account-trigger" aria-expanded={open} aria-controls="account-panel" onClick={() => setOpen(v => !v)} aria-label="Opciones de mi cuenta"><FaUser /></button>{open && <div className="account-panel" id="account-panel"><strong>{user.name || user.email}</strong><Link to="/perfil" onClick={() => setOpen(false)}><FaUser /> Mi perfil</Link><Link to="/ajustes" onClick={() => setOpen(false)}><FaCog /> Ajustes</Link><button onClick={onLogout}><FaSignOutAlt /> Cerrar sesión</button></div>}</div></header>;
}
