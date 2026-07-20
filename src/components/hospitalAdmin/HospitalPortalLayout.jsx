import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { subscribeHospital } from '../../firebase/hospitals'
import { signOutUser } from '../../firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import { useFeatures } from '../../contexts/FeatureContext'
import { FEATURE_REGISTRY } from '../../config/featureRegistry'
import { ROLE_LABELS } from '../../utils/roles'
import StatusBadge from '../superadmin/StatusBadge'
import NavIcon from '../common/NavIcon'
import ThemeToggle from '../common/ThemeToggle'

function HospitalPortalLayout({ tenantSlug }) {
  const location = useLocation()
  const { user, role } = useAuth()
  const { isFeatureEnabled } = useFeatures()
  const [hospital, setHospital] = useState(undefined)

  useEffect(() => subscribeHospital(tenantSlug, setHospital), [tenantSlug])

  const navItems = FEATURE_REGISTRY.filter(
    (feature) => feature.allowedRoles.includes(role) && isFeatureEnabled(feature.key)
  ).map((feature) => ({ to: feature.path, label: feature.label, icon: feature.icon }))

  return (
    <div className="min-h-screen bg-page text-heading md:flex">
      <aside className="relative flex flex-col overflow-hidden border-b border-line bg-surface md:w-64 md:shrink-0 md:border-b-0 md:border-r">
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full opacity-[0.12] blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)' }}
        />

        <div className="relative px-5 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-inset ring-indigo-500/20">
              <NavIcon name="hospitals" className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-heading">
                {hospital?.title || 'Hospital Dashboard'}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {hospital?.status && <StatusBadge status={hospital.status} />}
            <span className="text-[10px] font-semibold uppercase tracking-widest text-faint">
              {ROLE_LABELS[role]}
            </span>
          </div>
        </div>

        <nav className="relative mt-2 flex gap-1 px-3 pb-3 md:flex-col md:flex-1 md:px-2.5 md:pb-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={{ pathname: item.to, search: location.search }}
              className={({ isActive }) =>
                `group flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-600 shadow-sm shadow-indigo-500/5 ring-1 ring-inset ring-indigo-500/25 dark:text-indigo-300'
                    : 'text-muted hover:bg-card-strong hover:text-heading'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    isActive ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300' : 'text-faint group-hover:text-muted'
                  }`}>
                    <NavIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative hidden border-t border-line px-5 py-4 md:block">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-600 ring-1 ring-inset ring-indigo-500/20 dark:text-indigo-300">
              {(user?.email || '?')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-heading">{user?.displayName || user?.email}</p>
              <p className="truncate text-[11px] text-faint">{ROLE_LABELS[role]}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/80 bg-surface/80 px-6 py-3 backdrop-blur-xl backdrop-saturate-150">
          <Link
            to={{ pathname: '/', search: location.search }}
            className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-card-strong hover:text-heading"
          >
            <NavIcon name="eye" className="h-4 w-4" />
            View public site
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <span className="hidden text-sm text-muted sm:inline">{user?.email}</span>
            <button
              onClick={() => signOutUser()}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default HospitalPortalLayout
