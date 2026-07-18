function DoctorsSection({ data }) {
  const items = data?.items ?? []
  if (items.length === 0) return null

  return (
    <section className="px-6 py-16 md:px-12">
      <h2 className="text-center text-2xl font-semibold text-slate-800">Our Doctors</h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.name} className="rounded-xl border border-slate-100 p-5 text-center shadow-sm">
            <img
              src={item.photo}
              alt={item.name}
              className="mx-auto h-20 w-20 rounded-full object-cover"
            />
            <h3 className="mt-4 font-semibold text-slate-800">{item.name}</h3>
            <p className="mt-1 text-sm text-[var(--tenant-primary)]">{item.specialization}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default DoctorsSection
