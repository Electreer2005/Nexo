// src/Pages/AlbumDetail/data.js

import Amanecer from '../../assets/Amanecer.jpg';
import Banner   from '../../assets/Banner.png';

/* Un pool de fotos para rellenar el álbum */
const POOL = [Amanecer, Banner];

function makePhoto(i, albumTitle) {
  const titles = [
    'Primera luz',
    'Sendero oculto',
    'Reflejo en el lago',
    'Cumbre nevada',
    'Bosque de lengas',
    'Atardecer dorado',
    'Viento patagónico',
    'Silencio blanco',
    'Mirador natural',
    'Río turquesa',
    'Niebla baja',
    'Cielo infinito',
    'Detalle de musgo',
    'Piedra milenaria',
    'Horizonte lejano',
    'Última luz',
  ];

  return {
    id: `photo-${i}`,
    title: titles[i % titles.length],
    src: POOL[i % POOL.length],
    date: new Date(2025, 9, 12 - (i % 12)).toISOString().slice(0, 10),
    favorite: i % 5 === 0,
    ratio: i % 3 === 0 ? 'portrait' : i % 3 === 1 ? 'landscape' : 'square',
    albumTitle,
  };
}

/* Base de álbumes: replica la forma que usás en MisÁlbumes/Favoritos.
   En un caso real, esto vendría de un fetch por id. */
const ALBUMS = {
  'amanecer-austral': {
    id: 'amanecer-austral',
    title: 'Amanecer Austral',
    location: 'Torres del Paine',
    description:
      'Una travesía de diez días por los senderos más icónicos del sur patagónico. Glaciares, cuernos de granito y cielos que se tiñen de naranja al amanecer.',
    date: '2025-10-12',
    tags: ['Montaña', 'Atardecer', 'Nieve'],
    cover: Amanecer,
    favorite: true,
    photosCount: 128,
  },
  'glaciares-eternos': {
    id: 'glaciares-eternos',
    title: 'Glaciares Eternos',
    location: 'El Calafate',
    description:
      'El azul imposible del hielo milenario. Un recorrido por los glaciares más imponentes de la Patagonia argentina.',
    date: '2025-09-03',
    tags: ['Nieve', 'Montaña'],
    cover: Banner,
    favorite: false,
    photosCount: 96,
  },
};

/* Genera fotos para un álbum (fallback si no existe) */
function buildPhotos(album, count = 24) {
  return Array.from({ length: count }, (_, i) => makePhoto(i, album.title));
}

/* API del módulo */
export function getAlbumById(id) {
  const album = ALBUMS[id];

  /* Si no existe, usamos uno genérico pero marcamos que no lo encontramos */
  if (!album) {
    const fallback = {
      id,
      title: 'Álbum sin título',
      location: 'Ubicación desconocida',
      description:
        'No pudimos cargar la información de este álbum. Probá volviendo a tu biblioteca.',
      date: new Date().toISOString().slice(0, 10),
      tags: [],
      cover: Amanecer,
      favorite: false,
      photosCount: 0,
    };
    return { album: fallback, photos: [], notFound: true };
  }

  return {
    album,
    photos: buildPhotos(album, Math.min(album.photosCount, 24)),
    notFound: false,
  };
}

/* Formato de fecha reutilizable */
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', {
    month: 'short',
    year: 'numeric',
  });
}