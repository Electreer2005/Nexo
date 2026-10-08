import { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
export default function Image({ src, alt, ...props }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="image-fallback" role="img" aria-label={alt}><FaCamera /><span>Imagen no disponible</span></div>;
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} {...props} />;
}
