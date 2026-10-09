import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { collections } from '../data';
import Image from '../components/Image';
export default function Welcome() {
  return <main className="studio-welcome"><div className="welcome-photo"><Image src={collections[0].photos[0].src} alt="Cumbres nevadas del Fitz Roy y vegetación de otoño" /></div><div className="welcome-copy"><Link className="wordmark" to="/">nexo<span>estudio</span></Link><span className="kicker">FOTOGRAFÍA & ARTE VISUAL</span><h1>Una mirada.<br />Un mundo propio.</h1><p>Un espacio para construir tu archivo, descubrir otras miradas y darle lugar a tu trabajo.</p><Link className="solid-button" to="/register">Crear mi espacio <FaArrowRight /></Link><Link className="text-link" to="/login">Ya tengo una cuenta</Link><small>Acceso de prueba · las cuentas todavía no se verifican.</small></div></main>;
}
