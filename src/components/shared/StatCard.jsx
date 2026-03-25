export default function StatCard({ icon: Icon, label, value, subtitle, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary/20 to-primary/5 text-primary-light border-primary/20',
    accent: 'from-accent/20 to-accent/5 text-accent-light border-accent/20',
    success: 'from-success/20 to-success/5 text-success border-success/20',
    warning: 'from-warning/20 to-warning/5 text-warning border-warning/20',
    danger: 'from-danger/20 to-danger/5 text-danger border-danger/20',
  }
  const classes = colorMap[color] || colorMap.primary

  return (
    <div className={`rounded-xl sm:rounded-2xl bg-gradient-to-br ${classes} border transition-transform hover:scale-[1.02] shadow-lg shadow-black/10`} style={{ padding: '1.25rem 1.5rem' }}>
      <div className="flex items-center justify-between" style={{ gap: '1rem' }}>
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-medium text-text-secondary uppercase tracking-wider truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-text-primary mt-1.5">{value}</p>
          {subtitle && <p className="text-[11px] sm:text-xs text-text-secondary mt-1 truncate">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  )
}
