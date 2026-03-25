import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { MOCK_USERS } from '../../data/mockData'
import { BookOpen, GraduationCap, Shield, ChevronRight } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState(null)

  const admins = MOCK_USERS.filter(u => u.role === 'admin')
  const students = MOCK_USERS.filter(u => u.role === 'student')

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-40 sm:w-72 h-40 sm:h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[400px] md:w-[600px] h-72 sm:h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 glow">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Eazy<span className="gradient-text">Assign</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm">Student Assignment Management System</p>
        </div>

        {/* Role selection */}
        {!selectedRole && (
          <div>
            <p className="text-center text-text-secondary text-sm mb-8 sm:mb-10">Select your role to continue</p>
            <div className="flex flex-col gap-6 sm:gap-8">
              <button
                onClick={() => setSelectedRole('admin')}
                className="w-full glass rounded-2xl flex items-center gap-3 sm:gap-4 hover:bg-white/10 transition-all group glow"
                style={{ padding: '1.25rem 1.5rem', margin: '0.25rem 0' }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-text-primary">Professor</h3>
                  <p className="text-xs text-text-secondary">Create & manage assignments, view student progress</p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-primary-light transition-colors" />
              </button>

              <button
                onClick={() => setSelectedRole('student')}
                className="w-full glass rounded-2xl flex items-center gap-3 sm:gap-4 hover:bg-white/10 transition-all group glow"
                style={{ padding: '1.25rem 1.5rem', margin: '0.25rem 0' }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-accent to-cyan-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-semibold text-text-primary">Student</h3>
                <p className="text-xs text-text-secondary">View assignments, track progress & submit work</p>
              </div>
              <ChevronRight className="w-5 h-5 text-text-secondary group-hover:text-accent-light transition-colors" />
              </button>
            </div>
          </div>
        )}

        {/* User selection */}
        {selectedRole && (
          <div>
            <button
              onClick={() => setSelectedRole(null)}
              className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
              style={{ padding: '0.5rem 0.75rem', marginBottom: '1rem' }}
            >
              ← Back to role selection
            </button>

            <div className="glass rounded-2xl glow" style={{ padding: '2rem 2.5rem' }}>
              <h2 className="text-lg font-semibold text-text-primary" style={{ marginBottom: '0.5rem' }}>
                {selectedRole === 'admin' ? 'Select Professor Account' : 'Select Student Account'}
              </h2>
              <p className="text-xs text-text-secondary" style={{ marginBottom: '2rem' }}>Choose a demo account to sign in</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {(selectedRole === 'admin' ? admins : students).map(user => (
                  <button
                    key={user.id}
                    onClick={() => login(user.id)}
                    className="w-full flex items-center rounded-xl hover:bg-white/10 transition-all group"
                    style={{ gap: '1.25rem', padding: '1rem 1.25rem', margin: '0.25rem 0' }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                      selectedRole === 'admin'
                        ? 'bg-gradient-to-br from-primary to-primary-dark'
                        : 'bg-gradient-to-br from-accent to-cyan-600'
                    }`}>
                      {user.avatar}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-text-primary">{user.name}</p>
                      <p className="text-[11px] text-text-secondary">{user.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-text-secondary/50 mt-8">
          Demo application — No real authentication required
        </p>
      </div>
    </div>
  )
}
