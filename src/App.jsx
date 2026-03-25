import { useAuth } from './context/AuthContext'
import Navbar from './components/shared/Navbar'
import LoginPage from './components/auth/LoginPage'
import StudentDashboard from './components/student/StudentDashboard'
import AdminDashboard from './components/admin/AdminDashboard'

export default function App() {
  const { user, isAdmin } = useAuth()

  if (!user) return <LoginPage />

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      {isAdmin ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  )
}
