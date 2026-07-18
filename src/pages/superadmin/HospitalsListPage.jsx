import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeHospitals, deleteHospital } from '../../firebase/hospitals'
import StatusBadge from '../../components/superadmin/StatusBadge'
import ConfirmDialog from '../../components/superadmin/ConfirmDialog'
import Spinner from '../../components/common/Spinner'

function HospitalsListPage() {
  const [hospitals, setHospitals] = useState(null)
  const [search, setSearch] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => subscribeHospitals(setHospitals), [])

  const filtered = useMemo(() => {
    if (!hospitals) return []
    const q = search.trim().toLowerCase()
    if (!q) return hospitals
    return hospitals.filter(
      (h) => h.title?.toLowerCase().includes(q) || h.slug.toLowerCase().includes(q)
    )
  }, [hospitals, search])

  async function handleDelete() {
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteHospital(pendingDelete.slug)
      setPendingDelete(null)
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (!hospitals) return <Spinner />

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-slate-900">Hospitals</h1>
        <Link
          to="/superadmin/hospitals/new"
          className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          + New Hospital
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name or slug…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none sm:w-72"
      />

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Hospital</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((hospital) => (
              <tr key={hospital.slug} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{hospital.title}</td>
                <td className="px-4 py-3 text-slate-500">{hospital.slug}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={hospital.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/superadmin/hospitals/${hospital.slug}`}
                    className="mr-4 cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    Manage
                  </Link>
                  <button
                    onClick={() => {
                      setDeleteError('')
                      setPendingDelete(hospital)
                    }}
                    className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  No hospitals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete hospital"
          message={
            deleteError ||
            `Are you sure you want to delete "${pendingDelete.title}"? This cannot be undone.`
          }
          confirmLabel="Delete"
          danger
          busy={deleting}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

export default HospitalsListPage
