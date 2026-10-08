import landscape from '../assets/Amanecer.jpg';

export const disciplines = ['Todas', 'Paisaje', 'Retrato', 'Arquitectura', 'Arte visual'];
export const collections = [
  { id: 'sur', title: 'Donde termina el sur', author: 'Clara Montes', discipline: 'Paisaje', location: 'Patagonia', description: 'La luz cambia antes que el paisaje. Una serie sobre la espera, el frío y las primeras horas del día.', tags: ['Montaña', 'Luz natural'], cover: landscape, date: '2026-10-01', photos: [{ id: 'sur-1', src: landscape, title: 'Primera luz' }] },
  { id: 'silencio', title: 'La forma del silencio', author: 'Tomás Vidal', discipline: 'Arquitectura', location: 'Buenos Aires', description: 'Espacios cotidianos vistos desde sus líneas y sus pausas.', tags: ['Ciudad', 'Geometría'], cover: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=80', date: '2026-09-27', photos: [{ id: 'silencio-1', src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85', title: 'Líneas abiertas' }] },
  { id: 'botanica', title: 'Notas de primavera', author: 'Inés Costa', discipline: 'Arte visual', location: 'Córdoba', description: 'Un pequeño archivo de colores, texturas y flores que aparecen sin pedir permiso.', tags: ['Flores', 'Color'], cover: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=80', date: '2026-09-21', photos: [{ id: 'botanica-1', src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1600&q=85', title: 'Flores de septiembre' }] },
];
