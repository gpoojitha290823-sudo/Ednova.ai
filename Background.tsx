import { memo } from 'react'

/**
 * Fixed ambient background layer: deep gradient canvas, drifting aurora
 * orbs, a masked grid, and a fine noise wash for texture.
 */
function BackgroundBase() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      {/* Base canvas gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-12%,#131a3d_0%,#080b1c_38%,#05060f_72%)]" />

      {/* Aurora orbs */}
      <div className="absolute -left-[14%] top-[-12%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(79,87,240,0.42),transparent_66%)] blur-[92px] animate-orb-drift" />
      <div className="absolute right-[-12%] top-[-6%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.36),transparent_66%)] blur-[96px] animate-orb-drift-slow" />
      <div className="absolute left-[22%] top-[36%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2),transparent_68%)] blur-[110px] animate-orb-drift" />
      <div className="absolute bottom-[-18%] left-[6%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.22),transparent_68%)] blur-[112px] animate-orb-drift-slow" />
      <div className="absolute bottom-[-10%] right-[8%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.2),transparent_68%)] blur-[108px] animate-orb-drift" />

      {/* Soft horizon band */}
      <div className="absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(180deg,rgba(99,102,241,0.1),transparent)]" />

      {/* Grid */}
      <div className="grid-lines absolute inset-0" />

      {/* Fine grain */}
      <div className="noise-layer absolute inset-0 opacity-[0.032] mix-blend-overlay" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_38%,rgba(4,6,15,0.62)_100%)]" />
    </div>
  )
}

export const Background = memo(BackgroundBase)
