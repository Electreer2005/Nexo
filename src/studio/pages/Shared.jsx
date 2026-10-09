import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cloudError } from '../../lib/cloudArchive';
import { refreshVerification, verifyEmail, watchReceived, watchSharedAlbum } from '../../lib/sharing';
import Detail from './Detail';
export default function Shared({user}) {
  const [verified,setVerified]=useState(user.emailVerified);const [items,setItems]=useState([]);const [message,setMessage]=useState('');const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);
  useEffect(()=>{if(!verified)return;return watchReceived(user.email,list=>{setItems(list);setLoading(false);},err=>{setMessage(cloudError(err));setLoading(false);});},[verified,user.email]);
  async function action(refresh) {setBusy(true);try{if(refresh){const next=await refreshVerification();setVerified(next);setMessage(next?'Correo verificado.':'Todavía no está verificado. Revisá tu correo.');}else{await verifyEmail();setMessage('Te enviamos un enlace de verificación. Revisá también spam.');}}catch(err){setMessage(cloudError(err));}finally{setBusy(false);}}
  return <><header className="detail-heading"><div><span className="kicker">MIRADAS EN CONFIANZA</span><h1>Compartidos conmigo.</h1><p>Álbumes que otras personas te invitaron a ver.</p></div></header><p className="status-message" role="status">{message}</p>{!verified?<section className="empty-collection"><h2>Verificá tu correo para acceder</h2><p>Las invitaciones están asociadas a {user.email}. Confirmá que ese correo es tuyo antes de abrir fotos privadas.</p><button className="solid-button" disabled={busy} onClick={()=>action(false)}>Enviar enlace de verificación</button><button className="outline-button" disabled={busy} onClick={()=>action(true)}>Ya verifiqué mi correo</button></section>:loading?<p role="status">Buscando invitaciones…</p>:items.length?<div className="shared-list">{items.map(item=><Link key={item.id} to={`/compartido/${encodeURIComponent(item.ownerId)}/${encodeURIComponent(item.albumId)}`}><span className="kicker">INVITACIÓN · SOLO LECTURA</span><h2>{item.title}</h2><span>Abrir álbum ↗</span></Link>)}</div>:<div className="empty-collection"><h2>Todavía no tenés invitaciones.</h2><p>Pedile al dueño de un álbum que invite a {user.email}.</p></div>}</>;
}
export function SharedDetail() {
  const {ownerId,albumId}=useParams();const [album,setAlbum]=useState(null);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  useEffect(()=>watchSharedAlbum(ownerId,albumId,next=>{setAlbum(next);setLoading(false);},()=>{setAlbum(null);setLoading(false);setError('El álbum ya no está disponible o no tenés acceso. Verificá el correo de tu cuenta o consultá al dueño.');}),[ownerId,albumId]);
  if(loading)return <p role="status">Abriendo álbum compartido…</p>;
  if(!album)return <section className="empty-collection"><h1>No podemos abrir este álbum</h1><p role="alert">{error || 'El dueño eliminó la serie.'}</p><Link className="outline-button" to="/compartidos">Volver a mis invitaciones</Link></section>;
  return <Detail albums={[album]} saved={[]} />;
}
