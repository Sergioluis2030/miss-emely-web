// Usuarios de prueba (hardcodeados) que sirven como semilla inicial.
// En el futuro esto vendrá de la tabla `users` (ver /src/schemas).
// La maestra puede agregar más usuarios desde la sección "Usuarios" del panel.

export const MOCK_USERS = [
]

// Genera un nombre de usuario a partir de la primera letra del nombre y el apellido.
// Ej: "Juan Pérez" -> "jperez". Acepta un set de usernames ya usados para evitar duplicados.
export function generateUsername(fullName, usedUsernames = []) {
  const cleaned = String(fullName).trim().toLowerCase().replace(/[^a-záéíóúñü\s]/g, '')
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  const first = parts[0][0]
  const last = parts[parts.length - 1]
  let base = `${first}${last}`

  // Si el nombre y el apellido son la misma palabra (una sola), usamos la palabra completa
  if (parts.length === 1) base = last

  let candidate = base
  let n = 2
  const used = new Set(usedUsernames)
  while (used.has(candidate)) {
    candidate = `${base}${n}`
    n += 1
  }
  return candidate
}

// Genera una contraseña aleatoria de 10 dígitos numéricos.
export function generatePassword() {
  const digits = '0123456789'
  let out = ''
  for (let i = 0; i < 10; i++) {
    out += digits[Math.floor(Math.random() * digits.length)]
  }
  return out
}

export function findUser(username, password) {
  return MOCK_USERS.find(
    (u) =>
      u.username.toLowerCase() === String(username).trim().toLowerCase() &&
      u.password === password
  )
}
