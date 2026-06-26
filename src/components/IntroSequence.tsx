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

// ─── Stage 5: Rocket Launch Sequence ──────────────────────────────────────────
function Stage5Launch({ onComplete, onPullUp }: { onComplete: () => void; onPullUp: () => void }) {
  const [stage, setStage] = useState<"ignition" | "full_power" | "blastoff">("ignition");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pulledRef = useRef(false);

  useEffect(() => {
    const audio = new Audio("/audio/Voice-1.mp3");
    audio.volume = 1.0;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      const t = audio.currentTime;
      if (t >= 3.0 && t < 7.8) {
        setStage("full_power");
      } else if (t >= 7.8) {
        setStage("blastoff");
        if (!pulledRef.current) {
          pulledRef.current = true;
          onPullUp();
        }
      }
    };

    const onEnded = () => {
      if (!pulledRef.current) {
        pulledRef.current = true;
        onPullUp();
      }
      setTimeout(() => onComplete(), 800);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.play().catch(() => {
      // Autoplay fallback
      setTimeout(() => setStage("full_power"), 2500);
      setTimeout(() => {
        setStage("blastoff");
        if (!pulledRef.current) {
          pulledRef.current = true;
          onPullUp();
        }
      }, 6000);
      setTimeout(() => onComplete(), 7500);
    });

    const safety = setTimeout(() => {
      if (!pulledRef.current) {
        pulledRef.current = true;
        onPullUp();
      }
      setTimeout(() => onComplete(), 800);
    }, 11000);

    return () => {
      clearTimeout(safety);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [onComplete, onPullUp]);

  return (
    <div className={`flex flex-col items-center justify-center h-full w-full select-none ${stage === "blastoff" ? "animate-rocket-pull" : stage === "full_power" ? "animate-intense-shake" : "animate-base-shake"}`}>
      {/* Background speed lines / Launchpad ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent animate-pulse" />
      </div>

      <div className="text-xs font-mono text-emerald-400 tracking-widest uppercase opacity-80 mb-6 z-10 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]">
        — LEVEL 05 — DRAKE PROTOCOL LAUNCH —
      </div>

      {/* ── HIGH-TECH ROCKET ── */}
      <div className="relative flex flex-col items-center z-10 transition-transform duration-1000">
        {/* Rocket Body */}
        <div className="relative w-28 h-56 flex flex-col items-center">
          {/* Nose cone & fuselage */}
          <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
            {/* Outer Wings/Fins */}
            <path d="M20,120 L5,180 L25,170 Z" fill="#0284c7" />
            <path d="M80,120 L95,180 L75,170 Z" fill="#0284c7" />
            
            {/* Main Fuselage */}
            <path d="M50,10 Q20,60 20,170 L80,170 Q80,60 50,10 Z" fill="url(#rocketGrad)" stroke="#00ffcc" strokeWidth="2" />
            
            {/* Cockpit / AI Core */}
            <circle cx="50" cy="80" r="14" fill="#0f172a" stroke="#00ffcc" strokeWidth="3" />
            <circle cx="50" cy="80" r="8" fill="#10b981" className="animate-ping opacity-75" />
            <circle cx="50" cy="80" r="6" fill="#00ffcc" />

            {/* Body Accents */}
            <line x1="50" y1="110" x2="50" y2="150" stroke="#0284c7" strokeWidth="3" strokeDasharray="5 5" />

            <defs>
              <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── THRUSTER FLAMES ── */}
        <div className="relative flex flex-col items-center w-24 -mt-2">
          <div className={`w-16 rounded-b-full bg-gradient-to-b transition-all duration-300 blur-[1px] ${
            stage === "blastoff"
              ? "h-48 from-cyan-400 via-amber-300 to-amber-600 shadow-[0_0_60px_rgba(6,182,212,1)] animate-flame-intense"
              : stage === "full_power"
              ? "h-40 from-amber-300 via-orange-500 to-red-600 shadow-[0_0_50px_rgba(245,158,11,0.9)] animate-flame-intense"
              : "h-20 from-cyan-400 via-blue-600 to-transparent shadow-[0_0_25px_rgba(6,182,212,0.6)] animate-flame-base"
          }`} />
          {/* Inner white-hot core */}
          <div className={`absolute top-0 w-8 rounded-b-full bg-white transition-all duration-300 blur-sm ${
            stage === "blastoff" ? "h-28 shadow-[0_0_30px_#ffffff]" : stage === "full_power" ? "h-20 shadow-[0_0_20px_#ffffff]" : "h-10"
          }`} />
        </div>
      </div>

      {/* Launch Status Text */}
      <div className="mt-12 font-mono font-bold text-center z-10 tracking-widest text-lg text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
        {stage === "blastoff" ? "🚀 BLASTOFF — ENTERING ORBIT" : stage === "full_power" ? "⚡ ALL SYSTEMS NOMINAL" : "🔑 ACCESS GRANTED"}
      </div>

      <style>{`
        @keyframes base-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-1px, 1px) rotate(-0.5deg); }
          50% { transform: translate(1px, -1px) rotate(0.5deg); }
          75% { transform: translate(-1px, -1px) rotate(0deg); }
        }
        @keyframes intense-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-3px, 3px) rotate(-1deg); }
          40% { transform: translate(3px, -3px) rotate(1deg); }
          60% { transform: translate(-3px, -3px) rotate(-1deg); }
          80% { transform: translate(3px, 3px) rotate(1deg); }
        }
        @keyframes flame-base {
          0%, 100% { transform: scaleY(1); opacity: 0.9; }
          50% { transform: scaleY(1.15); opacity: 1; }
        }
        @keyframes flame-intense {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.9; }
          33% { transform: scaleY(1.25) scaleX(1.05); opacity: 1; }
          66% { transform: scaleY(0.95) scaleX(1.1); opacity: 1; }
        }
        .animate-base-shake { animation: base-shake 0.15s ease-in-out infinite; }
        .animate-intense-shake { animation: intense-shake 0.08s ease-in-out infinite; }
        .animate-flame-base { animation: flame-base 0.2s ease-in-out infinite; }
        .animate-flame-intense { animation: flame-intense 0.1s ease-in-out infinite; }
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
  const [pullingUp, setPullingUp] = useState(false);

  const next = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setTransitioning(false);
    }, 350);
  }, [transitioning]);

  const handlePullUp = useCallback(() => {
    setPullingUp(true);
  }, []);

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
        transition: "transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.7s ease",
        transform: pullingUp ? "translateY(-100vh)" : "translateY(0)",
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
        {step === 4 && <Stage5Launch onComplete={finish} onPullUp={handlePullUp} />}
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-lg pointer-events-none z-30" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-purple-500/40 rounded-tr-lg pointer-events-none z-30" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/40 rounded-bl-lg pointer-events-none z-30" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/40 rounded-br-lg pointer-events-none z-30" />
    </div>
  );
}
