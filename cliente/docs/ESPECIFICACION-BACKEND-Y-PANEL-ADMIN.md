# Especificación para backend y panel de administración

**Proyecto:** ACV2.MUSIC (prototipo frontend en `cliente`)  
**Audiencia:** equipo de backend, DevOps y quien implemente el CMS o panel de administración  
**Objetivo:** definir cómo se gestionaría el contenido desde un panel admin (subida de imágenes, videos y demás) para que la API y el almacenamiento encajen con lo que hoy muestra el prototipo, evitando desalineación cuando el frontend se conecte a datos reales.

---

## 1. Contexto del prototipo actual

El sitio es un **prototipo de presentación para cliente**: no existe servidor propio; el texto, listas y comportamiento están **hardcodeados** o en memoria/localStorage.

| Área actual | Comportamiento hoy |
|-------------|-------------------|
| Navegación, highlights, redes | `src/data/siteContent.js` |
| Música, galería, comunidad, exclusivo | Arrays/objetos dentro de cada página |
| Registro / login | `localStorage` (`musico-prototype-user`), sin contraseña real en login |
| Ruta protegida `/exclusivo` | Solo comprueba si hay usuario en contexto |
| Contacto | Simula envío en el cliente |

Cualquier panel admin y backend debe **reemplazar** esas fuentes por **API + archivos** (o URLs externas) con contratos estables.

---

## 2. Visión del panel de administración

Se asume un **panel web restringido a roles administrativos** (separado del sitio público o bajo ruta protegida con rol `admin`).

### 2.1 Funciones mínimas del panel

1. **Gestión de medios (Media library)**  
   - Subida de archivos con validación de tipo y tamaño.  
   - Generación de **URL pública** (CDN o bucket con lectura pública) o URL firmada según política de seguridad.  
   - Metadatos: nombre original, MIME, dimensiones (imagen/video), duración (audio/video), tamaño en bytes, fecha de carga.

2. **Contenido editorial por sección** (mapeado 1:1 a las pantallas del prototipo; ver sección 4).

3. **Usuarios y membresía** (si se mantiene la zona exclusiva real).  
   - Altas, bloqueos, asignación de rol `user` / `admin`.  
   - Opcional: flags tipo `hasPremiumAccess` o suscripción.

4. **Bandeja de contacto**  
   - Listado de mensajes del formulario de `/contacto` con estados (nuevo, leído, respondido).

5. **Comunidad (eventos y votaciones)**  
   - CRUD de eventos de agenda.  
   - Configuración de tracks/canciones votables y lectura de resultados (el front hoy solo incrementa en memoria).

### 2.2 Flujo típico de subida (recomendado)

1. El admin solicita **URL prefirmada** o abre endpoint de **multipart** según diseño.  
2. El archivo queda en **object storage** (S3, R2, Azure Blob, etc.).  
3. El backend persiste un registro `media_asset` y devuelve `id` + `publicUrl` (o equivalente).  
4. Al crear/editar un ítem de galería, track, bloque de home, etc., el panel **asocia** `mediaId` o guarda directamente la `publicUrl` según el modelo de datos acordado.

**Coordinación con frontend:** el contrato debe exponer siempre **HTTPS** y, si es posible, **CORS** habilitado para el dominio del SPA.

---

## 3. Autenticación y autorización (alineación futura)

Hoy el front usa `name` + `email` en localStorage. Para producción se recomienda:

| Concepto | Uso en el prototipo | Expectativa backend |
|----------|---------------------|---------------------|
| Usuario final | `ExclusivePage` saluda con `user.name` | JWT/sesión con claims mínimos: `sub`, `name`, `email`, roles |
| Zona `/exclusivo` | Cualquier usuario “logueado” | Solo usuarios autenticados **y** con permiso premium si el negocio lo exige |
| Admin panel | No existe en el front | Rol `admin` (o permisos granulares); **nunca** mezclar con el mismo token de usuario sin scopes claros |

**Registro:** el formulario envía `name`, `email`, `password`. El backend debe hashear contraseña, validar email, etc.

