import { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getTenantSlug } from './utils/subdomain'
import CompanyLandingPage from './pages/CompanyLandingPage'
import HospitalLandingPage from './pages/HospitalLandingPage'

function HomeRoute() {
  const tenantSlug = useMemo(() => getTenantSlug(), [])
  return tenantSlug ? <HospitalLandingPage slug={tenantSlug} /> : <CompanyLandingPage />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
