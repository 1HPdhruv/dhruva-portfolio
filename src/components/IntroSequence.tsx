import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type IntroSequenceProps = {
  onComplete: () => void;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
};

type Obstacle = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
};

type DataBlock = {
  id: number;
  x: number;
  y: number;
  label: string;
  collected: boolean;
  pulse: boolean;
};

type Node = {
  id: number;
  x: number;
  y: number;
  active: boolean;
  label: string;
};

// ─── Audio Util ───────────────────────────────────────────────────────────────
function playTone(
  freq: number,
  type: OscillatorType = "sine",
  duration = 0.15,
  volume = 0.08
) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), (duration + 0.1) * 1000);
  } catch {}
}

function playChord(freqs: number[], duration = 0.4) {
  freqs.forEach((f, i) =>
    setTimeout(() => playTone(f, "sine", duration, 0.06), i * 60)
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NEON_PURPLE = "#a855f7";
const NEON_BLUE = "#3b82f6";
const NEON_CYAN = "#06b6d4";
const NEON_GREEN = "#10b981";
const NEON_WHITE = "#e0f2fe";

const DATA_LABELS = [
  "AI_MODEL", "REACT.tsx", "Java.class",
  "DSA", "ML_NET", "API", "SQL", "NODE.js",
];

const NET_NODES_DEF: Omit<Node, "active">[] = [
  { id: 0, x: 50, y: 50, label: "CORE" },
  { id: 1, x: 20, y: 25, label: "ML" },
  { id: 2, x: 80, y: 25, label: "API" },
  { id: 3, x: 15, y: 70, label: "DB" },
  { id: 4, x: 85, y: 70, label: "UI" },
  { id: 5, x: 50, y: 12, label: "AI" },
  { id: 6, x: 50, y: 88, label: "WEB" },
];

const LAUNCH_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?";

// ─── Starfield Canvas ─────────────────────────────────────────────────────────
function Starfield({ opacity = 1 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
    }));

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1) { s.alpha = 0; s.x = Math.random() * canvas.width; s.y = Math.random() * canvas.height; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${s.alpha * 0.7})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
}

// ─── Scan Line Overlay ────────────────────────────────────────────────────────
function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,255,0.018) 3px, rgba(0,255,255,0.018) 4px)",
      }}
    />
  );
}

// ─── Stage 1: System Init ─────────────────────────────────────────────────────
function Stage1Init({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<{ text: string; done: boolean }[]>([]);
  const bootLines = [
    "DHRUVA_OS v3.1 — KERNEL BOOT…",
    "Allocating neural threads... [████████] 100%",
    "Mounting quantum filesystem... OK",
    "Initializing AI subsystems... OK",
    "Loading cognitive matrix... [████████] 100%",
    "Handshaking with universe... OK",
    "All systems operational.",
    "▶  ENTER THE UNIVERSE",
  ];

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i >= bootLines.length) return;
      playTone(300 + i * 80, "square", 0.08, 0.05);
      setLines((prev) => [...prev, { text: bootLines[i], done: i === bootLines.length - 1 }]);
      i++;
      if (i < bootLines.length) setTimeout(tick, 380 + Math.random() * 220);
    };
    tick();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-3 px-6 cursor-pointer select-none"
      onClick={() => { if (lines.length >= bootLines.length) { playChord([440, 550, 660]); onDone(); }}}
    >
      <div className="text-xs font-mono text-cyan-400 mb-4 tracking-widest uppercase opacity-60">
        — LEVEL 01 — SYSTEM INITIALIZATION —
      </div>
      <div className="w-full max-w-xl bg-black/60 border border-cyan-500/40 rounded-lg p-6 backdrop-blur-md shadow-[0_0_60px_rgba(6,182,212,0.15)]">
        {lines.map((l, idx) => (
          <div
            key={idx}
            className={`font-mono text-sm leading-7 flex items-center gap-2 ${
              l.done
                ? "text-green-400 font-bold text-base animate-pulse"
                : idx === lines.length - 1
                ? "text-cyan-300"
                : "text-cyan-500/70"
            }`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <span className="text-purple-400 opacity-60">{`>`}</span>
            <span className={l.done ? "text-gradient" : ""}>{l.text}</span>
          </div>
        ))}
        {lines.length < bootLines.length && (
          <span className="inline-block w-2 h-4 bg-cyan-400 ml-4 align-middle animate-pulse" />
        )}
      </div>
      {lines.length >= bootLines.length && (
        <p className="text-cyan-400/60 text-xs font-mono mt-4 animate-pulse tracking-widest">
          [ CLICK TO CONTINUE ]
        </p>
      )}
    </div>
  );
}

// ─── Stage 2 Inner Canvas ─────────────────────────────────────────────────────
// Extracted so that changing `restartKey` fully remounts the component and
// re-runs useEffect — this is the correct way to restart a canvas game loop.
function Stage2Canvas({
  onDone,
  onDead,
}: {
  onDone: () => void;
  onDead: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    ship: { x: 15, y: 50 },
    obstacles: [] as Obstacle[],
    score: 0,
    alive: true,
    phase: 0,
    nextId: 0,
    frame: 0,
  });
  const [score, setScore] = useState(0);
  const rafRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const TARGET_SCORE = 20;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const toX = (p: number) => (p / 100) * W;
    const toY = (p: number) => (p / 100) * H;
    let spawnTimer = 0;

    const spawnObstacle = () => {
      const s = stateRef.current;
      const h = 4 + Math.random() * 18;
      s.obstacles.push({
        id: s.nextId++,
        x: 105,
        y: Math.random() * (90 - h),
        w: 3 + Math.random() * 4,
        h,
        speed: 0.5 + Math.random() * 0.8 + s.score * 0.018,
      });
    };

    function loop() {
      const s = stateRef.current;
      if (!s.alive || s.phase === 1) return;
      s.frame++;

      const spd = 1.2;
      if (keysRef.current.has("ArrowUp") || keysRef.current.has("w")) s.ship.y = Math.max(2, s.ship.y - spd);
      if (keysRef.current.has("ArrowDown") || keysRef.current.has("s")) s.ship.y = Math.min(94, s.ship.y + spd);
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) s.ship.x = Math.max(2, s.ship.x - spd * 0.7);
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) s.ship.x = Math.min(95, s.ship.x + spd * 0.7);
      if (mouseRef.current) {
        const tx = (mouseRef.current.x / W) * 100;
        const ty = (mouseRef.current.y / H) * 100;
        s.ship.x += (tx - s.ship.x) * 0.1;
        s.ship.y += (ty - s.ship.y) * 0.1;
      }

      spawnTimer++;
      const interval = Math.max(18, 40 - s.score * 0.8);
      if (spawnTimer > interval) { spawnObstacle(); spawnTimer = 0; }

      s.obstacles = s.obstacles.filter((o) => o.x + o.w > -5);
      s.obstacles.forEach((o) => { o.x -= o.speed; });

      s.obstacles.forEach((o) => {
        if (o.x + o.w < s.ship.x - 2 && !(o as any).scored) {
          (o as any).scored = true;
          s.score++;
          setScore(s.score);
          if (s.score % 5 === 0) playTone(660, "sine", 0.15, 0.07);
        }
      });

      const sw = 3, sh = 3;
      for (const o of s.obstacles) {
        if (
          s.ship.x + sw > o.x && s.ship.x < o.x + o.w &&
          s.ship.y + sh > o.y && s.ship.y < o.y + o.h
        ) {
          s.alive = false;
          playTone(200, "sawtooth", 0.3, 0.12);
          onDead();
          return;
        }
      }

      if (s.score >= TARGET_SCORE) {
        s.phase = 1;
        playChord([523, 659, 784]);
        setTimeout(() => onDone(), 900);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(6,182,212,0.06)";
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }

      s.obstacles.forEach((o) => {
        const x = toX(o.x), y = toY(o.y), w = toX(o.w), h = toY(o.h);
        ctx.save();
        ctx.shadowColor = NEON_PURPLE;
        ctx.shadowBlur = 14;
        ctx.fillStyle = NEON_PURPLE;
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "#c084fc";
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
      });

      const sx = toX(s.ship.x), sy = toY(s.ship.y);
      ctx.save();
      ctx.shadowColor = NEON_CYAN;
      ctx.shadowBlur = 20;
      ctx.fillStyle = NEON_CYAN;
      ctx.beginPath();
      ctx.moveTo(sx + 14, sy + 5);
      ctx.lineTo(sx, sy);
      ctx.lineTo(sx, sy + 10);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(168,85,247,0.8)";
      ctx.beginPath();
      ctx.moveTo(sx, sy + 3);
      ctx.lineTo(sx - 8 - Math.random() * 6, sy + 5);
      ctx.lineTo(sx, sy + 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Score HUD on canvas
      ctx.fillStyle = "rgba(6,182,212,0.7)";
      ctx.font = "bold 12px monospace";
      ctx.fillText(`SCORE: ${s.score} / ${TARGET_SCORE}`, 10, 20);

      rafRef.current = requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => { keysRef.current.add(e.key); };
    const offKey = (e: KeyboardEvent) => { keysRef.current.delete(e.key); };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = null; };

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", offKey);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", offKey);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={560}
      height={300}
      className="rounded-lg border border-cyan-500/30 bg-black/70 backdrop-blur shadow-[0_0_60px_rgba(6,182,212,0.12)]"
    />
  );
}

