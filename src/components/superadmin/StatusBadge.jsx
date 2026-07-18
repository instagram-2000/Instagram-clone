const STYLES = {
  trial: 'bg-amber-50 text-amber-700 ring-amber-200',
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  disabled: 'bg-slate-100 text-slate-500 ring-slate-200',
}

const LABELS = {
  hospital: { trial: 'Trial', active: 'Ongoing' },
  user: { active: 'Active', disabled: 'Disabled' },
}

function StatusBadge({ status, kind = 'hospital' }) {
  const label = LABELS[kind]?.[status] || status
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        STYLES[status] || STYLES.disabled
      }`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
