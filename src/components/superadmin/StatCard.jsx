import NavIcon from '../common/NavIcon'

const GRADIENT_MAP = {
  appointments: 'from-sky-500/10 to-indigo-500/5',
  doctors: 'from-violet-500/10 to-purple-500/5',
  patients: 'from-emerald-500/10 to-teal-500/5',
  schedule: 'from-amber-500/10 to-orange-500/5',
}

const ICON_BG_MAP = {
  appointments: 'bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300',
  doctors: 'bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300',
  patients: 'bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300',
  schedule: 'bg-amber-500/15 text-amber-600 ring-amber-500/20 dark:text-amber-300',
}

function StatCard({ label, value, hint, icon }) {
  const gradient = GRADIENT_MAP[icon] || 'from-indigo-500/10 to-indigo-500/5'
  const iconBg = ICON_BG_MAP[icon] || 'bg-indigo-500/15 text-indigo-600 ring-indigo-500/20 dark:text-indigo-300'

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${gradient} p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-line-strong`}>
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
      <div className="relative">
        {icon && (
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${iconBg}`}>
            <NavIcon name={icon} />
          </span>
        )}
        <p className={`text-sm font-medium text-muted ${icon ? 'mt-4' : ''}`}>{label}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-heading">{value}</p>
        {hint && <p className="mt-1.5 text-xs text-faint">{hint}</p>}
      </div>
    </div>
  )
}

export default StatCard
