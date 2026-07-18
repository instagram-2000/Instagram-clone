function ServicesSection({ data }) {
  const items = data?.items ?? []
  if (items.length === 0) return null

  return (
    <section className="px-6 py-16 md:px-12">
      <h2 className="text-center text-2xl font-semibold text-slate-800">Our Services</h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-100 p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="text-3xl">{item.icon}</div>
            <h3 className="mt-4 font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
