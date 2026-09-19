import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Blocks,
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Flame,
  GraduationCap,
  MessageSquareText,
  Play,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Button,
  container,
  Counter,
  Divider,
  Eyebrow,
  fadeUp,
  GlassCard,
  GradientText,
  ProgressBar,
  SectionHeading,
  stagger,
  viewportOnce,
} from '../components/ui'

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const features: { icon: ReactNode; title: string; desc: string; to: string; tag: string }[] = [
  {
    icon: <MessageSquareText className="h-5 w-5" />,
    title: 'AI Chat Tutor',
    desc: 'Ask anything in plain language. Get step-by-step explanations, analogies and follow-up questions that adapt to your level.',
    to: '/chat',
    tag: 'Core',
  },
  {
    icon: <GraduationCap className="h-5 w-5" />,
    title: 'Study Materials',
    desc: 'A curated library of notes, summaries and visual guides across science, maths, humanities and technology.',
    to: '/materials',
    tag: 'Library',
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: 'Adaptive Quizzes',
    desc: 'Timed quizzes that read your answers and quietly adjust difficulty so you are always working at the edge of your ability.',
    to: '/quiz',
    tag: 'Practice',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Smart Notes',
    desc: 'Write once, recall forever. Notes are auto-tagged, searchable and linked to the quizzes and materials they came from.',
    to: '/notes',
    tag: 'Workspace',
  },
  {
    icon: <CalendarCheck className="h-5 w-5" />,
    title: 'Study Planner',
    desc: 'A calm weekly plan that balances deep work, revision and breaks — and reshuffles itself when life happens.',
    to: '/planner',
    tag: 'Planning',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Progress Analytics',
    desc: 'Beautiful, honest dashboards: mastery by subject, streak health, focus trends and exactly what to revise next.',
    to: '/progress',
    tag: 'Insights',
  },
  {
    icon: <Blocks className="h-5 w-5" />,
    title: 'Coding Tutor',
    desc: 'Learn Python, JavaScript, Java and C++ with runnable examples, guided challenges and instant, friendly feedback.',
    to: '/coding',
    tag: 'Build',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Focus Mode',
    desc: 'Distraction-free sessions with ambient timers, breathing room and gentle nudges — designed for deep, sustainable study.',
    to: '/planner',
    tag: 'Wellbeing',
  },
]

const steps = [
  {
    n: '01',
    title: 'Tell Nova where you are',
    desc: 'Share your goal, subject and timeline. EduNova builds a personalised learning path in seconds — not weeks.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    n: '02',
    title: 'Learn with an adaptive loop',
    desc: 'Explain, practise, quiz, reflect. Every interaction tunes the next one, so the platform quietly gets smarter about you.',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    n: '03',
    title: 'Watch mastery compound',
    desc: 'Clear analytics show what has stuck and what needs another pass — turning effort into visible, motivating momentum.',
    icon: <TrendingUp className="h-5 w-5" />,
  },
]

const testimonials = [
  {
    name: 'Amara Osei',
    role: 'Medical student · Year 3',
    image: '/images/avatar-1.png',
    quote:
      'EduNova replaced three apps for me. The AI tutor explains physiology the way a good mentor would — then the quiz engine catches exactly what I glossed over.',
    stars: 5,
  },
  {
    name: 'Daniel Reyes',
    role: 'Software engineer · Career switcher',
    image: '/images/avatar-2.png',
    quote:
      'The coding tutor is genuinely patient. It never just hands you the answer; it nudges you toward it, and the progress view keeps me honest about consistency.',
    stars: 5,
  },
  {
    name: 'Priya Raghavan',
    role: 'PhD researcher',
    image: '/images/avatar-3.png',
    quote:
      'The planner is the first one I have actually kept using. It is calm, opinionated in the right places, and the analytics are refreshingly honest.',
    stars: 5,
  },
]

const marquee = [
  'MIT OpenLearn',
  'Stanford Online',
  'Cambridge Press',
  'Khan Academy',
  'Coursera Labs',
  'Oxford Union',
  'ETH Zürich',
  'UNESCO EdTech',
]

