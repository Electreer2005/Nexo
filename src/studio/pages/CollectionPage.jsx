import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import PageIntro from '../components/PageIntro';
import CollectionFilters from '../components/CollectionFilters';
function normalize(text) { return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
export default function CollectionPage({ albums, saved, onSave, mode }) {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState('recent');
  const query = params.get('q') || '';
  const category = params.get('disciplina') || 'Todas';
  const tag = params.get('etiqueta');
  const list = albums.filter(a => (mode !== 'mine' || a.local) && (mode !== 'saved' || saved.includes(a.id)) && (mode === 'mine' || mode === 'saved' || a.visibility !== 'private')).filter(a => normalize([a.title, a.author, a.location, ...a.tags].join(' ')).includes(normalize(query)) && (category === 'Todas' || a.discipline === category) && (!tag || a.tags.includes(tag))).sort((a,b) => sort === 'title' ? a.title.localeCompare(b.title, 'es') : b.date.localeCompare(a.date));
  function filter(key, value) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); }
  return <><PageIntro eyebrow={mode === 'mine' ? 'TU ARCHIVO' : mode === 'saved' ? 'TU SELECCIÓN' : 'EL ARCHIVO ABIERTO'} title={mode === 'mine' ? 'Tu trabajo, en series.' : mode === 'saved' ? 'Miradas que guardaste.' : 'Lo que merece una segunda mirada.'}>{mode === 'mine' ? 'Organizá tus fotos en tu archivo local.' : mode === 'saved' ? 'Un lugar para volver a lo que te inspira.' : 'Series de fotografía y arte visual. Sin apuro, imagen por imagen.'}</PageIntro><CollectionFilters category={category} query={query} sort={sort} tag={tag} onFilter={filter} onSort={setSort} /><div className="collection-count">{list.length} {list.length === 1 ? 'serie' : 'series'}</div>{list.length ? <div className="work-grid">{list.map(a => <Card key={a.id} album={a} saved={saved.includes(a.id)} onSave={onSave} />)}</div> : <EmptyState title={mode === 'mine' ? 'Tu primera serie empieza acá.' : 'No hay series para mostrar.'} description={mode === 'mine' ? 'Elegí tus imágenes y creá un álbum.' : 'Probá otra búsqueda o guardá una serie del archivo.'} to={mode === 'mine' ? '/crear' : '/'} action={mode === 'mine' ? 'Crear una serie' : 'Volver al archivo'} />}</>;
}
