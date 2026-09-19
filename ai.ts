/* ------------------------------------------------------------------ */
/*  Lightweight knowledge engine that powers the EduNova chat demo.    */
/*  It pattern-matches the prompt and returns structured, formatted    */
/*  tutoring responses (headings, lists, code blocks, inline code).    */
/* ------------------------------------------------------------------ */

type Rule = { test: RegExp; reply: string }

const codeSample = (lang: string, code: string, note: string) =>
  `\n\`\`\`${lang}\n${code}\n\`\`\`\n${note}\n`

const rules: Rule[] = [
  {
    test: /\b(hello|hi|hey|good\s(morning|afternoon|evening)|howdy)\b/i,
    reply: `## Hello! 👋 Great to see you.

I'm **Nova**, your EduNova tutor. I can help you with:

- **Explaining concepts** — from photosynthesis to gradient descent
- **Solving problems step by step** — maths, physics, chemistry, code
- **Writing & feedback** — essays, summaries, study plans
- **Coding** — Python, JavaScript, Java, C++, SQL and more

Just tell me what you're working on, and how deep you'd like to go.`,
  },
  {
    test: /\b(photosynthesis|chlorophyll|plant)\b/i,
    reply: `## Photosynthesis — the elegant engine of life

Photosynthesis is how plants convert **light energy** into **chemical energy** (glucose). The overall equation:

> 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

### The two stages

1. **Light-dependent reactions** (thylakoid membrane)
   - Chlorophyll absorbs photons
   - Water is split → releasing **oxygen**
   - Produces **ATP** and **NADPH**
2. **Light-independent reactions / Calvin cycle** (stroma)
   - Uses ATP + NADPH
   - Fixes CO₂ into glucose

### Why it matters
- Produces the oxygen you're breathing right now
- Forms the base of nearly every food chain
- Drives the global carbon cycle

**Memory hook:** *Light reactions charge the battery; the Calvin cycle spends it.*`,
  },
  {
    test: /\b(photosynthesis|quadratic|derivative)\b.*\b(example|solve)\b|\b(quadratic|parabola)\b/i,
    reply: `## Solving a quadratic equation

For **ax² + bx + c = 0**, the quadratic formula is:

> x = (−b ± √(b² − 4ac)) / 2a

### Worked example: x² − 5x + 6 = 0

1. Identify: a = 1, b = −5, c = 6
2. Discriminant: b² − 4ac = 25 − 24 = **1**
3. x = (5 ± 1) / 2
4. So **x = 3** or **x = 2**

### Quick check by factoring
(x − 2)(x − 3) = 0 → same answers ✓

**Tip:** if the discriminant is negative, the roots are complex; if it's zero, there's exactly one repeated root.`,
  },
  {
    test: /\b(derivative|differentiat|calculus|integral|limit)\b/i,
    reply: `## Calculus, made calm

Calculus studies **how things change** (derivatives) and **how things accumulate** (integrals).

### The derivative — intuition first
The derivative is the *slope of the tangent line*: how fast a quantity changes at exactly one instant.

${codeSample(
  'python',
  `# Numerical derivative of f(x) = x^2 at x = 3
def f(x):
    return x ** 2

h = 1e-6
derivative = (f(3 + h) - f(3 - h)) / (2 * h)
print(round(derivative, 4))  # 6.0`,
  'The exact answer is 2x → 6 at x = 3. The tiny `h` gives us a very close approximation.',
)}

### Rules worth memorising
| Function | Derivative |
| --- | --- |
| xⁿ | n·xⁿ⁻¹ |
| sin(x) | cos(x) |
| eˣ | eˣ |
| ln(x) | 1/x |

### The beautiful part
The **Fundamental Theorem of Calculus** links the two: differentiation and integration are inverse operations.`,
  },
  {
    test: /\b(python|javascript|java\b|c\+\+|typescript|coding|programming|code|function|algorithm)\b/i,
    reply: `## Let's write some clean code

Here's a classic: **two-sum** — find two numbers in a list that add up to a target.