/* ------------------------------------------------------------------ */
/*  Hero visual                                                        */
/* ------------------------------------------------------------------ */

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 22 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
      className="relative mx-auto w-full max-w-[560px]"
    >
      {/* Glow behind */}
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.32),transparent_62%)] blur-3xl" />

      {/* Orbit ring */}
      <div className="pointer-events-none absolute inset-[-6%] rounded-full border border-white/[0.07]" />
      <div className="pointer-events-none absolute inset-[-16%] rounded-full border border-dashed border-nova-300/[0.11]" />

      {/* Main orb */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative overflow-hidden rounded-[34px] border border-white/10 shadow-[0_50px_120px_-40px_rgba(79,87,240,0.7)]"
      >
        <img
          src="/images/hero-orb.png"
          alt="Abstract glowing AI learning orb"
          className="h-[380px] w-full object-cover sm:h-[440px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,22,0.06),rgba(6,8,22,0.55))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(129,140,248,0.22),transparent_60%)]" />

        {/* Overlay chip inside */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4f57f0,#a78bfa)]">
              <BrainCircuit className="h-4 w-4 text-white" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-white">
                Nova is analysing your study pattern
              </p>
              <p className="mt-0.5 text-[10.5px] text-mist">
                Optimising revision for maximum retention
              </p>
            </div>
            <span className="flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" />
          </div>
        </div>
      </motion.div>

      {/* Floating card: streak */}
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="glass absolute -left-3 top-10 hidden rounded-2xl px-4 py-3.5 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] sm:block"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400/15 text-orange-300">
            <Flame className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[15px] font-semibold leading-none text-white">
              <Counter to={47} /> day streak
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-mist/80">
              Personal best
            </p>
          </div>
        </div>
      </motion.div>

      {/* Floating card: mastery */}
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        className="glass absolute -right-2 top-1/3 hidden w-[186px] rounded-2xl p-4 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] lg:block"
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-mist/80">
            Mastery
          </p>
          <Trophy className="h-3.5 w-3.5 text-amber-300" />
        </div>
        <p className="mt-2 text-[22px] font-semibold leading-none text-white">
          <Counter to={92} suffix="%" />
        </p>
        <ProgressBar value={92} className="mt-3" />
        <p className="mt-2 text-[10px] text-mist/80">+12% this month</p>
      </motion.div>

      {/* Floating card: sessions */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="glass absolute -bottom-6 right-6 hidden items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] sm:flex"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-glow/15 text-cyan-glow">
          <Clock className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[13px] font-semibold leading-none text-white">
            <Counter to={28} />h focused
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-mist/80">This month</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 70])

  return (
    <>
      {/* ================= HERO ================= */}
      <section ref={heroRef} className="relative overflow-hidden pt-32 sm:pt-40 lg:pt-44">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className={container}>
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_1fr] lg:gap-10">
            {/* Copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="relative z-10 text-center lg:text-left"
            >
              <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
                <Eyebrow>EduNova 2.0 · Adaptive learning engine</Eyebrow>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-7 text-balance font-display text-[clamp(2.55rem,7vw,5.15rem)] font-semibold leading-[0.98] tracking-[-0.035em]"
              >
                Learn anything.
                <br />
                <GradientText>Faster than ever.</GradientText>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mx-auto mt-7 max-w-[560px] text-pretty text-[15.5px] leading-[1.75] text-mist sm:text-[17px] lg:mx-0"
              >
                EduNova AI is a calm, intelligent workspace where a personal tutor, adaptive
                quizzes, smart notes and honest analytics work together — so studying finally
                feels like progress, not pressure.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link to="/chat" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Sparkles className="h-[17px] w-[17px]" />
                    Start learning free
                  </Button>
                </Link>
                <Link to="/progress" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    <Play className="h-[15px] w-[15px] fill-current" />
                    See the platform
                  </Button>
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start"
              >
                <div className="flex items-center">
                  {['/images/avatar-1.png', '/images/avatar-2.png', '/images/avatar-3.png'].map(
                    (src, i) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        width={38}
                        height={38}
                        className={`rounded-full border-2 border-void object-cover ${
                          i > 0 ? '-ml-3' : ''
                        }`}
                        style={{ width: 38, height: 38 }}
                      />
                    ),
                  )}
                  <div className="-ml-3 flex h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-void bg-[linear-gradient(135deg,#4f57f0,#a78bfa)] text-[10px] font-semibold text-white">
                    240K+
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center gap-1 sm:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    ))}
                    <span className="ml-1.5 text-[12px] font-semibold text-white">4.9/5</span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-mist/80">
                    Trusted by learners in 120+ countries
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Visual */}
            <HeroVisual />
          </div>
        </motion.div>

        {/* Marquee */}
        <div className="relative mt-24 overflow-hidden border-y border-white/[0.06] py-7">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-[linear-gradient(90deg,#05060f,transparent)]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-[linear-gradient(270deg,#05060f,transparent)]" />
          <div className="flex w-max animate-marquee items-center gap-14">
            {[...marquee, ...marquee].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-[15px] font-medium tracking-[0.02em] text-white/32"
              >
                <GraduationCap className="h-4 w-4 text-nova-300/45" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative py-24 sm:py-32">
        <div className={container}>
          <SectionHeading
            eyebrow="Everything in one place"
            title={
              <>
                A complete system for <GradientText>serious learning</GradientText>
              </>
            }
            description="Eight carefully connected tools that share the same context — so your tutor knows your notes, your quizzes know your goals, and your planner knows your limits."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Link to={f.to} className="block h-full">
                  <GlassCard glow className="flex h-full flex-col p-6">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.18),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(99,102,241,0.28),rgba(139,92,246,0.14))] text-nova-100 transition-transform duration-500 group-hover:scale-110">
                        {f.icon}
                      </span>
                      <Badge tone="info">{f.tag}</Badge>
                    </div>
                    <h3 className="mt-6 text-[17px] font-semibold leading-snug">{f.title}</h3>
                    <p className="mt-3 flex-1 text-[13px] leading-[1.72] text-mist">{f.desc}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-nova-200 transition-all duration-300 group-hover:gap-2.5 group-hover:text-white">
                      Explore
                      <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14),transparent_66%)] blur-3xl" />
        <div className={container}>
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Three steps to <GradientText>momentum</GradientText>
              </>
            }
            description="No steep setup, no overwhelming dashboards. Just a clear loop that gets more useful every single day you use it."
          />

          <div className="relative mt-16">
            {/* connecting line */}
            <div className="absolute left-0 right-0 top-[46px] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(129,140,248,0.3),rgba(196,164,255,0.22),transparent)] lg:block" />
            <div className="grid gap-6 lg:grid-cols-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.12 }}
                  className="relative"
                >
                  <GlassCard className="h-full p-8">
                    <div className="flex items-center gap-4">
                      <span className="relative z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-nova-300/30 bg-[linear-gradient(140deg,#4f57f0,#8b5cf6)] text-white shadow-[0_12px_30px_-10px_rgba(99,102,241,0.9)]">
                        {s.icon}
                      </span>
                      <span className="font-display text-[34px] font-semibold leading-none text-white/10">
                        {s.n}
                      </span>
                    </div>
                    <h3 className="mt-6 text-[19px] font-semibold leading-snug">{s.title}</h3>
                    <p className="mt-3.5 text-[13.5px] leading-[1.78] text-mist">{s.desc}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SPLIT FEATURE ================= */}
      <section className="relative py-20 sm:py-28">
        <div className={container}>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              <Eyebrow>Adaptive intelligence</Eyebrow>
              <h2 className="mt-6 text-balance text-[clamp(1.95rem,4.2vw,2.95rem)] font-semibold leading-[1.1]">
                A tutor that understands <GradientText>how you think</GradientText>
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.82] text-mist">
                Most tools give you content. EduNova gives you context. It remembers where you got
                stuck last week, which explanation style landed, and when your focus tends to dip —
                then quietly adjusts.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  'Step-by-step reasoning, never just a final answer',
                  'Automatic difficulty tuning based on real performance',
                  'Explanations rewritten for your exact level',
                  'Spaced repetition scheduled at the right moment',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[13.5px] leading-relaxed text-mist-bright">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/chat">
                  <Button>
                    Try the AI tutor
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/coding">
                  <Button variant="ghost">Explore coding tutor</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="relative"
            >
              <div className="glass relative overflow-hidden rounded-[26px]">
                <img
                  src="/images/coding-visual.png"
                  alt="Futuristic holographic learning interface"
                  className="h-[330px] w-full object-cover sm:h-[430px]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,24,0.15),rgba(8,11,24,0.82))]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="glass-soft rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-7 w-7 rounded-full border-2 border-white/15 bg-[linear-gradient(135deg,#4f57f0,#a78bfa)]"
                          />
                        ))}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11.5px] font-medium text-white">
                          Live cohort · Machine Learning Foundations
                        </p>
                        <p className="mt-0.5 text-[10px] text-mist">
                          128 learners studying right now
                        </p>
                      </div>
                      <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* floating stat */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="glass absolute -left-4 top-8 rounded-2xl p-4 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold leading-none text-white">
                      <Counter to={3.4} decimals={1} suffix="×" /> faster
                    </p>
                    <p className="mt-1 text-[9.5px] uppercase tracking-[0.14em] text-mist/80">
                      Concept retention
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= METRICS ================= */}
      <section className="relative py-16">
        <div className={container}>
          <div className="glass relative overflow-hidden rounded-[28px] px-7 py-12 sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(129,140,248,0.18),transparent_52%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_78%,rgba(196,164,255,0.14),transparent_52%)]" />
            <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: 240, suffix: 'K+', label: 'Active learners', sub: 'across 120 countries' },
                { value: 18, suffix: 'M+', label: 'Questions answered', sub: 'by the AI tutor' },
                { value: 96, suffix: '%', label: 'Report better grades', sub: 'within 3 months' },
                { value: 4.9, suffix: '/5', decimals: 1, label: 'Average rating', sub: 'from 40K reviews' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.1 }}
                  className={i > 0 ? 'lg:border-l lg:border-white/10 lg:pl-10' : ''}
                >
                  <p className="font-display text-[clamp(2.25rem,4.6vw,3.15rem)] font-semibold leading-none">
                    <GradientText>
                      <Counter
                        to={s.value}
                        suffix={s.suffix}
                        decimals={'decimals' in s ? (s.decimals as number) : 0}
                      />
                    </GradientText>
                  </p>
                  <p className="mt-3 text-[14px] font-medium text-white">{s.label}</p>
                  <p className="mt-1.5 text-[12px] text-mist">{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="relative py-24 sm:py-28">
        <div className={container}>
          <SectionHeading
            eyebrow="Loved by learners"
            title={
              <>
                Real people. <GradientText>Real progress.</GradientText>
              </>
            }
            description="From first-year students to working professionals — EduNova adapts to the way each person learns best."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                transition={{ delay: i * 0.12 }}
              >
                <GlassCard className="flex h-full flex-col p-7">
                  <Quote className="h-7 w-7 text-nova-300/35" />
                  <div className="mt-4 flex items-center gap-1">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                    ))}
                  </div>
                  <p className="mt-5 flex-1 text-[13.5px] leading-[1.82] text-mist-bright">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <Divider className="my-6" />
                  <div className="flex items-center gap-3">
                    <Avatar src={t.image} alt={t.name} size={42} />
                    <div>
                      <p className="text-[13px] font-semibold text-white">{t.name}</p>
                      <p className="mt-0.5 text-[11px] text-mist">{t.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative pb-8 pt-10">
        <div className={container}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative overflow-hidden rounded-[32px] border border-white/10"
          >
            <img
              src="/images/aurora-band.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,10,26,0.9),rgba(20,16,52,0.72),rgba(8,10,26,0.9))]" />
            <div className="noise-layer absolute inset-0 opacity-[0.05]" />

            <div className="relative px-7 py-16 text-center sm:px-12 sm:py-20">
              <Eyebrow>Start today · free forever plan</Eyebrow>
              <h2 className="mx-auto mt-7 max-w-3xl text-balance text-[clamp(2.15rem,5.2vw,3.65rem)] font-semibold leading-[1.05]">
                Your best studying is <GradientText>one click away</GradientText>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-[15px] leading-[1.8] text-mist-bright/85">
                Join 240,000+ learners using EduNova AI to understand more, remember longer and
                stay consistently motivated.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Sparkles className="h-[17px] w-[17px]" />
                    Create free account
                  </Button>
                </Link>
                <Link to="/chat" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    Try AI chat first
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[11.5px] text-mist-bright/70">
                {['No credit card required', 'Cancel anytime', 'GDPR compliant', 'SOC 2 ready'].map(
                  (item) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                      {item}
                    </span>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
