import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Github,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  UserPlus,
  Zap,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { container, GradientText } from '../components/ui'

type Mode = 'signin' | 'signup'

function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(
    () => [
      { label: 'At least 8 characters', ok: password.length >= 8 },
      { label: 'One uppercase letter', ok: /[A-Z]/.test(password) },
      { label: 'One number', ok: /\d/.test(password) },
      { label: 'One special character', ok: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  )
  const score = checks.filter((c) => c.ok).length
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399']

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="h-[4px] flex-1 rounded-full"
              initial={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              animate={{
                backgroundColor:
                  password.length === 0
                    ? 'rgba(255,255,255,0.1)'
                    : i < score
                      ? colors[score - 1]
                      : 'rgba(255,255,255,0.1)',
              }}
              transition={{ duration: 0.32 }}
            />
          ))}
        </div>
        <span
          className="w-[54px] text-right text-[8.5px] font-semibold uppercase tracking-[0.11em]"
          style={{ color: password ? colors[Math.max(0, score - 1)] : 'rgba(255,255,255,0.35)' }}
        >
          {password ? labels[score] : ''}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={`inline-flex items-center gap-1.5 text-[8.5px] transition-colors ${
              c.ok ? 'text-emerald-300' : 'text-mist/55'
            }`}
          >
            <Check
              className={`h-2.5 w-2.5 ${c.ok ? 'opacity-100' : 'opacity-32'}`}
              strokeWidth={3}
            />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-white/[0.1] bg-white/[0.04] py-3 text-[11.5px] font-medium text-white/88 transition-all hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-white/[0.08]"
    >
      <span className="text-white/78 transition-colors group-hover:text-white">{icon}</span>
      {label}
    </button>
  )
}

