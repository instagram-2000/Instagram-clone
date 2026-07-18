import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

function Footer({ config }) {
  const { title, footer } = config
  const location = useLocation()
  const { t } = useLanguage()

  return (
    <footer
      id="contact"
      className="px-6 py-10 text-slate-200 md:px-12"
      style={{ backgroundColor: 'var(--tenant-secondary)' }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">{title}</p>
          {footer?.address && <p className="mt-1 text-sm text-slate-300">{footer.address}</p>}
        </div>
        <div className="text-sm text-slate-300">
          {footer?.phone && <p>{footer.phone}</p>}
          {footer?.email && <p>{footer.email}</p>}
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {title}. {t('hospital.allRightsReserved')} &middot;{' '}
        <Link to={{ pathname: '/appointment-status', search: location.search }} className="hover:text-slate-200">
          {t('hospital.checkAppointmentStatus')}
        </Link>
      </p>
    </footer>
  )
}

export default Footer
