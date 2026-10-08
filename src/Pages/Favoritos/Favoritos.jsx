import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaSortAmountDown, FaCompass } from 'react-icons/fa';
import AlbumCard from '../../Components/AlbumCard/AlbumCard';
import { albums as allAlbums } from './data';
import './Favoritos.css';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recientes' },
  { value: 'name',   label: 'Nombre' },
  { value: 'photos', label: 'Más fotos' },
];

/* ============================================================
   EmptyState
   ============================================================ */
function EmptyState() {
  return (
    <div className="favoritos__empty animate-fade-up">
      {/* Corazones flotando de fondo */}
      <div className="favoritos__empty-hearts" aria-hidden="true">
        <FaHeart />
        <FaHeart />
        <FaHeart />
      </div>

      <div className="favoritos__empty-icon">
        <FaHeart aria-hidden="true" />
      </div>

      <h2 className="favoritos__empty-title">
        Todavía no tenés favoritos
      </h2>

      <p className="favoritos__empty-text">
        Tocá el corazón en cualquier álbum para guardarlo acá y tenerlo siempre a mano.
      </p>

      <div className="favoritos__empty-actions">
        <Link to="/explorar" className="btn btn--primary shine">
          <FaCompass aria-hidden="true" /> Explorar álbumes
        </Link>
        <Link to="/mis-albumes" className="btn btn--ghost">
          Ir a mis álbumes
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   Favoritos
   ============================================================ */
export default function Favoritos() {
  const [items, setItems] = useState(allAlbums);
  const [sortBy, setSortBy] = useState('recent');

  /* Solo los favoritos */
  const favorites = useMemo(
    () => items.filter((a) => a.favorite),
    [items]
  );

  /* Ordenados */
  const visible = useMemo(() => {
    const copy = [...favorites];
    switch (sortBy) {
      case 'recent':
        return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'name':
        return copy.sort((a, b) => a.title.localeCompare(b.title, 'es'));
      case 'photos':
        return copy.sort((a, b) => b.photos - a.photos);
      default:
        return copy;
    }
  }, [favorites, sortBy]);

  /* Toggle favorito (acá, "quitar") */
  function toggleFavorite(id) {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a))
    );
  }

  const totalPhotos = favorites.reduce((acc, a) => acc + a.photos, 0);

  return (
    <div className="favoritos">
      {/* ---------- Header ---------- */}
      <header className="favoritos__header">
        <div className="favoritos__header-content">
          <div className="section__title-group">
            <span className="section__eyebrow">Tu selección</span>
            <h1 className="section__title">
              Favoritos
              <span className="favoritos__header-heart" aria-hidden="true">
                <FaHeart />
              </span>
            </h1>
          </div>

          {favorites.length > 0 && (
            <p className="favoritos__subtitle">
              {favorites.length}{' '}
              {favorites.length === 1 ? 'álbum guardado' : 'álbumes guardados'}
              {' · '}
              {totalPhotos.toLocaleString('es-AR')} fotos
            </p>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="favoritos__sort">
            <FaSortAmountDown aria-hidden="true" />
            <select
              className="favoritos__sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Ordenar favoritos"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* ---------- Contenido ---------- */}
      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid--albums">
          {visible.map((album, i) => (
            <AlbumCard
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
