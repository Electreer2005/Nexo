import { useMemo, useState } from 'react';
import {
  FaSearch,
  FaHeart,
  FaTimes,
  FaFire,
  FaRandom,
  FaCompass,
} from 'react-icons/fa';
import { GrLocation } from 'react-icons/gr';
import { photos, TAGS, SORT_OPTIONS } from './data';
import './Explorar.css';

/* ============================================================
   PhotoTile — masonry item
   ============================================================ */
function PhotoTile({ photo, index, onToggleLike }) {
  return (
    <article
      className={`explore-tile explore-tile--${photo.ratio} animate-fade-up`}
      style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s` }}
    >
      <div className="explore-tile__media">
        <img src={photo.src} alt={photo.title} loading="lazy" />
        <div className="explore-tile__overlay" />

        <button
          type="button"
          className={`explore-tile__like ${
            photo.liked ? 'explore-tile__like--active' : ''
          }`}
          onClick={() => onToggleLike(photo.id)}
          aria-label={photo.liked ? 'Quitar me gusta' : 'Me gusta'}
          aria-pressed={photo.liked}
        >
          <FaHeart aria-hidden="true" />
        </button>
      </div>

      <div className="explore-tile__info">
        <h3 className="explore-tile__title">{photo.title}</h3>

        <div className="explore-tile__meta">
          <span className="explore-tile__location">
            <GrLocation aria-hidden="true" /> {photo.location}
          </span>
          <span className="explore-tile__author">por {photo.author}</span>
        </div>

        <div className="explore-tile__footer">
          <div className="explore-tile__tags">
            {photo.tags.map((tag) => (
              <span key={tag} className="explore-tile__tag">
                {tag}
              </span>
            ))}
          </div>
          <span className="explore-tile__likes">
            <FaHeart aria-hidden="true" /> {photo.likes}
          </span>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   Explorar
   ============================================================ */
export default function Explorar() {
  const [items, setItems] = useState(photos);
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [sortBy, setSortBy] = useState('recent');

  /* Toggle like */
  function toggleLike(id) {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  }

  /* Toggle tag */
  function toggleTag(tag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function clearFilters() {
    setQuery('');
    setActiveTags([]);
    setSortBy('recent');
  }

  /* Filtrado + orden */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = items.filter((photo) => {
      const matchesQuery =
        !q ||
        photo.title.toLowerCase().includes(q) ||
        photo.author.toLowerCase().includes(q) ||
        photo.location.toLowerCase().includes(q) ||
        photo.tags.some((t) => t.toLowerCase().includes(q));

      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((t) => photo.tags.includes(t));

      return matchesQuery && matchesTags;
    });

    const copy = [...filtered];
    switch (sortBy) {
      case 'popular':
        return copy.sort((a, b) => b.likes - a.likes);
      case 'random':
        return copy.sort((a, b) => a.id.localeCompare(b.id));
      case 'recent':
      default:
        return copy;
    }
  }, [items, query, activeTags, sortBy]);

  const hasActiveFilters = query.trim() !== '' || activeTags.length > 0;

  return (
    <div className="explorar">
      {/* ---------- Hero de exploración ---------- */}
      <section className="explorar__hero">
        <div className="explorar__hero-content">
          <span className="section__eyebrow">Descubrí</span>
          <h1 className="explorar__hero-title">
            Explorá lo que <span className="explorar__hero-accent">otros</span> están capturando
          </h1>
          <p className="explorar__hero-subtitle">
            Miles de paisajes, ciudades y momentos compartidos por la comunidad.
          </p>
        </div>

        {/* Búsqueda prominente */}
        <div className="explorar__search">
          <FaSearch className="explorar__search-icon" aria-hidden="true" />
          <input
            type="search"
            className="explorar__search-input"
            placeholder="Buscá por título, autor, lugar o etiqueta…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar en Explorar"
          />
          {query && (
            <button
              type="button"
              className="explorar__search-clear"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
            >
              <FaTimes aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      {/* ---------- Toolbar de filtros ---------- */}
      <div className="explorar__toolbar">
        <div className="explorar__tags" role="group" aria-label="Filtrar por etiqueta">
          {TAGS.map((tag) => {
            const active = activeTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                className={`toolbar__chip ${active ? 'toolbar__chip--active' : ''}`}
                onClick={() => toggleTag(tag)}
                aria-pressed={active}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="explorar__sort" role="group" aria-label="Ordenar por">
          {SORT_OPTIONS.map(({ value, label }) => {
            const active = sortBy === value;
            const Icon =
              value === 'popular' ? FaFire
              : value === 'random' ? FaRandom
              : FaCompass;

            return (
              <button
                key={value}
                type="button"
                className={`explorar__sort-btn ${
                  active ? 'explorar__sort-btn--active' : ''
                }`}
                onClick={() => setSortBy(value)}
                aria-pressed={active}
              >
                <Icon aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="explorar__clear"
            onClick={clearFilters}
          >
            <FaTimes aria-hidden="true" /> Limpiar
          </button>
        )}
      </div>

      {/* ---------- Resultado ---------- */}
      {visible.length > 0 && (
        <p className="explorar__count">
          {visible.length}{' '}
          {visible.length === 1 ? 'resultado' : 'resultados'}
          {hasActiveFilters && ' con los filtros aplicados'}
        </p>
      )}

      {/* ---------- Masonry ---------- */}
      {visible.length === 0 ? (
        <div className="empty-state animate-fade-up">
          <div className="empty-state__icon">
            <FaSearch aria-hidden="true" size={28} />
          </div>
          <h3 className="empty-state__title">Sin resultados</h3>
          <p className="empty-state__text">
            No encontramos fotos que coincidan con tu búsqueda.
            Probá con otros términos o etiquetas.
          </p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={clearFilters}
          >
            <FaTimes aria-hidden="true" /> Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="explorar__masonry">
          {visible.map((photo, i) => (
            <PhotoTile
              key={photo.id}
              photo={photo}
              index={i}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      )}
    </div>
  );
}
