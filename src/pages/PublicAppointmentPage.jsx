import { useSearchParams, Link } from 'react-router-dom'
import LanguageSwitcher from '../components/common/LanguageSwitcher'
import ThemeToggle from '../components/common/ThemeToggle'
import BookAppointmentForm from '../components/hospital/BookAppointmentForm'
import NavIcon from '../components/common/NavIcon'
import { useSeoMeta } from '../hooks/useSeoMeta'

// Standalone route for direct/shared links (e.g. an SMS to a patient) —
// same form as the popup triggered from the landing page, just presented as
// its own full-page card instead of a dialog over the page.
function PublicAppointmentPage({ slug }) {
  const [searchParams] = useSearchParams()
  const doctorId = searchParams.get('doctor')
  const backTo = doctorId
    ? { pathname: `/doctor/${doctorId}`, search: `?tenant=${slug}` }
    : { pathname: '/', search: `?tenant=${slug}` }

  // noindex: thin, form-only content that duplicates the booking section
  // already on the hospital's homepage — indexing both would just compete
  // with the homepage for the same search terms.
  useSeoMeta({ title: 'Book an Appointment', noindex: true })

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-6 py-10 text-heading">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-line bg-surface p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <Link
            to={backTo}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-heading"
          >
            <NavIcon name="arrowLeft" className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
        <BookAppointmentForm slug={slug} />
      </div>
    </div>
  )
}

export default PublicAppointmentPage
