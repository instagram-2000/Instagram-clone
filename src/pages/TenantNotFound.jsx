import { useLanguage } from '../contexts/LanguageContext'

function TenantNotFound({ slug }) {
  const { t } = useLanguage()

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">{t('hospital.notFoundTitle')}</h1>
      <p className="max-w-md text-slate-500">{t('hospital.notFoundBody', { slug })}</p>
    </div>
  )
}

export default TenantNotFound
