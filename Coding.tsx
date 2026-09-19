import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Braces,
  Bug,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  Code2,
  Command,
  Cpu,
  Flame,
  GraduationCap,
  Layers,
  Lightbulb,
  Play,
  Rocket,
  RotateCcw,
  Sparkles,
  Star,
  Terminal,
  Trophy,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
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
/*  Syntax highlighting                                                */
/* ------------------------------------------------------------------ */

type Lang = 'python' | 'javascript' | 'java' | 'cpp'

const keywordMap: Record<Lang, string[]> = {
  python: [
    'def', 'return', 'for', 'in', 'if', 'elif', 'else', 'while', 'class', 'import',
    'from', 'as', 'with', 'try', 'except', 'finally', 'lambda', 'None', 'True',
    'False', 'and', 'or', 'not', 'is', 'pass', 'break', 'continue', 'yield',
    'async', 'await', 'global', 'raise',
  ],
  javascript: [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'extends', 'new', 'this', 'import', 'export', 'from', 'default',
    'try', 'catch', 'finally', 'throw', 'async', 'await', 'of', 'in', 'typeof',
    'instanceof', 'null', 'undefined', 'true', 'false', 'switch', 'case', 'break',
  ],
  java: [
    'public', 'private', 'protected', 'static', 'final', 'void', 'int', 'double',
    'float', 'boolean', 'char', 'long', 'short', 'byte', 'String', 'class',
    'interface', 'extends', 'implements', 'new', 'return', 'if', 'else', 'for',
    'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch',
    'finally', 'throw', 'throws', 'import', 'package', 'this', 'super', 'null',
    'true', 'false',
  ],
  cpp: [
    'int', 'float', 'double', 'char', 'bool', 'void', 'auto', 'const', 'static',
    'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
    'continue', 'class', 'struct', 'public', 'private', 'protected', 'template',
    'typename', 'namespace', 'using', 'std', 'vector', 'string', 'include',
    'nullptr', 'true', 'false', 'new', 'delete',
  ],
}

const tokenColors: Record<string, string> = {
  comment: '#5c6b9c',
  string: '#86e8c0',
  keyword: '#c792ea',
  number: '#f78c6c',
  func: '#7dd3fc',
  type: '#ffcb6b',
  punct: '#89a8d8',
  plain: '#d6e2ff',
}

