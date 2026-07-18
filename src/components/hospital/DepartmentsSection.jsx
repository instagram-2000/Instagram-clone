import { useLanguage } from '../../contexts/LanguageContext'

function DepartmentsSection({ data }) {
  const items = data?.items ?? []
  const { t } = useLanguage()
  if (items.length === 0) return null

  return (
    <section className="bg-slate-50 px-6 py-16 md:px-12">
      <h2 className="text-center text-2xl font-semibold text-slate-800">{t('hospital.departments')}</h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.name} className="rounded-xl bg-white p-5 text-center shadow-sm">
            <h3 className="font-semibold text-slate-800">{item.name}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DepartmentsSection
