export function Logo({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <rect width="28" height="28" rx="8" fill={dark ? '#FFFFFF' : '#0C0E14'} />
        <path d="M6 20c5 0 5-12 10-12h6M16 8c0 0 2 6 6 6M16 8c0 6 3 12 6 12" fill="none" stroke="#FF5B1F" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="6" cy="20" r="2.4" fill={dark ? '#0C0E14' : '#FFFFFF'} />
      </svg>
      <span className={`font-display text-[20px] font-bold tracking-[-0.03em] ${dark ? 'text-white' : 'text-rb-ink'}`}>RouteBench</span>
    </span>
  )
}
