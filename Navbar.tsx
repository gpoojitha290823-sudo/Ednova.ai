import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { Button } from './ui'

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/chat', label: 'AI Chat' },
  { to: '/materials', label: 'Materials' },
  { to: '/quiz', label: 'Quiz' },
  { to: '/notes', label: 'Notes' },
  { to: '/planner', label: 'Planner' },
  { to: '/progress', label: 'Progress' },
  { to: '/coding', label: 'Coding' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/[0.08] bg-[rgba(7,9,22,0.72)] shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8 lg:px-10">
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `relative rounded-full px-3.5 py-2 text-[12.5px] font-medium tracking-[-0.005em] transition-all duration-300 ${
                      isActive
                        ? 'text-white'
                        : 'text-mist/85 hover:bg-white/[0.07] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full border border-nova-300/25 bg-nova-400/[0.14]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 xl:flex">
            <Link
              to="/auth"
              className="rounded-full px-4 py-2.5 text-[12.5px] font-medium text-mist transition-colors duration-300 hover:bg-white/[0.07] hover:text-white"
            >
              Sign in
            </Link>
            <Link to="/chat" className="inline-flex">
              <Button size="sm" className="!px-5 !py-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                Start free
              </Button>
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="glass-soft flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 bg-[rgba(5,6,15,0.82)] backdrop-blur-2xl xl:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="glass-deep absolute inset-x-4 top-[76px] max-h-[calc(100dvh-110px)] overflow-y-auto rounded-[26px] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045 }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors ${
                          isActive
                            ? 'bg-nova-400/[0.18] text-white'
                            : 'text-mist hover:bg-white/[0.07] hover:text-white'
                        }`
                      }
                    >
                      {item.label}
                      <span className="h-1.5 w-1.5 rounded-full bg-nova-300/50" />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2.5 border-t border-white/10 pt-4">
                <Link to="/auth" className="w-full">
                  <Button variant="ghost" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link to="/chat" className="w-full">
                  <Button className="w-full">
                    <Sparkles className="h-4 w-4" />
                    Start free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
