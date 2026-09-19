import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'

/* ------------------------------------------------------------------ */
/*  Layout helpers                                                     */
/* ------------------------------------------------------------------ */

export const container = 'mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-10'

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const viewportOnce = { once: true, margin: '-80px' } as const

/* ------------------------------------------------------------------ */
/*  Typography                                                         */
/* ------------------------------------------------------------------ */

export function GradientText({
  children,
  className = '',
  variant = 'cool',
}: {
  children: ReactNode
  className?: string
  variant?: 'cool' | 'warm'
}) {
  return (
    <span
      className={`${variant === 'warm' ? 'gradient-text-warm' : 'gradient-text'} ${className}`}
    >
      {children}
    </span>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.19em] text-nova-200 backdrop-blur-md">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-glow opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-glow" />
      </span>
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: {
  eyebrow?: string
  title: ReactNode
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl text-left'} ${className}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-5 text-balance text-[clamp(1.95rem,4.4vw,3.15rem)] font-semibold leading-[1.08]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-pretty text-[15px] leading-relaxed text-mist sm:text-base">
          {description}
        </p>
      )}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Buttons                                                            */
/* ------------------------------------------------------------------ */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-[12.5px]',
  md: 'px-6 py-3 text-[13.5px]',
  lg: 'px-7 py-3.5 text-[14.5px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: BtnProps) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.01em] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-nova-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:opacity-50 disabled:pointer-events-none'

  const variants: Record<string, string> = {
    primary:
      'btn-shine text-white bg-[linear-gradient(120deg,#4f57f0_0%,#7c4dff_48%,#3f8cff_100%)] bg-[length:170%_100%] hover:bg-[position:100%_0] shadow-[0_16px_40px_-14px_rgba(99,102,241,0.75)] hover:shadow-[0_22px_55px_-12px_rgba(124,77,255,0.8)] hover:-translate-y-0.5',
    ghost:
      'text-mist-bright bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 hover:-translate-y-0.5',
    outline:
      'text-white border border-nova-400/35 bg-nova-400/[0.07] hover:bg-nova-400/[0.15] hover:border-nova-300/55',
    dark: 'text-white/90 bg-[#0b1020] border border-white/10 hover:border-white/20 hover:text-white',
  }

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Cards & surfaces                                                   */
/* ------------------------------------------------------------------ */

export function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}) {
  return (
    <div
      className={`glass group relative overflow-hidden rounded-[22px] transition-all duration-500 ${
        hover
          ? 'hover:-translate-y-1.5 hover:border-white/[0.16] hover:shadow-[0_36px_80px_-32px_rgba(79,87,240,0.55)]'
          : ''
      } ${glow ? 'ring-glow' : ''} ${className}`}
    >
      {glow && (
        <div className="pointer-events-none absolute -inset-px rounded-[22px] bg-[radial-gradient(circle_at_18%_12%,rgba(129,140,248,0.18),transparent_58%)]" />
      )}
      {children}
    </div>
  )
}

export function Badge({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}) {
  const tones: Record<string, string> = {
    default: 'border-white/10 bg-white/[0.06] text-mist-bright',
    success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
    warning: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
    danger: 'border-rose-400/25 bg-rose-400/10 text-rose-300',
    info: 'border-nova-300/25 bg-nova-400/12 text-nova-200',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.11em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Inputs                                                             */
/* ------------------------------------------------------------------ */

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  icon?: ReactNode
  error?: string
}

export function Input({ label, icon, error, className = '', ...rest }: InputProps) {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-mist/80">
          {label}
        </span>
      )}
      <span className="relative block">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist/70">
            {icon}
          </span>
        )}
        <input
          className={`w-full rounded-2xl border bg-white/[0.045] py-3 text-[14px] text-white placeholder:text-mist/45 outline-none transition-all duration-300 focus:border-nova-400/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)] ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } ${error ? 'border-rose-400/50' : 'border-white/10'} ${className}`}
          {...rest}
        />
      </span>
      {error && <span className="mt-1.5 block text-[11.5px] text-rose-300">{error}</span>}
    </label>
  )
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                   */
/* ------------------------------------------------------------------ */

export function Counter({
  to,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 1700,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setValue(to)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(to * eased)
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Misc                                                               */
/* ------------------------------------------------------------------ */

export function Divider({ className = '' }: { className?: string }) {
  return <div className={`hairline ${className}`} />
}

export function Avatar({
  src,
  alt,
  size = 40,
  ring = true,
}: {
  src: string
  alt: string
  size?: number
  ring?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={`shrink-0 rounded-full object-cover ${
        ring ? 'ring-2 ring-nova-400/35 ring-offset-2 ring-offset-void' : ''
      }`}
      style={{ width: size, height: size }}
    />
  )
}

export function ProgressBar({
  value,
  className = '',
  tone = 'cool',
}: {
  value: number
  className?: string
  tone?: 'cool' | 'warm' | 'green'
}) {
  const gradients: Record<string, string> = {
    cool: 'linear-gradient(90deg,#4de3ff,#6d7cff,#a78bfa)',
    warm: 'linear-gradient(90deg,#f472d0,#a78bfa,#6d7cff)',
    green: 'linear-gradient(90deg,#34d399,#4de3ff,#6d7cff)',
  }
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08] ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: gradients[tone] }}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
