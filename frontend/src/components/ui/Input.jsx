export function Input({ label, hint, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label ? <span className="mb-1 block text-sm font-medium text-slate-800">{label}</span> : null}
      <input
        className={`w-full rounded-xl border bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white ${
          error ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200/80'
        }`}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-sm text-rose-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-sm text-slate-500">{hint}</span>
      ) : null}
    </label>
  )
}

