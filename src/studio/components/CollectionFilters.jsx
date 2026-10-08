import { FaSearch } from 'react-icons/fa';
import { disciplines } from '../data';
export default function CollectionFilters({ category, query, sort, tag, onFilter, onSort }) {
  return <><div className="collection-tools"><div className="category-tabs" aria-label="Disciplinas">{disciplines.map(d => <button key={d} className={category === d ? 'selected' : ''} onClick={() => onFilter('disciplina', d === 'Todas' ? '' : d)} aria-pressed={category === d}>{d}</button>)}</div><select value={sort} onChange={e => onSort(e.target.value)} aria-label="Ordenar series"><option value="recent">Más recientes</option><option value="title">Título A–Z</option></select></div><label className="collection-search"><FaSearch /><input value={query} onChange={e => onFilter('q', e.target.value)} placeholder="Buscar título, autor, lugar o etiqueta" aria-label="Buscar series" /></label>{tag && <button className="text-link" onClick={() => onFilter('etiqueta', '')}>Quitar etiqueta {tag} ×</button>}</>;
}
