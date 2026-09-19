import { Link } from 'react-router-dom'

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="en-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4de3ff" />
          <stop offset="52%" stopColor="#6d7cff" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="en-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="19" fill="rgba(255,255,255,0.05)" />
      <rect
        x="1.25"
        y="1.25"
        width="61.5"
        height="61.5"
        rx="17.75"
        stroke="url(#en-a)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      <path d="M32 12.5 L51.5 22 L32 31.5 L12.5 22 Z" fill="url(#en-a)" />
      <path
        d="M19.5 27.2 V38.6 C22.4 41.9 26.8 43.8 32 43.8 C37.2 43.8 41.6 41.9 44.5 38.6 V27.2 L32 33.2 Z"
        fill="url(#en-b)"
        opacity="0.92"
      />
      <path
        d="M51.5 22 V36.4"
        stroke="url(#en-a)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="51.5" cy="39.8" r="3.2" fill="url(#en-a)" />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-nova-400/70 rounded-xl"
      aria-label="EduNova AI home"
    >
      <span className="transition-transform duration-500 group-hover:rotate-[7deg] group-hover:scale-105">
        <LogoMark size={compact ? 32 : 38} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-white">
          Edu<span className="gradient-text">Nova</span>
        </span>
        {!compact && (
          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-mist/70">
            AI Learning
          </span>
        )}
      </span>
    </Link>
  )
}
