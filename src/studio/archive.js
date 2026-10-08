export function validateArchive(data) {
  const fail = () => { throw new Error('La copia no tiene el formato de archivo Nexo válido.'); };
  if (data?.version !== 1 || !Array.isArray(data.albums) || !Array.isArray(data.saved) || data.albums.length > 100) fail();
  const text = (v, max) => typeof v === 'string' && v.length <= max;
  const ids = new Set();
  const albums = data.albums.map(a => {
    if (!a || !text(a.id, 100) || !a.id || ids.has(a.id) || !text(a.title, 100) || !a.title.trim() || !text(a.description, 1500) || !text(a.discipline, 100) || !text(a.location, 100) || !text(a.date, 30) || !Array.isArray(a.tags) || a.tags.length > 50 || !a.tags.every(t => text(t,200)) || !Array.isArray(a.photos) || !a.photos.length || a.photos.length > 12) fail();
    ids.add(a.id); const photoIds = new Set();
    const photos = a.photos.map(p => {
      if (!p || !text(p.id, 100) || !p.id || photoIds.has(p.id) || !text(p.title,100) || typeof p.src !== 'string' || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(p.src)) fail();
      photoIds.add(p.id); return { id:p.id, title:p.title, src:p.src };
    });
    return { id:a.id, title:a.title, description:a.description, discipline:a.discipline, location:a.location, date:a.date, tags:a.tags, photos, cover:photos[0].src, local:true, visibility:'private' };
  });
  if (!data.saved.every(id => text(id,100))) fail();
  return { albums, saved:data.saved };
}
