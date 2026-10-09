import { useEffect, useState } from 'react';
import { photoBlob } from '../../lib/cloudArchive';
import Image from './Image';
export default function PrivateImage({ photo, ...props }) {
  const [source, setSource] = useState(''); const [error, setError] = useState(false);
  useEffect(() => {
    let active = true; let url;
    photoBlob(photo.path).then(blob => { if (active) { url=URL.createObjectURL(blob); setSource(url); } }).catch(() => { if (active) setError(true); });
    return () => { active=false; if (url) URL.revokeObjectURL(url); };
  }, [photo.path]);
  if (error) return <div className="image-fallback" role="img" aria-label={props.alt}>No se pudo cargar la foto. Revisá permisos y conexión.</div>;
  if (!source) return <div className="image-fallback" role="status">Cargando foto…</div>;
  return <Image key={source} src={source} {...props} />;
}
