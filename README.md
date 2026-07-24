# Miss Emely 🌟

Web didáctica para que **Miss Emely** publique la actividad de cada día
(agenda/calendario) y sus alumnos de primer grado la comenten. Hecha con
**React + Vite**, 100% responsive (celular, tablet, laptop y PC).

## Cómo correrla

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

Para generar la build de producción:

```bash
npm run build
npm run preview
```

## Cuentas de prueba (hardcodeadas)

No hay backend todavía, así que el login valida contra usuarios de ejemplo
en `src/data/mockUsers.js`:

En la pantalla de login también hay botones de "Cuentas de prueba" que
llenan los campos automáticamente.

## Qué incluye

- **Login** con validación de credenciales de prueba y opción de
  mostrar/ocultar contraseña.
- **Dashboard** con menú lateral (por ahora solo la opción
  **Actividades**, como se pidió) y barra superior con saludo
  personalizado.
- **Actividades (agenda/calendario)**:
  - La **maestra** puede redactar una actividad con fecha, título,
    descripción y una foto opcional (se sube desde el dispositivo).
  - Los **alumnos** pueden entrar, leer la actividad y dejar comentarios
    debajo.
  - Cada actividad muestra una "pestaña" de color según el día de la
    semana, usando la misma paleta didáctica del proyecto.
- Los datos (actividades y comentarios) se guardan en `localStorage`
  para que la demo persista al recargar, mientras no exista backend.

## Preparado para un backend futuro

Aunque hoy todo es local/hardcodeado, el proyecto ya incluye el diseño
de datos para cuando se conecte a una API real:

- `src/schemas/database-schema.sql` — esquema de base de datos
  (PostgreSQL) con las tablas `users`, `classrooms`, `activities`,
  `activity_comments`, `sessions`.
- `src/schemas/dtos.md` — DTOs (contratos de request/response) para los
  endpoints de auth, actividades y comentarios, con notas de qué
  reemplazar en `AuthContext.jsx` y `ActivitiesContext.jsx` cuando se
  integre el backend.

## Paleta de colores

| Color   | Hex       | Uso                                   |
|---------|-----------|----------------------------------------|
| Azul    | `#4A90E2` | Marca, botones principales             |
| Verde   | `#2ECC71` | Éxito, publicar                        |
| Amarillo| `#F1C40F` | Foco, elementos destacados             |
| Naranja | `#FF8C42` | Acentos                                |
| Morado  | `#9B59B6` | Secciones especiales                   |
| Rosado  | `#FF6B9D` | Detalles amigables                     |

## Estructura

```
src/
  components/     Avatar, Sidebar, Topbar, ActivityCard, Comment, NewActivityForm, LoginIllustration
  context/        AuthContext (sesión), ActivitiesContext (actividades + comentarios)
  data/           mockUsers.js, mockActivities.js (datos de prueba)
  pages/          Login.jsx, Dashboard.jsx, Activities.jsx (+ sus .css)
  schemas/        database-schema.sql, dtos.md (contrato para backend futuro)
  utils/          date.js (formato de fechas en español)
```
# miss-emely-web
