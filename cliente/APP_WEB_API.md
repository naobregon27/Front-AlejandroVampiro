# API de la aplicación web — ACV2.Music

Documento de contrato entre el **backend** (`acv2-music-api`) y la **aplicación web pública** (sitio de música, galería, eventos, contacto, encuestas y zona premium).

**Versión API:** `v1`  
**Base URL:** `{PUBLIC_API_URL}/api/v1`  
**Swagger:** `{PUBLIC_API_URL}/api/v1/docs`

---

## 1. Resumen del sistema

| Componente | Descripción |
|------------|-------------|
| **Backend** | Node.js + Express + TypeScript + MongoDB |
| **Medios** | Cloudinary (carpeta `musica-acv`). URLs HTTPS en respuestas JSON |
| **Emails** | SendGrid (bienvenida al registrarse, confirmación de contacto) |
| **Auth** | JWT (access 15 min + refresh 7 días) |

---

## 2. Roles y permisos

### 2.1 Roles disponibles

| Rol | Valor | Quién lo tiene |
|-----|-------|----------------|
| **Usuario** | `user` | Cualquiera que se registra en la app web |
| **Administrador** | `admin` | Cuenta creada por bootstrap o promovida manualmente |

No existen más roles. La distinción de acceso premium no es un rol, es un **flag**.

### 2.2 Flags de usuario

| Flag | Efecto en la app web |
|------|----------------------|
| `hasPremiumAccess: true` | Puede ver contenido exclusivo en `GET /me/premium-content` |
| `hasPremiumAccess: false` | Solo ve el teaser en `GET /public/premium-preview` |
| `isBlocked: true` | No puede iniciar sesión ni usar rutas autenticadas (`401`) |

El admin gestiona `hasPremiumAccess` desde el panel. El usuario **no ve** `isBlocked` en `/auth/me`; si está bloqueado, las rutas protegidas fallan con `401`.

### 2.3 Qué puede hacer cada tipo en la web

| Acción | Visitante (sin login) | Usuario `user` | Usuario premium | Admin |
|--------|----------------------|----------------|-----------------|-------|
| Ver música, galería, eventos | ✓ | ✓ | ✓ | ✓ |
| Ver config del sitio | ✓ | ✓ | ✓ | ✓ |
| Enviar contacto | ✓ | ✓ | ✓ | ✓ |
| Registrarse / login | ✓ | — | — | ✓ (mismo endpoint) |
| Votar encuestas | ✗ | ✓ | ✓ | ✓ |
| Contenido premium completo | ✗ | ✗ | ✓ | ✓ (si tiene flag) |
| Panel administrativo | ✗ | ✗ | ✗ | ✓ (rol `admin`) |

> El admin usa los mismos endpoints de `/auth` que la web. El panel admin consume rutas bajo `/admin/*` (ver documento aparte).

---

## 3. Configuración frontend

```env
# Vacío = same-origin /api/v1 (proxy Vite en local, proxy Netlify en prod)
VITE_API_URL=
# Opcional: URL absoluta al backend (requiere CORS_ORIGINS correcto)
# VITE_API_URL=https://backend-acv2.onrender.com
```

Todas las peticiones van a `{VITE_API_URL}/api/v1/...`. Si `VITE_API_URL` está vacío, la base es `/api/v1` en el mismo origen.

### CORS

El backend permite orígenes definidos en `CORS_ORIGINS`. En desarrollo suele ser `http://localhost:5173`.

**Producción (Netlify):** el sitio usa proxy same-origin (`/api/*` → backend) para no depender de CORS. En Render, `CORS_ORIGINS` debe incluir `https://acv2-music.netlify.app` (y el origen del panel admin) si alguna app llama al API en forma directa.

### Cabeceras en rutas protegidas

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

## 4. Autenticación (`/auth`)

### 4.1 Registro

**`POST /api/v1/auth/register`**

| Campo | Reglas |
|-------|--------|
| `name` | 1–120 caracteres |
| `email` | email válido |
| `password` | 8–128 caracteres |

