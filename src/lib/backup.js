import { photoBlob } from './cloudArchive';
function asDataURL(blob) { return new Promise((resolve,reject) => { const reader=new FileReader(); reader.onload=() => resolve(reader.result); reader.onerror=reject; reader.readAsDataURL(blob); }); }
export async function exportCloudArchive(albums, saved) {
  const copies=[];
  for (const album of albums) {
    const photos=[];
    for (const photo of album.photos) photos.push({ id:photo.id, title:photo.title, src:await asDataURL(await photoBlob(photo.path)) });
    copies.push({ ...album, photos, cover:photos[0].src });
  }
  return { version:1, albums:copies, saved };
}
export async function downloadPhoto(photo) {
  const url=URL.createObjectURL(await photoBlob(photo.path));
  const link=document.createElement('a');link.href=url;link.download=`${photo.title || 'foto'}.jpg`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
