import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import Image from './Image';
export default function Card({ album, saved, onSave }) {
  return <article className="work-card"><Link className="work-image" to={`/album/${album.id}`}><Image src={album.cover} alt={album.title} /><span className="work-image-label">{album.photos.length} {album.photos.length === 1 ? "imagen" : "imágenes"}</span></Link><div className="work-caption"><div className="work-meta"><span>{album.discipline}</span><button className={`save-button ${saved ? 'is-saved' : ''}`} onClick={() => onSave(album.id)} aria-label={saved ? `Quitar ${album.title} de guardados` : `Guardar ${album.title}`} aria-pressed={saved}><FaHeart /></button></div><Link to={`/album/${album.id}`}><h2>{album.title}</h2></Link><Link className="author-link" to={album.local ? "/perfil" : `/autor/${encodeURIComponent(album.author)}`}>{album.author} <span>↗</span></Link><div className="work-footnote"><span>{album.location || "Sin ubicación"}</span><Link to={`/album/${album.id}`} aria-label={`Ver serie ${album.title}`}>Ver serie <span aria-hidden="true">↗</span></Link></div></div></article>;
}
