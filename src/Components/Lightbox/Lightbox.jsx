// src/Components/Lightbox/Lightbox.jsx
import { useEffect, useRef } from 'react';
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
} from 'react-icons/fa';
import './Lightbox.css';

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onToggleFavorite,
}) {
  const closeButtonRef = useRef(null);

  /* Bloquear scroll y atajos de teclado */
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }

    window.addEventListener('keydown', handleKey);

    /* Foco inicial al botón cerrar */
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, onPrev, onNext]);

  if (!photos?.length) return null;

  const photo = photos[currentIndex];
  const total = photos.length;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${currentIndex + 1} de ${total}: ${photo.title}`}
      onClick={onClose}
    >
      {/* Fondo con blur de la propia foto */}
      <div
        className="lightbox__backdrop"
        style={{ backgroundImage: `url(${photo.src})` }}
        aria-hidden="true"
      />

      {/* Botón cerrar */}
      <button
        ref={closeButtonRef}
        type="button"
        className="lightbox__close"
        onClick={onClose}
        aria-label="Cerrar visor"
      >
        <FaTimes aria-hidden="true" />
      </button>

      {/* Contador */}
      <div className="lightbox__counter" aria-hidden="true">
        {currentIndex + 1} <span>/</span> {total}
      </div>

      {/* Flecha anterior */}
      <button
        type="button"
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Foto anterior"
        disabled={total <= 1}
      >
        <FaChevronLeft aria-hidden="true" />
      </button>

      {/* Imagen */}
      <figure
        className="lightbox__figure"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={photo.id}
          src={photo.src}
          alt={photo.title}
          className="lightbox__image animate-zoom-in"
        />
      </figure>

      {/* Flecha siguiente */}
      <button
        type="button"
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Foto siguiente"
        disabled={total <= 1}
      >
        <FaChevronRight aria-hidden="true" />
      </button>

      {/* Barra inferior: info + like */}
      <footer
        className="lightbox__footer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lightbox__info">
          <h3 className="lightbox__title">{photo.title}</h3>
          <p className="lightbox__meta">
            {photo.date}
          </p>
        </div>

        <button
          type="button"
          className={`lightbox__like ${
            photo.favorite ? 'lightbox__like--active' : ''
          }`}
          onClick={() => onToggleFavorite(photo.id)}
          aria-label={
            photo.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
          }
          aria-pressed={photo.favorite}
        >
          <FaHeart aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
}
