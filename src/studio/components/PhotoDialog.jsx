import { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import Photo from './Photo';
export default function PhotoDialog({ photo, onClose }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; if (!dialog.open) dialog.showModal(); }, []);
  return <dialog ref={ref} className="photo-dialog" onClose={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-label={photo.title}><button className="dialog-close" onClick={onClose} aria-label="Cerrar foto"><FaTimes /></button><Photo photo={photo} alt={photo.title} /><p>{photo.title}{photo.credit && <a className="photo-credit" href={photo.source} target="_blank" rel="noreferrer">Foto: {photo.credit} / Unsplash ↗</a>}</p></dialog>;
}
