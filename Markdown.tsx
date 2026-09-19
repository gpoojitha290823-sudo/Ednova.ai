import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/*  Minimal markdown-style renderer for the chat demo.                 */
/*  Supports: ## headings, ``` code blocks, `inline code`,            */
/*  **bold**, *italic*, > quotes, - bullets, 1. numbered, tables.     */
/* ------------------------------------------------------------------ */

function renderInline(text: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = []
  // Tokenise: **bold**, `code`, *italic*, emoji-safe plain text
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    const key = `${keyBase}-${i++}`
    if (token.startsWith('**')) {
      parts.push(
        <strong key={key} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>,
      )
    } else if (token.startsWith('`')) {
      parts.push(
        <code
          key={key}
          className="rounded-md border border-nova-300/20 bg-nova-400/12 px-1.5 py-0.5 font-mono text-[0.86em] text-nova-100"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else {
      parts.push(
        <em key={key} className="italic text-mist-bright">
          {token.slice(1, -1)}
        </em>,
      )
    }
    lastIndex = match.index + token.length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

function renderTable(block: string, keyBase: string) {
  const rows = block
    .trim()
    .split('\n')
    .filter((r) => r.trim())
  const parseRow = (row: string) =>
    row
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim())

  return (
    <div key={keyBase} className="my-3 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full border-collapse text-[12.5px]">
        <tbody>
          {rows.map((row, ri) =>
            /^\s*\|?\s*-{2,}/.test(row) ? null : (
              <tr key={`${keyBase}-r${ri}`} className={ri === 0 ? 'bg-white/[0.055]' : 'border-t border-white/[0.07]'}>
                {parseRow(row).map((cell, ci) => (
                  <td
                    key={`${keyBase}-c${ci}`}
                    className={`px-3.5 py-2.5 align-top ${
                      ri === 0 ? 'font-semibold text-white' : 'text-mist'
                    }`}
                  >
                    {renderInline(cell, `${keyBase}-${ri}-${ci}`)}
                  </td>
                ))}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.split(/```/)
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const isCode = bi % 2 === 1

        if (isCode) {
          const lines = block.split('\n')
          const lang = lines[0].trim() || 'code'
          const code = lines.slice(1).join('\n').trim()
          return (
            <div
              key={`code-${bi}`}
              className="my-3 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(6,9,22,0.72)]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.035] px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist/70">
                  {lang}
                </span>
              </div>
              <pre className="overflow-x-auto px-4 py-3.5">
                <code className="font-mono text-[11.8px] leading-[1.72] text-cyan-100/90">
                  {code}
                </code>
              </pre>
            </div>
          )
        }

        // Text block → line by line
        return (
          <div key={`text-${bi}`} className="space-y-2">
            {block.split('\n').map((line, li) => {
              const trimmed = line.trim()
              if (!trimmed) return null
              const key = `t-${bi}-${li}`

              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={key} className="pt-2 text-[13.5px] font-semibold text-white">
                    {renderInline(trimmed.slice(4), key)}
                  </h4>
                )
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={key} className="pt-1 text-[15.5px] font-semibold text-white">
                    {renderInline(trimmed.slice(3), key)}
                  </h3>
                )
              }
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote
                    key={key}
                    className="my-2 border-l-2 border-nova-300/50 bg-nova-400/[0.07] px-4 py-2.5 text-[12.8px] italic text-mist-bright"
                  >
                    {renderInline(trimmed.slice(2), key)}
                  </blockquote>
                )
              }
              if (/^\d+\.\s/.test(trimmed)) {
                return (
                  <div key={key} className="flex gap-2.5 pl-1">
                    <span className="mt-[3px] flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border border-nova-300/30 bg-nova-400/15 text-[10px] font-semibold text-nova-100">
                      {trimmed.match(/^\d+/)?.[0]}
                    </span>
                    <p className="flex-1 text-[12.9px] leading-[1.72] text-mist">
                      {renderInline(trimmed.replace(/^\d+\.\s/, ''), key)}
                    </p>
                  </div>
                )
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
                return (
                  <div key={key} className="flex gap-2.5 pl-1">
                    <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[linear-gradient(135deg,#7dd3fc,#a78bfa)]" />
                    <p className="flex-1 text-[12.9px] leading-[1.72] text-mist">
                      {renderInline(trimmed.slice(2), key)}
                    </p>
                  </div>
                )
              }
              if (trimmed.startsWith('|')) {
                return null // handled by table pass below
              }

              return (
                <p key={key} className="text-[12.9px] leading-[1.78] text-mist">
                  {renderInline(trimmed, key)}
                </p>
              )
            })}

            {/* Table pass */}
            {/\|.*\|/.test(block) && renderTable(block, `table-${bi}`)}
          </div>
        )
      })}
    </div>
  )
}
