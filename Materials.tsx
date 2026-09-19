import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Clock,
  Download,
  Filter,
  GraduationCap,
  Layers,
  Play,
  Search,
  Signal,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Badge,
  Button,
  container,
  Counter,
  fadeUp,
  GlassCard,
  GradientText,
  ProgressBar,
  SectionHeading,
  stagger,
  viewportOnce,
} from '../components/ui'

type Material = {
  id: string
  title: string
  subject: string
  category: string
  type: 'Course' | 'Video' | 'Notes' | 'Guide'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  lessons: number
  duration: string
  rating: number
  students: number
  gradient: string
  icon: string
  description: string
  featured?: boolean
  image?: string
}

const materials: Material[] = [
  {
    id: 'm1',
    title: 'Machine Learning Foundations',
    subject: 'Artificial Intelligence',
    category: 'Technology',
    type: 'Course',
    level: 'Intermediate',
    lessons: 42,
    duration: '18h 30m',
    rating: 4.9,
    students: 84200,
    gradient: 'linear-gradient(135deg,#4f57f0 0%,#8b5cf6 52%,#c084fc 100%)',
    icon: '🤖',
    description:
      'From linear regression to neural networks — build real intuition for how modern ML actually works.',
    featured: true,
    image: '/images/coding-visual.png',
  },
  {
    id: 'm2',
    title: 'Calculus & Analytical Thinking',
    subject: 'Mathematics',
    category: 'Mathematics',
    type: 'Course',
    level: 'Intermediate',
    lessons: 36,
    duration: '14h 10m',
    rating: 4.8,
    students: 126400,
    gradient: 'linear-gradient(135deg,#0ea5e9 0%,#4f57f0 55%,#7c4dff 100%)',
    icon: '📐',
    description:
      'Limits, derivatives and integrals taught visually — so the formulas finally make sense.',
    featured: true,
    image: '/images/hero-orb.png',
  },
  {
    id: 'm3',
    title: 'The Human Body Systems',
    subject: 'Biology',
    category: 'Science',
    type: 'Video',
    level: 'Beginner',
    lessons: 28,
    duration: '9h 45m',
    rating: 4.7,
    students: 61800,
    gradient: 'linear-gradient(135deg,#10b981 0%,#14b8a6 50%,#22d3ee 100%)',
    icon: '🧬',
    description:
      'An illustrated journey through the circulatory, nervous, immune and endocrine systems.',
  },
  {
    id: 'm4',
    title: 'World History: Turning Points',
    subject: 'History',
    category: 'Humanities',
    type: 'Course',
    level: 'Intermediate',
    lessons: 32,
    duration: '12h 20m',
    rating: 4.8,
    students: 47300,
    gradient: 'linear-gradient(135deg,#f59e0b 0%,#f97316 48%,#ef4444 100%)',
    icon: '🏛️',
    description:
      'Twenty moments that reshaped civilisation — analysed through causes, choices and consequences.',
  },
  {
    id: 'm5',
    title: 'English Writing Mastery',
    subject: 'Languages',
    category: 'Languages',
    type: 'Course',
    level: 'Beginner',
    lessons: 24,
    duration: '8h 05m',
    rating: 4.9,
    students: 92100,
    gradient: 'linear-gradient(135deg,#ec4899 0%,#a855f7 52%,#6366f1 100%)',
    icon: '✍️',
    description:
      'Structure, style and editing techniques that turn flat writing into persuasive prose.',
  },
  {
    id: 'm6',
    title: 'Quantum Physics Primer',
    subject: 'Physics',
    category: 'Science',
    type: 'Guide',
    level: 'Advanced',
    lessons: 18,
    duration: '6h 40m',
    rating: 4.6,
    students: 28400,
    gradient: 'linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)',
    icon: '⚛️',
    description:
      'Wave functions, superposition and entanglement — explained without the usual hand-waving.',
  },
  {
    id: 'm7',
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    category: 'Technology',
    type: 'Course',
    level: 'Intermediate',
    lessons: 48,
    duration: '22h 15m',
    rating: 4.9,
    students: 143600,
    gradient: 'linear-gradient(135deg,#8b5cf6 0%,#6366f1 50%,#22d3ee 100%)',
    icon: '🧮',
    description:
      'Master the patterns behind technical interviews: arrays, trees, graphs, dynamic programming.',
  },
  {
    id: 'm8',
    title: 'Organic Chemistry Essentials',
    subject: 'Chemistry',
    category: 'Science',
    type: 'Notes',
    level: 'Intermediate',
    lessons: 22,
    duration: '7h 30m',
    rating: 4.5,
    students: 39700,
    gradient: 'linear-gradient(135deg,#14b8a6 0%,#22d3ee 48%,#818cf8 100%)',
    icon: '🧪',
    description:
      'Mechanisms, stereochemistry and reaction maps — condensed into clear visual summaries.',
  },
  {
    id: 'm9',
    title: 'Personal Finance Fundamentals',
    subject: 'Business',
    category: 'Business',
    type: 'Course',
    level: 'Beginner',
    lessons: 20,
    duration: '6h 25m',
    rating: 4.7,
    students: 76500,
    gradient: 'linear-gradient(135deg,#fbbf24 0%,#f59e0b 50%,#ea580c 100%)',
    icon: '💰',
    description:
      'Budgeting, investing and compound interest — the practical money skills school never taught.',
  },
  {
    id: 'm10',
    title: 'Spanish for Beginners',
    subject: 'Languages',
    category: 'Languages',
    type: 'Video',
    level: 'Beginner',
    lessons: 30,
    duration: '10h 50m',
    rating: 4.8,
    students: 68900,
    gradient: 'linear-gradient(135deg,#ef4444 0%,#f97316 50%,#fbbf24 100%)',
    icon: '🗣️',
    description:
      'Conversational Spanish built around high-frequency patterns, with native-speaker audio.',
  },
  {
    id: 'm11',
    title: 'Statistics & Probability',
    subject: 'Mathematics',
    category: 'Mathematics',
    type: 'Course',
    level: 'Advanced',
    lessons: 34,
    duration: '13h 40m',
    rating: 4.7,
    students: 54200,
    gradient: 'linear-gradient(135deg,#3b82f6 0%,#6366f1 50%,#a855f7 100%)',
    icon: '📊',
    description:
      'Distributions, hypothesis testing and Bayesian thinking — with real-world datasets.',
  },
  {
    id: 'm12',
    title: 'Design Systems & UI Craft',
    subject: 'Design',
    category: 'Technology',
    type: 'Guide',
    level: 'Intermediate',
    lessons: 16,
    duration: '5h 15m',
    rating: 4.8,
    students: 41200,
    gradient: 'linear-gradient(135deg,#f472b6 0%,#a78bfa 50%,#60a5fa 100%)',
    icon: '🎨',
    description:
      'Typography, colour, spacing and component architecture for interfaces that feel inevitable.',
  },
]

