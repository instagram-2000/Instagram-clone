import { useEffect, useState } from 'react'
import { subscribePatients } from '../../firebase/patients'
import { subscribeUsersByHospital } from '../../firebase/users'
import { ROLES } from '../../utils/roles'
import PatientFormModal from '../../components/hospitalAdmin/PatientFormModal'
import BookAppointmentModal from '../../components/hospitalAdmin/BookAppointmentModal'
import { PageSpinner } from '../../components/common/Spinner'
import NavIcon from '../../components/common/NavIcon'

function PatientsPage({ tenantSlug }) {
  const [patients, setPatients] = useState(null)
  const [staff, setStaff] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [bookingForPatientId, setBookingForPatientId] = useState(null)

  useEffect(() => subscribePatients(tenantSlug, setPatients), [tenantSlug])
  useEffect(() => subscribeUsersByHospital(tenantSlug, setStaff), [tenantSlug])

  const doctors = staff.filter((s) => s.role === ROLES.DOCTOR && s.status === 'active')

  if (patients === null) return <PageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-heading">Patients</h1>
          <p className="mt-0.5 text-sm text-muted">{patients.length} registered patient{patients.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-md hover:shadow-indigo-500/30 active:scale-[0.98]"
        >
          <NavIcon name="patients" className="h-4 w-4" />
          Add Patient
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead>
            <tr className="border-b border-line bg-card-strong/30">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-faint">Name</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-faint">Phone</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-faint">Email</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-faint">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {patients.map((patient) => (
              <tr key={patient.id} className="group transition-colors hover:bg-card-strong/50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-600 ring-1 ring-inset ring-indigo-500/20 dark:text-indigo-300">
                      {(patient.name || '?')[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-heading">{patient.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted">{patient.phone || '—'}</td>
                <td className="px-5 py-3.5 text-muted">{patient.email || '—'}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => setBookingForPatientId(patient.id)}
                    className="cursor-pointer rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-500/20 dark:text-indigo-300"
                  >
                    Book appointment
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card-strong">
                      <NavIcon name="patients" className="h-6 w-6 text-faint" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-muted">No patients yet</p>
                    <p className="mt-1 text-xs text-faint">Add your first patient to get started</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-500/25 transition-all hover:bg-indigo-500"
                    >
                      + Add Patient
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <PatientFormModal
          hospitalId={tenantSlug}
          onCancel={() => setShowAddModal(false)}
          onCreated={() => setShowAddModal(false)}
        />
      )}

      {bookingForPatientId && (
        <BookAppointmentModal
          hospitalId={tenantSlug}
          patients={patients}
          doctors={doctors}
          preselectedPatientId={bookingForPatientId}
          onCancel={() => setBookingForPatientId(null)}
          onCreated={() => setBookingForPatientId(null)}
        />
      )}
    </div>
  )
}

export default PatientsPage
