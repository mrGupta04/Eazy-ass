export default function ProgressBar({ value, max, size = 'md', showLabel = true, color = 'primary' }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0

  const colorMap = {
    primary: 'from-primary to-accent',
    success: 'from-success to-emerald-400',
    warning: 'from-warning to-amber-400',
    danger: 'from-danger to-red-400',
  }

  const sizeMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  const gradient = colorMap[color] || colorMap.primary

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-text-secondary">{value}/{max} completed</span>
          <span className="text-xs font-semibold text-text-primary">{percent}%</span>
        </div>
      )}
      <div className={`w-full ${sizeMap[size]} bg-white/10 rounded-full overflow-hidden`}>
        <div
          className={`${sizeMap[size]} bg-gradient-to-r ${gradient} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
