import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  ListChecks,
  Moon,
  Plus,
  Sparkles,
  Sun,
  Target,
  Timer,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
  stagger,
  viewportOnce,
} from '../components/ui'

type Task = {
  id: string
  title: string
  day: number // 0-6 (Mon-Sun)
  time: string
  duration: number // minutes
  category: string
  priority: 'High' | 'Medium' | 'Low'
  done: boolean
}

const STORAGE_KEY = 'edunova-planner-v1'

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const dayShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const categoryMeta: Record<string, { color: string; icon: string }> = {
  Mathematics: { color: '#6d7cff', icon: '📐' },
  Science: { color: '#22d3ee', icon: '🔬' },
  Programming: { color: '#a78bfa', icon: '💻' },
  Languages: { color: '#f472b6', icon: '🗣️' },
  Writing: { color: '#fbbf24', icon: '✍️' },
  Review: { color: '#34d399', icon: '🔁' },
  Wellbeing: { color: '#f87171', icon: '🌿' },
}

const seedTasks: Task[] = [
  { id: 't1', title: 'Calculus — integration by parts', day: 0, time: '09:00', duration: 60, category: 'Mathematics', priority: 'High', done: true },
  { id: 't2', title: 'ML foundations — lesson 19', day: 0, time: '16:00', duration: 45, category: 'Programming', priority: 'Medium', done: true },
  { id: 't3', title: 'Physics problem set', day: 1, time: '10:30', duration: 75, category: 'Science', priority: 'High', done: true },
  { id: 't4', title: 'Spanish vocabulary review', day: 1, time: '19:00', duration: 25, category: 'Languages', priority: 'Low', done: true },
  { id: 't5', title: 'Algorithms — dynamic programming', day: 2, time: '09:30', duration: 90, category: 'Programming', priority: 'High', done: true },
  { id: 't6', title: 'Essay draft — introduction', day: 2, time: '15:00', duration: 50, category: 'Writing', priority: 'Medium', done: true },
  { id: 't7', title: 'Chemistry — organic mechanisms', day: 3, time: '11:00', duration: 60, category: 'Science', priority: 'Medium', done: true },
  { id: 't8', title: 'Spaced repetition session', day: 3, time: '20:00', duration: 30, category: 'Review', priority: 'High', done: true },
  { id: 't9', title: 'Statistics — hypothesis testing', day: 4, time: '09:00', duration: 70, category: 'Mathematics', priority: 'High', done: true },
  { id: 't10', title: 'Morning run & stretch', day: 4, time: '07:00', duration: 35, category: 'Wellbeing', priority: 'Medium', done: true },
  { id: 't11', title: 'Deep work — ML project', day: 5, time: '10:00', duration: 120, category: 'Programming', priority: 'High', done: false },
  { id: 't12', title: 'Weekly review & planning', day: 5, time: '17:00', duration: 40, category: 'Review', priority: 'Medium', done: false },
  { id: 't13', title: 'Reading — "Deep Work"', day: 6, time: '11:00', duration: 45, category: 'Review', priority: 'Low', done: false },
  { id: 't14', title: 'Rest & recharge', day: 6, time: '15:00', duration: 60, category: 'Wellbeing', priority: 'Low', done: false },
]

