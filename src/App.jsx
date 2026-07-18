import { useMemo } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { getTenantSlug } from './utils/subdomain'
import CompanyLandingPage from './pages/CompanyLandingPage'
import HospitalLandingPage from './pages/HospitalLandingPage'
import { AuthProvider } from './contexts/AuthContext'
import RequireSuperAdmin from './components/superadmin/RequireSuperAdmin'
import SuperAdminLayout from './components/superadmin/SuperAdminLayout'
import SuperAdminLoginPage from './pages/superadmin/SuperAdminLoginPage'
import DashboardPage from './pages/superadmin/DashboardPage'
import HospitalsListPage from './pages/superadmin/HospitalsListPage'
import HospitalFormPage from './pages/superadmin/HospitalFormPage'
import HospitalDetailPage from './pages/superadmin/HospitalDetailPage'

function App() {
  const tenantSlug = useMemo(() => getTenantSlug(), [])

  return (
    <Routes>
      <Route
        path="/"
        element={tenantSlug ? <HospitalLandingPage slug={tenantSlug} /> : <CompanyLandingPage />}
      />

      {/* /superadmin only exists on the root/company domain — under a
          tenant subdomain it falls through to the catch-all below. */}
      {!tenantSlug && (
        <Route
          path="/superadmin"
          element={
            <AuthProvider>
              <Outlet />
            </AuthProvider>
          }
        >
          <Route index element={<SuperAdminLoginPage />} />
          <Route element={<RequireSuperAdmin />}>
            <Route element={<SuperAdminLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="hospitals" element={<HospitalsListPage />} />
              <Route path="hospitals/new" element={<HospitalFormPage mode="create" />} />
              <Route path="hospitals/:slug" element={<HospitalDetailPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/superadmin" replace />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
