import Image from './Image';
import PrivateImage from './PrivateImage';
export default function Photo({ photo, ...props }) {
  return photo.path ? <PrivateImage key={photo.path} photo={photo} {...props} /> : <Image key={photo.src} src={photo.src} {...props} />;
}
