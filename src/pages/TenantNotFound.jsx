function TenantNotFound({ slug }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-slate-50 px-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-800">Hospital not found</h1>
      <p className="max-w-md text-slate-500">
        We couldn't find a hospital registered at{' '}
        <span className="font-medium text-slate-700">{slug}</span>. Double-check the
        address or contact your hospital administrator.
      </p>
    </div>
  )
}

export default TenantNotFound
