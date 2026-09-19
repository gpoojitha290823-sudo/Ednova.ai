import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Twitter,
  Youtube,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { container, Divider, fadeUp, viewportOnce } from './ui'

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'AI Chat Tutor', to: '/chat' },
      { label: 'Study Materials', to: '/materials' },
      { label: 'Quiz Engine', to: '/quiz' },
      { label: 'Smart Notes', to: '/notes' },
      { label: 'Study Planner', to: '/planner' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Progress Analytics', to: '/progress' },
      { label: 'Coding Tutor', to: '/coding' },
      { label: 'Sign Up', to: '/auth' },
      { label: 'Sign In', to: '/auth' },
      { label: 'Home', to: '/' },
    ],
  },
  {
    title: 'Subjects',
    links: [
      { label: 'Mathematics', to: '/materials' },
      { label: 'Physics', to: '/materials' },
      { label: 'Computer Science', to: '/coding' },
      { label: 'Languages', to: '/materials' },
      { label: 'History', to: '/materials' },
    ],
  },
]

const socials = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Github, label: 'GitHub' },
  { icon: Linkedin, label: 'LinkedIn' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/[0.07] pt-16">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[880px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_66%)] blur-[90px]" />

      <div className={container}>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="glass relative overflow-hidden rounded-[28px] p-8 sm:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(129,140,248,0.18),transparent_52%)]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h3 className="text-balance text-[clamp(1.55rem,3.2vw,2.15rem)] font-semibold leading-tight">
                Get the weekly <span className="gradient-text">learning edge</span>
              </h3>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-mist">
                Study strategies, AI workflows and new EduNova features — distilled into one
                short email every Sunday. No noise, unsubscribe anytime.
              </p>
            </div>

            <form onSubmit={onSubmit} className="w-full">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-emerald-200"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-[14px] font-medium">
                    You&apos;re in! Check your inbox for a welcome note.
                  </span>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist/70" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@school.edu"
                      className="w-full rounded-full border border-white/12 bg-white/[0.055] py-3.5 pl-11 pr-4 text-[14px] text-white placeholder:text-mist/50 outline-none transition-all focus:border-nova-400/55 focus:bg-white/[0.09] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-shine inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[linear-gradient(120deg,#4f57f0,#7c4dff_52%,#3f8cff)] px-6 py-3.5 text-[13.5px] font-semibold text-white shadow-[0_16px_38px_-14px_rgba(99,102,241,0.8)] transition-transform hover:-translate-y-0.5"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-mist">
              EduNova AI blends adaptive tutoring, structured practice and calm design to help
              you learn deeply — not just memorise.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="glass-soft flex h-9 w-9 items-center justify-center rounded-xl text-mist transition-all duration-300 hover:-translate-y-0.5 hover:border-nova-300/35 hover:text-white"
                >
                  <Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.19em] text-white/85">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1.5 text-[13.5px] text-mist transition-colors duration-300 hover:text-white"
                    >
                      <span className="h-px w-0 bg-nova-300 transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="mt-14" />

        <div className="flex flex-col items-center justify-between gap-5 py-8 text-[12px] text-mist/70 sm:flex-row">
          <p>© {new Date().getFullYear()} EduNova AI. Crafted for curious minds.</p>
          <div className="flex items-center gap-2 text-mist/70">
            <MapPin className="h-3.5 w-3.5 text-nova-300" />
            <span>Remote-first · Built for learners worldwide</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-white">
              Terms
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-white">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
