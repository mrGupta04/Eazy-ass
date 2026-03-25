import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  Plus, Trash2, Users, CheckCircle2, Clock,
  ExternalLink, Calendar, BookOpen, TrendingUp,
  ChevronDown, ChevronUp, Link2
} from 'lucide-react'
import StatCard from '../shared/StatCard'
import ProgressBar from '../shared/ProgressBar'
import ConfirmModal from '../shared/ConfirmModal'
import CreateAssignmentModal from './CreateAssignmentModal'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { getAdminAssignments, getAssignmentSubmissions, deleteAssignment, getStudentById } = useData()

  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  const assignments = getAdminAssignments(user.id)

  // Compute stats
  const totalStudents = new Set(assignments.flatMap(a => a.assignedTo)).size
  const totalSubmissions = assignments.reduce((sum, a) => sum + getAssignmentSubmissions(a.id).length, 0)
  const totalExpected = assignments.reduce((sum, a) => sum + a.assignedTo.length, 0)

  const handleDelete = () => {
    if (deleteTarget) {
      deleteAssignment(deleteTarget)
      setDeleteTarget(null)
      if (expandedId === deleteTarget) setExpandedId(null)
    }
  }

  return (
    <div>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2.5rem' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary">
              Professor <span className="gradient-text">{user.name.split(' ').pop()}</span>
            </h1>
            <p className="text-text-secondary mt-1 text-sm">Assignment management overview</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-accent rounded-xl hover:opacity-90 transition-opacity glow"
            style={{ padding: '0.75rem 1.5rem', margin: '0.25rem 0' }}
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5" style={{ marginBottom: '2.5rem' }}>
          <StatCard icon={BookOpen} label="Assignments" value={assignments.length} subtitle="Created" color="primary" />
          <StatCard icon={Users} label="Students" value={totalStudents} subtitle="Enrolled" color="accent" />
          <StatCard icon={CheckCircle2} label="Submissions" value={totalSubmissions} subtitle="Received" color="success" />
          <StatCard icon={TrendingUp} label="Completion" value={totalExpected > 0 ? `${Math.round((totalSubmissions / totalExpected) * 100)}%` : '0%'} subtitle="Overall rate" color="warning" />
        </div>

        {/* Overall progress */}
        <div className="glass-card rounded-2xl glow" style={{ marginBottom: '2.5rem', padding: '1.5rem 2rem' }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <TrendingUp className="w-5 h-5 text-primary-light" />
            <h2 className="text-lg font-semibold text-text-primary">Overall Submission Rate</h2>
          </div>
          <ProgressBar value={totalSubmissions} max={totalExpected} size="lg" />
        </div>

        {/* Assignment list */}
        <h2 className="text-base sm:text-lg font-semibold text-text-primary" style={{ marginBottom: '1.5rem' }}>Your Assignments</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {assignments.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No assignments created yet.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 text-sm text-primary-light hover:text-primary transition-colors"
                style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}
              >
                <Plus className="w-4 h-4" />
                Create your first assignment
              </button>
            </div>
          )}

          {assignments.map(assignment => {
            const subs = getAssignmentSubmissions(assignment.id)
            const total = assignment.assignedTo.length
            const submittedCount = subs.length
            const isExpanded = expandedId === assignment.id

            return (
              <div key={assignment.id} className="glass-card rounded-xl sm:rounded-2xl overflow-hidden transition-all">
                {/* Assignment header */}
                <div
                  className="cursor-pointer hover:bg-white/[0.05] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                  style={{ padding: '1.25rem 1.5rem' }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-light" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="text-base font-semibold text-text-primary truncate">{assignment.title}</h3>
                        <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                          <Calendar className="w-3 h-3" />
                          Due {assignment.dueDate}
                        </span>
                      </div>
                      <p className="text-xs text-primary-light font-medium mb-2">{assignment.course}</p>

                      {/* Progress bar */}
                      <ProgressBar
                        value={submittedCount}
                        max={total}
                        size="sm"
                        color={submittedCount === total ? 'success' : 'primary'}
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        style={{ padding: '0.625rem', margin: '0.125rem' }}
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(assignment.id) }}
                        className="p-2 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                        title="Delete assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isExpanded
                        ? <ChevronUp className="w-5 h-5 text-text-secondary" />
                        : <ChevronDown className="w-5 h-5 text-text-secondary" />
                      }
                    </div>
                  </div>
                </div>

                {/* Expanded student details */}
                {isExpanded && (
                  <div className="border-t border-white/5" style={{ padding: '1rem 1.5rem 1.25rem' }}>
                    {/* Drive link */}
                    {assignment.driveLink && (
                      <div className="flex items-center gap-2 py-3 border-b border-white/5 min-w-0 overflow-hidden">
                        <Link2 className="w-4 h-4 text-accent" />
                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:text-accent-light transition-colors flex items-center gap-1 min-w-0"
                        >
                          <span className="truncate">{assignment.driveLink}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    )}

                    <p className="text-xs text-text-secondary mt-3 mb-3">Student Submission Status</p>
                    <div className="space-y-2">
                      {assignment.assignedTo.map(studentId => {
                        const student = getStudentById(studentId)
                        const sub = subs.find(s => s.studentId === studentId)
                        return (
                          <div
                            key={studentId}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
                              {student?.avatar || '??'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-primary truncate">{student?.name || 'Unknown'}</p>
                              <p className="text-[11px] text-text-secondary">{student?.email || ''}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {sub ? (
                                <>
                                  <span className="hidden sm:inline text-[11px] text-text-secondary">{sub.submittedAt}</span>
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Submitted
                                  </span>
                                </>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary bg-white/5 px-2.5 py-1 rounded-full">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Per-assignment progress summary */}
                    <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center justify-between text-xs text-text-secondary mb-2">
                        <span>{submittedCount} of {total} students submitted</span>
                        <span className="font-semibold text-text-primary">
                          {total > 0 ? Math.round((submittedCount / total) * 100) : 0}%
                        </span>
                      </div>
                      <ProgressBar
                        value={submittedCount}
                        max={total}
                        showLabel={false}
                        size="md"
                        color={submittedCount === total ? 'success' : submittedCount > 0 ? 'primary' : 'danger'}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Create Assignment Modal */}
      <CreateAssignmentModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? All associated submission records will also be removed. This cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        danger
      />
    </div>
  )
}
