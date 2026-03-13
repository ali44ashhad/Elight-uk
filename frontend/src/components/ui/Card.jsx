export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm
        transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        border border-slate-100 hover:border-emerald-100
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 opacity-0 transition-opacity group-hover:opacity-10" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}