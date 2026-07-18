import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ROLES } from '../../utils/roles'
import Spinner from '../common/Spinner'

function RequireSuperAdmin() {
  const { loading, user, role, status } = useAuth()

  if (loading) return <Spinner />

  if (!user || role !== ROLES.SUPERADMIN || status === 'disabled') {
    return <Navigate to="/superadmin" replace />
  }

  return <Outlet />
}

export default RequireSuperAdmin
