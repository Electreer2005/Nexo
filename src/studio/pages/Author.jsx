import { Link, useParams } from 'react-router-dom';
import Photo from '../components/Photo';
import EmptyState from '../components/EmptyState';
export default function Author({ albums, user }) {
  const { name } = useParams(); const own = !name; const author = own ? user.name || user.email.split('@')[0] : name;
  const works = albums.filter(a => own ? a.owned : !a.owned && a.author === author);
  return <><section className="artist-heading"><span className="artist-monogram">{author[0]}</span><span className="kicker">{own ? 'TU PERFIL' : 'PORTFOLIO DE EJEMPLO'}</span><h1>{author}</h1>{own && <><p>{[user.discipline, user.location].filter(Boolean).join(' · ')}</p><p className="profile-bio">{user.bio}</p><Link className="outline-button" to="/perfil/editar">Editar perfil</Link></>}<p>{works.length} {works.length === 1 ? 'serie' : 'series'} en el archivo</p></section><div className="portfolio-grid">{works.map(a => <Link key={a.id} to={`/album/${a.id}`}><Photo photo={a.owned ? a.photos[0] : {src:a.cover}} alt={a.title} /><h2>{a.title}</h2><span>{a.discipline}</span></Link>)}</div>{!works.length && <EmptyState title={own ? 'Tu portfolio empieza con una serie.' : 'Este autor no tiene series en el archivo.'} to={own ? '/crear' : '/'} action={own ? 'Crear mi primera serie' : 'Volver al archivo'} />}</>;
}
