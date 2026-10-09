# Nexo

Archivo visual para fotógrafos y artistas, con React, Vite y Firebase. El acceso usa Authentication; las series y perfiles usan Firestore, y las fotos usan Storage. Las series del catálogo inicial son ejemplos.

## Desarrollo

```sh
npm ci
npm run dev
npm run lint
npm run test
npm run build
```

## Activar el proyecto Firebase

1. En el proyecto `nexo-9d725`, habilitar Authentication → Correo electrónico/contraseña y autorizar `localhost` y el dominio del despliegue.
2. Crear Cloud Firestore y activar Storage. Revisar en Firebase los requisitos de facturación de Storage antes de habilitarlo.
3. Publicar `firestore.rules` en Firestore → Rules y `storage.rules` en Storage → Rules. También pueden publicarse con Firebase CLI:

```sh
npx firebase-tools deploy --only firestore:rules,storage --project nexo-9d725
```

4. Para cargar imágenes por acceso autenticado, configurar CORS del bucket. `storage.cors.json` incluye localhost; agregar el origen HTTPS de Vercel o el dominio propio. Aplicar con Google Cloud CLI:

```sh
gcloud storage buckets update gs://nexo-9d725.firebasestorage.app --cors-file=storage.cors.json
```

La app muestra errores si los servicios o permisos no están preparados. Ninguna regla se publica automáticamente con el PR. Analytics no se inicializa.

## Archivo privado

- Series: `users/{uid}/albums/{id}`. Metadatos y rutas de fotos, sin base64 ni enlaces públicos en documentos.
- Fotos: `users/{uid}/albums/{id}/{archivo}`. Carga y lectura autenticadas; las imágenes se muestran con URLs de objeto temporales que se liberan al desmontar el componente.
- Perfil: `users/{uid}`. Nombre, biografía, ubicación y especialidad.
- Guardados: `users/{uid}/preferences/saved`.

Cada cuenta solo puede acceder a sus rutas. La publicación y las invitaciones todavía no están implementadas. No se usan URLs con token de descarga como enlaces para compartir.

La edición y eliminación usan transacciones con revisión para detectar cambios simultáneos. Las nuevas imágenes usan nombres únicos. Si falla una subida antes de escribir metadatos, se intenta limpiar lo subido. Si se pierde la respuesta de una escritura, se conservan los archivos para evitar borrar imágenes que podrían haberse guardado. La limpieza tras una eliminación o edición puede requerir intervención si falla: Firestore y Storage no ofrecen una transacción conjunta. Antes de producción se necesita una tarea de limpieza de objetos huérfanos.

## Fotos e importación

La app admite hasta 12 fotos JPG, PNG o WebP por serie. Optimiza a 1200 px de lado mayor y JPEG; no conserva originales ni EXIF. Storage limita cada archivo a menos de 5 MB.

Ajustes permite descargar una copia JSON con las imágenes, restaurarla o importar las series antiguas de localStorage. Las series ya presentes no se reemplazan, y las copias locales se conservan. Si una importación falla parcialmente, las series ya completadas permanecen y el reintento salta esos identificadores. Una copia JSON puede pesar bastante y contener fotos privadas: guardala en un lugar adecuado.

## Pruebas

`npm run test` verifica subidas, rutas, revisiones, guardados, compensación de errores y eliminación con dependencias Firebase simuladas.

Para probar reglas sin tocar datos reales, iniciar los emuladores y ejecutar:

```sh
npx firebase-tools@13.35.1 emulators:exec --project demo-nexo --only firestore,storage "npm run test:rules"
```

Las pruebas verifican aislamiento entre usuarios, rechazo anónimo, revisiones, visibilidad privada, tipos de archivo, tamaño y prohibición de sobrescritura. Requiere Java compatible con la versión del emulador. La prueba real entre dos cuentas y dispositivos se realiza después de activar servicios, reglas y CORS en el proyecto.

## Estructura

`src/App.jsx` y `src/hooks/useAuth.js` manejan acceso. `src/lib/cloudArchive.js` conecta Firestore y Storage. `src/hooks/useCloudArchive.js` mantiene las series y guardados por suscripción. `src/studio/components/` y `src/studio/pages/` contienen la experiencia activa. Las pantallas anteriores quedan como referencia y no participan de las rutas actuales, salvo las de Auth.

## Créditos fotográficos

Selección de demostración en WebP, con vistas de 2400 px de ancho y portadas de hasta 960 px. Perfiles y títulos de series ficticios; los créditos reales aparecen junto a las fotos.

- Fitz Roy: [Marina Zvada](https://unsplash.com/photos/i5W6KLe8w1Y).
- Arquitectura de Oslo: [Damon Zaidmus](https://unsplash.com/photos/h6d3NwoOeuw).
- Dalia: [Annie Spratt](https://unsplash.com/photos/TDbWFtSscJY).
- [Licencia Unsplash](https://unsplash.com/license).
