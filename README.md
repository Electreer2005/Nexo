# Nexo

Un archivo visual para fotógrafos y artistas, construido con React y Vite. Firebase Authentication gestiona las cuentas. Los álbumes, guardados y datos extendidos del perfil todavía se almacenan localmente.

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
- Guardados persistentes y compartidos entre pantallas, separados por correo de la cuenta.
- Portfolios de autor, detalle de serie y visor accesible con Escape y foco modal.
- Creación y edición de series con hasta 12 fotos JPG, PNG o WebP: títulos de imágenes, orden, portada, eliminación y descarga de copias locales.
- Perfil editable con biografía, ubicación y especialidad, con nombre en Firebase y datos extendidos locales.
- Ajustes con exportación JSON y restauración validada: incorpora series nuevas sin reemplazar las que ya existen.
- Guías y ejercicios de luz, composición y selección de series. Contenido fijo, sin IA ni evaluación de fotos.
- Menú de cuenta que se cierra con Escape o al tocar afuera.
- Optimización de imágenes a un máximo de 1200 píxeles por lado mayor y JPEG. No conserva originales ni metadatos EXIF.
- Diseño móvil, navegación de teclado y ruta 404.

## Límites del prototipo

El acceso usa Firebase Authentication con correo y contraseña. La sesión se restaura con onAuthStateChanged; el antiguo nexo:user ya no concede acceso. El archivo local sigue siendo accesible para alguien con acceso al navegador y no es almacenamiento remoto protegido.

Las series nuevas se guardan únicamente en localStorage, como archivos privados locales. Borrar los datos del navegador elimina las series. El almacenamiento es limitado; la interfaz informa si no puede guardar. Para material importante conservá siempre los originales fuera de la app.

Las series, nombres de autores y portfolios iniciales son ejemplos. Las imágenes de demostración se incluyen en el proyecto en WebP, con portadas de hasta 960 px y vistas ampliadas de 2400 px de ancho; no requieren conexión a Unsplash. Los créditos reales aparecen en cada imagen. Las publicaciones, invitaciones, visibilidad remota y moderación no están implementadas. El enlace de las series de ejemplo funciona solo si el destinatario inicia sesión; las series locales no se comparten por enlace.

## Estructura activa

`src/App.jsx` maneja la sesión de prueba. `src/studio/Studio.jsx` conecta las rutas y el archivo local. `src/studio/components/` contiene navegación, filtros, tarjetas, estados vacíos, visor y subida de fotos. `src/studio/pages/` contiene las pantallas activas. `archive.js` valida las copias importadas. `data.js` y `studio.css` definen el catálogo de ejemplo y el diseño editorial. Las páginas anteriores permanecen en el repositorio como referencia, pero no forman parte de las rutas activas, salvo Login y Register.

Antes del lanzamiento: completar almacenamiento remoto, autorización por propietario e invitación, moderación y copias de seguridad.

## Créditos fotográficos

Selección de demostración; los nombres de perfiles y títulos de series son ficticios. Fotografías descargadas de Unsplash y convertidas a WebP:

- Fitz Roy: [Marina Zvada](https://unsplash.com/photos/i5W6KLe8w1Y).
- Arquitectura en Oslo: [Damon Zaidmus](https://unsplash.com/photos/h6d3NwoOeuw).
- Dalia: [Annie Spratt](https://unsplash.com/photos/TDbWFtSscJY).
- [Licencia Unsplash](https://unsplash.com/license).

## Activar Firebase Authentication

1. En [Firebase Console](https://console.firebase.google.com/project/nexo-9d725/authentication/providers), abrir Authentication y habilitar el proveedor Correo electrónico/contraseña.
2. Revisar Authentication → Settings → Authorized domains: incluir localhost para desarrollo y el dominio de Vercel o el dominio propio que use la app.
3. Probar registro, logout, acceso y recuperación de contraseña con una cuenta propia.

La recuperación usa el enlace de Firebase y su página alojada para elegir una nueva contraseña. No se usa una pantalla de reset local. El nombre se guarda con updateProfile; biografía, ubicación y especialidad permanecen locales. Analytics no se inicializa en esta etapa.

`src/lib/firebase.js` contiene la configuración pública de la app web; no contiene credenciales administrativas. Los accesos a Firestore y Storage se preparan con carga diferida, pero todavía no se suben fotos ni se escriben documentos. Se deben definir y probar reglas de acceso antes de esa migración.
