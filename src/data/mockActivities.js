// Datos de ejemplo (seed) para la agenda de actividades.
// Estructura alineada al DTO ActivityDTO (ver /src/schemas/dtos.md)

export const SEED_ACTIVITIES = [
  {
    id: 'act-1',
    date: '2026-07-21',
    title: 'Sumas con dibujitos 🍎',
    description:
      'Hoy practicamos sumas hasta el 10 usando frutitas de colores. Recuerden traer su cuaderno de matemáticas y 10 semillas o botones para contar en casa.',
    imageUrl: null,
    authorId: 'u-teacher-1',
    authorName: 'Miss Emely',
    createdAt: '2026-07-21T13:05:00.000Z',
    comments: [
      {
        id: 'c-1',
        authorId: 'u-student-1',
        authorName: 'Sofía Ramírez',
        authorRole: 'student',
        text: '¡Me encantaron las manzanitas! Ya practiqué en casa 🍎',
        createdAt: '2026-07-21T18:20:00.000Z',
      },
    ],
  },
  {
    id: 'act-2',
    date: '2026-07-22',
    title: 'Cuento: El planeta Tierra 🌎',
    description:
      'Leímos juntos sobre nuestro planeta y los cuidados que debemos tener con la naturaleza. Tarea: dibujar algo que podemos hacer en casa para cuidar el planeta.',
    imageUrl: null,
    authorId: 'u-teacher-1',
    authorName: 'Miss Emely',
    createdAt: '2026-07-22T14:10:00.000Z',
    comments: [],
  },
]
