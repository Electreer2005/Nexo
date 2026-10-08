// src/Components/AlbumCard/AlbumCard.jsx
import { FaHeart, FaCamera, FaCalendar } from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';
import './AlbumCard.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    month: 'short',
    year: 'numeric',
  });
}

export default function AlbumCard({
  album,
  index = 0,
  onToggleFavorite,
  delayStep = 0.05,
}) {
  return (
    <article
      className="album-card animate-fade-up"
      style={{ animationDelay: `${index * delayStep}s` }}
    >
      <img className="album-card__image" src={album.cover} alt={album.title} />
      <div className="album-card__overlay" />

      <button
        type="button"
        className={`album-card__favorite ${
          album.favorite ? 'album-card__favorite--active' : ''
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(album.id);
        }}
        aria-label={
          album.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
        }
        aria-pressed={album.favorite}
      >
        <FaHeart aria-hidden="true" />
      </button>

      <div className="album-card__content">
        <span className="album-card__location">
          <GrLocation aria-hidden="true" /> {album.location}
        </span>
        <h3 className="album-card__title">{album.title}</h3>
        <div className="album-card__meta">
          <span className="album-card__meta-item">
            <FaCamera aria-hidden="true" /> {album.photos} fotos
          </span>
          <span className="album-card__meta-item">
            <FaCalendar aria-hidden="true" /> {formatDate(album.date)}
          </span>
        </div>
      </div>
    </article>
  );
}
