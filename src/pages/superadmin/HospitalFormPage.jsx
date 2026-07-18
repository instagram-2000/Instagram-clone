import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createHospital, updateHospital } from '../../firebase/hospitals'
import { useAuth } from '../../contexts/AuthContext'

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none'
const labelClass = 'block text-sm font-medium text-slate-700'

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

function ColorField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 shrink-0 cursor-pointer rounded border border-slate-300"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
    </Field>
  )
}

// Shared create/edit form for hospitals.slug is immutable once created, since
// it's also the Firestore doc id and the tenant subdomain.
function HospitalFormPage({ mode = 'create', hospital, onSaved }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [slug, setSlug] = useState(hospital?.slug || '')
  const [title, setTitle] = useState(hospital?.title || '')
  const [primaryColor, setPrimaryColor] = useState(hospital?.branding?.primaryColor || '#0ea5e9')
  const [secondColor, setSecondColor] = useState(hospital?.branding?.secondColor || '#0f172a')
  const [bgImage, setBgImage] = useState(hospital?.branding?.logos?.bgImage || '')
  const [smallLogo, setSmallLogo] = useState(hospital?.branding?.logos?.smallLogo || '')
  const [address, setAddress] = useState(hospital?.footer?.address || '')
  const [phone, setPhone] = useState(hospital?.footer?.phone || '')
  const [email, setEmail] = useState(hospital?.footer?.email || '')

  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setSubmitting(true)

    const data = {
      title,
      branding: {
        primaryColor,
        secondColor,
        logos: { bgImage, smallLogo },
      },
      footer: { address, phone, email },
    }

    try {
      if (mode === 'create') {
        const newSlug = await createHospital(slug, data, user.uid)
        navigate(`/superadmin/hospitals/${newSlug}`)
      } else {
        await updateHospital(hospital.slug, data)
        setSaved(true)
        onSaved?.()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const form = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Subdomain slug">
          <input
            type="text"
            required
            disabled={mode === 'edit'}
            placeholder="e.g. sunrise-hospital"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={`${inputClass} ${mode === 'edit' ? 'cursor-not-allowed bg-slate-50 text-slate-500' : ''}`}
          />
          {mode === 'create' && (
            <p className="mt-1 text-xs text-slate-400">
              Lowercase letters, numbers and hyphens only. Cannot be changed later.
            </p>
          )}
        </Field>

        <Field label="Hospital name">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">Theme</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ColorField label="Primary color" value={primaryColor} onChange={setPrimaryColor} />
          <ColorField label="Secondary color" value={secondColor} onChange={setSecondColor} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Background image URL">
            <input
              type="url"
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Logo URL">
            <input
              type="url"
              value={smallLogo}
              onChange={(e) => setSmallLogo(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">Contact / footer</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Address">
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">Saved.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="cursor-pointer rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'Saving…' : mode === 'create' ? 'Create hospital' : 'Save changes'}
      </button>
    </form>
  )

  if (mode !== 'create') return form

  return (
    <div className="max-w-2xl">
      <Link to="/superadmin/hospitals" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to hospitals
      </Link>
      <h1 className="mt-2 text-xl font-semibold text-slate-900">New hospital</h1>
      <div className="mt-6">{form}</div>
    </div>
  )
}

export default HospitalFormPage