${codeSample(
  'python',
  `def two_sum(nums: list[int], target: int) -> tuple[int, int] | None:
    """Return indices of the two numbers that add up to target."""
    seen: dict[int, int] = {}          # value -> index

    for i, value in enumerate(nums):
        complement = target - value
        if complement in seen:
            return seen[complement], i
        seen[value] = i

    return None


print(two_sum([2, 7, 11, 15], 9))   # (0, 1)`,
  'This runs in **O(n)** time because dictionary lookups are O(1) — much better than the naive O(n²) nested loop.',
)}

### Why this pattern matters
- **Hash maps** trade a little memory for a lot of speed
- Always ask: *what do I need to have seen already?*
- Name things for intent (\`complement\`, not \`x\`)

Want me to walk through the complexity analysis, or translate this into another language?`,
  },
  {
    test: /\b(machine learning|neural network|deep learning|ai\b|artificial intelligence|gradient descent|llm|transformer)\b/i,
    reply: `## Machine learning — the core idea

Instead of programming explicit rules, you give the model **examples** and let it find the pattern.

### The three flavours
1. **Supervised** — labelled data (spam vs. not spam)
2. **Unsupervised** — find structure (customer segments)
3. **Reinforcement** — learn by reward (game playing)

### Gradient descent, intuitively
Imagine you're blindfolded on a hillside and want to reach the valley:
- Feel the slope under your feet → **compute the gradient**
- Take a step downhill → **update the weights**
- Repeat until the steps stop helping → **convergence**

> θ := θ − α · ∇J(θ)

Where **α** is the learning rate — too large and you overshoot, too small and training crawls.

### What actually matters in practice
- **Data quality** beats model complexity, almost always
- **Validation splits** protect you from fooling yourself
- Start simple, then add complexity only when justified`,
  },
  {
    test: /\b(study|revise|revision|exam|test prep|memor|focus|procrastinat|motivat|time management|schedule)\b/i,
    reply: `## A study system that actually sticks

Most people study by *re-reading*. It feels productive, but it's surprisingly weak. Here's what the evidence supports instead:

### 1. Active recall
Close the book and force yourself to retrieve the answer. Struggle is not a bug — **it's the mechanism**.

### 2. Spaced repetition
Review at expanding intervals:
- Day 1 → Day 3 → Day 7 → Day 21 → Day 60

### 3. Interleaving
Mix problem types in one session instead of blocking them. It feels harder and works far better.

### 4. The Feynman technique
1. Write the concept as if explaining it to a 12-year-old
2. Notice where your explanation breaks down
3. Go back to the source, then simplify again

### A realistic 90-minute block
| Time | Activity |
| --- | --- |
| 0–5 min | Recall yesterday's material from memory |
| 5–45 min | Deep work on one new concept |
| 45–50 min | Real break (move, don't scroll) |
| 50–80 min | Practice problems |
| 80–90 min | Summarise in your own words |

Want me to build this into your **EduNova planner**?`,
  },
  {
    test: /\b(essay|writing|write|thesis|paragraph|grammar|summar|email|cover letter)\b/i,
    reply: `## Writing that reads effortlessly

### The structure that almost always works

1. **Hook** — a surprising fact, question, or concrete image
2. **Context** — why this matters right now
3. **Thesis** — your single, arguable claim
4. **Body** — one idea per paragraph, each with evidence
5. **So-what** — the implication, not just a summary

### The paragraph formula
> **Claim** → **Evidence** → **Analysis** → **Link back**

Most weak writing skips the *analysis* step — it presents a fact and moves on, without explaining why the reader should care.

### Editing checklist
- ✂️ Cut the first sentence (it's usually a warm-up)
- 🔁 Replace abstract nouns with concrete verbs
- 🗣️ Read it aloud — your ear catches what your eye skips
- 📏 Aim for 15–20 words per sentence on average

Share a draft and I'll give you line-level feedback.`,
  },
  {
    test: /\b(history|war|revolution|ancient|renaissance|empire|industrial)\b/i,
    reply: `## How to actually understand history

History isn't a list of dates — it's a network of **causes, pressures and turning points**.

### A useful lens: the 4C framework
| Lens | Question to ask |
| --- | --- |
| **Context** | What was normal at the time? |
| **Causes** | What pressures had been building? |
| **Choices** | What decisions did people actually make? |
| **Consequences** | What changed — and for whom? |

### Example: the Industrial Revolution
- **Context:** agricultural improvements → surplus labour
- **Causes:** accessible coal, capital markets, colonial trade
- **Choices:** factory owners optimised for throughput, not wellbeing
- **Consequences:** urbanisation, new class structures, labour movements

### Study tip
For every event you memorise, write one sentence each for *why it happened* and *what it changed*. That single habit turns rote recall into real understanding.`,
  },
  {
    test: /\b(physics|force|velocity|acceleration|energy|newton|gravity|quantum|relativity|momentum)\b/i,
    reply: `## Physics: build from first principles

### Newton's three laws — in plain language
1. **Inertia** — objects keep doing what they're doing unless a force interferes
2. **F = ma** — force equals mass times acceleration (the whole of classical mechanics in five characters)
3. **Action/reaction** — forces always come in pairs

### The problem-solving recipe
1. Draw the diagram (seriously — half the marks are here)
2. List knowns and unknowns with units
3. Choose the principle: energy? momentum? kinematics?
4. Solve symbolically, *then* plug in numbers
5. Sanity-check the units and magnitude

### Worked snippet
${codeSample(
  'python',
  `# Kinematics: how far does a car travel accelerating at 2 m/s^2 for 5 s?
a = 2      # m/s^2
t = 5      # s
v0 = 0     # m/s

distance = v0 * t + 0.5 * a * t ** 2
final_velocity = v0 + a * t

print(f"Distance: {distance} m")        # 25.0 m
print(f"Final velocity: {final_velocity} m/s")  # 10.0 m/s`,
  'Notice we solved it symbolically first, then substituted — that pattern scales to far harder problems.',
)}

