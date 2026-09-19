import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUp,
  Bookmark,
  Bot,
  ChevronDown,
  Copy,
  Download,
  Info,
  Lightbulb,
  Menu,
  MessageSquarePlus,
  Mic,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { container } from '../components/ui'
import { generateResponse, quickTopics, suggestions } from '../lib/ai'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
}

const nowTime = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: `## Welcome to EduNova AI 👋

I'm **Nova**, your personal tutor. I can:

- 📖 **Explain concepts** at exactly your level
- 🧮 **Solve problems** step by step
- 💻 **Write and review code** in any major language
- 🗓️ **Build study plans** grounded in how memory actually works

What would you like to explore first?`,
    time: nowTime(),
  },
]

const history = [
  { title: 'Gradient descent explained', meta: 'Machine Learning · 12 messages', active: true },
  { title: 'Photosynthesis — light reactions', meta: 'Biology · 8 messages', active: false },
  { title: 'Two-sum algorithm review', meta: 'Python · 15 messages', active: false },
  { title: 'Essay structure feedback', meta: 'Writing · 6 messages', active: false },
  { title: 'Newton\'s laws problem set', meta: 'Physics · 21 messages', active: false },
  { title: 'Spanish verb conjugations', meta: 'Languages · 9 messages', active: false },
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-[linear-gradient(135deg,#7dd3fc,#a78bfa)]"
          animate={{ opacity: [0.28, 1, 0.28], y: [0, -5, 0] }}
          transition={{ duration: 1.15, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  )
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const send = (text: string) => {
    const value = text.trim()
    if (!value || thinking) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: value,
      time: nowTime(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    const reply = generateResponse(value)
    window.setTimeout(
      () => {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: reply,
            time: nowTime(),
          },
        ])
        setThinking(false)
      },
      Math.min(1900, 780 + reply.length * 1.1),
    )
  }

  const copy = (id: string, content: string) => {
    navigator.clipboard?.writeText(content).catch(() => undefined)
    setCopiedId(id)
    window.setTimeout(() => setCopiedId(null), 1800)
  }

  return (
    <div className="relative pt-24 sm:pt-28">
      <div className={container}>
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-nova-300/25 bg-nova-400/[0.1] px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.17em] text-nova-200">
              <Zap className="h-3 w-3" />
              Nova 2.0 · Online
            </div>
            <h1 className="mt-4 text-[clamp(1.95rem,4.6vw,2.85rem)] font-semibold leading-[1.06]">
              AI Chat <span className="gradient-text">Tutor</span>
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-mist">
              A calm, focused space to think out loud, ask follow-ups, and get explanations that
              actually match where you are.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-medium text-mist transition-all hover:border-white/20 hover:text-white">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-medium text-mist transition-all hover:border-white/20 hover:text-white">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              onClick={() => {
                setMessages(initialMessages)
                setInput('')
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,#4f57f0,#7c4dff_52%,#3f8cff)] px-4 py-2.5 text-[12px] font-semibold text-white shadow-[0_14px_32px_-12px_rgba(99,102,241,0.8)] transition-transform hover:-translate-y-0.5"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              New chat
            </button>
          </div>
        </motion.div>

        {/* ============ Workspace ============ */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass-deep flex h-[calc(100dvh-430px)] min-h-[540px] overflow-hidden rounded-[26px]"
        >
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 z-30 bg-black/55 lg:hidden"
              />
            )}
          </AnimatePresence>

          <aside
            className={`${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col border-r border-white/[0.08] bg-[rgba(11,15,32,0.96)] backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:bg-transparent`}
          >
            <div className="flex items-center justify-between gap-2 p-4">
              <button
                onClick={() => setMessages(initialMessages)}
                className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-white/[0.1]"
              >
                <Plus className="h-3.5 w-3.5 text-nova-200" />
                New conversation
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-mist lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mist/60" />
                <input
                  placeholder="Search chats…"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] py-2 pl-9 pr-3 text-[11.5px] text-white placeholder:text-mist/50 outline-none transition-colors focus:border-nova-400/45"
                />
              </div>
            </div>

            <div className="mt-5 flex-1 overflow-y-auto px-3 pb-4">
              <p className="px-2 pb-2 text-[9.5px] font-semibold uppercase tracking-[0.19em] text-mist/55">
                Recent
              </p>
              <ul className="space-y-1">
                {history.map((h, i) => (
                  <li key={h.title}>
                    <button
                      className={`group w-full rounded-xl px-3 py-2.5 text-left transition-colors ${
                        i === 0
                          ? 'border border-nova-300/22 bg-nova-400/[0.13]'
                          : 'border border-transparent hover:bg-white/[0.055]'
                      }`}
                    >
                      <p className="truncate text-[11.5px] font-medium text-white/92">{h.title}</p>
                      <p className="mt-1 truncate text-[9.5px] text-mist/70">{h.meta}</p>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="px-2 pb-2 pt-6 text-[9.5px] font-semibold uppercase tracking-[0.19em] text-mist/55">
                Topics
              </p>
              <div className="flex flex-wrap gap-1.5 px-1">
                {quickTopics.map((t) => (
                  <button
                    key={t}
                    onClick={() => send(`Help me learn more about ${t.toLowerCase()}`)}
                    className="rounded-full border border-white/[0.09] bg-white/[0.035] px-2.5 py-1.5 text-[9.5px] text-mist transition-colors hover:border-nova-300/35 hover:text-white"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Model card */}
            <div className="m-3 rounded-2xl border border-nova-300/18 bg-[linear-gradient(150deg,rgba(99,102,241,0.2),rgba(139,92,246,0.09))] p-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4f57f0,#a78bfa)]">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </span>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-white">Nova 2.0 Pro</p>
                  <p className="text-[9px] text-mist/80">Extended reasoning enabled</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-mist" />
              </div>
            </div>
          </aside>

          {/* Main chat column */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Chat top bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3.5 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-mist transition-colors hover:text-white lg:hidden"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-nova-300/25 bg-nova-400/[0.15]">
                    <Bot className="h-4 w-4 text-nova-200" />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0b0f20] bg-emerald-400" />
                  </span>
                  <div>
                    <p className="text-[12.5px] font-semibold leading-none text-white">
                      Nova Tutor
                    </p>
                    <p className="mt-1 text-[9.5px] text-mist/75">
                      Responds in seconds · Context aware
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-mist transition-colors hover:bg-white/[0.08] hover:text-white">
                  <Bookmark className="h-3.5 w-3.5" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-mist transition-colors hover:bg-white/[0.08] hover:text-white">
                  <Settings2 className="h-3.5 w-3.5" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-mist transition-colors hover:bg-white/[0.08] hover:text-white">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
              <div className="mx-auto max-w-[760px] space-y-7">
                {messages.map((m) =>
                  m.role === 'user' ? (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.36 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[82%]">
                        <div className="rounded-[20px] rounded-br-[7px] border border-nova-300/22 bg-[linear-gradient(135deg,rgba(79,87,240,0.42),rgba(124,77,255,0.28))] px-5 py-3.5 text-[13px] leading-[1.72] text-white shadow-[0_18px_40px_-22px_rgba(99,102,241,0.9)]">
                          {m.content}
                        </div>
                        <p className="mt-1.5 pr-1 text-right text-[9.5px] text-mist/55">
                          You · {m.time}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42 }}
                      className="flex gap-3.5"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-nova-300/25 bg-[linear-gradient(140deg,#4f57f0,#8b5cf6)] shadow-[0_12px_28px_-12px_rgba(99,102,241,0.9)]">
                        <Sparkles className="h-4 w-4 text-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="rounded-[20px] rounded-tl-[7px] border border-white/[0.09] bg-white/[0.045] px-5 py-4">
                          <Markdown content={m.content} />
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-1">
                          {[
                            {
                              icon: ThumbsUp,
                              label: 'Good',
                              onClick: () => undefined,
                            },
                            {
                              icon: ThumbsDown,
                              label: 'Improve',
                              onClick: () => undefined,
                            },
                            {
                              icon: Copy,
                              label: copiedId === m.id ? 'Copied!' : 'Copy',
                              onClick: () => copy(m.id, m.content),
                            },
                            {
                              icon: RefreshCw,
                              label: 'Regenerate',
                              onClick: () => send('Can you explain that a bit differently?'),
                            },
                          ].map(({ icon: Icon, label, onClick }) => (
                            <button
                              key={label}
                              onClick={onClick}
                              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9.5px] text-mist/70 transition-colors hover:bg-white/[0.07] hover:text-white"
                            >
                              <Icon className="h-3 w-3" />
                              {label}
                            </button>
                          ))}
                          <span className="ml-1 text-[9.5px] text-mist/45">{m.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ),
                )}

                {thinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3.5"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-nova-300/25 bg-[linear-gradient(140deg,#4f57f0,#8b5cf6)]">
                      <Sparkles className="h-4 w-4 text-white" />
                    </span>
                    <div className="rounded-[20px] rounded-tl-[7px] border border-white/[0.09] bg-white/[0.045] px-5 py-4">
                      <TypingIndicator />
                      <p className="mt-1.5 text-[10px] text-mist/60">Nova is thinking…</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Suggestions + Input */}
            <div className="border-t border-white/[0.07] px-4 pb-5 pt-4 sm:px-8">
              <div className="mx-auto max-w-[760px]">
                <div className="flex gap-2 overflow-x-auto pb-3 [scrollbar-width:none]">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => send(s.prompt)}
                      className="group flex shrink-0 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-3.5 py-2 text-[10.5px] text-mist transition-all hover:-translate-y-0.5 hover:border-nova-300/35 hover:bg-nova-400/[0.1] hover:text-white"
                    >
                      <span className="text-[12px]">{s.icon}</span>
                      {s.title}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    send(input)
                  }}
                  className="relative"
                >
                  <div className="flex items-end gap-2 rounded-[20px] border border-white/[0.11] bg-white/[0.05] p-2.5 transition-all focus-within:border-nova-400/50 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.13)]">
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-mist transition-colors hover:bg-white/[0.09] hover:text-white"
                      aria-label="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          send(input)
                        }
                      }}
                      rows={1}
                      placeholder="Ask Nova anything…  (Shift + Enter for a new line)"
                      className="max-h-32 min-h-[38px] flex-1 resize-none bg-transparent py-2 text-[13px] leading-[1.6] text-white placeholder:text-mist/50 outline-none"
                    />
                    <button
                      type="button"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-mist transition-colors hover:bg-white/[0.09] hover:text-white"
                      aria-label="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                    <button
                      type="submit"
                      disabled={!input.trim() || thinking}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4f57f0,#7c4dff)] text-white shadow-[0_12px_26px_-10px_rgba(99,102,241,0.95)] transition-all hover:scale-105 disabled:opacity-35 disabled:hover:scale-100"
                      aria-label="Send message"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-mist/55">
                  <span className="inline-flex items-center gap-1.5">
                    <Info className="h-3 w-3" />
                    Nova can make mistakes — double-check anything important.
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lightbulb className="h-3 w-3 text-nova-300" />
                    <Link to="/notes" className="transition-colors hover:text-white">
                      Save this answer to Notes →
                    </Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom feature strip */}
        <div className="mt-8 grid gap-4 pb-6 sm:grid-cols-3">
          {[
            {
              icon: <Zap className="h-4 w-4" />,
              title: 'Instant explanations',
              desc: 'Answers in seconds, tuned to the level you choose.',
            },
            {
              icon: <Lightbulb className="h-4 w-4" />,
              title: 'Follow-up aware',
              desc: 'Nova remembers the thread, so you can keep digging.',
            },
            {
              icon: <Bookmark className="h-4 w-4" />,
              title: 'Save anything',
              desc: 'Turn any answer into a note, flashcard or quiz.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass-soft flex items-start gap-3.5 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:border-white/[0.15]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-nova-300/22 bg-nova-400/[0.13] text-nova-200">
                {f.icon}
              </span>
              <div>
                <p className="text-[12.5px] font-semibold text-white">{f.title}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-mist">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
