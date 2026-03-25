import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { X, Plus, UserPlus, UserMinus } from 'lucide-react'

export default function CreateAssignmentModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const { addAssignment, getAllStudents } = useData()
  const allStudents = getAllStudents()

  const [form, setForm] = useState({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    driveLink: '',
    assignedTo: allStudents.map(s => s.id),
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.course.trim()) errs.course = 'Course is required'
    if (!form.dueDate) errs.dueDate = 'Due date is required'
    if (form.assignedTo.length === 0) errs.assignedTo = 'Select at least one student'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    addAssignment({
      ...form,
      createdBy: user.id,
    })
    // Reset form
    setForm({
      title: '',
      description: '',
      course: '',
      dueDate: '',
      driveLink: '',
      assignedTo: allStudents.map(s => s.id),
    })
    setErrors({})
    onClose()
  }

  const toggleStudent = (studentId) => {
    setForm(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(studentId)
        ? prev.assignedTo.filter(id => id !== studentId)
        : [...prev.assignedTo, studentId],
    }))
  }

  const toggleAll = () => {
    setForm(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.length === allStudents.length ? [] : allStudents.map(s => s.id),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass rounded-xl sm:rounded-2xl w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10 animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 glass rounded-t-2xl border-b border-white/10 flex items-center justify-between z-10" style={{ padding: '1rem 2rem' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-text-primary">Create Assignment</h2>
              <p className="text-[11px] sm:text-xs text-text-secondary">Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-primary" style={{ marginBottom: '0.5rem' }}>Assignment Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. React Component Architecture"
              className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.title ? 'border-danger' : 'border-white/10'
              }`}
            />
            {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-text-primary" style={{ marginBottom: '0.5rem' }}>Course *</label>
            <input
              type="text"
              value={form.course}
              onChange={e => setForm({ ...form, course: e.target.value })}
              placeholder="e.g. CS 301 - Web Development"
              className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                errors.course ? 'border-danger' : 'border-white/10'
              }`}
            />
            {errors.course && <p className="text-xs text-danger mt-1">{errors.course}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary" style={{ marginBottom: '0.5rem' }}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the assignment objectives and requirements..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Due Date & Drive Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1.25rem' }}>
            <div>
              <label className="block text-sm font-medium text-text-primary" style={{ marginBottom: '0.5rem' }}>Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                  errors.dueDate ? 'border-danger' : 'border-white/10'
                }`}
              />
              {errors.dueDate && <p className="text-xs text-danger mt-1">{errors.dueDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary" style={{ marginBottom: '0.5rem' }}>Drive Link</label>
              <input
                type="url"
                value={form.driveLink}
                onChange={e => setForm({ ...form, driveLink: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Assign Students */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-primary">Assign Students *</label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-primary-light hover:text-primary transition-colors flex items-center gap-1"
              >
                {form.assignedTo.length === allStudents.length ? (
                  <><UserMinus className="w-3 h-3" /> Deselect All</>
                ) : (
                  <><UserPlus className="w-3 h-3" /> Select All</>
                )}
              </button>
            </div>
            {errors.assignedTo && <p className="text-xs text-danger mb-2">{errors.assignedTo}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 max-h-48 overflow-y-auto" style={{ gap: '0.75rem', padding: '0.25rem' }}>
              {allStudents.map(student => {
                const selected = form.assignedTo.includes(student.id)
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudent(student.id)}
                    className={`flex items-center rounded-xl text-left transition-all ${
                      selected
                        ? 'bg-primary/15 border border-primary/30'
                        : 'bg-white/[0.03] border border-white/5 hover:bg-white/[0.06]'
                    }`}
                    style={{ gap: '0.75rem', padding: '0.75rem' }}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white ${
                      selected
                        ? 'bg-gradient-to-br from-primary to-accent'
                        : 'bg-white/10'
                    }`}>
                      {student.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">{student.name}</p>
                      <p className="text-[10px] text-text-secondary truncate">{student.email}</p>
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-[11px] text-text-secondary mt-2">
              {form.assignedTo.length} of {allStudents.length} students selected
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end" style={{ gap: '0.75rem', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto text-sm font-medium text-text-secondary rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-center"
              style={{ padding: '0.75rem 1.5rem', margin: '0.25rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto text-sm font-medium text-white rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-center"
              style={{ padding: '0.75rem 1.5rem', margin: '0.25rem' }}
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
