import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BrainCircuit,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  History,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  viewportOnce,
} from '../components/ui'

type Question = {
  id: string
  topic: TopicKey
  question: string
  options: string[]
  answer: number
  explanation: string
}

type TopicKey = 'science' | 'maths' | 'technology' | 'history' | 'language'

const topics: {
  key: TopicKey
  label: string
  icon: string
  gradient: string
  description: string
}[] = [
  {
    key: 'science',
    label: 'Science',
    icon: '🔬',
    gradient: 'linear-gradient(135deg,#10b981,#22d3ee)',
    description: 'Physics, biology, chemistry and the natural world',
  },
  {
    key: 'maths',
    label: 'Mathematics',
    icon: '📐',
    gradient: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    description: 'Algebra, calculus, statistics and problem solving',
  },
  {
    key: 'technology',
    label: 'Technology',
    icon: '💻',
    gradient: 'linear-gradient(135deg,#6366f1,#22d3ee)',
    description: 'Computing, AI, software and the digital world',
  },
  {
    key: 'history',
    label: 'History',
    icon: '🏛️',
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    description: 'Civilisations, turning points and great thinkers',
  },
  {
    key: 'language',
    label: 'Language',
    icon: '✍️',
    gradient: 'linear-gradient(135deg,#ec4899,#a855f7)',
    description: 'Grammar, vocabulary and writing craft',
  },
]

