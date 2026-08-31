import { useState } from 'react'
import { Eye, EyeOff, MessageCircle, Pencil, Trash2, UserPlus, X } from 'lucide-react'
import { useUsers } from '../context/UsersContext'

const KINSHIP_LABELS = { alumno: 'Alumno/a', padre: 'Padre', madre: 'Madre' }
const KINSHIP_ALIAS = { padre: 'papito de', madre: 'mamita de' }

function formatBirthday(iso) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  const MESES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  return `${d} de ${MESES[Number(m) - 1]} de ${y}`
}

export default function Usuarios() {
  const { users, createUser, toggleCommentBlock, updateUser, removeUser } = useUsers()

  const [view, setView] = useState('list') // 'list' | 'form' | 'detail'
  const [selectedUser, setSelectedUser] = useState(null)
  const [createdPass, setCreatedPass] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    kinship: 'alumno',
    childId: '',
    password: '',
    birthday: '',
    favoriteColor: '',
    extra: '',
  })
  const [formError, setFormError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const classmates = users.filter((u) => u.role !== 'teacher')
  const students = users.filter((u) => u.kinship === 'alumno')

  function childName(u) {
    if (u.kinship === 'alumno' || !u.childId) return null
    const child = users.find((c) => c.id === u.childId)
    return child ? child.fullName : null
  }

  function aliasFor(u) {
    if (u.kinship === 'alumno') return null
    const name = childName(u)
    if (!name) return null
    return `${KINSHIP_ALIAS[u.kinship] || 'padre de'} ${name}`
  }

  function resetForm() {
    setForm({ fullName: '', kinship: 'alumno', childId: '', password: '', birthday: '', favoriteColor: '', extra: '' })
    setFormError('')
    setShowPass(false)
  }

  function openForm() {
    resetForm()
    setCreatedPass('')
    setView('form')
  }

  async function handleCreate(e) {
    e.preventDefault()
    const fullName = form.fullName.trim()
    if (!fullName) {
      setFormError('El nombre y apellidos son obligatorios.')
      return
    }
    if (form.kinship !== 'alumno' && !form.childId) {
      setFormError('Selecciona a su hijo/a para poder crearlo.')
      return
    }
    try {
      const created = await createUser({
        fullName,
        kinship: form.kinship,
        childId: form.childId,
        password: form.password,
        birthday: form.birthday || null,
        favoriteColor: form.favoriteColor || null,
        extra: form.extra || null,
      })
      setCreatedPass(created.password)
      setSelectedUser(created)
      setView('detail')
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleToggleBlock(u) {
    await toggleCommentBlock(u.id)
  }

  async function handleRemove(u) {
    if (window.confirm(`¿Eliminar a "${u.fullName}"? No podrá iniciar sesión.`)) {
      await removeUser(u.id)
      if (selectedUser?.id === u.id) {
        setSelectedUser(null)
        setView('list')
      }
    }
  }

  function openDetail(u) {
    setSelectedUser(u)
    setCreatedPass('')
    setView('detail')
  }

  async function handleSaveDetail(e) {
    e.preventDefault()
    if (!selectedUser) return
    const fullName = selectedUser.fullName.trim()
    if (!fullName) {
      setFormError('El nombre y apellidos son obligatorios.')
      return
    }
    if (selectedUser.kinship !== 'alumno' && !selectedUser.childId) {
      setFormError('Selecciona a su hijo/a para guardar.')
      return
    }
    try {
      await updateUser(selectedUser.id, {
        fullName,
        kinship: selectedUser.kinship,
        childId: selectedUser.kinship !== 'alumno' ? selectedUser.childId || null : null,
        birthday: selectedUser.birthday || null,
        favoriteColor: selectedUser.favoriteColor || null,
        extra: selectedUser.extra || null,
      })
      setView('list')
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="usuarios-page">
      <div className="usuarios-title-row">
        <div className="usuarios-title">
          <UserPlus size={26} color="var(--blue)" />
          <h1>Gestión de usuarios</h1>
        </div>
        <p className="ususarios-subtitle">
          Agrega alumnos y padres, y controla quién puede comentar.
        </p>
        {view !== 'form' && (
          <button type="button" className="usuarios-add-btn" onClick={openForm}>
            <UserPlus size={18} />
            Agregar usuario
          </button>
        )}
      </div>

      {view === 'form' && (
        <form className="usuarios-form" onSubmit={handleCreate}>
          <div className="new-activity-form-head">
            <h3>Nuevo usuario</h3>
            <button type="button" className="new-activity-close" onClick={() => setView('list')} aria-label="Cerrar">
              <X size={20} />
            </button>
          </div>

          <label className="new-activity-field">
            <span>Nombre y apellidos *</span>
            <input
              type="text"
              placeholder="Ej. Juana Pérez García"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </label>

          <label className="new-activity-field">
            <span>Parentesco</span>
            <select value={form.kinship} onChange={(e) => setForm({ ...form, kinship: e.target.value })}>
              <option value="alumno">Alumno/a</option>
              <option value="padre">Padre</option>
              <option value="madre">Madre</option>
            </select>
          </label>

          {form.kinship !== 'alumno' && (
            <label className="new-activity-field">
              <span>Es hijo/a de — elige a su alumno *</span>
              <select
                value={form.childId}
                onChange={(e) => setForm({ ...form, childId: e.target.value })}
                required
              >
                <option value="">Selecciona a su hijo/a…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="new-activity-field">
            <span>Contraseña (opcional — si la dejas vacía se genera una de 10 dígitos)</span>
            <input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              maxLength={10}
              placeholder="Déjalo vacío para auto-generar"
            />
          </label>

          <label className="new-activity-field">
            <span>Cumpleaños (opcional)</span>
            <input
              type="date"
              value={form.birthday}
              onChange={(e) => setForm({ ...form, birthday: e.target.value })}
            />
          </label>

          <label className="new-activity-field">
            <span>Color favorito (opcional)</span>
            <input
              type="color"
              value={form.favoriteColor || '#4A90E2'}
              onChange={(e) => setForm({ ...form, favoriteColor: e.target.value })}
            />
          </label>

          <label className="new-activity-field">
            <span>Otros datos (opcional)</span>
            <textarea
              rows={2}
              placeholder="Notas, alergias, comidas favoritas…"
              value={form.extra}
              onChange={(e) => setForm({ ...form, extra: e.target.value })}
            />
          </label>

          {formError && <p className="field-error">{formError}</p>}

          <button type="submit" className="new-activity-submit">
            Crear usuario
          </button>
        </form>
      )}

      {view === 'detail' && selectedUser && (
        <div className="usuario-detail">
          <div className="new-activity-form-head">
            <h3>Ficha del usuario</h3>
          </div>

          {createdPass && (
            <div className="usuario-created-pass">
              <p>
                <span>Usuario de acceso:</span> <strong>{selectedUser.username}</strong>
              </p>
              <div className="usuario-pass-row">
                <span>Contraseña generada:</span>
                <strong className="usuario-pass">
                  {showPass ? selectedUser.password : '•'.repeat(10)}
                </strong>
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="usuario-copy-hint">
                Anota estas credenciales y entrégalas al usuario.
              </p>
              <button
                type="button"
                className="usuario-copy-btn"
                onClick={() => {
                  navigator.clipboard?.writeText(`${selectedUser.username}\n${selectedUser.password}`)
                }}
              >
                Copiar credenciales
              </button>
            </div>
          )}

          <form className="usuarios-form" onSubmit={handleSaveDetail}>
            <label className="new-activity-field">
              <span>Nombre y apellidos *</span>
              <input
                type="text"
                value={selectedUser.fullName}
                onChange={(e) => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                required
              />
            </label>

            <label className="new-activity-field">
              <span>Parentesco</span>
              <select
                value={selectedUser.kinship}
                onChange={(e) => setSelectedUser({ ...selectedUser, kinship: e.target.value })}
              >
                <option value="alumno">Alumno/a</option>
                <option value="padre">Padre</option>
                <option value="madre">Madre</option>
              </select>
            </label>

            {selectedUser.kinship !== 'alumno' && (
              <label className="new-activity-field">
                <span>Es hijo/a de — elige a su alumno *</span>
                <select
                  value={selectedUser.childId || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, childId: e.target.value })}
                  required
                >
                  <option value="">Selecciona a su hijo/a…</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="new-activity-field">
              <span>Cumpleaños</span>
              <input
                type="date"
                value={selectedUser.birthday || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, birthday: e.target.value })}
              />
            </label>

            <label className="new-activity-field">
              <span>Color favorito</span>
              <input
                type="color"
                value={selectedUser.favoriteColor || '#4A90E2'}
                onChange={(e) => setSelectedUser({ ...selectedUser, favoriteColor: e.target.value })}
              />
            </label>

            <label className="new-activity-field">
              <span>Otros datos</span>
              <textarea
                rows={2}
                value={selectedUser.extra || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, extra: e.target.value })}
              />
            </label>

            {formError && <p className="field-error">{formError}</p>}

            <div className="edit-activity-form-actions">
              <button type="button" className="edit-activity-cancel" onClick={() => setView('list')}>
                Cancelar
              </button>
              <button type="submit" className="new-activity-submit">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'list' && (
        <>
          <div className="usuarios-list">
            {classmates.length === 0 ? (
              <div className="activities-empty">
                <span role="img" aria-hidden="true">👥</span>
                <h3>Todavía no hay usuarios</h3>
                <p>Agrega alumnos y padres para que puedan acceder a la aplicación.</p>
              </div>
            ) : (
              classmates.map((u) => (
                <div className="usuario-row" key={u.id}>
                  <div
                    className="sidebar-user-avatar"
                    style={{ background: u.avatarColor }}
                  >
                    {u.avatarEmoji}
                  </div>
                  <div className="usuario-row-info">
                    <p className="usuario-row-name">
                      {u.fullName}
                      {aliasFor(u) && <span className="usuario-alias"> {aliasFor(u)}</span>}
                    </p>
                    <p className="usuario-row-meta">
                      @{u.username} · {KINSHIP_LABELS[u.kinship] || u.kinship}
                    </p>
                    {u.birthday && (
                      <p className="usuario-row-meta">🎂 {formatBirthday(u.birthday)}</p>
                    )}
                  </div>

                  <span
                    className={`usuario-comment-state ${u.canComment ? 'is-allowed' : 'is-blocked'}`}
                    title={u.canComment ? 'Puede comentar' : 'Bloqueado para comentar'}
                  >
                    <MessageCircle size={15} />
                    {u.canComment ? 'Puede comentar' : 'Solo lectura'}
                  </span>

                  <button
                    type="button"
                    className={`usuario-block-btn ${u.canComment ? '' : 'is-blocked'}`}
                    onClick={() => handleToggleBlock(u)}
                  >
                    {u.canComment ? 'Bloquear' : 'Desbloquear'} comentar
                  </button>

                  <button
                    type="button"
                    className="usuario-edit-btn"
                    onClick={() => openDetail(u)}
                    aria-label="Ver ficha"
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    className="usuario-del-btn"
                    onClick={() => handleRemove(u)}
                    aria-label="Eliminar"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))
            )}
          </div>

          <p className="usuario-footer-note">
            Los usuarios bloqueados solo podrán ver las actividades, sin comentar.
          </p>
        </>
      )}
    </div>
  )
}
