// src/Pages/MisAlbumes/data.js

import Amanecer from '../../assets/Amanecer.jpg';
import Banner   from '../../assets/Banner.png';

export const TAGS = [
  'Montaña',
  'Playa',
  'Bosque',
  'Atardecer',
  'Nieve',
  'Ciudad',
];

export const SORT_OPTIONS = [
  { value: 'recent',   label: 'Más recientes' },
  { value: 'oldest',   label: 'Más antiguos'  },
  { value: 'name',     label: 'Nombre (A-Z)'  },
  { value: 'photos',   label: 'Más fotos'     },
];

export const albums = [
  {
    id: 'amanecer-austral',
    title: 'Amanecer Austral',
    location: 'Torres del Paine',
    photos: 128,
    date: '2025-10-12',
    tags: ['Montaña', 'Atardecer'],
    cover: Amanecer,
    favorite: true,
  },
  {
    id: 'glaciares-eternos',
    title: 'Glaciares Eternos',
    location: 'El Calafate',
    photos: 96,
    date: '2025-09-03',
    tags: ['Nieve', 'Montaña'],
    cover: Banner,
  },
  {
    id: 'cordillera-andina',
    title: 'Cordillera Andina',
    location: 'Mendoza',
    photos: 74,
    date: '2025-08-21',
    tags: ['Montaña'],
    cover: Amanecer,
  },
  {
    id: 'bosques-del-sur',
    title: 'Bosques del Sur',
    location: 'Bariloche',
    photos: 52,
    date: '2025-07-14',
    tags: ['Bosque'],
    cover: Banner,
    favorite: true,
  },
  {
    id: 'costa-atlantica',
    title: 'Costa Atlántica',
    location: 'Mar del Plata',
    photos: 61,
    date: '2025-06-02',
    tags: ['Playa'],
    cover: Amanecer,
  },
  {
    id: 'ciudad-nocturna',
    title: 'Ciudad Nocturna',
    location: 'Buenos Aires',
    photos: 88,
    date: '2025-05-19',
    tags: ['Ciudad', 'Atardecer'],
    cover: Banner,
  },
  {
    id: 'selva-misionera',
    title: 'Selva Misionera',
    location: 'Iguazú',
    photos: 43,
    date: '2025-04-08',
    tags: ['Bosque'],
    cover: Amanecer,
  },
  {
    id: 'puna-salteña',
    title: 'Puna Salteña',
    location: 'Salta',
    photos: 57,
    date: '2025-03-26',
    tags: ['Montaña', 'Atardecer'],
    cover: Banner,
  },
];