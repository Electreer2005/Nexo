import { Link } from 'react-router-dom';
import {
  FaArrowUp,
  FaArrowDown,
  FaPlus,
} from 'react-icons/fa';
import Banner from '../../Components/Banner/Banner';
import AlbumCard from '../../Components/AlbumCard/AlbumCard';
import { stats, albums, recentPhotos } from './data';
import './Dashboard.css';

/* ============================================================
   StatCard
   ============================================================ */
function StatCard({ label, value, trend, trendUp, index }) {
  return (
    <article
      className="stat-card animate-fade-up"
      style={{ animationDelay: `${index * 0.08 + 0.1}s` }}
    >
      <span className="stat-card__label">{label}</span>

      <div className="stat-card__value">
        {value}
      </div>

      {trend && (
        <span
          className={`stat-card__trend ${
            trendUp ? '' : 'stat-card__trend--down'
          }`}
        >
          {trendUp ? <FaArrowUp /> : <FaArrowDown />}
          {trend} esta semana
        </span>
      )}
    </article>
  );
}

/* ============================================================
   PhotoTile
   ============================================================ */
function PhotoTile({ photo, index }) {
  return (
    <div
      className="photo-tile animate-zoom-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <img src={photo.src} alt={photo.title} loading="lazy" />
      <div className="photo-tile__overlay">
        <span className="photo-tile__title">{photo.title}</span>
      </div>
    </div>
  );
}

/* ============================================================
   Dashboard
   ============================================================ */
export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* ---------- Hero ---------- */}
      <Banner />

      {/* ---------- Stats ---------- */}
      <section className="stats" aria-label="Resumen de tu biblioteca">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </section>

      {/* ---------- Álbumes destacados ---------- */}
      <section className="section">
        <header className="section__header">
          <div className="section__title-group">
            <span className="section__eyebrow">Colección</span>
            <h2 className="section__title">Álbumes destacados</h2>
          </div>
          <Link to="/mis-albumes" className="section__link">
            Ver todos →
          </Link>
        </header>

        <div className="grid grid--albums">
          {albums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- Fotos recientes ---------- */}
      <section className="section">
        <header className="section__header">
          <div className="section__title-group">
            <span className="section__eyebrow">Últimas subidas</span>
            <h2 className="section__title">Fotos recientes</h2>
          </div>
          <Link to="/explorar" className="section__link">
            Explorar más →
          </Link>
        </header>

        <div className="grid grid--photos">
          {recentPhotos.map((photo, i) => (
            <PhotoTile key={photo.id} photo={photo} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- CTA final ---------- */}
      <section className="dashboard__cta animate-fade-up">
        <div className="dashboard__cta-content">
          <h3 className="dashboard__cta-title">
            ¿Listo para tu próxima aventura?
          </h3>
          <p className="dashboard__cta-text">
            Creá un álbum nuevo y empezá a organizar tus recuerdos.
          </p>
        </div>
        <Link to="/mis-albumes" className="btn btn--primary shine">
          <FaPlus aria-hidden="true" /> Nuevo álbum
        </Link>
      </section>
    </div>
  );
}
