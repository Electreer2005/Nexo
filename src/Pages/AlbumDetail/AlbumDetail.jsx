import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  FaHeart,
  FaCamera,
  FaCalendar,
  FaMapMarkedAlt,
  FaArrowLeft,
  FaShareAlt,
  FaSortAmountDown,
} from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';

import Lightbox from '../../Components/Lightbox/Lightbox';
import { getAlbumById, formatDate } from './data';
import './AlbumDetail.css';

const SORT_OPTIONS = [
  { value: 'recent',  label: 'Recientes' },
  { value: 'oldest',  label: 'Antiguas'  },
  { value: 'title',   label: 'Título'    },
];

/* ============================================================
   PhotoTile — adaptación del de Explorar con foco en álbum
   ============================================================ */
function PhotoTile({ photo, index, onOpen }) {
  return (
    <button
      type="button"
      className={`album-photo album-photo--${photo.ratio} animate-zoom-in`}
      style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
      onClick={() => onOpen(index)}
      aria-label={`Abrir ${photo.title}`}
    >
      <img src={photo.src} alt={photo.title} loading="lazy" />
      <span className="album-photo__overlay" aria-hidden="true" />
      <span className="album-photo__label">
        <span className="album-photo__label-title">{photo.title}</span>
      </span>
    </button>
  );
}

/* ============================================================
   AlbumDetail
   ============================================================ */
export default function AlbumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { album, photos: initialPhotos, notFound } = useMemo(
    () => getAlbumById(id),
    [id]
  );

  const [photos, setPhotos] = useState(initialPhotos);
  const [albumFav, setAlbumFav] = useState(album.favorite);
  const [sortBy, setSortBy] = useState('recent');
  const [openIndex, setOpenIndex] = useState(null);

  /* Reaccionar si cambia el id sin desmontar */
  if (initialPhotos !== photos && initialPhotos.length && photos.length === 0) {
    // (caso raro, pero por las dudas)
    setPhotos(initialPhotos);
  }

  /* Toggle favorito de una foto */
  const togglePhotoFavorite = useCallback((photoId) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId ? { ...p, favorite: !p.favorite } : p
      )
    );
  }, []);

  /* Ordenamiento */
  const sortedPhotos = useMemo(() => {
    const copy = [...photos];
    switch (sortBy) {
      case 'oldest':
        return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'title':
        return copy.sort((a, b) => a.title.localeCompare(b.title, 'es'));
      case 'recent':
      default:
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [photos, sortBy]);

  /* Navegación del lightbox */
  const openPhoto = useCallback((i) => setOpenIndex(i), []);
  const closeLightbox = useCallback(() => setOpenIndex(null), []);

  const goPrev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i - 1 + sortedPhotos.length) % sortedPhotos.length
    );
  }, [sortedPhotos.length]);

  const goNext = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? null : (i + 1) % sortedPhotos.length
    );
  }, [sortedPhotos.length]);

  const favoritesCount = photos.filter((p) => p.favorite).length;

  /* ---------- 404 interno ---------- */
  if (notFound) {
    return (
      <div className="album-detail album-detail--not-found animate-fade-up">
        <div className="empty-state">
          <div className="empty-state__icon">
            <FaCamera aria-hidden="true" size={28} />
          </div>
          <h2 className="empty-state__title">No encontramos ese álbum</h2>
          <p className="empty-state__text">
            Puede que lo hayas borrado o que el enlace esté roto.
          </p>
          <Link to="/mis-albumes" className="btn btn--primary">
            <FaArrowLeft aria-hidden="true" /> Volver a mis álbumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="album-detail">
      {/* ---------- Botón volver ---------- */}
      <button
        type="button"
        className="album-detail__back"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft aria-hidden="true" /> Volver
      </button>

      {/* ---------- Hero del álbum ---------- */}
      <header className="album-hero animate-fade-up">
        <div className="album-hero__bg" aria-hidden="true">
          <img src={album.cover} alt="" />
          <div className="album-hero__bg-overlay" />
        </div>

        <div className="album-hero__content">
          <div className="album-hero__meta">
            <span className="album-hero__location">
              <GrLocation aria-hidden="true" /> {album.location}
            </span>
            <span className="album-hero__date">
              <FaCalendar aria-hidden="true" /> {formatDate(album.date)}
            </span>
          </div>

          <h1 className="album-hero__title">{album.title}</h1>

          <p className="album-hero__description">{album.description}</p>

          <div className="album-hero__tags">
            {album.tags.map((tag) => (
              <span key={tag} className="album-hero__tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="album-hero__actions">
            <button
              type="button"
              className={`btn ${
                albumFav ? 'btn--secondary' : 'btn--primary'
              } shine`}
              onClick={() => setAlbumFav((f) => !f)}
              aria-pressed={albumFav}
            >
              <FaHeart aria-hidden="true" />
              {albumFav ? 'En favoritos' : 'Agregar a favoritos'}
            </button>

            <button
              type="button"
              className="btn btn--ghost"
              aria-label="Compartir álbum"
            >
              <FaShareAlt aria-hidden="true" /> Compartir
            </button>
          </div>
        </div>

        {/* Stats flotantes */}
        <div className="album-hero__stats">
          <div className="album-hero__stat">
            <FaCamera aria-hidden="true" />
            <div>
              <strong>{photos.length}</strong>
              <span>fotos</span>
            </div>
          </div>
          <div className="album-hero__stat">
            <FaMapMarkedAlt aria-hidden="true" />
            <div>
              <strong>{album.location.split(',')[0]}</strong>
              <span>lugar</span>
            </div>
          </div>
          <div className="album-hero__stat">
            <FaHeart aria-hidden="true" />
            <div>
              <strong>{favoritesCount}</strong>
              <span>favoritas</span>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Toolbar de fotos ---------- */}
      <div className="album-detail__toolbar">
        <div className="section__title-group">
          <span className="section__eyebrow">Contenido</span>
          <h2 className="section__title">
            Fotos <span className="album-detail__count">({photos.length})</span>
          </h2>
        </div>

        <label className="album-detail__sort">
          <FaSortAmountDown aria-hidden="true" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Ordenar fotos"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ---------- Grid masonry ---------- */}
      {sortedPhotos.length > 0 ? (
        <div className="album-detail__masonry">
          {sortedPhotos.map((photo, i) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              index={i}
              onOpen={openPhoto}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state animate-fade-up">
          <div className="empty-state__icon">
            <FaCamera aria-hidden="true" size={28} />
          </div>
          <h3 className="empty-state__title">Este álbum está vacío</h3>
          <p className="empty-state__text">
            Todavía no subiste fotos a este álbum.
          </p>
        </div>
      )}

      {/* ---------- Lightbox ---------- */}
      {openIndex !== null && (
        <Lightbox
          photos={sortedPhotos}
          currentIndex={openIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
          onToggleFavorite={togglePhotoFavorite}
        />
      )}
    </div>
  );
}
