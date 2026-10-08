// src/Pages/Explorar/data.js

import Amanecer from '../../assets/Amanecer.jpg';
import Banner   from '../../assets/Banner.png';

export const TAGS = [
  'Montaña',
  'Playa',
  'Bosque',
  'Atardecer',
  'Nieve',
  'Ciudad',
  'Río',
  'Desierto',
];

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recientes' },
  { value: 'popular', label: 'Populares' },
  { value: 'random', label: 'Sorprendeme' },
];

/* Un mix de fotos con proporciones variadas para que el masonry
   no quede todo con la misma altura. */
export const photos = [
  { id: 'p1',  title: 'Amanecer en el Fitz Roy',  author: 'Sofía R.',  location: 'El Chaltén',    tags: ['Montaña', 'Atardecer'], likes: 342, src: Amanecer, ratio: 'portrait' },
  { id: 'p2',  title: 'Glaciar Perito Moreno',    author: 'Tomás L.',  location: 'El Calafate',   tags: ['Nieve'],                likes: 891, src: Banner,   ratio: 'landscape' },
  { id: 'p3',  title: 'Bosque de arrayanes',      author: 'Camila P.', location: 'Villa La Angostura', tags: ['Bosque'],          likes: 156, src: Amanecer, ratio: 'square' },
  { id: 'p4',  title: 'Atardecer en la costanera', author: 'Martín G.', location: 'Mar del Plata', tags: ['Playa', 'Atardecer'],  likes: 420, src: Banner,   ratio: 'landscape' },
  { id: 'p5',  title: 'Cumbre nevada',            author: 'Lucía M.',  location: 'Mendoza',       tags: ['Montaña', 'Nieve'],    likes: 612, src: Amanecer, ratio: 'portrait' },
  { id: 'p6',  title: 'Callejón de San Telmo',    author: 'Diego F.',  location: 'Buenos Aires',  tags: ['Ciudad'],              likes: 278, src: Banner,   ratio: 'square' },
  { id: 'p7',  title: 'Río de la Plata',          author: 'Ana B.',    location: 'Tigre',         tags: ['Río'],                 likes: 189, src: Amanecer, ratio: 'landscape' },
  { id: 'p8',  title: 'Desierto de Sal',          author: 'Pablo Q.',  location: 'Jujuy',         tags: ['Desierto'],            likes: 733, src: Banner,   ratio: 'portrait' },
  { id: 'p9',  title: 'Nubes en la cordillera',   author: 'Sofía R.',  location: 'Bariloche',     tags: ['Montaña'],             likes: 401, src: Amanecer, ratio: 'landscape' },
  { id: 'p10', title: 'Puesta de sol urbana',     author: 'Martín G.', location: 'Rosario',       tags: ['Ciudad', 'Atardecer'], likes: 356, src: Banner,   ratio: 'square' },
  { id: 'p11', title: 'Playa desierta',           author: 'Camila P.', location: 'Pinamar',       tags: ['Playa'],               likes: 220, src: Amanecer, ratio: 'portrait' },
  { id: 'p12', title: 'Sendero en la selva',      author: 'Diego F.',  location: 'Iguazú',        tags: ['Bosque', 'Río'],       likes: 502, src: Banner,   ratio: 'landscape' },
  { id: 'p13', title: 'Nieve temprana',           author: 'Lucía M.',  location: 'Ushuaia',       tags: ['Nieve', 'Montaña'],    likes: 645, src: Amanecer, ratio: 'square' },
  { id: 'p14', title: 'Reflejo al alba',          author: 'Ana B.',    location: 'Nahuel Huapi',  tags: ['Río', 'Atardecer'],    likes: 388, src: Banner,   ratio: 'portrait' },
  { id: 'p15', title: 'Calles de colores',        author: 'Pablo Q.',  location: 'La Boca',       tags: ['Ciudad'],              likes: 297, src: Amanecer, ratio: 'landscape' },
  { id: 'p16', title: 'Dunas al atardecer',       author: 'Sofía R.',  location: 'Villa Gesell',  tags: ['Desierto', 'Playa'],   likes: 461, src: Banner,   ratio: 'square' },
];