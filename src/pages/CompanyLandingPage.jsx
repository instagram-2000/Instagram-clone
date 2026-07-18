const STATS = [
  { label: 'Hospitals Onboarded', value: '120+' },
  { label: 'Doctors Connected', value: '3,400+' },
  { label: 'Appointments Booked Daily', value: '18,000+' },
]

function CompanyLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="text-lg font-semibold text-slate-800">MediDesk</span>
        <a
          href="mailto:sales@medidesk.com"
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white"
        >
          Get Your Hospital Onboarded
        </a>
      </header>

      <section className="px-6 py-24 text-center md:px-12">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold text-slate-900 md:text-5xl">
          One platform for every hospital's appointment system
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500">
          MediDesk gives every hospital its own branded booking site on a dedicated
          subdomain — set up in minutes, managed from one dashboard.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-8 px-6 pb-24 sm:grid-cols-3 md:px-12">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-sm text-slate-400 md:px-12">
        © {new Date().getFullYear()} MediDesk. All rights reserved.
      </footer>
    </div>
  )
}

export default CompanyLandingPage