const categories = [
  'All',
  'Mathematics',
  'Science',
  'Technology',
  'Languages',
  'Humanities',
  'Business',
]

const featured = materials.filter((m) => m.featured)

export function Materials() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [levelFilter, setLevelFilter] = useState<string>('All')

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const matchesQuery =
        !query.trim() ||
        `${m.title} ${m.subject} ${m.description}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || m.category === category
      const matchesLevel = levelFilter === 'All' || m.level === levelFilter
      return matchesQuery && matchesCategory && matchesLevel
    })
  }, [query, category, levelFilter])

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className={container}>
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center"
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.19em] text-nova-200">
              <Layers className="h-3 w-3" />
              12 curated tracks · 340+ lessons
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-balance text-[clamp(2.25rem,5.6vw,3.85rem)] font-semibold leading-[1.03]"
          >
            Study materials that <GradientText>respect your time</GradientText>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-[1.8] text-mist sm:text-[16px]"
          >
            Every course is reviewed for clarity, structured for retention, and paired with the
            AI tutor — so you are never stuck alone at step one.
          </motion.p>
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="glass mt-11 rounded-[22px] p-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-mist/65" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, subjects or skills…"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.045] py-3.5 pl-11 pr-10 text-[13.5px] text-white placeholder:text-mist/50 outline-none transition-all focus:border-nova-400/55 focus:bg-white/[0.075] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.13)]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-mist hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
                <SlidersHorizontal className="h-4 w-4 text-mist/70" />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="bg-transparent text-[12px] font-medium text-white outline-none"
                  aria-label="Filter by level"
                >
                  <option className="bg-[#0b1020]" value="All">
                    All levels
                  </option>
                  <option className="bg-[#0b1020]" value="Beginner">
                    Beginner
                  </option>
                  <option className="bg-[#0b1020]" value="Intermediate">
                    Intermediate
                  </option>
                  <option className="bg-[#0b1020]" value="Advanced">
                    Advanced
                  </option>
                </select>
              </div>
              <Button variant="ghost" size="sm" className="!px-4 !py-2.5">
                <Filter className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 text-[11.5px] font-medium transition-all duration-300 ${
                  category === c
                    ? 'border-nova-300/45 bg-[linear-gradient(120deg,rgba(79,87,240,0.32),rgba(124,77,255,0.24))] text-white shadow-[0_12px_28px_-14px_rgba(99,102,241,0.9)]'
                    : 'border-white/[0.09] bg-white/[0.03] text-mist hover:border-white/20 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
            {(category !== 'All' || levelFilter !== 'All' || query) && (
              <button
                onClick={() => {
                  setCategory('All')
                  setLevelFilter('All')
                  setQuery('')
                }}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-medium text-mist/80 transition-colors hover:text-white"
              >
                <X className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* Continue learning */}
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[21px] font-semibold leading-tight">Continue learning</h2>
              <p className="mt-1.5 text-[12.5px] text-mist">
                Pick up exactly where you left off
              </p>
            </div>
            <Link
              to="/progress"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-nova-200 transition-colors hover:text-white"
            >
              View all activity
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                title: 'Machine Learning Foundations',
                lesson: 'Lesson 19 · Neural network basics',
                progress: 64,
                img: '/images/coding-visual.png',
                time: '2h 15m left',
              },
              {
                title: 'Calculus & Analytical Thinking',
                lesson: 'Lesson 12 · Chain rule applications',
                progress: 38,
                img: '/images/hero-orb.png',
                time: '5h 40m left',
              },
              {
                title: 'English Writing Mastery',
                lesson: 'Lesson 7 · Persuasive structure',
                progress: 81,
                img: '/images/aurora-band.png',
                time: '45m left',
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="overflow-hidden">
                  <div className="relative h-[132px] overflow-hidden">
                    <img
                      src={c.img}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,24,0.12),rgba(8,11,24,0.86))]" />
                    <button className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0b1020] shadow-lg transition-transform hover:scale-110">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-[13px] font-semibold leading-snug text-white">{c.title}</p>
                    <p className="mt-1.5 text-[10.5px] text-mist">{c.lesson}</p>
                    <ProgressBar value={c.progress} className="mt-4" />
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-mist/80">{c.progress}% complete</span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-mist/80">
                        <Clock className="h-2.5 w-2.5" />
                        {c.time}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats strip */}
        <div className="glass mt-12 grid gap-8 rounded-[22px] px-8 py-9 sm:grid-cols-4">
          {[
            { value: 340, suffix: '+', label: 'Lessons available' },
            { value: 96, suffix: '%', label: 'Completion satisfaction' },
            { value: 24, suffix: '/7', label: 'Tutor availability' },
            { value: 12, suffix: '', label: 'Subject tracks' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-[27px] font-semibold leading-none">
                <GradientText>
                  <Counter to={s.value} suffix={s.suffix} />
                </GradientText>
              </p>
              <p className="mt-2 text-[11.5px] text-mist">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Library grid */}
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[21px] font-semibold leading-tight">
                Explore the library
                <span className="ml-2.5 text-[12px] font-normal text-mist">
                  {filtered.length} result{filtered.length === 1 ? '' : 's'}
                </span>
              </h2>
              <p className="mt-1.5 text-[12.5px] text-mist">
                Filter by subject, level or keyword
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-mist">
              <TrendingUp className="h-3.5 w-3.5 text-nova-300" />
              Sorted by popularity
            </div>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass mt-8 flex flex-col items-center rounded-[24px] px-8 py-16 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                <Search className="h-6 w-6 text-mist" />
              </span>
              <h3 className="mt-5 text-[17px] font-semibold">No materials found</h3>
              <p className="mt-2 max-w-sm text-[12.5px] leading-relaxed text-mist">
                Try a different keyword, or reset the filters to browse the full library.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-6"
                onClick={() => {
                  setCategory('All')
                  setLevelFilter('All')
                  setQuery('')
                }}
              >
                Reset filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((m) => (
                <motion.div key={m.id} variants={fadeUp}>
                  <GlassCard className="flex h-full flex-col overflow-hidden">
                    {/* Gradient thumbnail */}
                    <div
                      className="relative h-[142px] overflow-hidden"
                      style={{ background: m.gradient }}
                    >
                      <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_22%_26%,rgba(255,255,255,0.65),transparent_46%),radial-gradient(circle_at_78%_74%,rgba(255,255,255,0.4),transparent_48%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(6,9,22,0.62))]" />
                      <span className="absolute left-4 top-4 text-[34px] drop-shadow-[0_10px_22px_rgba(0,0,0,0.36)]">
                        {m.icon}
                      </span>
                      <div className="absolute right-4 top-4">
                        <Badge tone="default" className="!border-white/25 !bg-black/22 !text-white">
                          {m.type}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3.5 left-4 right-4 flex items-center gap-3 text-[9.5px] font-medium text-white/88">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {m.duration}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {m.lessons} lessons
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Signal className="h-3 w-3" />
                          {m.level}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-nova-200">
                        {m.subject}
                      </p>
                      <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-white">
                        {m.title}
                      </h3>
                      <p className="mt-2.5 flex-1 text-[11.5px] leading-[1.72] text-mist">
                        {m.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-[10.5px] text-amber-300">
                            <Star className="h-3 w-3 fill-amber-300" />
                            {m.rating}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10.5px] text-mist">
                            <Users className="h-3 w-3" />
                            {(m.students / 1000).toFixed(1)}K
                          </span>
                        </div>
                        <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-medium text-white transition-all hover:border-nova-300/40 hover:bg-nova-400/[0.16]">
                          <Download className="h-2.5 w-2.5" />
                          Save
                        </button>
                      </div>

                      <Link to="/chat" className="mt-4 block">
                        <button className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.045] py-2.5 text-[11.5px] font-semibold text-white transition-all hover:border-nova-300/38 hover:bg-nova-400/[0.16]">
                          <Sparkles className="h-3 w-3 text-nova-200" />
                          Start learning
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* CTA */}
        <SectionHeading
          className="mt-24"
          eyebrow="Need a custom path?"
          title={
            <>
              Let Nova build a plan <GradientText>around your goals</GradientText>
            </>
          }
          description="Tell us your subject, timeline and current level — we'll assemble a personalised track in under a minute."
        />
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 pb-8">
          <Link to="/auth">
            <Button size="lg">
              <GraduationCap className="h-[17px] w-[17px]" />
              Get my learning path
            </Button>
          </Link>
          <Link to="/planner">
            <Button variant="ghost" size="lg">
              Open the planner
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
