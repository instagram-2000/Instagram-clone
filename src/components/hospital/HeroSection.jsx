function HeroSection({ config }) {
  const { title, branding } = config
  const bgImage = branding?.logos?.bgImage

  return (
    <section
      className="relative flex min-h-[420px] items-center px-6 py-20 md:px-12"
      style={{
        backgroundColor: 'var(--tenant-secondary)',
        backgroundImage: bgImage ? `linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.55)), url(${bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-2xl text-white">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--tenant-primary)]">
          Welcome to
        </p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-slate-100/90">
          Quality healthcare, trusted specialists, and appointments that fit your life.
        </p>
        <a
          href="#contact"
          className="mt-8 inline-block rounded-full bg-[var(--tenant-primary)] px-6 py-3 font-medium text-white shadow-lg"
        >
          Book an Appointment
        </a>
      </div>
    </section>
  )
}

export default HeroSection
