import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { collections } from '../data';
import Image from '../components/Image';
export default function Welcome() {
  return <main className="studio-welcome"><div className="welcome-photo"><Image src={collections[0].photos[0].src} alt="Cumbres nevadas del Fitz Roy y vegetación de otoño" /><div className="welcome-photo-note"><span>EL ARCHIVO VISUAL</span><p>Una historia empieza<br />cuando elegís mirar.</p><a href={collections[0].photos[0].source} target="_blank" rel="noreferrer">Fotografía de Marina Zvada ↗</a></div></div><div className="welcome-copy"><Link className="wordmark" to="/">nexo<span>estudio</span></Link><span className="kicker">FOTOGRAFÍA & ARTE VISUAL</span><h1>Una mirada.<br />Un mundo propio.</h1><p>Un espacio para construir tu archivo, descubrir otras miradas y darle lugar a tu trabajo.</p><Link className="solid-button" to="/register">Crear mi espacio <FaArrowRight /></Link><Link className="text-link" to="/login">Ya tengo una cuenta</Link><small>Tu cuenta, tu mirada, tu espacio.</small></div></main>;
}