function highlight(code: string, lang: Lang): ReactNode[] {
  const keywords = keywordMap[lang]
  const keywordRegex = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const commentPattern = lang === 'python' || lang === 'cpp' ? '#[^\\n]*' : '//[^\\n]*'
  const regex = new RegExp(
    `(${commentPattern})|("(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*')|(\\b(?:${keywordRegex})\\b)|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_]\\w*)(?=\\s*\\()`,
    'g',
  )

  const nodes: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={key++} style={{ color: tokenColors.plain }}>
          {code.slice(lastIndex, match.index)}
        </span>,
      )
    }

    const [full, comment, str, keyword, num, fn] = match
    let color = tokenColors.plain
    if (comment) color = tokenColors.comment
    else if (str) color = tokenColors.string
    else if (keyword) color = tokenColors.keyword
    else if (num) color = tokenColors.number
    else if (fn) color = tokenColors.func

    nodes.push(
      <span key={key++} style={{ color, fontStyle: comment ? 'italic' : 'normal' }}>
        {full}
      </span>,
    )
    lastIndex = match.index + full.length
  }

  if (lastIndex < code.length) {
    nodes.push(
      <span key={key++} style={{ color: tokenColors.plain }}>
        {code.slice(lastIndex)}
      </span>,
    )
  }

  return nodes
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const languages: {
  key: Lang
  name: string
  ext: string
  color: string
  gradient: string
  blurb: string
  snippet: string
  output: string[]
}[] = [
  {
    key: 'python',
    name: 'Python',
    ext: 'main.py',
    color: '#4de3ff',
    gradient: 'linear-gradient(135deg,#3776ab,#4de3ff)',
    blurb: 'Clean, readable and perfect for data science, automation and AI.',
    snippet: `# Binary search — O(log n) complexity
def binary_search(nums, target):
    """Return the index of target in a sorted list."""
    low, high = 0, len(nums) - 1

    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1


data = [2, 5, 8, 12, 16, 23, 38, 45, 67]
index = binary_search(data, 23)

print(f"Found 23 at index: {index}")`,
    output: ['Found 23 at index: 5', '', 'Process finished with exit code 0'],
  },
  {
    key: 'javascript',
    name: 'JavaScript',
    ext: 'app.js',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg,#f7df1e,#f59e0b)',
    blurb: 'The language of the web — from interactive UIs to serverless backends.',
    snippet: `// Debounce: limit how often a function can fire
function debounce(fn, delay = 300) {
  let timer = null;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}


// Example: resize handler that only runs
// 250ms after the user stops resizing
const onResize = debounce(() => {
  console.log("Layout recalculated");
}, 250);

window.addEventListener("resize", onResize);
console.log("Listener attached");`,
    output: ['Listener attached', '', 'Process finished with exit code 0'],
  },
  {
    key: 'java',
    name: 'Java',
    ext: 'Main.java',
    color: '#f87171',
    gradient: 'linear-gradient(135deg,#e76f51,#f87171)',
    blurb: 'Enterprise-grade, strongly typed and built for large-scale systems.',
    snippet: `public class Main {

    // Generic method to find the maximum
    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }

    public static void main(String[] args) {
        int maxInt = max(17, 42);
        double maxDouble = max(3.14, 2.71);
        String maxString = max("apple", "banana");

        System.out.println("Max int:    " + maxInt);
        System.out.println("Max double: " + maxDouble);
        System.out.println("Max string: " + maxString);
    }
}`,
    output: [
      'Max int:    42',
      'Max double: 3.14',
      'Max string: banana',
      '',
      'Process finished with exit code 0',
    ],
  },
  {
    key: 'cpp',
    name: 'C++',
    ext: 'main.cpp',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg,#6366f1,#a78bfa)',
    blurb: 'Raw performance and control — the backbone of engines and systems.',
    snippet: `#include <iostream>
#include <vector>
#include <numeric>

// Compute the moving average of a window
std::vector<double> moving_average(
    const std::vector<int>& data, int window) {

    std::vector<double> result;
    for (size_t i = 0; i + window <= data.size(); ++i) {
        int sum = std::accumulate(
            data.begin() + i,
            data.begin() + i + window, 0);
        result.push_back(static_cast<double>(sum) / window);
    }
    return result;
}

int main() {
    std::vector<int> values = {2, 4, 6, 8, 10, 12};
    auto avg = moving_average(values, 3);

    for (double v : avg)
        std::cout << v << " ";
    std::cout << std::endl;
    return 0;
}`,
    output: ['4 6 8 10 ', '', 'Process finished with exit code 0'],
  },
]

const challenges = [
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Arrays · Hash Maps',
    solved: true,
    acceptance: 92,
    desc: 'Find two numbers in an array that add up to a target value.',
  },
  {
    title: 'Longest Substring',
    difficulty: 'Medium',
    topic: 'Sliding Window',
    solved: true,
    acceptance: 68,
    desc: 'Find the length of the longest substring without repeating characters.',
  },
  {
    title: 'Merge Intervals',
    difficulty: 'Medium',
    topic: 'Sorting · Intervals',
    solved: true,
    acceptance: 61,
    desc: 'Merge all overlapping intervals into a non-overlapping list.',
  },
  {
    title: 'Word Ladder',
    difficulty: 'Hard',
    topic: 'BFS · Graphs',
    solved: false,
    acceptance: 34,
    desc: 'Find the shortest transformation sequence between two words.',
  },
  {
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Two Pointers',
    solved: false,
    acceptance: 41,
    desc: 'Compute how much water can be trapped after raining.',
  },
  {
    title: 'LRU Cache',
    difficulty: 'Medium',
    topic: 'Design · Linked List',
    solved: true,
    acceptance: 57,
    desc: 'Design a data structure that follows the LRU eviction policy.',
  },
]

