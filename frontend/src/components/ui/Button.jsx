export function Button({
  as,
  variant = 'primary',
  className = '',
  ...props
}) {
  const Comp = as || 'button'
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const styles =
    variant === 'primary'
      ? 'bg-teal-800 text-white hover:bg-teal-900 focus:ring-emerald-500 focus:ring-offset-slate-900'
      : variant === 'secondary'
        ? 'bg-white text-slate-900 ring-1 ring-slate-200/80 hover:bg-slate-50 focus:ring-emerald-500 focus:ring-offset-white'
        : variant === 'ghost'
          ? 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-emerald-500 focus:ring-offset-white'
          : 'bg-teal-800 text-white hover:bg-teal-900 focus:ring-emerald-500 focus:ring-offset-slate-900'

  return <Comp className={`${base} ${styles} ${className}`} {...props} />
}