**Login:** el prototipo pide nombre + email sin password; en integración real el login debería ser **email + password** (o OAuth) y el front se adaptará al contrato acordado.

---

## 4. Inventario de contenido por pantalla (contrato funcional)

Esta tabla es la **fuente de verdad** para que el CMS no invente secciones desconectadas del UI actual.

### 4.1 Sitio global (`siteContent` y layout)

| Recurso | Campos lógicos sugeridos | Notas |
|---------|--------------------------|--------|
| `nav_links` | `label`, `path`, `sortOrder`, `visible` | Hoy: Inicio, Música, Galería, Comunidad, Contacto, Exclusivo |
| `social_links` | `platform` (enum), `url`, `sortOrder`, `visible` | Footer y bloque en home usan nombre + href |
| `highlights` (home) | `title`, `description`, `sortOrder`, `visible` | Tres tarjetas bajo el hero |

Opcional para home (hoy fijos en JSX): **chips** del hero, **titulares** del hero, **métricas** (+120K streams, etc.) si el cliente quiere editarlos sin deploy.

### 4.2 `/musica` — Catálogo de tracks

Cada track en el prototipo tiene: `title`, `status`, `mood`, `duration`, `type` (`single` | `live` | `ep`).

**Sugerencia de modelo `music_track`:**

- `id` (UUID)  
- `title`, `status` (texto corto, ej. “Single 2026”), `mood`, `duration` (string legible o segundos + formato en cliente)  
- `type`: enum **`single` | `live` | `ep`** (debe coincidir con los filtros del front)  
- `coverImageId` o `coverImageUrl` (para cuando se reemplace el layout solo texto)  
- `previewAudioId` o `previewAudioUrl` (archivo corto o URL)  
- Opcional: `spotifyUrl`, `youtubeUrl`, `appleMusicUrl` (el copy menciona integración futura)  
- `published`, `sortOrder`, `releasedAt`

**Panel:** CRUD + subida de portada y preview; reordenar con drag-and-drop mapeado a `sortOrder`.

### 4.3 `/galeria` — Items visuales

Prototipo: grid de ítems con `title`, `type` (“Show” | “Backstage”), lightbox sin archivo real aún.

**Sugerencia `gallery_item`:**

- `id`  
- `title`  
- `category`: enum **`show` | `backstage`** (el front puede mapear a “Show” / “Backstage” en español)  
- `thumbnailImageId` / URL (obligatorio para grid real)  
- `detailMediaType`: **`image` | `video`**  
- `detailImageId` / URL o `detailVideoId` / URL  
- `caption` o `description` (texto en lightbox)  
- `published`, `sortOrder`

**Panel:** subir thumbnail; elegir si el detalle es imagen o video; opción de pegar URL externa (YouTube/Vimeo) si no se hospeda el video en propio storage (definir política única: self-hosted vs embed).

### 4.4 `/comunidad`

**Eventos:** hoy `city`, `name`, `date` (texto). Modelo sugerido `community_event`: fechas en ISO 8601 + campos de presentación `city`, `title`, `timezone`, `published`, `sortOrder`.

**Votación setlist:** hoy tres tracks con contador local. Modelo sugerido:

- `poll` (id, título, fechas inicio/fin, `published`)  
- `poll_option` (id, `pollId`, `label` o `musicTrackId`, `sortOrder`)  
- `vote` (usuario o IP+device fingerprint según anti-fraude; definir con legal/negocio)

API pública: `GET` opciones + totales agregados (o porcentajes).  
API usuario: `POST` voto con idempotencia o límite por usuario.

### 4.5 `/exclusivo` — Contenido premium

Prototipo: tarjetas con `title`, `description`, `action` (texto del botón).

**Sugerencia `premium_content_item`:**

- `title`, `description`, `ctaLabel`  
- `contentType`: enum **`video` | `link` | `download` | `info`** (extensible)  
- `mediaId` / URLs según tipo  
- `requiresAuth`: true (siempre para esta sección)  
- `requiresPremium`: boolean según modelo de negocio  
- `published`, `sortOrder`

**Panel:** asociar video/archivo; para “descargas” usar objeto con checksum, nombre de archivo y permiso de descarga en API (URL firmada con expiración corta).

