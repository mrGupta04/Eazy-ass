import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { LogOut, BookOpen, RotateCcw, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { resetData } = useData()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary tracking-tight">EazyAssign</h1>
              <p className="text-[10px] text-text-secondary -mt-0.5 hidden sm:block">
                {isAdmin ? 'Professor Dashboard' : 'Student Portal'}
              </p>
            </div>
          </div>

          {/* Desktop user info */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={resetData}
              className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary rounded-lg hover:bg-white/5 transition-colors"
              style={{ padding: '0.5rem 1rem', margin: '0.125rem' }}
              title="Reset to demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-white">
                {user.avatar}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{user.name}</p>
                <p className="text-[11px] text-text-secondary">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
              style={{ padding: '0.625rem', margin: '0.125rem' }}
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-white">
                {user.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{user.name}</p>
                <p className="text-[11px] text-text-secondary">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2 px-2">
              <button
                onClick={() => { resetData(); setMobileOpen(false) }}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs text-text-secondary rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                style={{ padding: '0.625rem 1rem', margin: '0.25rem' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo
              </button>
              <button
                onClick={() => { logout(); setMobileOpen(false) }}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs text-danger rounded-lg bg-danger/10 hover:bg-danger/20 transition-colors"
                style={{ padding: '0.625rem 1rem', margin: '0.25rem' }}
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
