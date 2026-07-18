function TestimonialsSection({ data }) {
  const items = data?.items ?? []
  if (items.length === 0) return null

  return (
    <section className="bg-slate-50 px-6 py-16 md:px-12">
      <h2 className="text-center text-2xl font-semibold text-slate-800">
        What Our Patients Say
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.name} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-amber-500">{'★'.repeat(item.rating ?? 5)}</p>
            <p className="mt-3 text-sm text-slate-600">"{item.message}"</p>
            <p className="mt-4 text-sm font-semibold text-slate-800">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestimonialsSection
