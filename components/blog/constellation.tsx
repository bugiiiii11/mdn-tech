// Generative banner art for blog cards: each post gets its own constellation,
// derived deterministically from the post id (FNV-1a hash -> mulberry32 PRNG).
// Deterministic means the exact same SVG renders on the server and the client,
// so there is no hydration mismatch and no Math.random at render time.
//
// Why constellations: the posts have no raster cover images (public/blog/ does
// not exist), and the old banner — a gradient wash with a stock category icon —
// read as a placeholder. Star charts are the one illustration the Event
// Horizon system already owns: violet lines are mass (structure), cyan-bright
// stars are light (the proof accent), dust stays decorative.

type Star = {
  x: number;
  y: number;
  r: number;
  bright: boolean;
};

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VIEW_W = 320;
const VIEW_H = 180;
const MARGIN = 28;

export const Constellation = ({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) => {
  const rand = mulberry32(hashSeed(seed));

  const starCount = 8 + Math.floor(rand() * 3);
  const stars: Star[] = Array.from({ length: starCount }, () => ({
    x: MARGIN + rand() * (VIEW_W - MARGIN * 2),
    y: MARGIN + rand() * (VIEW_H - MARGIN * 2),
    r: 1.3 + rand() * 0.9,
    bright: rand() < 0.28,
  }));
  // At least one cyan-bright star per constellation.
  if (!stars.some((s) => s.bright)) {
    stars[Math.floor(rand() * stars.length)].bright = true;
  }
  // Left-to-right polyline reads as a chart, not scribble.
  stars.sort((a, b) => a.x - b.x);

  const dust = Array.from({ length: 18 }, () => ({
    x: rand() * VIEW_W,
    y: rand() * VIEW_H,
    r: 0.5 + rand() * 0.6,
    o: 0.15 + rand() * 0.2,
  }));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {dust.map((d, i) => (
        <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o} />
      ))}

      <polyline
        points={stars.map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(" ")}
        fill="none"
        stroke="#7042f8"
        strokeOpacity={0.45}
        strokeWidth={1}
      />

      {stars.map((s, i) =>
        s.bright ? (
          <g key={`s${i}`}>
            <circle cx={s.x} cy={s.y} r={7} fill="#06b6d4" opacity={0.16} />
            <circle cx={s.x} cy={s.y} r={2.2} fill="#67e8f9" opacity={0.95} />
          </g>
        ) : (
          <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.8} />
        )
      )}
    </svg>
  );
};

// Category-tinted wash behind the constellation. Violet-first for AI,
// cyan-first for Web3 — same palette, different weighting, so a mixed grid
// still reads as one system.
export const BANNER_BG: Record<string, string> = {
  "AI & Engineering":
    "bg-gradient-to-br from-purple-900/50 via-[#030014] to-cyan-900/30",
  "Blockchain & Web3":
    "bg-gradient-to-br from-cyan-900/50 via-[#030014] to-purple-900/30",
};

export const DEFAULT_BANNER_BG =
  "bg-gradient-to-br from-purple-900/40 via-[#030014] to-cyan-900/30";
