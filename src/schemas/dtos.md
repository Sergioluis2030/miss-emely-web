# DTOs — Miss Emely API (propuesta)

Este documento define el contrato de datos entre el frontend (React) y el
futuro backend. El frontend actual ya usa exactamente esta forma de datos
en `/src/data`, `/src/context/AuthContext.jsx` y
`/src/context/ActivitiesContext.jsx`, para que enchufar un backend real
sea solo cambiar `fetch` por las llamadas reales.

Tipado en formato TypeScript (documentación, el proyecto corre en JS puro).

---

## Auth

```ts
// POST /api/auth/login
interface LoginRequestDTO {
  username: string
  password: string
}

interface LoginResponseDTO {
  token: string          // JWT u otro token de sesión
  user: UserDTO
}

// GET /api/auth/me  (validar sesión activa)
interface MeResponseDTO {
  user: UserDTO
}
```

## User

```ts
type UserRole = 'teacher' | 'student' | 'admin'

interface UserDTO {
  id: string
  username: string
  fullName: string
  role: UserRole
  grade?: string | null       // ej. "1° Grado A", solo alumnos
  avatarEmoji: string
  avatarColor: string         // hex, ej. "#4A90E2"
}

// Nunca se expone password ni password_hash en las respuestas.
```

## Activity (actividad de la agenda)

```ts
// GET /api/activities?from=2026-07-01&to=2026-07-31&classroomId=...
interface ActivityDTO {
  id: string
  date: string                 // ISO date "YYYY-MM-DD" (día de la agenda)
  title: string
  description: string
  imageUrl: string | null      // URL pública en storage, null si no tiene foto
  authorId: string
  authorName: string
  createdAt: string            // ISO datetime
  comments: CommentDTO[]
}

// POST /api/activities   (solo role = 'teacher')
interface CreateActivityDTO {
  date: string                 // "YYYY-MM-DD"
  title: string                // máx 120 caracteres
  description: string          // máx 600 caracteres en el form actual
  image?: File | Blob | null   // multipart/form-data; el backend genera imageUrl
  classroomId?: string | null
}

// PATCH /api/activities/:id   (solo autor)
interface UpdateActivityDTO {
  title?: string
  description?: string
  date?: string
  image?: File | Blob | null
}

// DELETE /api/activities/:id  (solo autor / admin)
```

## Comment (comentario bajo una actividad)

```ts
interface CommentDTO {
  id: string
  authorId: string
  authorName: string
  authorRole: UserRole
  text: string
  createdAt: string            // ISO datetime
}

// POST /api/activities/:activityId/comments
interface CreateCommentDTO {
  text: string                 // máx 500 caracteres
}
```

## Errores (formato estándar sugerido)

```ts
interface ApiErrorDTO {
  error: {
    code: string        // ej. "INVALID_CREDENTIALS", "VALIDATION_ERROR"
    message: string      // mensaje amigable para mostrar al usuario
    fields?: Record<string, string> // errores de validación por campo
  }
}
```

---

## Notas de implementación futura

- Autenticación: reemplazar `AuthContext.login()` (que hoy busca en
  `MOCK_USERS`) por un `fetch('/api/auth/login', ...)` que guarde el
  `token` (en memoria + refresh, no localStorage si se busca mayor
  seguridad) y `user`.
- Actividades: reemplazar `ActivitiesContext` (que hoy persiste en
  `localStorage`) por llamadas `fetch` a `/api/activities` y
  `/api/activities/:id/comments`, manteniendo la misma forma de
  `ActivityDTO` y `CommentDTO` para no tocar los componentes de UI.
- Imágenes: hoy se guardan como `dataURL` (base64) en el navegador. En
  backend real, subir el archivo a un storage (S3, Cloud Storage, etc.)
  y guardar solo la URL pública en `imageUrl`.
- Roles: el backend debe validar en cada endpoint que solo `teacher`
  pueda crear/editar/eliminar actividades; `student` solo puede leer y
  comentar.
