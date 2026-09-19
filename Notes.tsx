import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen,
  Check,
  Clock,
  Download,
  Hash,
  Layers,
  PenLine,
  Pin,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Type,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  container,
  fadeUp,
  GlassCard,
  GradientText,
  ProgressBar,
  stagger,
} from '../components/ui'

type Note = {
  id: string
  title: string
  body: string
  tag: string
  color: string
  pinned: boolean
  updatedAt: number
}

const STORAGE_KEY = 'edunova-notes-v1'

const seedNotes: Note[] = [
  {
    id: 'n1',
    title: 'Gradient descent — intuition',
    body: `Gradient descent is how a model finds the bottom of a loss landscape.

Key ideas:
- The gradient tells you the direction of steepest ascent
- Move in the opposite direction to reduce the error
- The learning rate controls how big each step is

Too large → you overshoot the minimum.
Too small → training takes forever.

The update rule:
  θ := θ − α · ∇J(θ)

Variants worth knowing: SGD, mini-batch, Adam, RMSProp.`,
    tag: 'Machine Learning',
    color: '#6d7cff',
    pinned: true,
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'n2',
    title: 'Spaced repetition schedule',
    body: `Review intervals that actually work:
Day 1 → Day 3 → Day 7 → Day 21 → Day 60

Rules:
1. Always recall from memory before checking
2. If you struggle, shorten the next interval
3. If it feels easy, stretch it out

Best paired with active recall and interleaving.`,
    tag: 'Study Skills',
    color: '#22d3ee',
    pinned: true,
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'n3',
    title: 'Calculus — chain rule',
    body: `If y = f(g(x)), then dy/dx = f'(g(x)) · g'(x).

Example:
  d/dx (3x² + 1)⁵
  = 5(3x² + 1)⁴ · 6x
  = 30x(3x² + 1)⁴

Think of it as peeling an onion — differentiate the outside, then multiply by the derivative of the inside.`,
    tag: 'Mathematics',
    color: '#a78bfa',
    pinned: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 52,
  },
  {
    id: 'n4',
    title: 'Essay structure checklist',
    body: `Hook → Context → Thesis → Body → So-what

Per paragraph:
- Claim (one idea only)
- Evidence (specific, cited)
- Analysis (why it matters)
- Link back to the thesis

Editing passes:
1. Cut the first sentence
2. Replace abstract nouns with verbs
3. Read aloud for rhythm`,
    tag: 'Writing',
    color: '#f472b6',
    pinned: false,
    updatedAt: Date.now() - 1000 * 60 * 60 * 96,
  },
]

const accentColors = [
  '#6d7cff',
  '#22d3ee',
  '#a78bfa',
  '#f472b6',
  '#34d399',
  '#fbbf24',
  '#f87171',
]