function getWeekDates() {
  const now = new Date()
  const day = now.getDay() // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day // start Monday
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function StatCard({
  icon,
  value,
  suffix = '',
  label,
  sub,
  tone = 'cool',
}: {
  icon: React.ReactNode
  value: number
  suffix?: string
  label: string
  sub: string
  tone?: 'cool' | 'warm' | 'green'
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
            tone === 'warm'
              ? 'border-amber-300/22 bg-amber-400/[0.12] text-amber-200'
              : tone === 'green'
                ? 'border-emerald-300/22 bg-emerald-400/[0.12] text-emerald-200'
                : 'border-nova-300/22 bg-nova-400/[0.12] text-nova-200'
          }`}
        >
          {icon}
        </span>
        <TrendingUp className="h-3.5 w-3.5 text-emerald-300/70" />
      </div>
      <p className="mt-4 text-[26px] font-semibold leading-none text-white">
        <Counter to={value} suffix={suffix} />
      </p>
      <p className="mt-2 text-[10.5px] font-medium uppercase tracking-[0.13em] text-mist">
        {label}
      </p>
      <p className="mt-1 text-[9.5px] text-mist/70">{sub}</p>
    </GlassCard>
  )
}

export function Planner() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Task[]
        if (Array.isArray(parsed) && parsed.length) return parsed
      }
    } catch {
      /* ignore */
    }
    return seedTasks
  })
  const [weekOffset, setWeekOffset] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [filterDay, setFilterDay] = useState<number | null>(null)

  const [title, setTitle] = useState('')
  const [day, setDay] = useState(0)
  const [time, setTime] = useState('09:00')
  const [duration, setDuration] = useState(45)
  const [category, setCategory] = useState('Mathematics')
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      /* ignore */
    }
  }, [tasks])

  const weekDates = useMemo(() => {
    const base = getWeekDates()
    return base.map((d) => {
      const shifted = new Date(d)
      shifted.setDate(d.getDate() + weekOffset * 7)
      return shifted
    })
  }, [weekOffset])

  const todayIndex = (() => {
    const now = new Date()
    const jsDay = now.getDay()
    return jsDay === 0 ? 6 : jsDay - 1
  })()

  const totalDone = tasks.filter((t) => t.done).length
  const totalMinutes = tasks.filter((t) => t.done).reduce((s, t) => s + t.duration, 0)
  const completionRate = tasks.length ? Math.round((totalDone / tasks.length) * 100) : 0
  const highPriorityLeft = tasks.filter((t) => t.priority === 'High' && !t.done).length

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setTasks((prev) => [
      ...prev,
      {
        id: `t-${Date.now()}`,
        title: title.trim(),
        day,
        time,
        duration,
        category,
        priority,
        done: false,
      },
    ])
    setTitle('')
    setShowForm(false)
  }

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className={container}>
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"
        >
          <motion.div variants={fadeUp} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.19em] text-nova-200">
              <CalendarDays className="h-3 w-3" />
              Intelligent study planner
            </span>
            <h1 className="mt-6 text-balance text-[clamp(2.15rem,5.2vw,3.55rem)] font-semibold leading-[1.05]">
              Plan less. <GradientText>Achieve more.</GradientText>
            </h1>
            <p className="mt-5 text-pretty text-[14.5px] leading-[1.8] text-mist">
              A weekly rhythm that balances deep work, revision and recovery — so momentum
              compounds instead of burning out.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button onClick={() => setShowForm((v) => !v)}>
              <CalendarPlus className="h-4 w-4" />
              {showForm ? 'Close form' : 'Add task'}
            </Button>
            <Link to="/progress">
              <Button variant="ghost">
                <TrendingUp className="h-4 w-4" />
                View analytics
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Add task form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={addTask}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 36 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="glass overflow-hidden rounded-[22px]"
            >
              <div className="grid gap-5 p-7 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[9.5px] font-semibold uppercase tracking-[0.15em] text-mist/75">
                    Task title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Revise integration techniques"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-[12.5px] text-white placeholder:text-mist/45 outline-none transition-colors focus:border-nova-400/55"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9.5px] font-semibold uppercase tracking-[0.15em] text-mist/75">
                    Day
                  </label>
                  <select
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-[12px] text-white outline-none"
                  >
                    {dayNames.map((d, i) => (
                      <option key={d} value={i} className="bg-[#0b1020]">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[9.5px] font-semibold uppercase tracking-[0.15em] text-mist/75">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-[12px] text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[9.5px] font-semibold uppercase tracking-[0.15em] text-mist/75">
                    Duration (min)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-[12px] text-white outline-none"
                  >
                    {[15, 25, 30, 45, 60, 75, 90, 120].map((d) => (
                      <option key={d} value={d} className="bg-[#0b1020]">
                        {d} minutes
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[9.5px] font-semibold uppercase tracking-[0.15em] text-mist/75">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-[12px] text-white outline-none"
                  >
                    {Object.keys(categoryMeta).map((c) => (
                      <option key={c} value={c} className="bg-[#0b1020]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[9.5px] font-semibold uppercase tracking-[0.15em] text-mist/75">
                    Priority
                  </label>
                  <div className="flex gap-2">
                    {(['High', 'Medium', 'Low'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 rounded-xl border px-2 py-3 text-[10.5px] font-medium transition-colors ${
                          priority === p
                            ? 'border-nova-300/50 bg-nova-400/[0.18] text-white'
                            : 'border-white/10 text-mist hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4" />
                    Save task
                  </Button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Stats */}
        <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<ListChecks className="h-4 w-4" />}
            value={totalDone}
            label="Tasks completed"
            sub={`out of ${tasks.length} this week`}
            tone="green"
          />
          <StatCard
            icon={<Timer className="h-4 w-4" />}
            value={Math.round(totalMinutes / 60)}
            suffix="h"
            label="Focused time"
            sub="deep work logged"
          />
          <StatCard
            icon={<Flame className="h-4 w-4" />}
            value={12}
            suffix="d"
            label="Current streak"
            sub="keep it burning"
            tone="warm"
          />
          <StatCard
            icon={<Target className="h-4 w-4" />}
            value={completionRate}
            suffix="%"
            label="Weekly completion"
            sub={`${highPriorityLeft} high-priority left`}
            tone="green"
          />
        </div>

        {/* Week navigation */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="glass-soft flex h-10 w-10 items-center justify-center rounded-xl text-mist transition-colors hover:text-white"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="text-[13px] font-semibold text-white">
                {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} —{' '}
                {weekDates[6].toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="mt-0.5 text-[10px] text-mist">
                {weekOffset === 0 ? 'This week' : weekOffset > 0 ? 'Upcoming week' : 'Previous week'}
              </p>
            </div>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="glass-soft flex h-10 w-10 items-center justify-center rounded-xl text-mist transition-colors hover:text-white"
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="rounded-full border border-white/10 px-3.5 py-2 text-[10px] text-mist transition-colors hover:text-white"
              >
                Today
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterDay(null)}
              className={`rounded-full border px-3.5 py-2 text-[10px] font-medium transition-colors ${
                filterDay === null
                  ? 'border-nova-300/42 bg-nova-400/[0.16] text-white'
                  : 'border-white/[0.09] text-mist hover:text-white'
              }`}
            >
              All days
            </button>
            {dayShort.map((d, i) => (
              <button
                key={d}
                onClick={() => setFilterDay(i)}
                className={`rounded-full border px-3 py-2 text-[10px] font-medium transition-colors ${
                  filterDay === i
                    ? 'border-nova-300/42 bg-nova-400/[0.16] text-white'
                    : 'border-white/[0.09] text-mist hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Weekly calendar */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {weekDates.map((date, i) => {
            const dayTasks = tasks.filter((t) => t.day === i && (filterDay === null || filterDay === i))
            const isToday = weekOffset === 0 && i === todayIndex
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.055 }}
                className={`glass flex min-h-[212px] flex-col rounded-[18px] p-4 transition-all hover:-translate-y-1 hover:border-white/[0.15] ${
                  isToday
                    ? 'border-nova-300/38 bg-[linear-gradient(160deg,rgba(79,87,240,0.2),rgba(124,77,255,0.07))] shadow-[0_22px_50px_-24px_rgba(99,102,241,0.9)]'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-mist/75">
                      {dayShort[i]}
                    </p>
                    <p className="mt-1 text-[19px] font-semibold leading-none text-white">
                      {date.getDate()}
                    </p>
                  </div>
                  {isToday && (
                    <span className="rounded-full bg-nova-300/22 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.11em] text-nova-100">
                      Today
                    </span>
                  )}
                </div>

                <div className="mt-4 flex-1 space-y-2">
                  {dayTasks.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/[0.08] px-2 py-5">
                      <p className="text-[8.5px] text-mist/45">No tasks</p>
                    </div>
                  ) : (
                    dayTasks.slice(0, 3).map((t) => {
                      const meta = categoryMeta[t.category] ?? categoryMeta.Review
                      return (
                        <div
                          key={t.id}
                          className="group rounded-[11px] border border-white/[0.07] bg-white/[0.038] p-2.5 transition-colors hover:border-white/[0.15]"
                        >
                          <div className="flex items-start gap-2">
                            <button
                              onClick={() =>
                                setTasks((prev) =>
                                  prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                                )
                              }
                              className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                t.done
                                  ? 'border-emerald-400/55 bg-emerald-400/28'
                                  : 'border-white/22 hover:border-nova-300/55'
                              }`}
                              aria-label={t.done ? 'Mark as not done' : 'Mark as done'}
                            >
                              {t.done && <CheckCircle2 className="h-2 w-2 text-emerald-300" />}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-[8.5px] leading-[1.5] ${
                                  t.done ? 'text-mist/50 line-through' : 'text-white/88'
                                }`}
                              >
                                {t.title}
                              </p>
                              <div className="mt-1.5 flex items-center gap-1.5">
                                <span
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ background: meta.color }}
                                />
                                <span className="text-[7px] text-mist/60">
                                  {t.time} · {t.duration}m
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                setTasks((prev) => prev.filter((x) => x.id !== t.id))
                              }
                              className="opacity-0 transition-opacity group-hover:opacity-100"
                              aria-label="Delete task"
                            >
                              <Trash2 className="h-2.5 w-2.5 text-mist/55 hover:text-rose-300" />
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                  {dayTasks.length > 3 && (
                    <p className="pt-1 text-[8px] text-mist/60">+{dayTasks.length - 3} more</p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setDay(i)
                    setShowForm(true)
                    window.scrollTo({ top: 260, behavior: 'smooth' })
                  }}
                  className="mt-3 flex items-center justify-center gap-1.5 rounded-[10px] border border-white/[0.07] py-2 text-[8px] text-mist/70 transition-colors hover:border-nova-300/32 hover:text-white"
                >
                  <Plus className="h-2.5 w-2.5" />
                  Add
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Focus plan */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* Today's schedule */}
          <GlassCard hover={false} className="p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-semibold leading-tight">
                  Today&apos;s focus plan
                </h3>
                <p className="mt-1.5 text-[11px] text-mist">
                  {dayNames[todayIndex]} · {tasks.filter((t) => t.day === todayIndex && t.done).length} of{' '}
                  {tasks.filter((t) => t.day === todayIndex).length} tasks complete
                </p>
              </div>
              <Badge tone="info">
                <AlarmClock className="h-2.5 w-2.5" />
                Optimised by Nova
              </Badge>
            </div>

            <div className="mt-6 space-y-3">
              {tasks
                .filter((t) => t.day === todayIndex)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((t) => {
                  const meta = categoryMeta[t.category] ?? categoryMeta.Review
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-4 rounded-[14px] border border-white/[0.075] bg-white/[0.032] p-3.5 transition-colors hover:border-white/[0.15]"
                    >
                      <div className="flex w-[52px] shrink-0 flex-col items-center">
                        <span className="text-[11px] font-semibold text-white">{t.time}</span>
                        <span className="mt-1 text-[8px] text-mist/65">{t.duration}m</span>
                      </div>
                      <div
                        className="h-9 w-[3px] shrink-0 rounded-full"
                        style={{ background: meta.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[11.5px] font-medium ${
                            t.done ? 'text-mist/55 line-through' : 'text-white/92'
                          }`}
                        >
                          {t.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[8px] text-mist/65">
                            {meta.icon} {t.category}
                          </span>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] ${
                              t.priority === 'High'
                                ? 'bg-rose-400/16 text-rose-200'
                                : t.priority === 'Medium'
                                  ? 'bg-amber-400/16 text-amber-200'
                                  : 'bg-emerald-400/16 text-emerald-200'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                          )
                        }
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          t.done
                            ? 'border-emerald-400/50 bg-emerald-400/22 text-emerald-300'
                            : 'border-white/12 text-mist/50 hover:border-nova-300/45 hover:text-white'
                        }`}
                        aria-label="Toggle task"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}

              {tasks.filter((t) => t.day === todayIndex).length === 0 && (
                <div className="rounded-[14px] border border-dashed border-white/[0.09] px-6 py-12 text-center">
                  <CalendarDays className="mx-auto h-7 w-7 text-mist/45" />
                  <p className="mt-3 text-[11px] text-mist">
                    Nothing scheduled for today — enjoy the breathing room.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Right column */}
          <div className="space-y-6">
            {/* Weekly progress */}
            <GlassCard hover={false} className="p-7">
              <h3 className="text-[15px] font-semibold leading-tight">Weekly momentum</h3>
              <div className="mt-6 space-y-5">
                {[
                  { label: 'Deep work sessions', value: 78, tone: 'cool' as const },
                  { label: 'Revision completed', value: 62, tone: 'warm' as const },
                  { label: 'Wellbeing balance', value: 88, tone: 'green' as const },
                ].map((b) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between">
                      <p className="text-[10.5px] text-mist">{b.label}</p>
                      <p className="text-[10.5px] font-semibold text-white">{b.value}%</p>
                    </div>
                    <ProgressBar value={b.value} tone={b.tone} className="mt-2.5" />
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-[14px] border border-nova-300/18 bg-[linear-gradient(150deg,rgba(99,102,241,0.18),rgba(139,92,246,0.07))] p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-nova-400/22">
                    <Sparkles className="h-3.5 w-3.5 text-nova-100" />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold text-white">Nova&apos;s suggestion</p>
                    <p className="mt-1.5 text-[9px] leading-[1.72] text-mist">
                      Your focus peaks between 9–11am. Schedule your hardest subject there and
                      keep afternoons for lighter revision.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Time distribution */}
            <GlassCard hover={false} className="p-7">
              <h3 className="text-[15px] font-semibold leading-tight">Time distribution</h3>
              <div className="mt-6 space-y-3.5">
                {Object.entries(categoryMeta)
                  .slice(0, 5)
                  .map(([name, meta]) => {
                    const mins = tasks
                      .filter((t) => t.category === name)
                      .reduce((s, t) => s + t.duration, 0)
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="text-[11px]">{meta.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-[9.5px] text-mist">{name}</p>
                            <p className="text-[9px] text-mist/70">{Math.round(mins / 60)}h</p>
                          </div>
                          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: meta.color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${Math.min(100, (mins / 480) * 100)}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom tips */}
        <div className="mt-12 grid gap-5 pb-8 sm:grid-cols-3">
          {[
            {
              icon: <Sun className="h-4 w-4" />,
              title: 'Morning deep work',
              desc: 'Tackle the hardest subject when cognitive load is lowest — usually within 2 hours of waking.',
            },
            {
              icon: <Zap className="h-4 w-4" />,
              title: 'Time-box everything',
              desc: 'Parkinson\'s Law is real: work expands to fill the time you give it. Set a limit, then stop.',
            },
            {
              icon: <Moon className="h-4 w-4" />,
              title: 'Protect recovery',
              desc: 'Sleep is when memory consolidates. A rested brain outperforms an extra hour of cramming.',
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

        <div className="flex flex-wrap items-center justify-center gap-3 pb-6">
          <Link to="/quiz">
            <Button>
              <GraduationCap className="h-4 w-4" />
              Practise now
            </Button>
          </Link>
          <Button variant="ghost" onClick={() => setTasks(seedTasks)}>
            Reset demo schedule
          </Button>
        </div>
      </div>
    </div>
  )
}