### 4.6 `/contacto`

Campos del formulario: `name`, `email`, `subject`, `message`.

**Backend:** `POST /api/contact-messages` (rate limit + CAPTCHA opcional).  
**Panel:** listar, marcar estado, exportar CSV opcional.

### 4.7 Marca y SEO (recomendado)

- `site_settings`: título del sitio (hoy “ACV2.Music” en `index.html`), descripción, OG image por defecto.  
- Facilita que marketing cambie textos sin tocar código.

---

## 5. API: convenciones sugeridas

- **Base path:** `/api/v1/` (versionado explícito).  
- **JSON** en cuerpo y respuestas; charset UTF-8.  
- **Errores:** cuerpo JSON `{ "code": "STRING", "message": "humano", "details": {} }` con HTTP 4xx/5xx coherentes.  
- **Listados:** paginación `?page=&pageSize=` o cursor; incluir `total` cuando sea barato.  
- **Orden:** por defecto respetar `sortOrder` ASC; criterio secundario `createdAt`.  
- **Caché:** headers `Cache-Control` para GET públicos de catálogo/galería si el contenido no es tiempo real.

### 5.1 Endpoints orientativos (a refinar en OpenAPI)

| Método | Ruta (ejemplo) | Quién |
|--------|----------------|--------|
| GET | `/public/site-config` | Público |
| GET | `/public/music-tracks` | Público |
| GET | `/public/gallery` | Público |
| GET | `/public/community-events` | Público |
| GET | `/public/polls/:id` | Público |
| POST | `/public/polls/:id/vote` | Usuario autenticado (recomendado) |
| GET | `/public/premium-preview` | Opcional: solo metadatos sin URLs sensibles |
| GET | `/me/premium-content` | Usuario con premium |
| POST | `/public/contact-messages` | Público con anti-spam |
| POST | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | Público / usuario |
| CRUD | `/admin/*` | Admin (o servicio BFF separado) |

Los prefijos `/public` vs `/admin` son ilustrativos; lo crítico es **separar permisos** y documentar el mismo esquema de datos que consumirá el SPA.

---

## 6. Archivos y límites (coordinación práctica)

Definir en conjunto (backend + cliente + diseño):

- **Imágenes:** JPEG/PNG/WebP; tamaño máximo por subida; resize en servidor o al subir.  
- **Video:** codec (ej. H.264 + AAC), tamaño máximo, si se usa **transcoding** a múltiples calidades.  
- **Audio preview:** MP3/AAC, duración máxima.  
- **Descargables ZIP/WAV:** política de virus scan y límites de ancho de banda.

El frontend solo necesita **URLs finales estables** o IDs resolubles a URL en un endpoint `GET /media/:id/url` con firma si aplica.

---

## 7. Checklist de alineación con el equipo frontend

1. Publicar **OpenAPI/Swagger** o esquema TypeScript compartido con los DTO de cada lista pública.  
2. Confirmar enums **`music_track.type`** y **`gallery_item.category`** exactamente como arriba (o documentar mapping).  
3. Definir si las imágenes van como **URL absoluta** en JSON o como **`{ id, url }`**.  
4. Acordar **autenticación** (Bearer JWT recomendado) y cabeceras CORS.  
5. Definir **entorno** (`VITE_API_BASE_URL` o similar) para el build del SPA.  
6. Plan de **migración**: primero GET públicos reemplazando mocks; luego auth y zona exclusiva.

---

## 8. Glosario rápido

| Término | Significado |
|---------|-------------|
| CMS / Panel admin | Aplicación interna para cargar contenido y medios |
| Media asset | Registro de archivo subido + URL de entrega |
| SPA | Esta app React (Vite) en `cliente` |
| Zona exclusiva | Ruta `/exclusivo`, hoy mock, mañana datos filtrados por usuario/premium |

---

**Documento generado para coordinación backend–frontend** sobre el prototipo en la carpeta `cliente`. Cualquier cambio de UI (nuevos campos o tipos) debe reflejarse aquí y en el contrato de API para mantener una sola fuente de verdad.
