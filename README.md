# Nexo

Un archivo visual para fotógrafos y artistas, construido con React y Vite. Esta versión es un prototipo local, sin Firebase ni autenticación de servidor.

## Desarrollo

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
```

## Funciones

- Descubrimiento de series por disciplina, autor, título, ubicación y etiquetas.
- Guardados persistentes y compartidos entre pantallas, separados por correo de prueba.
- Portfolios de autor, detalle de serie y visor accesible con Escape y foco modal.
- Creación de series con hasta 12 fotos JPG, PNG o WebP, eliminación y descarga de copias locales.
- Optimización de imágenes a un máximo de 1200 píxeles por lado mayor y JPEG. No conserva originales ni metadatos EXIF.
- Diseño móvil, navegación de teclado y ruta 404.

## Límites del prototipo

El acceso acepta cualquier correo válido y contraseña no vacía. No verifica identidad. El correo usado selecciona los datos locales, pero no es una barrera de seguridad: cualquier persona con acceso al navegador puede leerlos.

Las series nuevas se guardan únicamente en localStorage, como archivos privados locales. Borrar los datos del navegador elimina las series. El almacenamiento es limitado; la interfaz informa si no puede guardar. Para material importante conservá siempre los originales fuera de la app.

Las series, nombres de autores y portfolios iniciales son ejemplos. Algunas imágenes de demostración vienen de Unsplash y requieren internet. Las publicaciones, invitaciones, visibilidad remota y moderación no están implementadas. El enlace de las series de ejemplo funciona solo si el destinatario entra al acceso de prueba; las series locales no se comparten por enlace.

## Estructura activa

`src/App.jsx` maneja la sesión de prueba. `src/studio/Studio.jsx`, `data.js` y `studio.css` contienen la nueva experiencia editorial. Las páginas anteriores permanecen en el repositorio como referencia, pero no forman parte de las rutas activas, salvo Login y Register.

Antes del lanzamiento: integrar autenticación, almacenamiento remoto, autorización por propietario e invitación, moderación y copias de seguridad.
