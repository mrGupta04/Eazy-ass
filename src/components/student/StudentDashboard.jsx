import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  CheckCircle2, Clock, ExternalLink, Calendar,
  BookOpen, TrendingUp, AlertCircle
} from 'lucide-react'
import StatCard from '../shared/StatCard'
import ProgressBar from '../shared/ProgressBar'
import ConfirmModal from '../shared/ConfirmModal'

function getDueStatus(dueDate) {
  const now = new Date()
  const due = new Date(dueDate)
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: 'Overdue', color: 'text-danger', urgent: true }
  if (diff <= 3) return { label: `${diff}d left`, color: 'text-warning', urgent: true }
  if (diff <= 7) return { label: `${diff}d left`, color: 'text-accent-light', urgent: false }
  return { label: `${diff}d left`, color: 'text-text-secondary', urgent: false }
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { getStudentAssignments, isSubmitted, submitAssignment } = useData()

  const [confirmStep, setConfirmStep] = useState(null) // { assignmentId, step: 1 | 2 }

  const assignments = getStudentAssignments(user.id)
  const submitted = assignments.filter(a => isSubmitted(a.id, user.id))
  const pending = assignments.filter(a => !isSubmitted(a.id, user.id))
  const overdue = pending.filter(a => new Date(a.dueDate) < new Date())

  const handleSubmitClick = (assignmentId) => {
    setConfirmStep({ assignmentId, step: 1 })
  }

  const handleFirstConfirm = () => {
    setConfirmStep(prev => ({ ...prev, step: 2 }))
  }

  const handleFinalConfirm = () => {
    submitAssignment(confirmStep.assignmentId, user.id)
    setConfirmStep(null)
  }

  const currentAssignment = confirmStep
    ? assignments.find(a => a.id === confirmStep.assignmentId)
    : null

  return (
    <div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm">Here's your assignment overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5" style={{ marginBottom: '2.5rem' }}>
          <StatCard icon={BookOpen} label="Total" value={assignments.length} subtitle="Assignments" color="primary" />
          <StatCard icon={CheckCircle2} label="Submitted" value={submitted.length} subtitle="Completed" color="success" />
          <StatCard icon={Clock} label="Pending" value={pending.length} subtitle="In progress" color="warning" />
          <StatCard icon={AlertCircle} label="Overdue" value={overdue.length} subtitle="Past due" color="danger" />
        </div>

        {/* Overall progress */}
        <div className="glass-card rounded-2xl glow" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem' }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <TrendingUp className="w-5 h-5 text-primary-light" />
            <h2 className="text-lg font-semibold text-text-primary">Overall Progress</h2>
          </div>
          <ProgressBar value={submitted.length} max={assignments.length} size="lg" />
        </div>

        {/* Assignment list */}
        <h2 className="text-base sm:text-lg font-semibold text-text-primary" style={{ marginBottom: '1.5rem' }}>Your Assignments</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {assignments.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No assignments assigned to you yet.</p>
            </div>
          )}

          {assignments.map(assignment => {
            const done = isSubmitted(assignment.id, user.id)
            const due = getDueStatus(assignment.dueDate)
            return (
              <div
                key={assignment.id}
                className={`glass-card rounded-xl sm:rounded-2xl transition-all hover:bg-white/[0.1] ${
                  done ? 'border-success/20' : due.urgent ? 'border-warning/20' : ''
                }`}
                style={{ padding: '1.25rem 1.5rem' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  {/* Status indicator */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    done ? 'bg-success/20' : 'bg-white/5'
                  }`}>
                    {done
                      ? <CheckCircle2 className="w-5 h-5 text-success" />
                      : <Clock className="w-5 h-5 text-text-secondary" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="text-base font-semibold text-text-primary truncate">{assignment.title}</h3>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${due.color}`}>
                        <Calendar className="w-3 h-3" />
                        Due {assignment.dueDate} · {due.label}
                      </span>
                    </div>
                    <p className="text-xs text-primary-light font-medium mb-1">{assignment.course}</p>
                    <p className="text-sm text-text-secondary line-clamp-2">{assignment.description}</p>

                    {/* Actions row */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                      {assignment.driveLink && (
                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-light transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open in Drive
                        </a>
                      )}

                      {done ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSubmitClick(assignment.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-gradient-to-r from-primary to-accent rounded-full hover:opacity-90 transition-opacity"
                          style={{ padding: '0.625rem 1.25rem', margin: '0.25rem 0' }}
                        >
                          Mark as Submitted
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Double-verification modal — Step 1 */}
      <ConfirmModal
        isOpen={confirmStep?.step === 1}
        title="Confirm Submission"
        message={`Have you submitted "${currentAssignment?.title}" via the external Drive link? This will mark the assignment as submitted.`}
        confirmText="Yes, I have submitted"
        onConfirm={handleFirstConfirm}
        onCancel={() => setConfirmStep(null)}
      />

      {/* Double-verification modal — Step 2 (Final) */}
      <ConfirmModal
        isOpen={confirmStep?.step === 2}
        title="Final Confirmation"
        message={`Are you absolutely sure? This action cannot be undone. "${currentAssignment?.title}" will be marked as submitted.`}
        confirmText="Confirm Submission"
        onConfirm={handleFinalConfirm}
        onCancel={() => setConfirmStep(null)}
        danger
      />
    </div>
  )
}
