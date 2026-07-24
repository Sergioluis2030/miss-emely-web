// Usuarios de prueba (hardcodeados) mientras no exista backend.
// En el futuro esto vendrá de la tabla `users` (ver /src/schemas).

export const MOCK_USERS = [
  {
    id: 'u-teacher-1',
    username: 'missemely',
    password: 'profe123',
    role: 'teacher',
    fullName: 'Miss Emely',
    avatarEmoji: '👩‍🏫',
    avatarColor: '#4A90E2',
  },
  {
    id: 'u-student-1',
    username: 'sofia',
    password: 'alumno123',
    role: 'student',
    fullName: 'Sofía Cordova',
    grade: '1° Grado A',
    avatarEmoji: '👧',
    avatarColor: '#FF6B9D',
  },
  {
    id: 'u-student-2',
    username: 'ivan',
    password: 'alumno123',
    role: 'student',
    fullName: 'Ivan sonic',
    grade: '1° Grado A',
    avatarEmoji: '👦',
    avatarColor: '#F1C40F',
  },
]

export function findUser(username, password) {
  return MOCK_USERS.find(
    (u) =>
      u.username.toLowerCase() === String(username).trim().toLowerCase() &&
      u.password === password
  )
}
