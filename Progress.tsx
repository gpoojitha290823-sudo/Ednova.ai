import { motion, useInView, useReducedMotion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Calendar,
  Clock,
  Flame,
  Focus,
  GraduationCap,
  LineChart,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

/* ------------------------------------------------------------------ */
/*  Study hours area chart                                             */
/* ------------------------------------------------------------------ */

const hoursData = [
  { w: 'W1', v: 6.2 },
  { w: 'W2', v: 7.8 },
  { w: 'W3', v: 5.4 },
  { w: 'W4', v: 9.1 },
  { w: 'W5', v: 8.3 },
  { w: 'W6', v: 11.6 },
  { w: 'W7', v: 10.2 },
  { w: 'W8', v: 13.4 },
  { w: 'W9', v: 12.1 },
  { w: 'W10', v: 15.2 },
  { w: 'W11', v: 14.4 },
  { w: 'W12', v: 17.8 },
]

function AreaChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()

  const width = 720
  const height = 260
  const pad = { top: 22, right: 16, bottom: 34, left: 42 }

  const max = Math.max(...hoursData.map((d) => d.v)) * 1.12
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const stepX = innerW / (hoursData.length - 1)

  const points = hoursData.map((d, i) => ({
    x: pad.left + i * stepX,
    y: pad.top + innerH - (d.v / max) * innerH,
  }))

  const line = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = points[i - 1]
      const cx = (prev.x + p.x) / 2
      return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`
    })
    .join(' ')

  const area = `${line} L ${points[points.length - 1].x} ${pad.top + innerH} L ${points[0].x} ${
    pad.top + innerH
  } Z`

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d7cff" stopOpacity="0.44" />
            <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4de3ff" />
            <stop offset="50%" stopColor="#6d7cff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.top + innerH * t
          return (
            <g key={t}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.075)"
                strokeDasharray={t === 1 ? '0' : '4 7'}
              />
              <text
                x={pad.left - 12}
                y={y + 4}
                textAnchor="end"
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
              >
                {Math.round(max * (1 - t))}h
              </text>
            </g>
          )
        })}

        <motion.path
          d={area}
          fill="url(#area-fill)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.1, delay: 0.35 }}
        />

        <motion.path
          d={line}
          fill="none"
          stroke="url(#line-stroke)"
          strokeWidth="2.8"
          strokeLinecap="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 6px 18px rgba(109,124,255,0.5))' }}
        />

        {points.map((p, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          >
            <circle cx={p.x} cy={p.y} r="8.5" fill="rgba(109,124,255,0.16)" />
            <circle cx={p.x} cy={p.y} r="3.8" fill="#0b1020" stroke="#7dd3fc" strokeWidth="2" />
          </motion.g>
        ))}

        {hoursData.map((d, i) => (
          <text
            key={d.w}
            x={pad.left + i * stepX}
            y={height - 9}
            textAnchor="middle"
            fill="rgba(255,255,255,0.38)"
            fontSize="9.5"
          >
            {d.w}
          </text>
        ))}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Subject mastery bar chart                                          */
/* ------------------------------------------------------------------ */

const mastery = [
  { subject: 'Mathematics', value: 92, color: '#4de3ff', delta: '+8%' },
  { subject: 'Programming', value: 87, color: '#818cf8', delta: '+12%' },
  { subject: 'Physics', value: 78, color: '#a78bfa', delta: '+5%' },
  { subject: 'Biology', value: 71, color: '#c084fc', delta: '+9%' },
  { subject: 'Writing', value: 84, color: '#f472b6', delta: '+6%' },
  { subject: 'History', value: 63, color: '#fbbf24', delta: '+3%' },
]

function MasteryBars() {
  return (
    <div className="space-y-5">
      {mastery.map((m, i) => (
        <div key={m.subject}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: m.color, boxShadow: `0 0 12px ${m.color}88` }}
              />
              <p className="text-[11.5px] font-medium text-white/92">{m.subject}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] text-emerald-300">{m.delta}</span>
              <p className="text-[12px] font-semibold text-white">{m.value}%</p>
            </div>
          </div>
          <div className="mt-2.5 h-[7px] w-full overflow-hidden rounded-full bg-white/[0.075]">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${m.color}bb, ${m.color})`,
                boxShadow: `0 0 16px ${m.color}66`,
              }}
              initial={{ width: 0 }}
              whileInView={{ width: `${m.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.15, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Donut chart                                                        */
/* ------------------------------------------------------------------ */

function DonutChart() {
  const segments = [
    { label: 'Completed', value: 62, color: '#4de3ff' },
    { label: 'In progress', value: 23, color: '#818cf8' },
    { label: 'Not started', value: 15, color: 'rgba(255,255,255,0.13)' },
  ]
  const radius = 62
  const circumference = 2 * Math.PI * radius
  let offsetAcc = 0

  return (
    <div className="flex flex-col items-center gap-7 sm:flex-row">
      <div className="relative h-[168px] w-[168px] shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="17"
            fill="none"
          />
          {segments.map((s, i) => {
            const len = (s.value / 100) * circumference
            const dash = `${len - 3.5} ${circumference - len + 3.5}`
            const currentOffset = offsetAcc
            offsetAcc += len
            return (
              <motion.circle
                key={s.label}
                cx="80"
                cy="80"
                r={radius}
                stroke={s.color}
                strokeWidth="17"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={dash}
                initial={{ strokeDashoffset: -currentOffset + circumference * 0.25 }}
                whileInView={{ strokeDashoffset: -currentOffset }}
                viewport={{ once: true }}
                transition={{ duration: 1.15, delay: i * 0.16, ease: [0.22, 1, 0.36, 1] }}
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-[30px] font-semibold leading-none">
            <GradientText>62%</GradientText>
          </p>
          <p className="mt-1.5 text-[8.5px] uppercase tracking-[0.19em] text-mist">
            Curriculum
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background: s.color,
                boxShadow: s.color.startsWith('rgba') ? 'none' : `0 0 12px ${s.color}88`,
              }}
            />
            <p className="flex-1 text-[11px] text-mist">{s.label}</p>
            <p className="text-[11px] font-semibold text-white">{s.value}%</p>
          </div>
        ))}

        <div className="mt-5 rounded-[13px] border border-nova-300/18 bg-nova-400/[0.1] p-3.5">
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nova-200" />
            <p className="text-[9.5px] leading-[1.72] text-mist">
              You&apos;re ahead of <strong className="text-white">78%</strong> of learners at your
              level. Completing 2 more modules this month puts you in the top decile.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Contribution heatmap                                               */
/* ------------------------------------------------------------------ */

function Heatmap() {
  const weeks = 22
  const cells = useRef<number[]>(
    Array.from({ length: weeks * 7 }, (_, i) => {
      const wave = Math.sin(i / 9) * 0.42 + 0.58
      const noise = (Math.sin(i * 12.9898) * 43758.5453) % 1
      return Math.max(0, Math.round(wave * 4 * Math.abs(noise)))
    }),
  ).current

  return (
    <div>
      <div className="flex gap-[4px] overflow-x-auto pb-2">
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} className="flex flex-col gap-[4px]">
            {Array.from({ length: 7 }).map((_, d) => {
              const level = cells[w * 7 + d]
              const colors = [
                'rgba(255,255,255,0.055)',
                'rgba(109,124,255,0.24)',
                'rgba(109,124,255,0.44)',
                'rgba(129,140,248,0.68)',
                'rgba(168,128,255,0.92)',
              ]
              return (
                <motion.span
                  key={d}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (w * 7 + d) * 0.004, duration: 0.35 }}
                  className="h-[11px] w-[11px] rounded-[3px]"
                  style={{ background: colors[level] }}
                  title={`Level ${level}`}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[9px] text-mist/60">Last 22 weeks</p>
        <div className="flex items-center gap-1.5">
          <p className="text-[8.5px] text-mist/60">Less</p>
          {[
            'rgba(255,255,255,0.055)',
            'rgba(109,124,255,0.24)',
            'rgba(109,124,255,0.44)',
            'rgba(129,140,248,0.68)',
            'rgba(168,128,255,0.92)',
          ].map((c) => (
            <span key={c} className="h-[9px] w-[9px] rounded-[2.5px]" style={{ background: c }} />
          ))}
          <p className="text-[8.5px] text-mist/60">More</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const achievements = [
  {
    icon: <Flame className="h-5 w-5" />,
    title: '30-Day Streak',
    desc: 'Studied every day for a month',
    earned: true,
    color: '#fbbf24',
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: 'Sharpshooter',
    desc: 'Scored 100% on 5 quizzes',
    earned: true,
    color: '#4de3ff',
  },
  {
    icon: <BrainCircuit className="h-5 w-5" />,
    title: 'Deep Diver',
    desc: '100 hours of focused study',
    earned: true,
    color: '#a78bfa',
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: 'Course Master',
    desc: 'Complete your first full track',
    earned: true,
    color: '#34d399',
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: 'Night Owl',
    desc: '25 late-night study sessions',
    earned: false,
    color: '#f472b6',
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: 'Top 1%',
    desc: 'Reach the global leaderboard',
    earned: false,
    color: '#f87171',
  },
]

export function Progress() {
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
              <Activity className="h-3 w-3" />
              Personal analytics
            </span>
            <h1 className="mt-6 text-balance text-[clamp(2.15rem,5.2vw,3.55rem)] font-semibold leading-[1.05]">
              Your progress, <GradientText>beautifully clear</GradientText>
            </h1>
            <p className="mt-5 text-pretty text-[14.5px] leading-[1.8] text-mist">
              Honest, motivating insight into how you spend your time, what you have mastered and
              exactly where the next gain is hiding.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link to="/quiz">
              <Button>
                <Zap className="h-4 w-4" />
                Take a skill check
              </Button>
            </Link>
            <Link to="/planner">
              <Button variant="ghost">
                <Calendar className="h-4 w-4" />
                Adjust plan
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* KPI cards */}
        <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <Clock className="h-[18px] w-[18px]" />,
              label: 'Total study time',
              value: 248,
              suffix: 'h',
              delta: '+18h this month',
              spark: [8, 12, 9, 15, 13, 19, 22],
            },
            {
              icon: <BookOpen className="h-[18px] w-[18px]" />,
              label: 'Lessons completed',
              value: 186,
              suffix: '',
              delta: '+12 this week',
              spark: [4, 7, 6, 10, 12, 14, 18],
            },
            {
              icon: <Target className="h-[18px] w-[18px]" />,
              label: 'Average quiz score',
              value: 87,
              suffix: '%',
              delta: '+4% vs last month',
              spark: [70, 74, 78, 76, 82, 85, 87],
            },
            {
              icon: <Flame className="h-[18px] w-[18px]" />,
              label: 'Longest streak',
              value: 47,
              suffix: 'd',
              delta: 'Current: 12 days',
              spark: [10, 18, 22, 30, 36, 42, 47],
            },
          ].map((k, idx) => (
            <motion.div
              key={k.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={{ delay: idx * 0.08 }}
            >
              <GlassCard className="overflow-hidden p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-nova-300/22 bg-nova-400/[0.13] text-nova-200">
                    {k.icon}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/22 bg-emerald-400/[0.1] px-2 py-1 text-[8.5px] font-semibold text-emerald-300">
                    <ArrowUpRight className="h-2.5 w-2.5" />
                    {k.delta}
                  </span>
                </div>

                <p className="mt-5 text-[27px] font-semibold leading-none text-white">
                  <Counter to={k.value} suffix={k.suffix} />
                </p>
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.13em] text-mist">
                  {k.label}
                </p>

                {/* Mini sparkline */}
                <svg viewBox="0 0 120 32" className="mt-4 h-8 w-full">
                  <defs>
                    <linearGradient id={`spark-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6d7cff" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#6d7cff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={`M ${k.spark
                      .map((v, i) => {
                        const max = Math.max(...k.spark)
                        return `${(i / (k.spark.length - 1)) * 120} ${28 - (v / max) * 24}`
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#7dd3fc"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                  <motion.path
                    d={`M ${k.spark
                      .map((v, i) => {
                        const max = Math.max(...k.spark)
                        return `${(i / (k.spark.length - 1)) * 120} ${28 - (v / max) * 24}`
                      })
                      .join(' L ')} L 120 32 L 0 32 Z`}
                    fill={`url(#spark-${idx})`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </svg>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Main charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <GlassCard hover={false} className="p-7">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-nova-300/22 bg-nova-400/[0.13]">
                    <LineChart className="h-4 w-4 text-nova-200" />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold leading-tight">
                      Study hours trend
                    </h3>
                    <p className="mt-1 text-[10px] text-mist">Last 12 weeks · weekly totals</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {['1M', '3M', '6M', '1Y'].map((r, i) => (
                  <button
                    key={r}
                    className={`rounded-full border px-3 py-1.5 text-[9.5px] font-medium transition-colors ${
                      i === 1
                        ? 'border-nova-300/42 bg-nova-400/[0.17] text-white'
                        : 'border-white/[0.08] text-mist hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <AreaChart />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-6 sm:grid-cols-4">
              {[
                { label: 'Weekly average', value: '11.2h' },
                { label: 'Best week', value: '17.8h' },
                { label: 'Growth', value: '+187%' },
                { label: 'Consistency', value: '94%' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[16px] font-semibold leading-none text-white">{s.value}</p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.13em] text-mist">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-7">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-nova-300/22 bg-nova-400/[0.13]">
                <BarChart3 className="h-4 w-4 text-nova-200" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold leading-tight">Subject mastery</h3>
                <p className="mt-1 text-[10px] text-mist">Based on quiz &amp; session data</p>
              </div>
            </div>

            <div className="mt-8">
              <MasteryBars />
            </div>

            <div className="mt-8 rounded-[15px] border border-white/[0.08] bg-white/[0.032] p-4">
              <div className="flex items-start gap-3">
                <Focus className="mt-0.5 h-4 w-4 shrink-0 text-nova-300" />
                <div>
                  <p className="text-[10px] font-semibold text-white">Recommended focus</p>
                  <p className="mt-1.5 text-[9.5px] leading-[1.72] text-mist">
                    History is your weakest area at 63%. Two 45-minute sessions this week would
                    lift it above your 70% threshold.
                  </p>
                  <Link
                    to="/materials"
                    className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-semibold text-nova-200 hover:text-white"
                  >
                    Open history materials
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Donut + heatmap */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GlassCard hover={false} className="p-7">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-nova-300/22 bg-nova-400/[0.13]">
                <GraduationCap className="h-4 w-4 text-nova-200" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold leading-tight">Curriculum completion</h3>
                <p className="mt-1 text-[10px] text-mist">Across all enrolled tracks</p>
              </div>
            </div>

            <div className="mt-8">
              <DonutChart />
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-nova-300/22 bg-nova-400/[0.13]">
                  <Calendar className="h-4 w-4 text-nova-200" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold leading-tight">Study consistency</h3>
                  <p className="mt-1 text-[10px] text-mist">
                    Every session, visualised
                  </p>
                </div>
              </div>
              <Badge tone="success">
                <TrendingUp className="h-2.5 w-2.5" />
                Top 8% globally
              </Badge>
            </div>

            <div className="mt-8">
              <Heatmap />
            </div>

            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
              {[
                { label: 'Active days', value: 128 },
                { label: 'Sessions', value: 412 },
                { label: 'Avg / day', value: 1.9, suffix: 'h' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[19px] font-semibold leading-none text-white">
                    <Counter to={s.value} suffix={'suffix' in s ? (s.suffix as string) : ''} />
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.13em] text-mist">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Achievements */}
        <SectionHeading
          className="mt-20"
          eyebrow="Milestones"
          title={
            <>
              Achievements worth <GradientText>celebrating</GradientText>
            </>
          }
          description="Progress deserves to be seen. Every badge marks a real habit, not just a checkbox."
        />

        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <motion.div
              key={a.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard
                className={`flex h-full items-start gap-4 p-6 ${
                  a.earned ? '' : 'opacity-55 grayscale-[0.35]'
                }`}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                  style={{
                    background: `linear-gradient(140deg, ${a.color}cc, ${a.color}77)`,
                    boxShadow: a.earned ? `0 16px 34px -16px ${a.color}aa` : 'none',
                  }}
                >
                  {a.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[13px] font-semibold">{a.title}</h3>
                    {a.earned && (
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/12 px-2 py-0.5 text-[7.5px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[10.5px] leading-[1.72] text-mist">{a.desc}</p>
                  {a.earned ? (
                    <div className="mt-3.5">
                      <ProgressBar value={100} tone="green" />
                    </div>
                  ) : (
                    <div className="mt-3.5">
                      <ProgressBar value={42} tone="warm" />
                      <p className="mt-2 text-[8.5px] text-mist/70">42% of the way there</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="glass mt-16 flex flex-col items-center justify-between gap-7 rounded-[26px] p-9 sm:flex-row"
        >
          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[linear-gradient(140deg,#4f57f0,#a78bfa)]">
              <Award className="h-6 w-6 text-white" />
            </span>
            <div>
              <h3 className="text-[17px] font-semibold leading-tight">
                Keep the momentum going
              </h3>
              <p className="mt-2 max-w-md text-[11.5px] leading-[1.78] text-mist">
                You&apos;re on a 12-day streak. A short 20-minute session today keeps it alive and
                compounds into something remarkable.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/chat">
              <Button>
                <Sparkles className="h-4 w-4" />
                Study with Nova
              </Button>
            </Link>
            <Link to="/quiz">
              <Button variant="ghost">Quick quiz</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
