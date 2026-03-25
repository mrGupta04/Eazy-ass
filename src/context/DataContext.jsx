import { createContext, useContext, useState, useCallback } from 'react'
import { MOCK_ASSIGNMENTS, MOCK_SUBMISSIONS, MOCK_USERS } from '../data/mockData'

const DataContext = createContext(null)
const ASSIGNMENTS_KEY = 'eazy-ass-assignments'
const SUBMISSIONS_KEY = 'eazy-ass-submissions'

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function DataProvider({ children }) {
  const [assignments, setAssignments] = useState(() =>
    loadFromStorage(ASSIGNMENTS_KEY, MOCK_ASSIGNMENTS)
  )
  const [submissions, setSubmissions] = useState(() =>
    loadFromStorage(SUBMISSIONS_KEY, MOCK_SUBMISSIONS)
  )

  const saveAssignments = (data) => {
    setAssignments(data)
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(data))
  }

  const saveSubmissions = (data) => {
    setSubmissions(data)
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data))
  }

  const addAssignment = useCallback((assignment) => {
    const newAssignment = {
      ...assignment,
      id: `asgn-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    saveAssignments([...assignments, newAssignment])
    return newAssignment
  }, [assignments])

  const deleteAssignment = useCallback((id) => {
    saveAssignments(assignments.filter(a => a.id !== id))
    saveSubmissions(submissions.filter(s => s.assignmentId !== id))
  }, [assignments, submissions])

  const submitAssignment = useCallback((assignmentId, studentId) => {
    const exists = submissions.find(
      s => s.assignmentId === assignmentId && s.studentId === studentId
    )
    if (exists) return false
    const newSub = {
      assignmentId,
      studentId,
      submittedAt: new Date().toISOString().split('T')[0],
    }
    saveSubmissions([...submissions, newSub])
    return true
  }, [submissions])

  const isSubmitted = useCallback((assignmentId, studentId) => {
    return submissions.some(
      s => s.assignmentId === assignmentId && s.studentId === studentId
    )
  }, [submissions])

  const getStudentAssignments = useCallback((studentId) => {
    return assignments.filter(a => a.assignedTo.includes(studentId))
  }, [assignments])

  const getAdminAssignments = useCallback((adminId) => {
    return assignments.filter(a => a.createdBy === adminId)
  }, [assignments])

  const getAssignmentSubmissions = useCallback((assignmentId) => {
    return submissions.filter(s => s.assignmentId === assignmentId)
  }, [submissions])

  const getStudentById = (id) => MOCK_USERS.find(u => u.id === id)
  const getAllStudents = () => MOCK_USERS.filter(u => u.role === 'student')

  const resetData = useCallback(() => {
    saveAssignments(MOCK_ASSIGNMENTS)
    saveSubmissions(MOCK_SUBMISSIONS)
  }, [])

  return (
    <DataContext.Provider value={{
      assignments,
      submissions,
      addAssignment,
      deleteAssignment,
      submitAssignment,
      isSubmitted,
      getStudentAssignments,
      getAdminAssignments,
      getAssignmentSubmissions,
      getStudentById,
      getAllStudents,
      resetData,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
