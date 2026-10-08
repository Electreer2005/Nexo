import { useMemo, useState, useEffect } from 'react';
import {
  FaHeart,
  FaCamera,
  FaCalendar,
  FaSearch,
  FaTh,
  FaList,
  FaTimes,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { GrLocation } from 'react-icons/gr';
import { BiPhotoAlbum } from 'react-icons/bi';
import AlbumCard from '../../Components/AlbumCard/AlbumCard';
import { albums, TAGS, SORT_OPTIONS } from './data';
import './MisAlbumes.css';

/* ============================================================
   Helpers
   ============================================================ */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    month: 'short',
    year: 'numeric',
  });
}

function sortAlbums(list, sortBy) {
  const copy = [...list];
  switch (sortBy) {
    case 'recent':
      return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'oldest':
      return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'name':
      return copy.sort((a, b) => a.title.localeCompare(b.title, 'es'));
    case 'photos':
      return copy.sort((a, b) => b.photos - a.photos);
    default:
      return copy;
  }
}

/* ============================================================
   AlbumRow — vista lista
   ============================================================ */
function AlbumRow({ album, index, onToggleFavorite }) {
  return (
    <article
      className="album-row animate-fade-left"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="album-row__cover">
        <img src={album.cover} alt={album.title} loading="lazy" />
      </div>

      <div className="album-row__info">
        <span className="album-row__location">
          <GrLocation aria-hidden="true" /> {album.location}
        </span>
        <h3 className="album-row__title">{album.title}</h3>

        <div className="album-row__tags">
          {album.tags.map((tag) => (
            <span key={tag} className="album-row__tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="album-row__meta">
        <span>
          <FaCamera aria-hidden="true" /> {album.photos}
        </span>
        <span>
          <FaCalendar aria-hidden="true" /> {formatDate(album.date)}
        </span>
      </div>

      <button
        type="button"
        className={`album-row__favorite ${album.favorite ? 'album-row__favorite--active' : ''
          }`}
        onClick={() => onToggleFavorite(album.id)}
        aria-label={
          album.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
        }
        aria-pressed={album.favorite}
      >
        <FaHeart aria-hidden="true" />
      </button>
    </article>
  );
}

/* ============================================================
   EmptyState
   ============================================================ */
function EmptyState({ onClear }) {
  return (
    <div className="empty-state animate-fade-up">
      <div className="empty-state__icon">
        <BiPhotoAlbum aria-hidden="true" size={32} />
      </div>
      <h3 className="empty-state__title">No encontramos álbumes</h3>
      <p className="empty-state__text">
        Probá con otra búsqueda o quitá los filtros para ver todos tus álbumes.
      </p>
      <button type="button" className="btn btn--ghost" onClick={onClear}>
        <FaTimes aria-hidden="true" /> Limpiar filtros
      </button>
    </div>
  );
}

/* ============================================================
   MisÁlbumes
   ============================================================ */
export default function MisAlbumes() {
  const [items, setItems] = useState(albums);
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  /* Toggle favorito */
  function toggleFavorite(id) {
    setItems((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, favorite: !a.favorite } : a
      )
    );
  }

  /* Toggle etiqueta */
  function toggleTag(tag) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  /* Limpiar filtros */
  function clearFilters() {
    setQuery('');
    setActiveTags([]);
    setSortBy('recent');
  }

  /* Filtrado + orden */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = items.filter((album) => {
      const matchesQuery =
        !q ||
        album.title.toLowerCase().includes(q) ||
        album.location.toLowerCase().includes(q) ||
        album.tags.some((t) => t.toLowerCase().includes(q));

      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((t) => album.tags.includes(t));

      return matchesQuery && matchesTags;
    });

    return sortAlbums(filtered, sortBy);
  }, [items, query, activeTags, sortBy]);

  /* Atajo de teclado: "/" enfoca la búsqueda */
  useEffect(() => {
    function onKey(e) {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT'
      ) {
        e.preventDefault();
        document.getElementById('albums-search')?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hasActiveFilters =
    query.trim() !== '' || activeTags.length > 0;

  return (
    <div className="mis-albumes">
      {/* ---------- Encabezado ---------- */}
      <header className="mis-albumes__header">
        <div className="section__title-group">
          <span className="section__eyebrow">Tu biblioteca</span>
          <h1 className="section__title">Mis álbumes</h1>
        </div>

        <div className="mis-albumes__counter">
          {visible.length}{' '}
          {visible.length === 1 ? 'álbum' : 'álbumes'}
        </div>
      </header>

      {/* ---------- Toolbar ---------- */}
      <div className="toolbar">
        {/* Búsqueda */}
        <div className="toolbar__search">
          <FaSearch className="toolbar__search-icon" aria-hidden="true" />
          <input
            id="albums-search"
            type="search"
            className="toolbar__search-input"
            placeholder="Buscar por nombre, lugar o etiqueta…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar álbumes"
          />
          {query && (
            <button
              type="button"
              className="toolbar__search-clear"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
            >
              <FaTimes aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Orden */}
        <select
          className="toolbar__select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Ordenar álbumes"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Toggle grid/list */}
        <div className="toolbar__view-toggle" role="group" aria-label="Vista">
          <button
            type="button"
            className={`toolbar__view-btn ${view === 'grid' ? 'toolbar__view-btn--active' : ''
              }`}
            onClick={() => setView('grid')}
            aria-label="Vista cuadrícula"
            aria-pressed={view === 'grid'}
          >
            <FaTh aria-hidden="true" />
          </button>
          <button
            type="button"
            className={`toolbar__view-btn ${view === 'list' ? 'toolbar__view-btn--active' : ''
              }`}
            onClick={() => setView('list')}
            aria-label="Vista lista"
            aria-pressed={view === 'list'}
          >
            <FaList aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------- Chips de etiquetas ---------- */}
      <div className="mis-albumes__tags" role="group" aria-label="Filtrar por etiquetas">
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

        {hasActiveFilters && (
          <button
            type="button"
            className="mis-albumes__clear"
            onClick={clearFilters}
          >
            <FaTimes aria-hidden="true" /> Limpiar
          </button>
        )}
      </div>

      {/* ---------- Contenido ---------- */}
      {visible.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : view === 'grid' ? (
        <div className="grid grid--albums">
          {visible.map((album, i) => (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              className="album-card__link"
            >
              <AlbumCard
                album={album}
                index={i}
                onToggleFavorite={toggleFavorite}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="album-list">
          {visible.map((album, i) => (
            <AlbumRow
              key={album.id}
              album={album}
              index={i}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
