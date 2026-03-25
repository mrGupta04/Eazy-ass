import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative glass rounded-2xl max-w-md w-full shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200" style={{ padding: '2rem 2.5rem', margin: '1rem' }}>
        <button
          onClick={onCancel}
          className="absolute text-text-secondary hover:text-text-primary transition-colors"
          style={{ top: '1.25rem', right: '1.25rem', padding: '0.5rem' }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start" style={{ gap: '1.25rem', paddingRight: '2rem', marginBottom: '1.5rem' }}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-danger/20' : 'bg-primary/20'}`} style={{ padding: '0.5rem' }}>
            <AlertTriangle className={`w-6 h-6 ${danger ? 'text-danger' : 'text-primary-light'}`} />
          </div>
          <div className="min-w-0" style={{ paddingTop: '0.25rem' }}>
            <h3 className="text-base sm:text-lg font-semibold text-text-primary" style={{ marginBottom: '0.5rem' }}>{title}</h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end" style={{ gap: '0.75rem', paddingTop: '1rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={onCancel}
            className="text-sm font-medium text-text-secondary rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-center"
            style={{ padding: '0.75rem 1.25rem', margin: '0.25rem' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: '0.75rem 1.25rem', margin: '0.25rem' }}
            className={`text-sm font-medium text-white rounded-xl transition-colors text-center ${
              danger
                ? 'bg-danger hover:bg-danger/80'
                : 'bg-gradient-to-r from-primary to-accent hover:opacity-90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