// ─── Stage 2: Avoid Obstacles ────────────────────────────────────────────────
function Stage2Avoid({ onDone }: { onDone: () => void }) {
  const [restartKey, setRestartKey] = useState(0);
  const [status, setStatus] = useState<"playing" | "dead" | "cleared">("playing");

  const TARGET_SCORE = 20;

  const handleDead = useCallback(() => setStatus("dead"), []);
  const handleDone = useCallback(() => {
    setStatus("cleared");
    onDone();
  }, [onDone]);

  const restart = () => {
    setStatus("playing");
    setRestartKey((k) => k + 1); // remounts Stage2Canvas → re-runs useEffect
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-4 select-none">
      <div className="text-xs font-mono text-purple-400 tracking-widest uppercase opacity-60">
        — LEVEL 02 — NAVIGATE THE VOID —
      </div>
      <div className="flex items-center gap-6 mb-1">
        <span className="font-mono text-cyan-300 text-sm">TARGET: <span className="text-yellow-400 font-bold">{TARGET_SCORE}</span></span>
        <span className="font-mono text-purple-300 text-sm">[ ARROW KEYS / MOUSE ]</span>
      </div>
      <div className="relative">
        {status !== "dead" && (
          <Stage2Canvas key={restartKey} onDone={handleDone} onDead={handleDead} />
        )}
        {status === "dead" && (
          <div className="w-[560px] h-[300px] rounded-lg border border-red-500/30 bg-black/70 flex flex-col items-center justify-center gap-4">
            <div className="text-red-400 font-mono font-bold text-2xl animate-pulse">SYSTEM CRASH</div>
            <div className="text-red-300/60 font-mono text-sm">Neural link severed. Reconnecting…</div>
            <button
              onClick={restart}
              className="px-6 py-2 border border-cyan-500 text-cyan-400 font-mono text-sm rounded hover:bg-cyan-500/10 transition-colors cursor-pointer"
            >
              ▶ RESTART SEQUENCE
            </button>
          </div>
        )}
        {status === "cleared" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm">
            <div className="text-green-400 font-mono font-bold text-2xl mb-2">NAVIGATION CLEARED</div>
            <div className="text-cyan-400 font-mono text-sm animate-pulse">Advancing to next protocol…</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stage 3: Collect Data ────────────────────────────────────────────────────
function Stage3Collect({ onDone }: { onDone: () => void }) {
  const blockCount = 8;
  const [blocks, setBlocks] = useState<DataBlock[]>(() =>
    Array.from({ length: blockCount }, (_, i) => ({
      id: i,
      x: 10 + (i % 4) * 22,
      y: 20 + Math.floor(i / 4) * 42,
      label: DATA_LABELS[i],
      collected: false,
      pulse: false,
    }))
  );
  const [collected, setCollected] = useState(0);
  const done = useRef(false);

  const collect = (id: number) => {
    if (done.current) return;
    playTone(440 + id * 55, "sine", 0.2, 0.08);
    setBlocks((prev) =>
      prev.map((b) => (b.id === id && !b.collected ? { ...b, collected: true, pulse: true } : b))
    );
    setCollected((c) => {
      const next = c + 1;
      if (next >= blockCount && !done.current) {
        done.current = true;
        playChord([523, 659, 784, 1047]);
        setTimeout(() => onDone(), 800);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6 select-none">
      <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase opacity-60">
        — LEVEL 03 — COLLECT DATA BLOCKS —
      </div>
      <div className="font-mono text-sm text-cyan-300">
        COLLECTED: <span className="text-white font-bold">{collected}</span> / {blockCount}
      </div>
      <div className="relative w-full max-w-lg h-64 bg-black/60 border border-blue-500/30 rounded-xl backdrop-blur shadow-[0_0_60px_rgba(59,130,246,0.1)] overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        {blocks.map((b) => (
          <button
            key={b.id}
            onClick={() => collect(b.id)}
            disabled={b.collected}
            className={`absolute font-mono text-xs px-2 py-1 rounded border transition-all duration-500 ${
              b.collected
                ? "bg-green-500/20 border-green-400/40 text-green-400 scale-90 opacity-50"
                : "bg-blue-900/50 border-blue-400/60 text-blue-300 hover:bg-blue-500/30 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer"
            }`}
            style={{ left: `${b.x}%`, top: `${b.y}%`, animation: b.collected ? "none" : `float ${2 + b.id * 0.3}s ease-in-out infinite` }}
          >
            {b.collected ? "✓" : b.label}
          </button>
        ))}

        {collected >= blockCount && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
            <div className="text-green-400 font-mono font-bold text-xl animate-pulse">ALL DATA ACQUIRED</div>
          </div>
        )}
      </div>
      <p className="text-cyan-400/50 font-mono text-xs">[ CLICK ALL BLOCKS TO COLLECT ]</p>
    </div>
  );
}

// ─── Stage 4: Network Sync ────────────────────────────────────────────────────
function Stage4Network({ onDone }: { onDone: () => void }) {
  const [nodes, setNodes] = useState<Node[]>(() =>
    NET_NODES_DEF.map((n) => ({ ...n, active: false }))
  );
  const [edges, setEdges] = useState<{ a: number; b: number }[]>([]);
  const [activating, setActivating] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    if (activating) return;
    setActivating(true);
    const activate = (i: number) => {
      if (i >= NET_NODES_DEF.length) {
        // Build edges
        const e: { a: number; b: number }[] = [];
        for (let x = 0; x < NET_NODES_DEF.length; x++) {
          for (let y = x + 1; y < NET_NODES_DEF.length; y++) {
            const nx = NET_NODES_DEF[x], ny = NET_NODES_DEF[y];
            const dist = Math.hypot(nx.x - ny.x, ny.y - nx.y);
            if (dist < 45) e.push({ a: x, b: y });
          }
        }
        setEdges(e);
        if (!doneRef.current) {
          doneRef.current = true;
          playChord([392, 494, 587, 698]);
          setTimeout(() => onDone(), 1200);
        }
        return;
      }
      playTone(300 + i * 70, "sine", 0.18, 0.07);
      setNodes((prev) => prev.map((n, idx) => idx === i ? { ...n, active: true } : n));
      setTimeout(() => activate(i + 1), 260);
    };
    setTimeout(() => activate(0), 400);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6 select-none">
      <div className="text-xs font-mono text-blue-400 tracking-widest uppercase opacity-60">
        — LEVEL 04 — SYNCHRONIZE NETWORK —
      </div>
      <div className="font-mono text-sm text-blue-300 mb-2">
        NODES ACTIVE: <span className="text-white font-bold">{nodes.filter((n) => n.active).length}</span> / {nodes.length}
      </div>
      <div className="relative w-full max-w-md h-72 bg-black/60 border border-blue-500/30 rounded-xl backdrop-blur shadow-[0_0_60px_rgba(59,130,246,0.12)]">
        {/* SVG layer for edges — rendered below nodes */}
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: "visible" }}>
          <defs>
            <style>{`@keyframes dash-anim { to { stroke-dashoffset: -16; } }`}</style>
          </defs>
          {edges.map((e, i) => {
            const a = nodes[e.a], b = nodes[e.b];
            return (
              <line
                key={i}
                x1={`${a.x}%`} y1={`${a.y}%`}
                x2={`${b.x}%`} y2={`${b.y}%`}
                stroke={NEON_BLUE}
                strokeWidth="1.5"
                opacity="0.6"
                strokeDasharray="4 4"
                style={{ animation: "dash-anim 1.2s linear infinite" }}
              />
            );
          })}
        </svg>

        {nodes.map((n) => (
          <div
            key={n.id}
            className={`absolute flex flex-col items-center transition-all duration-500 ${
              n.active ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ left: `${n.x}%`, top: `${n.y}%`, marginLeft: "-20px", marginTop: "-20px" }}
          >
            <div
              className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 font-mono text-xs font-bold ${
                n.active
                  ? "border-blue-400 bg-blue-900/60 text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                  : "border-gray-700 bg-gray-900 text-gray-600"
              }`}
            >
              {n.label}
              {n.active && (
                <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-30" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Word-level timestamps calibrated to Voice-1.mp3 (9.27s) ─────────────────
const KARAOKE_WORDS: { word: string; t: number; lineBreak?: boolean }[] = [
  { word: "Access",      t: 0.30 },
  { word: "granted.",    t: 0.85, lineBreak: true },
  { word: "Welcome,",    t: 1.65 },
  { word: "Dhruv.",      t: 2.15, lineBreak: true },
  { word: "All",         t: 3.45 },
  { word: "systems",     t: 3.85 },
  { word: "nominal.",    t: 4.30, lineBreak: true },
  { word: "Neural",      t: 5.05 },
  { word: "interfaces",  t: 5.60 },
  { word: "loaded.",     t: 6.15, lineBreak: true },
  { word: "DRAKE",       t: 6.90 },
  { word: "online.",     t: 7.40, lineBreak: true },
  { word: "Awaiting",    t: 7.95 },
  { word: "your",        t: 8.25 },
  { word: "command,",    t: 8.52 },
  { word: "sir.",        t: 8.82 },
];

// ─── Stage 5: Launch Sequence ─────────────────────────────────────────────────
function Stage5Launch({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"scramble" | "resolve" | "access">("scramble");
  const [displayText, setDisplayText] = useState("INITIALIZING…");
  const [count, setCount] = useState(5);
  const targetText = "WELCOME TO MY UNIVERSE";
  const [fadeOut, setFadeOut] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // activeIdx: the index of the word currently being "spoken" (-1 = none yet)
  const [activeIdx, setActiveIdx] = useState(-1);

  // ── Phase: Scramble ──
  useEffect(() => {
    let frame = 0;
    let raf: number;
    const scramble = () => {
      frame++;
      const txt = targetText
        .split("")
        .map((c, i) =>
          c === " " ? " " : frame > i * 2.5
            ? c
            : LAUNCH_CHARS[Math.floor(Math.random() * LAUNCH_CHARS.length)]
        )
        .join("");
      setDisplayText(txt);
      if (frame < targetText.length * 2.5 + 10) {
        raf = requestAnimationFrame(scramble);
      } else {
        setPhase("resolve");
      }
    };
    setTimeout(() => { raf = requestAnimationFrame(scramble); }, 200);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Phase: Resolve / Countdown ──
  useEffect(() => {
    if (phase !== "resolve") return;
    setDisplayText(targetText);
    playChord([523, 659, 784, 1047]);
    let c = 5;
    const tick = setInterval(() => {
      playTone(440 + c * 40, "sine", 0.1, 0.08);
      c--;
      setCount(c);
      if (c <= 0) {
        clearInterval(tick);
        setPhase("access");
        playChord([880, 1047, 1319]);
      }
    }, 700);
    return () => clearInterval(tick);
  }, [phase]);

  // ── Phase: Access — play audio + drive karaoke via timeupdate ──
  useEffect(() => {
    if (phase !== "access") return;

    const audio = new Audio("/audio/Voice-1.mp3");
    audio.volume = 1.0;
    audioRef.current = audio;

    // timeupdate fires ~4× per second — find which word index is active
    const onTimeUpdate = () => {
      const t = audio.currentTime;
      // Find the last word whose start time <= currentTime
      let idx = -1;
      for (let i = 0; i < KARAOKE_WORDS.length; i++) {
        if (t >= KARAOKE_WORDS[i].t) idx = i;
        else break;
      }
      setActiveIdx(idx);
    };

    const onEnded = () => {
      // Keep last word lit for 600ms then fade out
      setActiveIdx(KARAOKE_WORDS.length - 1);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => onComplete(), 900);
      }, 800);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.play().catch(() => {
      // Autoplay blocked — run a timer-based fallback
      let i = 0;
      const fallbackInterval = setInterval(() => {
        if (i >= KARAOKE_WORDS.length) {
          clearInterval(fallbackInterval);
          setTimeout(() => { setFadeOut(true); setTimeout(() => onComplete(), 900); }, 800);
          return;
        }
        setActiveIdx(i++);
      }, 550);
      return () => clearInterval(fallbackInterval);
    });

    // Safety net: if audio never ends, still proceed after 12s
    const safety = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onComplete(), 900);
    }, 12000);

    return () => {
      clearTimeout(safety);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [phase]);

  // Group words into lines for rendering
  const lines: { word: string; globalIdx: number }[][] = [];
  let currentLine: { word: string; globalIdx: number }[] = [];
  KARAOKE_WORDS.forEach((w, i) => {
    currentLine.push({ word: w.word, globalIdx: i });
    if (w.lineBreak) {
      lines.push(currentLine);
      currentLine = [];
    }
  });
  if (currentLine.length) lines.push(currentLine);

  return (
    <div
      className={`flex flex-col items-center justify-center h-full gap-5 px-6 select-none transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-xs font-mono text-green-400 tracking-widest uppercase opacity-60">
        — LEVEL 05 — LAUNCH SEQUENCE —
      </div>

      {/* Spinning rings */}
      <div className="relative w-52 h-52 flex items-center justify-center flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: `${100 - i * 26}%`,
              height: `${100 - i * 26}%`,
              borderColor: [NEON_CYAN, NEON_PURPLE, NEON_BLUE][i],
              opacity: 0.5 + i * 0.15,
              animation: `spin-${["slow", "medium", "fast"][i]} ${[6, 4, 2.5][i]}s linear infinite ${i % 2 === 1 ? "reverse" : ""}`,
              boxShadow: `0 0 20px ${[NEON_CYAN, NEON_PURPLE, NEON_BLUE][i]}40`,
            }}
          />
        ))}
        <div className="relative z-10 flex flex-col items-center text-center">
          {phase === "resolve" && (
            <div className="font-mono font-bold text-white text-4xl tabular-nums"
              style={{ textShadow: `0 0 20px ${NEON_CYAN}` }}>
              {count}
            </div>
          )}
          {phase === "access" && (
            <div className="font-mono font-bold text-green-400 text-base leading-tight"
              style={{ textShadow: `0 0 30px ${NEON_GREEN}` }}>
              ACCESS<br />GRANTED
            </div>
          )}
          {phase === "scramble" && (
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/60 animate-pulse" />
          )}
        </div>
      </div>

      {/* Scramble / resolve text */}
      {phase !== "access" && (
        <div
          className="font-mono font-bold text-center transition-all duration-300"
          style={{
            fontSize: "clamp(0.9rem, 2.5vw, 1.4rem)",
            letterSpacing: "0.15em",
            color: NEON_WHITE,
            textShadow: `0 0 30px ${NEON_CYAN}`,
          }}
        >
          {displayText}
        </div>
      )}

      {/* ── KARAOKE CAPTION AREA ── */}
      {phase === "access" && (
        <div className="w-full max-w-lg px-2">
          {/* Animated waveform */}
          <div className="flex items-end justify-center gap-0.5 h-6 mb-4">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-green-400/60"
                style={{
                  height: activeIdx >= 0
                    ? `${30 + Math.abs(Math.sin((i + activeIdx * 3) * 0.6)) * 70}%`
                    : "15%",
                  transition: "height 0.15s ease",
                  boxShadow: activeIdx >= 0 ? "0 0 4px #10b981" : "none",
                }}
              />
            ))}
          </div>

          {/* Word-by-word karaoke lines */}
          <div className="flex flex-col gap-2 items-center">
            {lines.map((line, lineIdx) => {
              const lineStart = line[0].globalIdx;
              const lineEnd = line[line.length - 1].globalIdx;
              const lineActive = activeIdx >= lineStart && activeIdx <= lineEnd;
              const linePast = activeIdx > lineEnd;
              return (
                <div
                  key={lineIdx}
                  className="flex flex-wrap justify-center gap-x-2 gap-y-1 transition-all duration-300"
                  style={{ opacity: lineActive || linePast ? 1 : 0.2 }}
                >
                  {line.map(({ word, globalIdx }) => {
                    const isActive = activeIdx === globalIdx;
                    const isPast = activeIdx > globalIdx;
                    return (
                      <span
                        key={globalIdx}
                        className="font-mono font-bold transition-all duration-150 inline-block"
                        style={{
                          fontSize: isActive ? "1.15rem" : "1rem",
                          color: isActive ? "#00ffcc" : isPast ? "#10b981" : "#4b5563",
                          textShadow: isActive
                            ? "0 0 18px #00ffcc, 0 0 40px #00ffcc88"
                            : isPast
                            ? "0 0 8px #10b981"
                            : "none",
                          transform: isActive ? "scale(1.12) translateY(-1px)" : "scale(1)",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-px w-full bg-green-900/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{
                width: activeIdx < 0 ? "0%" : `${((activeIdx + 1) / KARAOKE_WORDS.length) * 100}%`,
                boxShadow: "0 0 8px #10b981",
              }}
            />
          </div>
        </div>
      )}

      {/* Countdown dots */}
      {phase === "resolve" && (
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-8 h-2 rounded-full transition-all duration-300"
              style={{
                background: i >= count ? NEON_GREEN : NEON_PURPLE,
                boxShadow: i >= count ? `0 0 8px ${NEON_GREEN}` : "none",
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin-slow   { to { transform: rotate(360deg); } }
        @keyframes spin-medium { to { transform: rotate(360deg); } }
        @keyframes spin-fast   { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const steps = [
    { label: "INIT", color: NEON_CYAN },
    { label: "NAVIGATE", color: NEON_PURPLE },
    { label: "COLLECT", color: NEON_BLUE },
    { label: "SYNC", color: NEON_BLUE },
    { label: "LAUNCH", color: NEON_GREEN },
  ];
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded-full backdrop-blur-md">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-500"
            style={{
              background: i < step ? s.color + "33" : i === step ? s.color + "22" : "transparent",
              border: `1.5px solid ${i <= step ? s.color : "#333"}`,
              color: i <= step ? s.color : "#555",
              boxShadow: i === step ? `0 0 12px ${s.color}80` : "none",
            }}
          >
            {i < step ? "✓" : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div
              className="w-8 h-px transition-all duration-700"
              style={{ background: i < step ? `linear-gradient(90deg, ${steps[i].color}, ${steps[i + 1].color})` : "#333" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Skip Button ──────────────────────────────────────────────────────────────
function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      onClick={onSkip}
      className="absolute bottom-4 right-6 z-30 font-mono text-xs text-white/30 hover:text-white/70 transition-colors tracking-widest border border-white/10 hover:border-white/30 rounded px-3 py-1 backdrop-blur-sm"
    >
      SKIP INTRO ▶▶
    </button>
  );
}

// ─── Main IntroSequence ───────────────────────────────────────────────────────
export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);

  const next = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 350);
  }, [transitioning]);

  const finish = useCallback(() => {
    setTransitioning(true);
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete(), 700);
    }, 200);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #0a0a1a 0%, #050510 100%)",
        transition: "opacity 0.7s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      <Starfield />
      <ScanLines />
      <ProgressBar step={step} />
      <SkipButton onSkip={finish} />

      {/* Stage container */}
      <div
        className="relative z-20 flex items-center justify-center w-full h-full"
        style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "scale(0.97)" : "scale(1)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        {step === 0 && <Stage1Init onDone={next} />}
        {step === 1 && <Stage2Avoid onDone={next} />}
        {step === 2 && <Stage3Collect onDone={next} />}
        {step === 3 && <Stage4Network onDone={next} />}
        {step === 4 && <Stage5Launch onComplete={finish} />}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-lg pointer-events-none z-30" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500/40 rounded-tr-lg pointer-events-none z-30" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/40 rounded-bl-lg pointer-events-none z-30" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg pointer-events-none z-30" />
    </div>
  );
}
