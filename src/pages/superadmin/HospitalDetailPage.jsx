import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { subscribeHospital, updateHospital } from '../../firebase/hospitals'
import { subscribeUsersByHospital, setUserStatus } from '../../firebase/users'
import { ROLE_LABELS } from '../../utils/roles'
import { CONTENT_SECTIONS } from '../../utils/hospitalContentSchema'
import HospitalFormPage from './HospitalFormPage'
import ContentSectionEditor from '../../components/superadmin/ContentSectionEditor'
import StaffFormModal from '../../components/superadmin/StaffFormModal'
import CredentialsDialog from '../../components/superadmin/CredentialsDialog'
import StatCard from '../../components/superadmin/StatCard'
import StatusBadge from '../../components/superadmin/StatusBadge'
import Spinner from '../../components/common/Spinner'
import TenantNotFound from '../TenantNotFound'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'branding', label: 'Branding & Contact' },
  { key: 'content', label: 'Content' },
  { key: 'staff', label: 'Staff' },
]

function HospitalDetailPage() {
  const { slug } = useParams()
  const [hospital, setHospital] = useState(undefined)
  const [staff, setStaff] = useState([])
  const [togglingStatus, setTogglingStatus] = useState(false)
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [newCredentials, setNewCredentials] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => subscribeHospital(slug, setHospital), [slug])
  useEffect(() => subscribeUsersByHospital(slug, setStaff), [slug])
  useEffect(() => setActiveTab('overview'), [slug])

  if (hospital === undefined) return <Spinner />
  if (hospital === null) return <TenantNotFound slug={slug} />

  async function toggleStatus() {
    setTogglingStatus(true)
    try {
      await updateHospital(slug, { status: hospital.status === 'trial' ? 'active' : 'trial' })
    } finally {
      setTogglingStatus(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <Link to="/superadmin/hospitals" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to hospitals
      </Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{hospital.title}</h1>
          <p className="text-sm text-slate-500">{hospital.slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={hospital.status} />
          <button
            onClick={toggleStatus}
            disabled={togglingStatus}
            className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Switch to {hospital.status === 'trial' ? 'Ongoing' : 'Trial'}
          </button>
        </div>
      </div>

      <div className="mt-6 border-b border-slate-200">
        <nav className="-mb-px flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-medium ${
                activeTab === tab.key
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <section>
            <h2 className="text-sm font-semibold text-slate-900">Activity</h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Appointments today" value={0} hint="No appointment data yet" />
              <StatCard label="Total appointments" value={0} hint="No appointment data yet" />
              <StatCard label="Active staff" value={staff.filter((s) => s.status === 'active').length} />
            </div>
          </section>
        )}

        {activeTab === 'branding' && (
          <section>
            <HospitalFormPage mode="edit" hospital={hospital} />
          </section>
        )}

        {activeTab === 'content' && (
          <section className="space-y-4">
            <p className="text-sm text-slate-500">
              Controls what shows on {hospital.title}'s public landing page.
            </p>
            {CONTENT_SECTIONS.map((cfg) => (
              <ContentSectionEditor
                key={`${hospital.slug}-${cfg.key}`}
                slug={hospital.slug}
                sectionKey={cfg.key}
                label={cfg.label}
                fields={cfg.fields}
                section={hospital.optionals?.[cfg.key] || { enabled: 'off', orderNumber: 1, items: [] }}
              />
            ))}
          </section>
        )}

        {activeTab === 'staff' && (
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Staff</h2>
              <button
                onClick={() => setShowStaffForm(true)}
                className="cursor-pointer rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
              >
                + Add Staff
              </button>
            </div>

            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map((member) => (
                    <tr key={member.uid} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{member.displayName}</td>
                      <td className="px-4 py-3 text-slate-500">{member.email}</td>
                      <td className="px-4 py-3 text-slate-500">{ROLE_LABELS[member.role] || member.role}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={member.status} kind="user" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            setUserStatus(member.uid, member.status === 'active' ? 'disabled' : 'active')
                          }
                          className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          {member.status === 'active' ? 'Deactivate' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {staff.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        No staff assigned yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {showStaffForm && (
        <StaffFormModal
          hospitalId={slug}
          onCancel={() => setShowStaffForm(false)}
          onCreated={(credentials) => {
            setShowStaffForm(false)
            setNewCredentials(credentials)
          }}
        />
      )}

      {newCredentials && (
        <CredentialsDialog
          email={newCredentials.email}
          password={newCredentials.password}
          onClose={() => setNewCredentials(null)}
        />
      )}
    </div>
  )
}

export default HospitalDetailPage