const questions: Question[] = [
  /* ---------------- Science ---------------- */
  {
    id: 's1',
    topic: 'science',
    question: 'Which organelle is primarily responsible for producing ATP in eukaryotic cells?',
    options: ['Ribosome', 'Mitochondrion', 'Golgi apparatus', 'Lysosome'],
    answer: 1,
    explanation:
      'Mitochondria are the "powerhouses" of the cell — they generate most of the cell\'s ATP through oxidative phosphorylation.',
  },
  {
    id: 's2',
    topic: 'science',
    question: 'What is the approximate speed of light in a vacuum?',
    options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁵ m/s'],
    answer: 1,
    explanation:
      'Light travels at roughly 299,792,458 metres per second — about 3 × 10⁸ m/s — the universal speed limit.',
  },
  {
    id: 's3',
    topic: 'science',
    question: 'Which gas makes up the largest proportion of Earth\'s atmosphere?',
    options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'],
    answer: 2,
    explanation:
      'Nitrogen accounts for about 78% of the atmosphere, oxygen roughly 21%, and everything else just over 1%.',
  },
  {
    id: 's4',
    topic: 'science',
    question: 'Newton\'s second law of motion is commonly expressed as…',
    options: ['F = ma', 'E = mc²', 'V = IR', 'PV = nRT'],
    answer: 0,
    explanation:
      'F = ma states that force equals mass times acceleration — the bridge between motion and its causes.',
  },
  {
    id: 's5',
    topic: 'science',
    question: 'What type of bond involves the sharing of electron pairs between atoms?',
    options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
    answer: 1,
    explanation:
      'Covalent bonds form when atoms share one or more pairs of electrons, as in H₂O and CO₂.',
  },

  /* ---------------- Maths ---------------- */
  {
    id: 'm1',
    topic: 'maths',
    question: 'What is the derivative of f(x) = x³ with respect to x?',
    options: ['x²', '3x²', '3x', 'x³/3'],
    answer: 1,
    explanation: 'Using the power rule d/dx(xⁿ) = n·xⁿ⁻¹, we get 3x².',
  },
  {
    id: 'm2',
    topic: 'maths',
    question: 'If log₁₀(1000) = x, what is x?',
    options: ['2', '3', '10', '100'],
    answer: 1,
    explanation: '10³ = 1000, so log₁₀(1000) = 3.',
  },
  {
    id: 'm3',
    topic: 'maths',
    question: 'What is the sum of the interior angles of a hexagon?',
    options: ['360°', '540°', '720°', '900°'],
    answer: 2,
    explanation: 'The formula (n − 2) × 180° gives (6 − 2) × 180° = 720°.',
  },
  {
    id: 'm4',
    topic: 'maths',
    question: 'The discriminant of ax² + bx + c is given by…',
    options: ['b² − 4ac', 'b² + 4ac', '−b ± 2a', '4ac − b²'],
    answer: 0,
    explanation:
      'The discriminant b² − 4ac tells you the nature of the roots: positive (two real), zero (one repeated), negative (complex).',
  },
  {
    id: 'm5',
    topic: 'maths',
    question: 'What is the median of the data set: 3, 7, 9, 12, 15?',
    options: ['7', '9', '12', '9.2'],
    answer: 1,
    explanation: 'With five ordered values, the median is the middle one — 9.',
  },

  /* ---------------- Technology ---------------- */
  {
    id: 't1',
    topic: 'technology',
    question: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
    options: ['Queue', 'Stack', 'Linked list', 'Binary tree'],
    answer: 1,
    explanation:
      'A stack behaves like a pile of plates: the last item pushed is the first one popped.',
  },
  {
    id: 't2',
    topic: 'technology',
    question: 'What does "HTTP" stand for?',
    options: [
      'HyperText Transfer Protocol',
      'High Transmission Text Process',
      'Hyperlink Transfer Technology Package',
      'Host Text Transfer Protocol',
    ],
    answer: 0,
    explanation:
      'HTTP (HyperText Transfer Protocol) is the foundational protocol used to transfer web pages.',
  },
  {
    id: 't3',
    topic: 'technology',
    question: 'In machine learning, what is "overfitting"?',
    options: [
      'The model is too simple to capture patterns',
      'The model memorises training data and generalises poorly',
      'The model trains too slowly',
      'The dataset is too small to use',
    ],
    answer: 1,
    explanation:
      'An overfitted model performs excellently on training data but badly on unseen data — it learned noise instead of signal.',
  },
  {
    id: 't4',
    topic: 'technology',
    question: 'Which number system do computers use at the hardware level?',
    options: ['Decimal (base 10)', 'Binary (base 2)', 'Hexadecimal (base 16)', 'Octal (base 8)'],
    answer: 1,
    explanation:
      'Digital circuits represent state with two voltage levels, making binary (0 and 1) the native language of hardware.',
  },
  {
    id: 't5',
    topic: 'technology',
    question: 'What is the time complexity of a binary search on a sorted array?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 1,
    explanation:
      'Each comparison halves the search space, giving logarithmic time — O(log n).',
  },

  /* ---------------- History ---------------- */
  {
    id: 'h1',
    topic: 'history',
    question: 'In which year did the first human land on the Moon?',
    options: ['1965', '1969', '1972', '1975'],
    answer: 1,
    explanation: 'Apollo 11 touched down on 20 July 1969, with Armstrong and Aldrin walking the surface.',
  },
  {
    id: 'h2',
    topic: 'history',
    question: 'The Renaissance is generally considered to have begun in which country?',
    options: ['France', 'England', 'Italy', 'Spain'],
    answer: 2,
    explanation:
      'The Renaissance began in Italian city-states like Florence in the 14th century before spreading across Europe.',
  },
  {
    id: 'h3',
    topic: 'history',
    question: 'Which ancient civilisation built the pyramids at Giza?',
    options: ['Roman', 'Ancient Egyptian', 'Mesopotamian', 'Greek'],
    answer: 1,
    explanation:
      'The Giza pyramids were constructed during Egypt\'s Old Kingdom, roughly 2580–2510 BCE.',
  },
  {
    id: 'h4',
    topic: 'history',
    question: 'The Industrial Revolution is widely regarded as starting in…',
    options: ['Germany', 'The United States', 'Great Britain', 'France'],
    answer: 2,
    explanation:
      'Britain\'s access to coal, capital and agricultural surplus made it the cradle of industrialisation from the mid-18th century.',
  },
  {
    id: 'h5',
    topic: 'history',
    question: 'Who wrote "The Communist Manifesto", published in 1848?',
    options: ['Adam Smith', 'Karl Marx and Friedrich Engels', 'John Locke', 'Voltaire'],
    answer: 1,
    explanation: 'Karl Marx and Friedrich Engels published the manifesto in February 1848 in London.',
  },

  /* ---------------- Language ---------------- */
  {
    id: 'l1',
    topic: 'language',
    question: 'Which of the following is an example of a metaphor?',
    options: [
      'He ran like the wind',
      'Time is a thief',
      'The wind whispered through the trees',
      'Buzzing bees flew by',
    ],
    answer: 1,
    explanation:
      '"Time is a thief" directly states one thing IS another — that\'s a metaphor. The others are simile, personification and onomatopoeia.',
  },
  {
    id: 'l2',
    topic: 'language',
    question: 'What is the correct past participle of the verb "to write"?',
    options: ['Wrote', 'Written', 'Writing', 'Writed'],
    answer: 1,
    explanation: 'Write → wrote (simple past) → written (past participle), as in "have written".',
  },
  {
    id: 'l3',
    topic: 'language',
    question: 'Which sentence uses the apostrophe correctly?',
    options: [
      'The dogs bone was buried.',
      'The dog\'s bone was buried.',
      'The dogs\' bone was buried.',
      'The dog bone\'s was buried.',
    ],
    answer: 1,
    explanation:
      'For a singular possessive, the apostrophe goes before the s: "the dog\'s bone".',
  },
  {
    id: 'l4',
    topic: 'language',
    question: '"Ephemeral" most nearly means…',
    options: ['Lasting forever', 'Short-lived', 'Extremely loud', 'Highly detailed'],
    answer: 1,
    explanation: 'Ephemeral describes something fleeting — lasting a very short time.',
  },
  {
    id: 'l5',
    topic: 'language',
    question: 'Which of these is a subordinate (dependent) clause?',
    options: [
      'She left the room',
      'Because it was raining',
      'The sun is shining',
      'Please close the door',
    ],
    answer: 1,
    explanation:
      '"Because it was raining" cannot stand alone as a sentence — it depends on a main clause to complete its meaning.',
  },
]