export function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (mode === 'signup' && name.trim().length < 2) {
      next.name = 'Please enter your full name'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address'
    }
    if (password.length < 6) {
      next.password = 'Password must be at least 6 characters'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setSuccess(true)
      window.setTimeout(() => navigate('/'), 2200)
    }, 1100)
  }

  return (
    <div className="relative min-h-dvh">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-22%] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.26),transparent_64%)] blur-[100px]" />
      </div>

      <div className={`${container} pb-16 pt-28 sm:pt-32`}>
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-11 flex flex-wrap items-center justify-between gap-5"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.038] px-4 py-2.5 text-[11px] font-medium text-mist transition-colors hover:border-white/[0.18] hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>
          <Logo />
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.038] px-4 py-2.5 text-[11px] font-medium text-mist transition-colors hover:border-white/[0.18] hover:text-white"
          >
            Try without an account
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[1.02fr_1fr]">
          {/* ============ FORM SIDE ============ */}
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-deep relative overflow-hidden rounded-[28px] p-7 sm:p-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(129,140,248,0.16),transparent_52%)]" />

            <div className="relative">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -28 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.12 }}
                      className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-emerald-300/32 bg-[linear-gradient(140deg,#10b981,#34d399)] shadow-[0_22px_52px_-18px_rgba(16,185,129,0.9)]"
                    >
                      <CheckCircle2 className="h-8 w-8 text-white" />
                    </motion.span>

                    <h2 className="mt-7 text-[26px] font-semibold leading-tight">
                      {mode === 'signup' ? 'Welcome to EduNova!' : 'Welcome back!'}
                    </h2>
                    <p className="mt-3.5 max-w-sm text-[12.5px] leading-[1.82] text-mist">
                      {mode === 'signup'
                        ? 'Your account has been created successfully. Taking you to your dashboard…'
                        : 'Signed in successfully. Redirecting you to your learning space…'}
                    </p>

                    <div className="mt-8 w-full max-w-[240px]">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.09]">
                        <motion.div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#4de3ff,#a78bfa)]"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.9, ease: 'easeInOut' }}
                        />
                      </div>
                      <p className="mt-3 text-[9px] uppercase tracking-[0.17em] text-mist/70">
                        Preparing your workspace
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.32 }}
                  >
                    {/* Tabs */}
                    <div className="glass-soft flex rounded-full p-1.5">
                      {(
                        [
                          { key: 'signin' as Mode, label: 'Sign in', icon: <User className="h-3 w-3" /> },
                          {
                            key: 'signup' as Mode,
                            label: 'Create account',
                            icon: <UserPlus className="h-3 w-3" />,
                          },
                        ] as const
                      ).map((t) => (
                        <button
                          key={t.key}
                          onClick={() => {
                            setMode(t.key)
                            setErrors({})
                          }}
                          className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-semibold transition-colors"
                        >
                          {mode === t.key && (
                            <motion.span
                              layoutId="auth-tab"
                              className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(120deg,#4f57f0,#7c4dff_52%,#3f8cff)] shadow-[0_12px_28px_-12px_rgba(99,102,241,0.95)]"
                              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                            />
                          )}
                          <span className={mode === t.key ? 'text-white' : 'text-mist'}>
                            {t.icon}
                          </span>
                          <span className={mode === t.key ? 'text-white' : 'text-mist'}>
                            {t.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Heading */}
                    <div className="mt-8">
                      <h1 className="text-balance text-[clamp(1.75rem,3.6vw,2.35rem)] font-semibold leading-[1.12]">
                        {mode === 'signup' ? (
                          <>
                            Start learning <GradientText>smarter today</GradientText>
                          </>
                        ) : (
                          <>
                            Welcome back, <GradientText>learner</GradientText>
                          </>
                        )}
                      </h1>
                      <p className="mt-3.5 text-[12px] leading-[1.82] text-mist">
                        {mode === 'signup'
                          ? 'Create your free account and unlock the full EduNova workspace — no credit card required.'
                          : 'Sign in to pick up exactly where you left off, with all your progress intact.'}
                      </p>
                    </div>

                    {/* Social */}
                    <div className="mt-7 flex gap-3">
                      <SocialButton
                        icon={
                          <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L21 4.72S19.46 2 16.11 2C11.22 2 7.66 5.86 7.66 12c0 6.12 4.42 10.27 8.95 10.27 5.22 0 8.61-3.65 8.61-8.69 0-.61-.07-1.09-.16-1.48z" />
                          </svg>
                        }
                        label="Google"
                        onClick={() => undefined}
                      />
                      <SocialButton
                        icon={<Github className="h-[15px] w-[15px]" />}
                        label="GitHub"
                        onClick={() => undefined}
                      />
                      <SocialButton
                        icon={
                          <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                          </svg>
                        }
                        label="LinkedIn"
                        onClick={() => undefined}
                      />
                    </div>

                    {/* Divider */}
                    <div className="my-7 flex items-center gap-4">
                      <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
                      <span className="text-[8.5px] font-semibold uppercase tracking-[0.22em] text-mist/62">
                        or continue with email
                      </span>
                      <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]" />
                    </div>

                    {/* Form */}
                    <form onSubmit={onSubmit} className="space-y-5" noValidate>
                      <AnimatePresence>
                        {mode === 'signup' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-mist/78">
                              Full name
                            </label>
                            <div className="relative">
                              <User className="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-mist/62" />
                              <input
                                value={name}
                                onChange={(e) => {
                                  setName(e.target.value)
                                  setErrors((p) => ({ ...p, name: undefined }))
                                }}
                                placeholder="Alex Morgan"
                                className={`w-full rounded-2xl border bg-white/[0.042] py-3.5 pl-11 pr-4 text-[12.5px] text-white placeholder:text-mist/38 outline-none transition-all focus:border-nova-400/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.13)] ${
                                  errors.name ? 'border-rose-400/52' : 'border-white/[0.095]'
                                }`}
                              />
                            </div>
                            {errors.name && (
                              <p className="mt-1.5 text-[9px] text-rose-300">{errors.name}</p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-mist/78">
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-mist/62" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              setErrors((p) => ({ ...p, email: undefined }))
                            }}
                            placeholder="you@school.edu"
                            className={`w-full rounded-2xl border bg-white/[0.042] py-3.5 pl-11 pr-4 text-[12.5px] text-white placeholder:text-mist/38 outline-none transition-all focus:border-nova-400/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.13)] ${
                              errors.email ? 'border-rose-400/52' : 'border-white/[0.095]'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1.5 text-[9px] text-rose-300">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-[9px] font-semibold uppercase tracking-[0.16em] text-mist/78">
                            Password
                          </label>
                          {mode === 'signin' && (
                            <button
                              type="button"
                              className="text-[8.5px] font-medium text-nova-200 transition-colors hover:text-white"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-mist/62" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              setErrors((p) => ({ ...p, password: undefined }))
                            }}
                            placeholder="••••••••"
                            className={`w-full rounded-2xl border bg-white/[0.042] py-3.5 pl-11 pr-12 text-[12.5px] text-white placeholder:text-mist/38 outline-none transition-all focus:border-nova-400/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.13)] ${
                              errors.password ? 'border-rose-400/52' : 'border-white/[0.095]'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist/62 transition-colors hover:text-white"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? (
                              <EyeOff className="h-[15px] w-[15px]" />
                            ) : (
                              <Eye className="h-[15px] w-[15px]" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="mt-1.5 text-[9px] text-rose-300">{errors.password}</p>
                        )}
                        {mode === 'signup' && password.length > 0 && (
                          <PasswordStrength password={password} />
                        )}
                      </div>

                      {mode === 'signup' && (
                        <label className="flex cursor-pointer items-start gap-3">
                          <span className="mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] border border-nova-300/42 bg-nova-400/18">
                            <Check className="h-2.5 w-2.5 text-nova-100" strokeWidth={3.2} />
                          </span>
                          <span className="text-[8.5px] leading-[1.72] text-mist">
                            I agree to the{' '}
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="text-nova-200 underline underline-offset-2 hover:text-white"
                            >
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="text-nova-200 underline underline-offset-2 hover:text-white"
                            >
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-shine group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[linear-gradient(120deg,#4f57f0_0%,#7c4dff_48%,#3f8cff_100%)] bg-[length:170%_100%] py-4 text-[12.5px] font-semibold text-white shadow-[0_18px_42px_-16px_rgba(99,102,241,0.95)] transition-all hover:bg-[position:100%_0] hover:shadow-[0_22px_52px_-14px_rgba(124,77,255,1)] disabled:opacity-72"
                      >
                        {submitting ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="h-4 w-4 rounded-full border-2 border-white/32 border-t-white"
                            />
                            {mode === 'signup' ? 'Creating account…' : 'Signing in…'}
                          </>
                        ) : (
                          <>
                            {mode === 'signup' ? (
                              <Sparkles className="h-[15px] w-[15px]" />
                            ) : (
                              <Zap className="h-[15px] w-[15px]" />
                            )}
                            {mode === 'signup' ? 'Create free account' : 'Sign in to EduNova'}
                            <ArrowRight className="h-[15px] w-[15px] transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="mt-7 text-center text-[9.5px] text-mist">
                      {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                      <button
                        onClick={() => {
                          setMode(mode === 'signup' ? 'signin' : 'signup')
                          setErrors({})
                        }}
                        className="font-semibold text-nova-200 underline underline-offset-[3px] transition-colors hover:text-white"
                      >
                        {mode === 'signup' ? 'Sign in instead' : 'Create one free'}
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ============ VISUAL SIDE ============ */}
          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.1]"
          >
            <img
              src="/images/aurora-band.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(9,12,32,0.9),rgba(28,20,72,0.72),rgba(9,12,32,0.92))]" />
            <div className="noise-layer absolute inset-0 opacity-[0.05]" />

            <div className="relative flex h-full flex-col justify-between p-8 sm:p-10">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.07] px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.19em] text-white/78 backdrop-blur-md">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  Trusted by 240,000+ learners
                </span>

                <h2 className="mt-8 text-balance text-[clamp(1.85rem,3.6vw,2.65rem)] font-semibold leading-[1.1] text-white">
                  The learning platform that grows{' '}
                  <span className="gradient-text-warm">with you</span>
                </h2>

                <p className="mt-5 max-w-md text-[12.5px] leading-[1.86] text-white/68">
                  Everything in one calm workspace: an AI tutor that adapts, quizzes that challenge
                  you at the right level, and analytics that tell the honest truth about your
                  progress.
                </p>
              </div>

              {/* Feature chips */}
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: <Sparkles className="h-3.5 w-3.5" />,
                    title: 'Adaptive AI tutor',
                    desc: 'Explanations tuned to your level',
                  },
                  {
                    icon: <BookOpen className="h-3.5 w-3.5" />,
                    title: 'Structured library',
                    desc: '340+ lessons across 12 tracks',
                  },
                  {
                    icon: <GraduationCap className="h-3.5 w-3.5" />,
                    title: 'Guided roadmaps',
                    desc: 'Always know what to learn next',
                  },
                  {
                    icon: <ShieldCheck className="h-3.5 w-3.5" />,
                    title: 'Private by design',
                    desc: 'Your data stays yours, always',
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="flex items-start gap-3 rounded-[15px] border border-white/[0.1] bg-white/[0.055] p-3.5 backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/[0.19] hover:bg-white/[0.085]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.13] bg-white/[0.1] text-white">
                      {f.icon}
                    </span>
                    <div>
                      <p className="text-[10px] font-semibold leading-none text-white">
                        {f.title}
                      </p>
                      <p className="mt-1.5 text-[8px] leading-[1.62] text-white/58">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="mt-9 rounded-[18px] border border-white/[0.12] bg-white/[0.07] p-5 backdrop-blur-xl">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="mt-3.5 text-[11px] leading-[1.82] text-white/82">
                  &ldquo;EduNova is the first learning tool that actually feels like it understands
                  how I think. My grades improved within two months — and studying stopped feeling
                  like a chore.&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    src="/images/avatar-1.png"
                    alt="Amara Osei"
                    width={34}
                    height={34}
                    className="h-[34px] w-[34px] rounded-full object-cover ring-2 ring-white/22"
                  />
                  <div>
                    <p className="text-[9.5px] font-semibold leading-none text-white">
                      Amara Osei
                    </p>
                    <p className="mt-1 text-[8px] text-white/58">Medical student · Year 3</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-300/24 bg-emerald-300/12 px-2.5 py-1">
                    <AtSign className="h-2 w-2 text-emerald-200" />
                    <p className="text-[7px] font-medium text-emerald-100">Verified learner</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-9 gap-y-4 pb-6"
        >
          {[
            '256-bit encryption',
            'SOC 2 Type II',
            'GDPR compliant',
            '99.98% uptime',
            'No ads, ever',
          ].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.15em] text-mist/62"
            >
              <ShieldCheck className="h-3 w-3 text-nova-300/72" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
