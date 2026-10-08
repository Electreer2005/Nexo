// src/Pages/Dashboard/data.js

import Amanecer    from '../../assets/Amanecer.jpg';
import Banner      from '../../assets/Banner.png';

/* Reemplazá estas imágenes por las tuyas.
   Si no tenés más assets, reutilizá las que ya tenés. */

export const stats = [
  { label: 'Fotos',    value: '2,847', trend: '+12%', trendUp: true  },
  { label: 'Álbumes',  value: '18',    trend: '+2',   trendUp: true  },
  { label: 'Lugares',  value: '42',    trend: '+5',   trendUp: true  },
  { label: 'Favoritos', value: '136',  trend: '-3%',  trendUp: false },
];

export const albums = [
  {
    id: 'patagonia',
    title: 'Amanecer Austral',
    location: 'Torres del Paine',
    photos: 128,
    date: 'Oct 2025',
    cover: Amanecer,
    favorite: true,
  },
  {
    id: 'glaciares',
    title: 'Glaciares Eternos',
    location: 'El Calafate',
    photos: 96,
    date: 'Sep 2025',
    cover: Banner,
  },
  {
    id: 'andes',
    title: 'Cordillera Andina',
    location: 'Mendoza',
    photos: 74,
    date: 'Ago 2025',
    cover: Amanecer,
  },
  {
    id: 'bosques',
    title: 'Bosques del Sur',
    location: 'Bariloche',
    photos: 52,
    date: 'Jul 2025',
    cover: Banner,
  },
];

export const recentPhotos = [
  { id: 1, title: 'Mirador',     src: Amanecer },
  { id: 2, title: 'Sendero',     src: Banner   },
  { id: 3, title: 'Lago azul',   src: Amanecer },
  { id: 4, title: 'Cumbre',      src: Banner   },
  { id: 5, title: 'Atardecer',   src: Amanecer },
  { id: 6, title: 'Nevado',      src: Banner   },
  { id: 7, title: 'Refugio',     src: Amanecer },
  { id: 8, title: 'Río helado',  src: Banner   },
];