**Golden rule:** energy is almost always the fastest route when forces vary with position.`,
  },
  {
    test: /\b(chemistry|atom|molecule|reaction|periodic|bond|acid|base|organic)\b/i,
    reply: `## Chemistry without the memorisation trap

### The three big ideas everything hangs on
1. **Structure determines properties** — why water is weird, why metals conduct
2. **Energy drives change** — reactions happen when the products are more stable
3. **Equilibrium, not completion** — most reactions are a negotiation

### Reading the periodic table like a chemist
- **Left → right:** atomic radius shrinks, electronegativity rises
- **Top → bottom:** atoms get larger, more reactive metals
- **Same group:** similar chemistry (they have the same valence electrons)

### The reaction types worth recognising
| Type | Pattern |
| --- | --- |
| Synthesis | A + B → AB |
| Decomposition | AB → A + B |
| Single replacement | A + BC → AC + B |
| Combustion | Fuel + O₂ → CO₂ + H₂O |
| Acid–base | HA + BOH → BA + H₂O |

**Study strategy:** learn the *why* behind each trend, and the exceptions stop being arbitrary.`,
  },
  {
    test: /\b(spanish|french|german|language|learn a language|vocabulary|grammar|english)\b/i,
    reply: `## Learning a language the efficient way

### The 80/20 of language learning
- The **1,000 most common words** cover roughly 85% of everyday conversation
- Mastering **10 core verb patterns** lets you build thousands of sentences
- Pronunciation early saves months of unlearning later

### A daily routine that works (30 min)
| Minutes | Activity |
| --- | --- |
| 0–10 | Spaced-repetition vocabulary (Anki-style) |
| 10–20 | Comprehensible input — a podcast or graded reader |
| 20–27 | Shadowing: repeat after a native speaker, mimicking rhythm |
| 27–30 | Write 3 sentences using today's new words |