const difficulties = [
  { key: 'all', label: 'Mixed', desc: 'Balanced difficulty' },
  { key: 'quick', label: 'Quick 5', desc: 'Five questions' },
  { key: 'full', label: 'Full 10', desc: 'Ten questions' },
]

const secondsPerQuestion = 20

function ScoreRing({ percentage }: { percentage: number }) {
  const radius = 76
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative h-[196px] w-[196px]">
      <svg viewBox="0 0 190 190" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4de3ff" />
            <stop offset="52%" stopColor="#6d7cff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
        <circle
          cx="95"
          cy="95"
          r={radius}
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="13"
          fill="none"
        />
        <motion.circle
          cx="95"
          cy="95"
          r={radius}
          stroke="url(#ring-grad)"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (circumference * Math.min(100, percentage)) / 100,
          }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 14px rgba(109,124,255,0.6))' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-[42px] font-semibold leading-none">
          <GradientText>{Math.round(percentage)}%</GradientText>
        </p>
        <p className="mt-1.5 text-[10px] uppercase tracking-[0.19em] text-mist">Accuracy</p>
      </div>
    </div>
  )
}

export function Quiz() {
  const [stage, setStage] = useState<'setup' | 'playing' | 'results'>('setup')
  const [topic, setTopic] = useState<TopicKey | 'all'>('all')
  const [count, setCount] = useState(5)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeLeft, setTimeLeft] = useState(secondsPerQuestion)
  const timerRef = useRef<number | null>(null)

  const activeQuestions = useMemo(() => {
    const pool = topic === 'all' ? questions : questions.filter((q) => q.topic === topic)
    return pool.slice(0, count)
  }, [topic, count])

  const startQuiz = useCallback(() => {
    const pool = topic === 'all' ? questions : questions.filter((q) => q.topic === topic)
    setAnswers(new Array(Math.min(count, pool.length)).fill(null))
    setCurrent(0)
    setTimeLeft(secondsPerQuestion)
    setStage('playing')
  }, [topic, count])

  /* Timer */
  useEffect(() => {
    if (stage !== 'playing') return
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          return secondsPerQuestion
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [stage])

  /* Auto-advance handled through answers state */
  const selectAnswer = (index: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[current] = index
      return next
    })
  }

  const goNext = () => {
    if (current < activeQuestions.length - 1) {
      setCurrent((c) => c + 1)
      setTimeLeft(secondsPerQuestion)
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current)
      setStage('results')
    }
  }

  const goPrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1)
      setTimeLeft(secondsPerQuestion)
    }
  }

  const finish = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    setStage('results')
  }

  const correctCount = answers.filter(
    (a, i) => a !== null && activeQuestions[i] && a === activeQuestions[i].answer,
  ).length
  const answered = answers.filter((a) => a !== null).length
  const percentage = activeQuestions.length
    ? (correctCount / activeQuestions.length) * 100
    : 0

  const verdict =
    percentage >= 80
      ? { title: 'Outstanding!', text: 'You have a genuinely strong grasp of this material.', tone: 'success' }
      : percentage >= 60
        ? { title: 'Great progress!', text: 'Solid foundation — a quick review will lock it in.', tone: 'info' }
        : percentage >= 40
          ? { title: 'Good start', text: 'You are getting there. Focus on the explanations below.', tone: 'warning' }
          : { title: 'Keep going', text: 'Every expert started here. Review and try again!', tone: 'danger' }

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className={container}>
        {/* Header */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="text-center">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.19em] text-nova-200">
              <Target className="h-3 w-3" />
              Adaptive quiz engine
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mx-auto mt-6 max-w-3xl text-balance text-[clamp(2.25rem,5.6vw,3.85rem)] font-semibold leading-[1.03]"
          >
            Test what you <GradientText>really know</GradientText>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-pretty text-[15px] leading-[1.8] text-mist sm:text-[16px]"
          >
            Timed questions, instant feedback and detailed explanations — the fastest way to turn
            passive reading into durable knowledge.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ================= SETUP ================= */}
          {stage === 'setup' && (
            <motion.div
              key="setup"
              variants={stagger}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -18, transition: { duration: 0.28 } }}
              className="mt-12"
            >
              {/* Topic picker */}
              <motion.h2 variants={fadeUp} className="text-[15px] font-semibold text-white">
                1 · Choose a topic
              </motion.h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <motion.button
                  variants={fadeUp}
                  onClick={() => setTopic('all')}
                  className={`relative overflow-hidden rounded-[20px] border p-5 text-left transition-all duration-400 ${
                    topic === 'all'
                      ? 'border-nova-300/50 bg-[linear-gradient(135deg,rgba(79,87,240,0.28),rgba(124,77,255,0.16))] shadow-[0_22px_50px_-22px_rgba(99,102,241,0.9)]'
                      : 'border-white/[0.09] bg-white/[0.035] hover:border-white/[0.18] hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f57f0,#a78bfa)] text-[19px]">
                      🎯
                    </span>
                    {topic === 'all' && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-nova-400 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-[14px] font-semibold text-white">All topics</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-mist">
                    A balanced mix from every subject area
                  </p>
                </motion.button>

                {topics.map((t) => (
                  <motion.button
                    key={t.key}
                    variants={fadeUp}
                    onClick={() => setTopic(t.key)}
                    className={`relative overflow-hidden rounded-[20px] border p-5 text-left transition-all duration-400 ${
                      topic === t.key
                        ? 'border-nova-300/50 bg-[linear-gradient(135deg,rgba(79,87,240,0.28),rgba(124,77,255,0.16))] shadow-[0_22px_50px_-22px_rgba(99,102,241,0.9)]'
                        : 'border-white/[0.09] bg-white/[0.035] hover:border-white/[0.18] hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-2xl text-[19px]"
                        style={{ background: t.gradient }}
                      >
                        {t.icon}
                      </span>
                      {topic === t.key && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-nova-400 text-white">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-[14px] font-semibold text-white">{t.label}</p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-mist">
                      {t.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              {/* Length */}
              <motion.h2 variants={fadeUp} className="mt-12 text-[15px] font-semibold text-white">
                2 · Choose your length
              </motion.h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {difficulties.map((d) => {
                  const value = d.key === 'quick' ? 5 : d.key === 'full' ? 10 : 7
                  return (
                    <motion.button
                      key={d.key}
                      variants={fadeUp}
                      onClick={() => setCount(value)}
                      className={`rounded-[18px] border px-5 py-4 text-left transition-all ${
                        count === value
                          ? 'border-nova-300/50 bg-nova-400/[0.16]'
                          : 'border-white/[0.09] bg-white/[0.035] hover:border-white/[0.18]'
                      }`}
                    >
                      <p className="text-[13px] font-semibold text-white">{d.label}</p>
                      <p className="mt-1 text-[10.5px] text-mist">{d.desc}</p>
                    </motion.button>
                  )
                })}
              </div>

              {/* Start */}
              <motion.div
                variants={fadeUp}
                className="glass mt-10 flex flex-col items-center justify-between gap-6 rounded-[22px] p-7 sm:flex-row"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f57f0,#a78bfa)]">
                    <Timer className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-white">
                      {count} questions · {Math.round((count * secondsPerQuestion) / 60)} min
                    </p>
                    <p className="mt-1 text-[11px] text-mist">
                      {secondsPerQuestion}s per question · instant explanations
                    </p>
                  </div>
                </div>
                <Button size="lg" onClick={startQuiz} className="w-full sm:w-auto">
                  <Sparkles className="h-[17px] w-[17px]" />
                  Start the quiz
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ================= PLAYING ================= */}
          {stage === 'playing' && activeQuestions[current] && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, transition: { duration: 0.28 } }}
              className="mt-12"
            >
              {/* Top bar */}
              <div className="glass flex flex-wrap items-center justify-between gap-5 rounded-[20px] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f57f0,#a78bfa)]">
                    <BrainCircuit className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-mist">
                      Question {current + 1} of {activeQuestions.length}
                    </p>
                    <div className="mt-2 w-[190px]">
                      <ProgressBar
                        value={((current + 1) / activeQuestions.length) * 100}
                        tone="cool"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold ${
                      timeLeft <= 5
                        ? 'border-rose-400/40 bg-rose-400/12 text-rose-200'
                        : 'border-white/10 bg-white/[0.05] text-white'
                    }`}
                  >
                    <Clock className={`h-3.5 w-3.5 ${timeLeft <= 5 ? 'animate-pulse' : ''}`} />
                    {timeLeft}s
                  </div>
                  <button
                    onClick={finish}
                    className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-medium text-mist transition-colors hover:border-white/20 hover:text-white"
                  >
                    Finish early
                  </button>
                </div>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 26 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -26 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="glass mt-6 rounded-[24px] p-7 sm:p-9"
                >
                  <Badge tone="info">
                    {topics.find((t) => t.key === activeQuestions[current].topic)?.icon}{' '}
                    {topics.find((t) => t.key === activeQuestions[current].topic)?.label}
                  </Badge>
                  <h2 className="mt-5 max-w-3xl text-balance text-[clamp(1.25rem,2.9vw,1.85rem)] font-semibold leading-[1.32]">
                    {activeQuestions[current].question}
                  </h2>

                  <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
                    {activeQuestions[current].options.map((opt, i) => {
                      const selected = answers[current] === i
                      return (
                        <button
                          key={opt}
                          onClick={() => selectAnswer(i)}
                          className={`group flex items-center gap-3.5 rounded-[16px] border px-5 py-4 text-left transition-all duration-300 ${
                            selected
                              ? 'border-nova-300/55 bg-[linear-gradient(120deg,rgba(79,87,240,0.3),rgba(124,77,255,0.18))] shadow-[0_18px_40px_-20px_rgba(99,102,241,0.95)]'
                              : 'border-white/[0.09] bg-white/[0.035] hover:-translate-y-0.5 hover:border-white/[0.2] hover:bg-white/[0.07]'
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
                              selected
                                ? 'border-nova-200/60 bg-nova-300/25 text-white'
                                : 'border-white/12 bg-white/[0.05] text-mist group-hover:border-white/25'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1 text-[13px] leading-relaxed text-white/92">
                            {opt}
                          </span>
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-nova-300 text-[#0b1020]"
                            >
                              <Check className="h-3 w-3" />
                            </motion.span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={goPrev}
                      disabled={current === 0}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-[11.5px] font-medium text-mist transition-colors hover:border-white/20 hover:text-white disabled:opacity-35 disabled:hover:border-white/10 disabled:hover:text-mist"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Previous
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-[10.5px] text-mist/70">
                        {answers[current] === null ? 'Select an answer to continue' : 'Answer selected'}
                      </span>
                      <Button onClick={goNext} disabled={answers[current] === null}>
                        {current === activeQuestions.length - 1 ? 'See results' : 'Next question'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Question dots */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
                {activeQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrent(i)
                      setTimeLeft(secondsPerQuestion)
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-9 bg-[linear-gradient(90deg,#4de3ff,#a78bfa)]'
                        : answers[i] !== null
                          ? 'w-2.5 bg-nova-300/55'
                          : 'w-2.5 bg-white/14 hover:bg-white/28'
                    }`}
                    aria-label={`Go to question ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= RESULTS ================= */}
          {stage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18, transition: { duration: 0.28 } }}
              className="mt-12"
            >
              <div className="glass relative overflow-hidden rounded-[26px] p-8 sm:p-11">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(129,140,248,0.2),transparent_54%)]" />
                <div className="relative flex flex-col items-center gap-9 lg:flex-row lg:items-center">
                  <ScoreRing percentage={percentage} />

                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center gap-2 lg:justify-start">
                      <Trophy className="h-5 w-5 text-amber-300" />
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mist">
                        Quiz complete
                      </span>
                    </div>
                    <h2 className="mt-4 text-[clamp(1.85rem,4.2vw,2.65rem)] font-semibold leading-tight">
                      {verdict.title}{' '}
                      <GradientText>
                        {correctCount}/{activeQuestions.length}
                      </GradientText>
                    </h2>
                    <p className="mt-3.5 max-w-lg text-[13.5px] leading-[1.78] text-mist">
                      {verdict.text} You answered {answered} of {activeQuestions.length}{' '}
                      questions. Review the explanations below to turn every miss into a gain.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                      <Button onClick={startQuiz}>
                        <RotateCcw className="h-4 w-4" />
                        Retake quiz
                      </Button>
                      <Link to="/chat">
                        <Button variant="ghost">
                          <Lightbulb className="h-4 w-4" />
                          Ask Nova about this
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="grid w-full shrink-0 grid-cols-3 gap-3 lg:w-[212px] lg:grid-cols-1">
                    {[
                      {
                        icon: <CheckCircle2 className="h-4 w-4" />,
                        label: 'Correct',
                        value: correctCount,
                        cls: 'text-emerald-300 border-emerald-400/22 bg-emerald-400/[0.09]',
                      },
                      {
                        icon: <XCircle className="h-4 w-4" />,
                        label: 'Incorrect',
                        value: activeQuestions.length - correctCount,
                        cls: 'text-rose-300 border-rose-400/22 bg-rose-400/[0.09]',
                      },
                      {
                        icon: <Flame className="h-4 w-4" />,
                        label: 'Streak',
                        value: Math.round(percentage / 20),
                        cls: 'text-amber-300 border-amber-400/22 bg-amber-400/[0.09]',
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 ${s.cls}`}
                      >
                        {s.icon}
                        <div>
                          <p className="text-[15px] font-semibold leading-none">{s.value}</p>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.13em] opacity-75">
                            {s.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review */}
              <h3 className="mt-12 text-[17px] font-semibold">Answer review</h3>
              <div className="mt-6 space-y-4">
                {activeQuestions.map((q, i) => {
                  const userAnswer = answers[i]
                  const isCorrect = userAnswer === q.answer
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ delay: Math.min(i * 0.05, 0.3) }}
                      className={`glass rounded-[18px] p-5 ${
                        isCorrect
                          ? 'border-l-[3px] border-l-emerald-400/55'
                          : 'border-l-[3px] border-l-rose-400/55'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                            isCorrect
                              ? 'bg-emerald-400/18 text-emerald-300'
                              : 'bg-rose-400/18 text-rose-300'
                          }`}
                        >
                          {isCorrect ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        </span>
                        <div className="flex-1">
                          <p className="text-[12.5px] font-medium leading-relaxed text-white">
                            {q.question}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[10.5px]">
                            <span className="text-mist">
                              Your answer:{' '}
                              <span className={isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                                {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                              </span>
                            </span>
                            {!isCorrect && (
                              <span className="text-mist">
                                Correct:{' '}
                                <span className="text-emerald-300">{q.options[q.answer]}</span>
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.032] px-3.5 py-2.5">
                            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-nova-300" />
                            <p className="text-[10.5px] leading-[1.72] text-mist">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom CTA */}
              <div className="glass mt-12 flex flex-col items-center justify-between gap-6 rounded-[22px] p-8 sm:flex-row">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4f57f0,#a78bfa)]">
                    <Award className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-white">
                      Ready for the next challenge?
                    </p>
                    <p className="mt-1 text-[11px] text-mist">
                      Consistent practice is what builds real mastery.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStage('setup')
                    }}
                  >
                    <Zap className="h-4 w-4" />
                    Change topic
                  </Button>
                  <Button onClick={startQuiz}>
                    <History className="h-4 w-4" />
                    Try again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