**Respuesta `201`:**

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "user",
    "hasPremiumAccess": false,
    "createdAt": "ISO8601"
  }
}
```

**Emails automáticos (SendGrid, en segundo plano):**
- Al usuario → mail de bienvenida
- Al admin → alerta de nuevo registro

**Errores:** `409 EMAIL_IN_USE`  
**Rate limit:** ~60 req / 15 min por IP

---

### 4.2 Login

**`POST /api/v1/auth/login`**

Body: `{ "email", "password" }`  
**Respuesta `200`:** mismo formato que registro.

**Errores:**
- `401 INVALID_CREDENTIALS`
- `403 USER_BLOCKED`

---

### 4.3 Refresh

**`POST /api/v1/auth/refresh`**

Body: `{ "refreshToken": "<jwt>" }`  
**Respuesta `200`:** nuevos tokens (el refresh anterior queda invalidado).

---

### 4.4 Logout

**`POST /api/v1/auth/logout`** — requiere Bearer  
**Respuesta:** `204`

---

### 4.5 Perfil

**`GET /api/v1/auth/me`** — requiere Bearer  
**Respuesta `200`:** `{ "user": { id, email, name, role, hasPremiumAccess, createdAt } }`

---

## 5. Contenido público (`/public`)

Sin autenticación salvo donde se indique. Varios endpoints envían `Cache-Control` público.

### 5.1 Configuración del sitio

**`GET /api/v1/public/site-config`**

Devuelve nav, redes sociales, highlights y `siteSettings` (solo elementos `visible: true`).

```json
{
  "navLinks": [{ "label": "string", "path": "string", "sortOrder": 0, "visible": true }],
  "socialLinks": [{ "platform": "string", "url": "string", "sortOrder": 0, "visible": true }],
  "highlights": [{ "title": "string", "description": "string", "sortOrder": 0, "visible": true }],
  "siteSettings": {
    "siteTitle": "ACV2.Music",
    "siteDescription": "string",
    "defaultOgImageUrl": "string opcional"
  }
}
```

`Cache-Control: public, max-age=60`

---

### 5.2 Música

**`GET /api/v1/public/music-tracks`**

Solo `published: true`. Orden: `sortOrder`, `createdAt`.

```json
{
  "items": [{
    "id": "string",
    "title": "string",
    "type": "single" | "live" | "ep",
    "status": "string",
    "mood": "string",
    "duration": "string",
    "coverDataUrl": "https://res.cloudinary.com/...",
    "previewDataUrl": "https://res.cloudinary.com/...",
    "spotifyUrl": "string opcional",
    "youtubeUrl": "string opcional",
    "appleMusicUrl": "string opcional",
    "published": true,
    "sortOrder": 0,
    "releasedAt": "ISO8601 opcional",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }]
}
```

> **Medios:** `coverDataUrl` y `previewDataUrl` son URLs HTTPS de **Cloudinary** (el nombre del campo se mantiene por compatibilidad). Usar directamente en `<img src>` y `<audio src>`.

`Cache-Control: public, max-age=60`

---

### 5.3 Galería

**`GET /api/v1/public/gallery`**

```json
{
  "items": [{
    "id": "string",
    "title": "string",
    "category": "show" | "backstage",
    "detailMediaType": "image" | "video",
    "caption": "string",
    "thumbnailDataUrl": "https://res.cloudinary.com/...",
    "detailImageDataUrl": "https://res.cloudinary.com/...",
    "detailVideoDataUrl": "https://res.cloudinary.com/... o URL externa",
    "externalVideoUrl": "string opcional",
    "published": true,
    "sortOrder": 0,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }]
}
```

- Vídeos pesados: usar `externalVideoUrl` (YouTube, Vimeo) desde el panel admin.
- Si `detailVideoDataUrl` empieza con `https://res.cloudinary.com` → `<video src>`.
- Si empieza con `http` externo → reproductor embebido o enlace.

---

### 5.4 Eventos de comunidad

**`GET /api/v1/public/community-events`**

```json
{
  "items": [{
    "id": "string",
    "title": "string",
    "city": "string",
    "startsAt": "ISO8601",
    "timezone": "America/Argentina/Buenos_Aires",
    "published": true,
    "sortOrder": 0,
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  }]
}
```

---

### 5.5 Encuesta (detalle)

**`GET /api/v1/public/polls/:id`**

Solo encuestas `published: true`.

```json
{
  "id": "string",
  "title": "string",
  "startsAt": "fecha o null",
  "endsAt": "fecha o null",
  "totalVotes": 0,
  "options": [{
    "id": "string",
    "label": "string",
    "musicTrackId": "string opcional",
    "voteCount": 0,
    "percentage": 33.3
  }]
}
```

`Cache-Control: public, max-age=15`

> **No hay listado público de encuestas.** La app debe conocer el `id` por enlace directo o configuración.

---

### 5.6 Votar

**`POST /api/v1/public/polls/:id/vote`** — **requiere login**

Body: `{ "optionId": "<ObjectId>" }`  
**Respuesta `201`:** `{ "ok": true }`

**Reglas:**
- Un voto por usuario y encuesta → `409 ALREADY_VOTED`
- Respeta `startsAt` / `endsAt` → `400 POLL_NOT_STARTED` / `POLL_ENDED`

---

### 5.7 Vista previa premium (teaser)

**`GET /api/v1/public/premium-preview`**

Sin URLs de medios. Solo metadatos para tarjetas "bloqueadas".

```json
{
  "items": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "ctaLabel": "string",
    "contentType": "video" | "link" | "download" | "info",
    "requiresAuth": true,
    "requiresPremium": true
  }]
}
```