### The mindset shift
Fluency is not *knowing more words* — it's **recovering faster** when you don't know one. Train paraphrasing, not perfection.`,
  },
  {
    test: /\b(business|marketing|startup|finance|economics|invest|accounting|entrepreneur)\b/i,
    reply: `## Business fundamentals, distilled

### The only three numbers that matter first
1. **Revenue** — is anyone paying?
2. **Margin** — what's left after delivering it?
3. **Cash runway** — how long can you keep going?

Growth without margin is a hobby; margin without cash is a trap.

### Strategy in one paragraph
Strategy is choosing **what not to do**. A real strategy makes trade-offs painful and obvious — if everything is a priority, nothing is.

### The marketing loop
> **Attention → Interest → Trust → Action → Advocacy**

Most people pour effort into *attention* and neglect **trust** — which is where the compounding actually happens.`,
  },
  {
    test: /\b(who are you|what are you|your name|about you|edunova|how do you work)\b/i,
    reply: `## About me ✨

I'm **Nova**, the AI tutor inside **EduNova AI**.

### What makes me different
- 🧠 **Context-aware** — I remember the shape of our conversation
- 🎯 **Adaptive** — I match explanations to your level, not a textbook's
- 🧱 **Step-first** — I show reasoning, not just results
- 🗓️ **Connected** — I can feed insights into your planner, notes and quizzes

### What I'm great at
Explaining concepts · solving problems step by step · reviewing writing · debugging code · building study plans · quizzing you to test recall

### What I'm not
I'm not a substitute for your own thinking — I'm the scaffolding that helps it go further. Ask me anything, and push back when something doesn't click.`,
  },
]

const fallback = `## Great question — let's break it down

Here's how I'd approach it:

### 1. Clarify the goal
Before diving in, it helps to pin down exactly what "understanding" should look like. Are you preparing for an exam, building something, or trying to reason from first principles?

### 2. Build the mental model
- Start with the **simplest version** that's still true
- Add complexity only where reality forces it
- Always ask *why* at least three times

### 3. Test it
The fastest way to find the gaps in your understanding is to try explaining it to someone else — or to me.

${codeSample(
  'python',
  `# A reusable learning loop
def learn(topic: str) -> dict:
    return {
        "explore": f"Get the big picture of {topic}",
        "break_down": "Split into 3-5 core ideas",
        "practice": "Solve problems without looking",
        "teach": f"Explain {topic} in plain language",
        "review": "Revisit after 1, 3 and 7 days",
    }

for step, action in learn("your topic").items():
    print(f"{step:>12}: {action}")`,
  'Feel free to share more detail about your specific question and I\'ll give you a much more targeted answer.',
)}

Tell me a bit more about the specific angle you're after, and I'll go deeper.`

export function generateResponse(prompt: string): string {
  const found = rules.find((r) => r.test.test(prompt))
  return found ? found.reply : fallback
}

/* ------------------------------------------------------------------ */
/*  Suggested prompts                                                   */
/* ------------------------------------------------------------------ */

export const suggestions = [
  {
    icon: '🧠',
    title: 'Explain machine learning',
    prompt: 'Explain how machine learning and gradient descent work in simple terms',
  },
  {
    icon: '🐍',
    title: 'Write Python code',
    prompt: 'Write a Python function for the two-sum problem and explain the complexity',
  },
  {
    icon: '📐',
    title: 'Solve a quadratic',
    prompt: 'Show me how to solve a quadratic equation step by step with an example',
  },
  {
    icon: '📚',
    title: 'Build a study plan',
    prompt: 'Help me build an effective study system with spaced repetition',
  },
  {
    icon: '⚛️',
    title: 'Explain physics',
    prompt: 'Explain Newton\'s laws and how to solve physics problems from first principles',
  },
  {
    icon: '✍️',
    title: 'Improve my writing',
    prompt: 'Give me a framework for writing a clear, persuasive essay',
  },
]

export const quickTopics = [
  'Mathematics',
  'Physics',
  'Programming',
  'Chemistry',
  'History',
  'Writing',
  'Study Skills',
  'Languages',
]
