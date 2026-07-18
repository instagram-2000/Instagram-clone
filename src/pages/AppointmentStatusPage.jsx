import { useState } from 'react'
import { getAppointmentByToken, getAppointmentsByPhone } from '../firebase/appointments'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from '../components/common/LanguageSwitcher'

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-slate-500 focus:outline-none'
const labelClass = 'block text-sm font-medium text-slate-700'

function AppointmentStatusPage({ slug }) {
  const { t } = useLanguage()
  const [phone, setPhone] = useState('')
  const [token, setToken] = useState('')
  const [results, setResults] = useState(undefined)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const STATUS_COPY = {
    pending: { label: t('status.pendingLabel'), hint: t('status.pendingHint') },
    scheduled: { label: t('status.scheduledLabel'), hint: t('status.scheduledHint') },
    completed: { label: t('status.completedLabel'), hint: t('status.completedHint') },
    cancelled: { label: t('status.cancelledLabel'), hint: t('status.cancelledHint') },
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResults(undefined)

    const trimmedToken = token.trim()
    const trimmedPhone = phone.trim()
    if (!trimmedToken && !trimmedPhone) {
      setError(t('status.missingBoth'))
      return
    }

    setSubmitting(true)
    try {
      let found = []
      if (trimmedToken) {
        const appointment = await getAppointmentByToken(trimmedToken, trimmedPhone)
        if (appointment && appointment.hospitalId === slug) found = [appointment]
      } else {
        found = await getAppointmentsByPhone(slug, trimmedPhone)
      }

      if (found.length === 0) {
        setError(t('status.notFound'))
      } else {
        setResults(found)
      }
    } catch {
      setError(t('status.error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{t('status.title')}</h1>
            <p className="mt-1 text-sm text-slate-500">{t('status.subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelClass}>{t('status.phoneNumber')}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('status.token')}</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. K7M3Q2X"
              className={`${inputClass} font-mono uppercase`}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-lg bg-slate-900 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? t('status.submitting') : t('status.submit')}
          </button>
        </form>

        {results && (
          <div className="mt-6 space-y-3">
            {results.map((result) => {
              const statusInfo = STATUS_COPY[result.status] || { label: result.status, hint: '' }
              return (
                <div key={result.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
                  <p className="text-base font-semibold text-slate-900">{statusInfo.label}</p>
                  <p className="mt-1 text-slate-500">{statusInfo.hint}</p>
                  <dl className="mt-3 space-y-1">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">{t('status.doctor')}</dt>
                      <dd className="text-slate-900">{result.doctorName || '—'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">{t('status.date')}</dt>
                      <dd className="text-slate-900">{result.date}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">{t('status.time')}</dt>
                      <dd className="text-slate-900">{result.time}</dd>
                    </div>
                  </dl>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentStatusPage
