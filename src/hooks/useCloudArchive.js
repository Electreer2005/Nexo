import { useEffect, useState } from 'react';
import { cloudError, watchAlbums, watchSaved } from '../lib/cloudArchive';
export default function useCloudArchive(uid) {
  const [albums, setAlbums] = useState([]); const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => {
    let active = true; const unsubscribe = [];
    watchAlbums(uid, next => { if (active) { setAlbums(next); setLoading(false); } }, err => { if (active) { setError(cloudError(err)); setLoading(false); } }).then(stop => active ? unsubscribe.push(stop) : stop()).catch(err => { if (active) { setError(cloudError(err)); setLoading(false); } });
    watchSaved(uid, next => { if (active) setSaved(next); }, err => { if (active) setError(cloudError(err)); }).then(stop => active ? unsubscribe.push(stop) : stop()).catch(err => { if (active) setError(cloudError(err)); });
    return () => { active = false; unsubscribe.forEach(stop => stop()); };
  }, [uid]);
  function upsert(album) { setAlbums(previous => [album,...previous.filter(item=>item.id !== album.id)]); }
  return { albums, saved, loading, error, upsert };
}