const roadmap = [
  {
    step: '01',
    title: 'Programming fundamentals',
    desc: 'Variables, control flow, functions and data types — the vocabulary of code.',
    icon: <Code2 className="h-4.5 w-4.5" />,
    topics: ['Syntax', 'Loops', 'Functions', 'Debugging'],
    progress: 100,
  },
  {
    step: '02',
    title: 'Data structures',
    desc: 'Arrays, linked lists, stacks, queues, trees and graphs — and when to use each.',
    icon: <Layers className="h-4.5 w-4.5" />,
    topics: ['Arrays', 'Trees', 'Graphs', 'Hash Maps'],
    progress: 82,
  },
  {
    step: '03',
    title: 'Algorithms & complexity',
    desc: 'Searching, sorting, recursion, dynamic programming and Big-O reasoning.',
    icon: <Cpu className="h-4.5 w-4.5" />,
    topics: ['Sorting', 'Recursion', 'DP', 'Greedy'],
    progress: 54,
  },
  {
    step: '04',
    title: 'Build real projects',
    desc: 'APIs, databases, testing and deployment — turning knowledge into craft.',
    icon: <Rocket className="h-4.5 w-4.5" />,
    topics: ['APIs', 'SQL', 'Testing', 'DevOps'],
    progress: 21,
  },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function Coding() {
  const [langIndex, setLangIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<string[]>([])
  const [typedLines, setTypedLines] = useState(0)
  const lang = languages[langIndex]
  const consoleRef = useRef<HTMLDivElement>(null)

  const run = () => {
    setRunning(true)
    setOutput([])
    setTypedLines(0)
    window.setTimeout(() => {
      setOutput(lang.output)
      setRunning(false)
    }, 620)
  }

  /* Typing effect for console output */
  useEffect(() => {
    if (!output.length || typedLines >= output.length) return
    const t = window.setTimeout(() => setTypedLines((n) => n + 1), 110)
    return () => window.clearTimeout(t)
  }, [output, typedLines])

  useEffect(() => {
    setOutput([])
    setTypedLines(0)
  }, [langIndex])

  return (
    <div className="relative pt-28 sm:pt-32">
      <div className={container}>
        {/* ============ HERO ============ */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.19em] text-nova-200">
                <Terminal className="h-3 w-3" />
                Interactive coding tutor
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-balance text-[clamp(2.35rem,5.8vw,4.15rem)] font-semibold leading-[1.02]"
            >
              Learn to code by <GradientText>actually coding</GradientText>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-pretty text-[15px] leading-[1.82] text-mist sm:text-[16.5px]"
            >
              Write, run and debug real code in Python, JavaScript, Java and C++ — with a patient
              tutor that explains the <em className="text-mist-bright">why</em> behind every line.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" onClick={run}>
                <CirclePlay className="h-[17px] w-[17px]" />
                Run the example
              </Button>
              <Link to="/auth">
                <Button variant="ghost" size="lg">
                  Start the roadmap
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/[0.08] pt-8"
            >
              {[
                { value: 1200, suffix: '+', label: 'Practice problems' },
                { value: 24, suffix: '', label: 'Language tracks' },
                { value: 96, suffix: '%', label: 'Would recommend' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[24px] font-semibold leading-none text-white">
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-[9.5px] uppercase tracking-[0.14em] text-mist">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.28),transparent_62%)] blur-3xl" />
            <div className="glass relative overflow-hidden rounded-[26px]">
              <img
                src="/images/coding-visual.png"
                alt="Futuristic holographic code interface"
                className="h-[320px] w-full object-cover sm:h-[420px]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,24,0.12),rgba(8,11,24,0.8))]" />

              <div className="absolute inset-x-5 bottom-5 space-y-3">
                <div className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4f57f0,#a78bfa)]">
                    <Bug className="h-3.5 w-3.5 text-white" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[10.5px] font-medium text-white">
                      0 errors · 0 warnings
                    </p>
                    <div className="mt-1.5">
                      <ProgressBar value={100} tone="green" />
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                </div>

                <div className="glass-soft flex items-center gap-3 rounded-2xl px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/16">
                    <Flame className="h-3.5 w-3.5 text-amber-300" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-medium text-white">
                      14-day coding streak
                    </p>
                    <p className="mt-0.5 text-[8.5px] text-mist">
                      Personal best: 32 days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="glass absolute -right-3 top-9 hidden rounded-2xl px-4 py-3 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)] sm:block"
            >
              <div className="flex items-center gap-2.5">
                <Trophy className="h-4 w-4 text-amber-300" />
                <div>
                  <p className="text-[11px] font-semibold leading-none text-white">
                    Rank #248
                  </p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.13em] text-mist/80">
                    Global leaderboard
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ============ EDITOR ============ */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.75 }}
          className="mt-20"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="text-[clamp(1.55rem,3.2vw,2.15rem)] font-semibold leading-tight">
                Try it right here
              </h2>
              <p className="mt-2.5 max-w-xl text-[13px] leading-[1.78] text-mist">
                Switch languages, read the annotated code, then hit run — no setup, no installs.
              </p>
            </div>

            {/* Language tabs */}
            <div className="flex flex-wrap gap-2">
              {languages.map((l, i) => (
                <button
                  key={l.key}
                  onClick={() => setLangIndex(i)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-medium transition-all duration-300 ${
                    i === langIndex
                      ? 'border-white/22 text-white shadow-[0_14px_32px_-16px_rgba(255,255,255,0.32)]'
                      : 'border-white/[0.09] text-mist hover:border-white/20 hover:text-white'
                  }`}
                  style={
                    i === langIndex
                      ? { background: l.gradient }
                      : { background: 'rgba(255,255,255,0.032)' }
                  }
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            {/* Code panel */}
            <div className="glass overflow-hidden rounded-[22px]">
              {/* Title bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.028] px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400/75" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/75" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/75" />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5">
                    <Braces className="h-3 w-3 text-mist/70" />
                    <span className="font-mono text-[9.5px] text-mist">{lang.ext}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 text-[9px] text-mist transition-colors hover:text-white">
                    <RotateCcw className="h-2.5 w-2.5" />
                    Reset
                  </button>
                  <button
                    onClick={run}
                    disabled={running}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[linear-gradient(120deg,#22c55e,#10b981)] px-3.5 text-[9.5px] font-semibold text-white shadow-[0_12px_26px_-12px_rgba(34,197,94,0.9)] transition-transform hover:scale-[1.03] disabled:opacity-60"
                  >
                    {running ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-2.5 w-2.5 rounded-full border-2 border-white/35 border-t-white"
                      />
                    ) : (
                      <Play className="h-2.5 w-2.5 fill-current" />
                    )}
                    {running ? 'Running…' : 'Run code'}
                  </button>
                </div>
              </div>

              {/* Code */}
              <div className="relative">
                <div className="flex">
                  {/* Line numbers */}
                  <div className="select-none border-r border-white/[0.055] bg-white/[0.012] px-3.5 py-5">
                    {lang.snippet.split('\n').map((_, i) => (
                      <div
                        key={i}
                        className="text-right font-mono text-[10.5px] leading-[1.85] text-white/20"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  <pre className="flex-1 overflow-x-auto px-5 py-5">
                    <code className="block font-mono text-[11px] leading-[1.85]">
                      {highlight(lang.snippet, lang.key)}
                    </code>
                  </pre>
                </div>

                {/* Glow accent */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(11,16,32,0.55))]" />
              </div>

              {/* Console */}
              <div className="border-t border-white/[0.08] bg-[rgba(5,8,20,0.62)]">
                <div className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3 w-3 text-emerald-300" />
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-mist">
                      Console output
                    </p>
                  </div>
                  {output.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/22 bg-emerald-400/10 px-2.5 py-1 text-[8px] font-semibold text-emerald-300">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Executed in 0.04s
                    </span>
                  )}
                </div>

                <div ref={consoleRef} className="min-h-[112px] px-5 pb-5">
                  {running ? (
                    <div className="flex items-center gap-2 py-3">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-emerald-300"
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                        />
                      ))}
                      <span className="ml-1.5 font-mono text-[9.5px] text-mist/70">
                        Compiling and executing…
                      </span>
                    </div>
                  ) : output.length === 0 ? (
                    <p className="py-3 font-mono text-[9.5px] text-mist/42">
                      Press <span className="text-emerald-300">Run code</span> to see the output
                      here.
                    </p>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      {output.slice(0, typedLines).map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.24 }}
                          className={`font-mono text-[10px] leading-[1.7] ${
                            line.includes('exit code 0')
                              ? 'text-emerald-300/75'
                              : 'text-cyan-100/85'
                          }`}
                        >
                          {line || '\u00A0'}
                        </motion.p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Explanation panel */}
            <div className="space-y-6">
              <GlassCard hover={false} className="p-6">
                <div className="flex items-start gap-3.5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                    style={{ background: lang.gradient }}
                  >
                    <Lightbulb className="h-4.5 w-4.5 text-white" />
                  </span>
                  <div>
                    <h3 className="text-[13.5px] font-semibold leading-tight">
                      About {lang.name}
                    </h3>
                    <p className="mt-2 text-[10.5px] leading-[1.78] text-mist">{lang.blurb}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    {
                      label: 'Paradigm',
                      value:
                        lang.key === 'python'
                          ? 'Multi-paradigm'
                          : lang.key === 'java'
                            ? 'Object-oriented'
                            : lang.key === 'cpp'
                              ? 'Multi-paradigm'
                              : 'Multi-paradigm',
                    },
                    {
                      label: 'Typing',
                      value: lang.key === 'python' || lang.key === 'javascript' ? 'Dynamic' : 'Static',
                    },
                    {
                      label: 'Best for',
                      value:
                        lang.key === 'python'
                          ? 'AI, data, automation'
                          : lang.key === 'javascript'
                            ? 'Web, servers, tooling'
                            : lang.key === 'java'
                              ? 'Enterprise, Android'
                              : 'Systems, games, HPC',
                    },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between border-b border-white/[0.07] pb-3 last:border-0 last:pb-0"
                    >
                      <p className="text-[9.5px] uppercase tracking-[0.13em] text-mist/75">
                        {r.label}
                      </p>
                      <p className="text-[10px] font-medium text-white">{r.value}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hover={false} className="p-6">
                <div className="flex items-center gap-2.5">
                  <Command className="h-4 w-4 text-nova-300" />
                  <h3 className="text-[12.5px] font-semibold">What this code teaches</h3>
                </div>

                <ul className="mt-5 space-y-3">
                  {[
                    'Divide-and-conquer problem decomposition',
                    'Loop invariants and boundary conditions',
                    'Time and space complexity reasoning',
                    'Clean, self-documenting function design',
                  ].map((p, i) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-nova-300/32 bg-nova-400/[0.15] text-[8px] font-semibold text-nova-100">
                        {i + 1}
                      </span>
                      <p className="text-[10px] leading-[1.72] text-mist">{p}</p>
                    </li>
                  ))}
                </ul>

                <Link to="/chat" className="mt-6 block">
                  <button className="group flex w-full items-center justify-center gap-2 rounded-full border border-nova-300/25 bg-nova-400/[0.13] py-2.5 text-[10px] font-semibold text-white transition-all hover:bg-nova-400/[0.22]">
                    <Sparkles className="h-3 w-3 text-nova-200" />
                    Ask Nova to explain further
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </GlassCard>

              <GlassCard hover={false} className="overflow-hidden p-0">
                <div className="relative h-[124px]">
                  <img
                    src="/images/aurora-band.png"
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,14,32,0.82),rgba(30,22,72,0.55))]" />
                  <div className="absolute inset-0 flex flex-col justify-center px-6">
                    <Star className="h-4 w-4 text-amber-300" />
                    <p className="mt-2 text-[11px] font-semibold leading-snug text-white">
                      &ldquo;The best way to learn to code is to build.&rdquo;
                    </p>
                    <p className="mt-1.5 text-[8.5px] uppercase tracking-[0.15em] text-white/62">
                      EduNova mentors
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </motion.div>

        {/* ============ ROADMAP ============ */}
        <section className="mt-24">
          <SectionHeading
            eyebrow="Your learning path"
            title={
              <>
                A roadmap that <GradientText>actually makes sense</GradientText>
              </>
            }
            description="Four stages, each building on the last — designed to take you from first principles to real, deployable skills."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {roadmap.map((r, i) => (
              <motion.div
                key={r.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(99,102,241,0.3),rgba(139,92,246,0.15))] text-nova-100">
                      {r.icon}
                    </span>
                    <span className="font-display text-[27px] font-semibold leading-none text-white/9">
                      {r.step}
                    </span>
                  </div>

                  <h3 className="mt-5 text-[13.5px] font-semibold leading-snug">{r.title}</h3>
                  <p className="mt-2.5 flex-1 text-[10.5px] leading-[1.78] text-mist">{r.desc}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {r.topics.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/[0.085] bg-white/[0.038] px-2.5 py-1 text-[8.5px] text-mist"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[8.5px] uppercase tracking-[0.13em] text-mist/70">
                        Progress
                      </p>
                      <p className="text-[9.5px] font-semibold text-white">{r.progress}%</p>
                    </div>
                    <ProgressBar
                      value={r.progress}
                      tone={r.progress === 100 ? 'green' : 'cool'}
                      className="mt-2"
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ CHALLENGES ============ */}
        <section className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="text-[clamp(1.55rem,3.2vw,2.15rem)] font-semibold leading-tight">
                Popular challenges
              </h2>
              <p className="mt-2.5 max-w-xl text-[12.5px] leading-[1.78] text-mist">
                Practice with curated problems, ranked by difficulty and paired with detailed
                solutions.
              </p>
            </div>
            <Link to="/quiz">
              <Button variant="ghost">
                View all challenges
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((c, i) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                transition={{ delay: i * 0.07 }}
              >
                <GlassCard className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                          c.solved
                            ? 'bg-emerald-400/15 text-emerald-300'
                            : 'bg-white/[0.055] text-mist'
                        }`}
                      >
                        {c.solved ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Code2 className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div>
                        <h3 className="text-[12px] font-semibold leading-snug text-white">
                          {c.title}
                        </h3>
                        <p className="mt-1 text-[8.5px] text-mist/75">{c.topic}</p>
                      </div>
                    </div>

                    <Badge
                      tone={
                        c.difficulty === 'Easy'
                          ? 'success'
                          : c.difficulty === 'Medium'
                            ? 'warning'
                            : 'danger'
                      }
                      className="!text-[8px] !px-2 !py-0.5"
                    >
                      {c.difficulty}
                    </Badge>
                  </div>

                  <p className="mt-3.5 flex-1 text-[9.5px] leading-[1.72] text-mist">{c.desc}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] uppercase tracking-[0.12em] text-mist/65">
                          Acceptance
                        </p>
                        <p className="text-[8.5px] font-semibold text-white">{c.acceptance}%</p>
                      </div>
                      <ProgressBar
                        value={c.acceptance}
                        tone={c.acceptance > 70 ? 'green' : c.acceptance > 45 ? 'cool' : 'warm'}
                        className="mt-1.5"
                      />
                    </div>
                    <button className="flex h-7 items-center gap-1.5 rounded-full border border-white/[0.1] px-3 text-[8.5px] font-medium text-white transition-all hover:border-nova-300/40 hover:bg-nova-400/[0.15]">
                      <Play className="h-2 w-2 fill-current" />
                      Solve
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ CTA ============ */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="glass relative mt-20 overflow-hidden rounded-[28px] p-9 sm:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(129,140,248,0.2),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_78%,rgba(77,227,255,0.13),transparent_52%)]" />

          <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="max-w-xl text-center lg:text-left">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <BookOpen className="h-4 w-4 text-nova-200" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nova-200">
                  Free to start
                </p>
              </div>
              <h2 className="mt-5 text-balance text-[clamp(1.75rem,3.8vw,2.55rem)] font-semibold leading-[1.12]">
                Write your first line today. <GradientText>Build your future this year.</GradientText>
              </h2>
              <p className="mt-5 text-[13px] leading-[1.82] text-mist">
                Join thousands of learners using EduNova to go from curious beginner to confident
                developer — one honest step at a time.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap justify-center gap-3">
              <Link to="/auth">
                <Button size="lg">
                  <GraduationCap className="h-[17px] w-[17px]" />
                  Start free
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="ghost" size="lg">
                  <Zap className="h-4 w-4" />
                  Talk to Nova
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
