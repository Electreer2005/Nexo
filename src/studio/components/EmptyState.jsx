import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
export default function EmptyState({ title, description, to = '/', action = 'Volver al archivo' }) {
  return <section className="empty-collection"><h2>{title}</h2>{description && <p>{description}</p>}<Link className="text-link" to={to}>{action}<FaArrowRight /></Link></section>;
}
