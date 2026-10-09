# Álbumes compartidos

El dueño abre una serie y elige Compartir. Las invitaciones se guardan en
`users/{ownerId}/albums/{albumId}/albumInvitations/{correoEnMinusculas}`.
Los destinatarios encuentran sus invitaciones en `/compartidos` y necesitan
verificar su correo con Firebase Authentication. No se envían mensajes de
invitación automáticos; el enlace de verificación sí lo envía Firebase.

El invitado puede leer el documento del álbum y las imágenes de Storage.
Solo el dueño puede invitar, revocar, subir, editar o borrar. No hay enlaces
públicos de descarga ni búsquedas de correos de usuarios. Las invitaciones
funcionan también para personas que todavía no crearon una cuenta.

`shareKey` distingue cada creación del álbum; una invitación antigua no abre
un álbum restaurado o recreado con el mismo identificador. La primera
invitación migra los álbumes existentes de forma atómica. Las ediciones
conservan la clave y el control de revisiones.

## Activación

Publicar `firestore.rules` y `storage.rules` antes de desplegar esta versión.
Firebase puede pedir habilitar la conexión de las reglas de Storage con
Firestore para consultar las invitaciones; aceptar la autorización de lectura
para el servicio de reglas, sin abrir los datos a usuarios no autorizados.
El índice de grupo de colecciones de `albumInvitations.recipientEmail`
ascendente está definido en `firestore.indexes.json`.

Con Firebase CLI autenticado, desde la raíz del repositorio:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage --project nexo-9d725
```

CORS se conserva con los dos orígenes ya configurados: localhost:5173 y la
app principal de Vercel. Para otra URL de preview hace falta agregar su origen.

## Comprobación

Usar dos cuentas distintas. Crear una serie con la primera, invitar al correo
de la segunda, verificar ese correo y abrir Compartidos conmigo. Comprobar
que no aparecen acciones de edición, eliminación o descarga. Quitar acceso
desde la primera cuenta y confirmar que la segunda ya no puede abrirla.
La revocación impide nuevas lecturas; no borra imágenes que la persona ya vio
o conservó fuera de la app.

Pruebas automatizadas: `npm test`, `npm run lint`, `npm run build` y
`firebase emulators:exec --project demo-nexo --only firestore,storage 'npm run test:rules'`.
