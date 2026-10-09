import landscape from '../assets/editorial/patagonia.webp';
import landscapeCover from '../assets/editorial/patagonia-cover.webp';
import architecture from '../assets/editorial/arquitectura.webp';
import architectureCover from '../assets/editorial/arquitectura-cover.webp';
import botanical from '../assets/editorial/botanica.webp';
import botanicalCover from '../assets/editorial/botanica-cover.webp';

export const disciplines = ['Todas', 'Paisaje', 'Retrato', 'Arquitectura', 'Arte visual'];
export const collections = [
  { id: 'sur', title: 'Donde termina el sur', author: 'Clara Montes', discipline: 'Paisaje', location: 'Patagonia', description: 'Cumbres nevadas y colores de otoño al pie del Fitz Roy. Una selección de ejemplo sobre la escala del paisaje.', tags: ['Montaña', 'Luz natural'], cover: landscapeCover, date: '2026-10-01', photos: [{ id: 'sur-1', src: landscape, title: 'Fitz Roy', credit: 'Marina Zvada', source: 'https://unsplash.com/photos/i5W6KLe8w1Y' }] },
  { id: 'silencio', title: 'La forma del silencio', author: 'Tomás Vidal', discipline: 'Arquitectura', location: 'Oslo', description: 'Espacios cotidianos vistos desde sus líneas y sus pausas.', tags: ['Ciudad', 'Geometría'], cover: architectureCover, date: '2026-09-27', photos: [{ id: 'silencio-1', src: architecture, title: 'Líneas abiertas', credit: 'Damon Zaidmus', source: 'https://unsplash.com/photos/h6d3NwoOeuw' }] },
  { id: 'botanica', title: 'Notas de primavera', author: 'Inés Costa', discipline: 'Arte visual', location: 'Sin ubicación indicada', description: 'Un pequeño archivo de colores, texturas y flores que aparecen sin pedir permiso.', tags: ['Flores', 'Color'], cover: botanicalCover, date: '2026-09-21', photos: [{ id: 'botanica-1', src: botanical, title: 'Dalia en luz suave', credit: 'Annie Spratt', source: 'https://unsplash.com/photos/TDbWFtSscJY' }] },
];
