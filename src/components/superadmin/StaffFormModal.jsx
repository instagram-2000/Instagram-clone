import { useState } from 'react'
import { createStaffAuthAccount } from '../../firebase/secondaryAuth'
import { createUserDoc } from '../../firebase/users'
import { useAuth } from '../../contexts/AuthContext'
import { CREATABLE_STAFF_ROLES, ROLE_LABELS } from '../../utils/roles'
import { generatePassword } from '../../utils/generatePassword'

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none'

function StaffFormModal({ hospitalId, onCreated, onCancel }) {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState(generatePassword())
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState(CREATABLE_STAFF_ROLES[0])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const trimmedEmail = email.trim()
      const uid = await createStaffAuthAccount(trimmedEmail, password)
      await createUserDoc(uid, {
        email: trimmedEmail,
        displayName: displayName.trim() || trimmedEmail,
        role,
        hospitalId,
        createdBy: user.uid,
      })
      onCreated({ email: trimmedEmail, password })
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'That email is already in use.' : err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="text-base font-semibold text-slate-900">Add staff member</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Display name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              {CREATABLE_STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Initial password</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} mt-0 font-mono`}
              />
              <button
                type="button"
                onClick={() => setPassword(generatePassword())}
                className="shrink-0 cursor-pointer rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Generate
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StaffFormModal
