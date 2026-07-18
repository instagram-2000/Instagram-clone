import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeHospital } from '../firebase/hospitals'
import { subscribeActiveDoctors } from '../firebase/users'
import { createPatient } from '../firebase/patients'
import { createAppointment } from '../firebase/appointments'
import { weekdayKeyForDate } from '../utils/doctorSchedule'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import Spinner from '../components/common/Spinner'

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-slate-500 focus:outline-none'
const labelClass = 'block text-sm font-medium text-slate-700'
const todayString = () => new Date().toISOString().slice(0, 10)

function PublicAppointmentPage({ slug }) {
  const { t } = useLanguage()
  const [hospital, setHospital] = useState(undefined)
  const [doctors, setDoctors] = useState([])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState(todayString())
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => subscribeHospital(slug, setHospital), [slug])
  useEffect(() => subscribeActiveDoctors(slug, setDoctors), [slug])

  const selectedDoctor = doctors.find((d) => d.uid === doctorId)
  const weekday = weekdayKeyForDate(date)
  const daySchedule = selectedDoctor?.schedule?.[weekday]

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const patientId = await createPatient(slug, { name, phone, email }, 'public')
      const token = await createAppointment(
        {
          hospitalId: slug,
          patientId,
          patientName: name.trim(),
          patientPhone: phone.trim(),
          doctorId: doctorId || null,
          doctorName: selectedDoctor?.displayName || '',
          date,
          time,
          notes: notes.trim(),
          status: 'pending',
          bookedBy: 'patient',
        },
        'public'
      )
      setResult({ token, date, time, doctorName: selectedDoctor?.displayName })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (hospital === undefined) return <Spinner />
  if (!hospital) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center text-slate-500">
        {t('booking.hospitalNotFound')}
      </div>
    )
  }

  if (result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">{t('booking.requestedTitle')}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {result.doctorName
              ? t('booking.requestedBodyWithDoctor', { date: result.date, doctor: result.doctorName })
              : t('booking.requestedBodyNoDoctor', { date: result.date })}
          </p>
          <p className="mt-6 rounded-lg bg-slate-50 py-4 font-mono text-2xl font-bold tracking-widest text-slate-900">
            {result.token}
          </p>
          <p className="mt-4 text-xs text-slate-400">{t('booking.saveTokenHint')}</p>
          <Link
            to={{ pathname: '/appointment-status', search: `?tenant=${slug}` }}
            className="mt-6 inline-block text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {t('booking.checkStatusLink')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{t('booking.title')}</h1>
            <p className="mt-1 text-sm text-slate-500">{hospital.title}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelClass}>{t('booking.yourName')}</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>{t('booking.phoneNumber')}</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t('booking.emailOptional')}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>{t('booking.doctor')}</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">{t('booking.noPreference')}</option>
              {doctors.map((d) => (
                <option key={d.uid} value={d.uid}>
                  {d.displayName} {d.specialization ? `— ${d.specialization}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>{t('booking.date')}</label>
              <input
                type="date"
                required
                min={todayString()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t('booking.time')}</label>
              <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
            </div>
          </div>

          {selectedDoctor && weekday && (
            <p className={`text-xs ${daySchedule?.available ? 'text-slate-400' : 'text-amber-600'}`}>
              {daySchedule?.available
                ? t('booking.scheduleAvailable', {
                    doctor: selectedDoctor.displayName,
                    day: t(`day.${weekday}`),
                    start: daySchedule.start,
                    end: daySchedule.end,
                  })
                : t('booking.scheduleUnavailable', { doctor: selectedDoctor.displayName, day: t(`day.${weekday}`) })}
            </p>
          )}

          <div>
            <label className={labelClass}>{t('booking.reasonOptional')}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full cursor-pointer rounded-lg bg-[var(--tenant-primary,#0ea5e9)] py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? t('booking.submitting') : t('booking.submit')}
          </button>

          <p className="text-center text-xs text-slate-400">{t('booking.confirmAtReception')}</p>
        </form>
      </div>
    </div>
  )
}

export default PublicAppointmentPage