const tagOptions = [
  'Machine Learning',
  'Mathematics',
  'Study Skills',
  'Writing',
  'Physics',
  'Programming',
  'General',
]

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Note[]
        if (Array.isArray(parsed) && parsed.length) return parsed
      }
    } catch {
      /* ignore */
    }
    return seedNotes
  })
  const [activeId, setActiveId] = useState<string>(notes[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {
      /* ignore */
    }
  }, [notes])

  const active = notes.find((n) => n.id === activeId) ?? notes[0]

  const filtered = useMemo(() => {
    return notes
      .filter((n) => {
        const matchesQuery =
          !query.trim() ||
          `${n.title} ${n.body} ${n.tag}`.toLowerCase().includes(query.toLowerCase())
        const matchesTag = activeTag === 'All' || n.tag === activeTag
        return matchesQuery && matchesTag
      })
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt)
  }, [notes, query, activeTag])

  const updateActive = (patch: Partial<Note>) => {
    if (!active) return
    setNotes((prev) =>
      prev.map((n) => (n.id === active.id ? { ...n, ...patch, updatedAt: Date.now() } : n)),
    )
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1400)
  }

  const addNote = () => {
    const newNote: Note = {
      id: `n-${Date.now()}`,
      title: 'Untitled note',
      body: '',
      tag: 'General',
      color: accentColors[Math.floor(Math.random() * accentColors.length)],
      pinned: false,
      updatedAt: Date.now(),
    }
    setNotes((prev) => [newNote, ...prev])
    setActiveId(newNote.id)
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id)
      if (id === activeId) setActiveId(next[0]?.id ?? '')
      return next
    })
  }

  const wordCount = active ? active.body.trim().split(/\s+/).filter(Boolean).length : 0
  const readMinutes = Math.max(1, Math.round(wordCount / 220))

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className={container}>
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.19em] text-nova-200">
              <PenLine className="h-3 w-3" />
              Smart notes workspace
            </span>
            <h1 className="mt-6 text-balance text-[clamp(2.15rem,5.2vw,3.55rem)] font-semibold leading-[1.05]">
              Think clearly. <GradientText>Remember more.</GradientText>
            </h1>
            <p className="mt-5 text-pretty text-[14.5px] leading-[1.8] text-mist">
              A distraction-free editor with instant search, colour-coded topics and automatic
              saving — so your thinking is always one keystroke away.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button onClick={addNote}>
              <Plus className="h-4 w-4" />
              New note
            </Button>
            <Link to="/chat">
              <Button variant="ghost">
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Layers className="h-4 w-4" />,
              label: 'Total notes',
              value: notes.length,
              sub: 'across all topics',
            },
            {
              icon: <Type className="h-4 w-4" />,
              label: 'Words written',
              value: notes.reduce(
                (sum, n) => sum + n.body.trim().split(/\s+/).filter(Boolean).length,
                0,
              ),
              sub: 'and counting',
            },
            {
              icon: <Pin className="h-4 w-4" />,
              label: 'Pinned',
              value: notes.filter((n) => n.pinned).length,
              sub: 'quick access',
            },
            {
              icon: <Tag className="h-4 w-4" />,
              label: 'Topics',
              value: new Set(notes.map((n) => n.tag)).size,
              sub: 'organised',
            },
          ].map((s) => (
            <GlassCard key={s.label} className="p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-nova-300/22 bg-nova-400/[0.13] text-nova-200">
                  {s.icon}
                </span>
                <span className="text-[22px] font-semibold leading-none text-white">{s.value}</span>
              </div>
              <p className="mt-3.5 text-[11px] font-medium uppercase tracking-[0.13em] text-mist">
                {s.label}
              </p>
              <p className="mt-1 text-[10px] text-mist/70">{s.sub}</p>
            </GlassCard>
          ))}
        </div>

        {/* ============ Editor workspace ============ */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="glass flex max-h-[640px] flex-col overflow-hidden rounded-[22px]"
          >
            <div className="border-b border-white/[0.08] p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mist/65" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notes…"
                  className="w-full rounded-xl border border-white/[0.09] bg-white/[0.04] py-2.5 pl-9 pr-3 text-[11.5px] text-white placeholder:text-mist/50 outline-none transition-colors focus:border-nova-400/50"
                />
              </div>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {['All', ...Array.from(new Set(notes.map((n) => n.tag)))].slice(0, 5).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTag(t)}
                    className={`rounded-full border px-2.5 py-1.5 text-[9.5px] font-medium transition-colors ${
                      activeTag === t
                        ? 'border-nova-300/42 bg-nova-400/[0.18] text-white'
                        : 'border-white/[0.09] text-mist hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {filtered.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <BookOpen className="mx-auto h-7 w-7 text-mist/50" />
                  <p className="mt-3 text-[11px] text-mist">No notes match your search</p>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {filtered.map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => setActiveId(n.id)}
                        className={`group w-full rounded-[14px] border p-3 text-left transition-all ${
                          n.id === active?.id
                            ? 'border-nova-300/32 bg-nova-400/[0.13]'
                            : 'border-transparent hover:border-white/[0.09] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className="mt-1 h-2 w-2 shrink-0 rounded-full"
                            style={{ background: n.color }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium text-white/92">
                              {n.title || 'Untitled'}
                            </p>
                            <p className="mt-1 truncate text-[9px] text-mist/70">
                              {n.body.split('\n')[0] || 'Empty note'}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[8.5px] uppercase tracking-[0.11em] text-mist/55">
                                {n.tag}
                              </span>
                              <span className="flex items-center gap-1 text-[8.5px] text-mist/50">
                                <Clock className="h-2 w-2" />
                                {timeAgo(n.updatedAt)}
                              </span>
                              {n.pinned && <Pin className="h-2 w-2 text-nova-300" />}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNote(n.id)
                            }}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Delete note"
                          >
                            <Trash2 className="h-3 w-3 text-mist/70 hover:text-rose-300" />
                          </button>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={addNote}
              className="flex items-center justify-center gap-2 border-t border-white/[0.08] py-3.5 text-[11px] font-medium text-mist transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Add a note
            </button>
          </motion.div>

          {/* Editor */}
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.36 }}
                className="glass flex min-h-[640px] flex-col overflow-hidden rounded-[22px]"
              >
                {/* Editor toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5">
                      {['B', 'I', 'U'].map((f) => (
                        <button
                          key={f}
                          className={`h-6 w-6 rounded text-[10px] transition-colors hover:bg-white/10 ${
                            f === 'B' ? 'font-bold text-white' : 'text-mist'
                          } ${f === 'I' ? 'italic' : ''} ${f === 'U' ? 'underline' : ''}`}
                        >
                          {f}
                        </button>
                      ))}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5">
                      {['H1', 'H2', '•'].map((f) => (
                        <button
                          key={f}
                          className="h-6 rounded px-1.5 text-[9.5px] text-mist transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {f}
                        </button>
                      ))}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <AnimatePresence>
                      {saved && (
                        <motion.span
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-[9.5px] font-medium text-emerald-300"
                        >
                          <Check className="h-2.5 w-2.5" />
                          Saved
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => updateActive({ pinned: !active.pinned })}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                        active.pinned
                          ? 'border-nova-300/38 bg-nova-400/[0.18] text-nova-200'
                          : 'border-white/[0.09] text-mist hover:text-white'
                      }`}
                      aria-label="Pin note"
                    >
                      <Pin className="h-3.5 w-3.5" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.09] text-mist transition-colors hover:text-white">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Accent + tag row */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-mist/65">
                      Accent
                    </span>
                    {accentColors.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateActive({ color: c })}
                        className={`h-5 w-5 rounded-full transition-transform hover:scale-115 ${
                          active.color === c ? 'ring-2 ring-white/55 ring-offset-2 ring-offset-[#0b0f20]' : ''
                        }`}
                        style={{ background: c }}
                        aria-label={`Set accent ${c}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3 text-mist/60" />
                    <select
                      value={active.tag}
                      onChange={(e) => updateActive({ tag: e.target.value })}
                      className="rounded-lg border border-white/[0.09] bg-white/[0.035] px-2.5 py-1.5 text-[10px] text-white outline-none"
                    >
                      {tagOptions.map((t) => (
                        <option key={t} value={t} className="bg-[#0b1020]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Writing area */}
                <div className="flex-1 px-6 py-7 sm:px-9">
                  <input
                    value={active.title}
                    onChange={(e) => updateActive({ title: e.target.value })}
                    placeholder="Note title…"
                    className="w-full bg-transparent font-display text-[clamp(1.55rem,3.4vw,2.15rem)] font-semibold leading-tight text-white placeholder:text-white/22 outline-none"
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9.5px] text-mist/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-2.5 w-2.5" />
                      Updated {timeAgo(active.updatedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Type className="h-2.5 w-2.5" />
                      {wordCount} words
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="h-2.5 w-2.5" />
                      {readMinutes} min read
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
                      style={{ background: `${active.color}22`, color: active.color }}
                    >
                      <Star className="h-2 w-2" />
                      {active.tag}
                    </span>
                  </div>

                  <div
                    className="mt-6 h-px w-full"
                    style={{
                      background: `linear-gradient(90deg, ${active.color}66, transparent)`,
                    }}
                  />

                  <textarea
                    value={active.body}
                    onChange={(e) => updateActive({ body: e.target.value })}
                    placeholder="Start writing your thoughts…"
                    className="mt-7 min-h-[380px] w-full resize-none bg-transparent text-[13.5px] leading-[1.95] text-mist-bright placeholder:text-mist/32 outline-none"
                    spellCheck={false}
                  />
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[140px]">
                      <ProgressBar value={Math.min(100, (wordCount / 400) * 100)} tone="cool" />
                    </div>
                    <span className="text-[9.5px] text-mist/70">
                      {Math.min(100, Math.round((wordCount / 400) * 100))}% of daily goal
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Badge tone="info">
                      <Sparkles className="h-2.5 w-2.5" />
                      Auto-saved locally
                    </Badge>
                    <Link to="/quiz">
                      <Button size="sm" variant="ghost">
                        Turn into quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass flex min-h-[520px] flex-col items-center justify-center rounded-[22px] px-8 text-center"
              >
                <PenLine className="h-10 w-10 text-mist/50" />
                <h3 className="mt-5 text-[17px] font-semibold">No note selected</h3>
                <p className="mt-2.5 max-w-sm text-[12px] leading-relaxed text-mist">
                  Create a new note to start writing, or select one from the sidebar.
                </p>
                <Button className="mt-6" onClick={addNote}>
                  <Plus className="h-4 w-4" />
                  New note
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips */}
        <div className="mt-12 grid gap-5 pb-8 sm:grid-cols-3">
          {[
            {
              icon: <Sparkles className="h-4 w-4" />,
              title: 'Write to think',
              desc: 'The act of writing clarifies thought more than re-reading ever could.',
            },
            {
              icon: <Hash className="h-4 w-4" />,
              title: 'Tag ruthlessly',
              desc: 'Two or three tags per topic beats twenty. Retrieval loves simplicity.',
            },
            {
              icon: <Star className="h-4 w-4" />,
              title: 'Review weekly',
              desc: 'Notes compound in value only when they are revisited and refined.',
            },
          ].map((t) => (
            <GlassCard key={t.title} className="p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-nova-300/22 bg-nova-400/[0.13] text-nova-200">
                {t.icon}
              </span>
              <h3 className="mt-4 text-[13px] font-semibold">{t.title}</h3>
              <p className="mt-2 text-[11px] leading-[1.75] text-mist">{t.desc}</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex justify-center pb-4">
          <Button variant="ghost" onClick={() => setNotes(seedNotes)}>
            <X className="h-3.5 w-3.5" />
            Reset demo notes
          </Button>
        </div>
      </div>
    </div>
  )
}
