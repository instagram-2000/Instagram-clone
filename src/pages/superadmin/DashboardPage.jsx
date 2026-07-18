import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHospitalCounts } from '../../firebase/hospitals'
import { getStaffCount } from '../../firebase/users'
import StatCard from '../../components/superadmin/StatCard'
import Spinner from '../../components/common/Spinner'

function DashboardPage() {
  const [counts, setCounts] = useState(null)
  const [staffCount, setStaffCount] = useState(null)

  useEffect(() => {
    getHospitalCounts().then(setCounts)
    getStaffCount().then(setStaffCount)
  }, [])

  if (!counts || staffCount === null) return <Spinner />

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Overview across all onboarded hospitals.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Hospitals" value={counts.total} />
        <StatCard label="Trial" value={counts.trial} />
        <StatCard label="Ongoing" value={counts.active} />
        <StatCard label="Total Staff" value={staffCount} />
      </div>

      <div className="mt-8">
        <Link
          to="/superadmin/hospitals"
          className="inline-flex cursor-pointer items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Manage Hospitals
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