---

### 5.8 Formulario de contacto

**`POST /api/v1/public/contact-messages`**

| Campo | Reglas |
|-------|--------|
| `name` | 1–120 caracteres |
| `email` | email válido |
| `subject` | 1–200 caracteres |
| `message` | 1–8000 caracteres |

**Respuesta `201`:** `{ "ok": true }`  
**Rate limit:** 30 req / hora por IP

**Emails automáticos (SendGrid):**
- Al admin → mensaje completo (consultas, contrataciones, etc.)
- Al usuario → confirmación de recepción

El mensaje queda guardado con `status: "new"` para el panel admin.

---

## 6. Zona autenticada (`/me`)

### 6.1 Contenido premium completo

**`GET /api/v1/me/premium-content`**

Requiere:
1. Bearer válido
2. `hasPremiumAccess: true` → si no, `403 PREMIUM_REQUIRED`

```json
{
  "items": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "ctaLabel": "string",
    "contentType": "video" | "link" | "download" | "info",
    "mediaUrl": "https://res.cloudinary.com/...",
    "externalUrl": "string opcional",
    "downloadUrl": "https://res.cloudinary.com/...",
    "requiresAuth": true,
    "requiresPremium": true
  }]
}
```

---

## 7. Mapa de pantallas → endpoints

| Pantalla | Endpoint(s) |
|----------|---------------|
| Layout / nav / SEO | `GET /public/site-config` |
| Discografía | `GET /public/music-tracks` |
| Galería | `GET /public/gallery` |
| Gira / eventos | `GET /public/community-events` |
| Encuesta | `GET /public/polls/:id` |
| Votar | `POST /public/polls/:id/vote` + Bearer |
| Teaser premium | `GET /public/premium-preview` |
| Área exclusiva | `GET /me/premium-content` + premium |
| Registro / login | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` |
| Contacto | `POST /public/contact-messages` |
| Health check | `GET /health` |

---

## 8. Errores

```json
{ "code": "CODIGO", "message": "Texto legible" }
```

| HTTP | Códigos frecuentes |
|------|-------------------|
| 400 | `VALIDATION_ERROR`, `INVALID_ID`, `POLL_NOT_STARTED`, `POLL_ENDED` |
| 401 | `UNAUTHORIZED`, `INVALID_TOKEN`, `INVALID_CREDENTIALS` |
| 403 | `USER_BLOCKED`, `PREMIUM_REQUIRED` |
| 404 | `POLL_NOT_FOUND`, `SITE_CONFIG_NOT_FOUND` |
| 409 | `EMAIL_IN_USE`, `ALREADY_VOTED` |
| 500 | `INTERNAL_ERROR` |

---

## 9. Medios (Cloudinary)

- Los archivos **no** se guardan en MongoDB como base64.
- El admin sube desde el panel → Cloudinary carpeta `musica-acv`.
- La web recibe URLs `https://res.cloudinary.com/...` en campos `*DataUrl` / `mediaUrl`.
- No existe ruta `/uploads` en el backend.

---

## 10. Emails (SendGrid)

| Evento | Destinatario |
|--------|--------------|
| Registro | Usuario → bienvenida |
| Registro | Admin → alerta nuevo usuario |
| Contacto | Admin → mensaje completo |
| Contacto | Usuario → confirmación |

Si SendGrid no está configurado, la API funciona igual (emails omitidos).

---

## 11. Checklist implementación frontend

1. Variable `VITE_API_URL` apuntando al backend.
2. Medios: usar `coverDataUrl`, `thumbnailDataUrl`, etc. como `src` directo (URLs HTTPS).
3. Tokens: guardar `accessToken` + `refreshToken`; renovar con `/auth/refresh`.
4. Premium: `premium-preview` (marketing) vs `me/premium-content` (contenido real).
5. Encuestas: requiere login para votar; refrescar resultados tras voto.
6. Contacto: manejar `400` validación y rate limit (mensaje amigable).
7. Tras registro exitoso, el usuario ya tiene sesión (tokens en respuesta).

---

## 12. Variables de entorno del backend (referencia)

| Variable | Uso |
|----------|-----|
| `PUBLIC_API_URL` | URL base del API |
| `CORS_ORIGINS` | Orígenes permitidos del frontend |
| `JWT_*` | Autenticación |
| `MONGODB_URI` | Base de datos |
| `CLOUDINARY_*` | Almacenamiento de medios |
| `SENDGRID_*` | Emails transaccionales |
| `PUBLIC_WEB_URL` | Link en mail de bienvenida |
| `ADMIN_NOTIFICATION_EMAIL` | Bandeja de alertas del admin |

---

*Documento alineado con el código del backend. Última revisión: integración Cloudinary + SendGrid verificada.*
