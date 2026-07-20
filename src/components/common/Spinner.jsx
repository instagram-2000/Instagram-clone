function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-line border-t-indigo-500" />
        <div className="absolute inset-1 animate-spin rounded-full border-[2px] border-transparent border-t-indigo-400 [animation-duration:1.5s]" />
      </div>
    </div>
  )
}

export default Spinner

export function PageSpinner() {
  return (
    <div className="flex h-[60vh] w-full items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-line border-t-indigo-500" />
        <div className="absolute inset-1.5 animate-spin rounded-full border-[2px] border-transparent border-t-indigo-400 [animation-duration:1.5s]" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="space-y-0 divide-y divide-line">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className="h-4 animate-pulse rounded-md bg-card-strong"
                style={{ width: j === 0 ? '30%' : j === cols - 1 ? '10%' : `${50 / cols}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
