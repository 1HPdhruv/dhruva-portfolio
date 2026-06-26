import { useState } from "react";
import { Brain, Code2, Cpu, Database, Atom, Server, Sigma, Bot } from "lucide-react";

type Skill = {
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const innerSkills: Skill[] = [
  { name: "Java", Icon: Code2, color: "#f89820" },
  { name: "Python", Icon: Sigma, color: "#ffd43b" },
  { name: "DSA & CP", Icon: Cpu, color: "#a78bfa" },
];

const outerSkills: Skill[] = [
  { name: "React & Tailwind", Icon: Atom, color: "#61dafb" },
  { name: "Node.js & Express", Icon: Server, color: "#68a063" },
  { name: "Machine Learning", Icon: Bot, color: "#ff6b6b" },
  { name: "Databases (SQL)", Icon: Database, color: "#22d3ee" },
];

const INNER_RADIUS = 135;
const OUTER_RADIUS = 210;
const INNER_DURATION = 24; // seconds for full revolution
const OUTER_DURATION = 36; // seconds for full revolution

export const OrbitingSkills = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative mx-auto flex items-center justify-center w-full max-w-[520px] aspect-square min-h-[450px]">
      {/* Inner Orbit ring */}
      <div
        className="absolute rounded-full border border-primary/20 border-dashed animate-pulse"
        style={{ width: INNER_RADIUS * 2, height: INNER_RADIUS * 2 }}
      />
      {/* Outer Orbit ring */}
      <div
        className="absolute rounded-full border border-primary/10"
        style={{ width: OUTER_RADIUS * 2, height: OUTER_RADIUS * 2 }}
      />

      {/* Central AI brain */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse-glow" />
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/40 flex items-center justify-center backdrop-blur-sm glow-primary">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap font-semibold">
          AI Core
        </span>
      </div>

      {/* Inner Orbiting icons */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          animation: `orbit-spin ${INNER_DURATION}s linear infinite`,
          animationPlayState: hovered !== null ? "paused" : "running",
        }}
      >
        {innerSkills.map((skill, i) => {
          const angle = (360 / innerSkills.length) * i;
          const isHovered = hovered === skill.name;
          return (
            <div
              key={skill.name}
              className="absolute top-1/2 left-1/2 pointer-events-auto"
              style={{
                transform: `rotate(${angle}deg) translateX(${INNER_RADIUS}px) rotate(-${angle}deg)`,
              }}
            >
              {/* Counter-rotation wrapper keeps icons upright */}
              <div
                className="relative -translate-x-1/2 -translate-y-1/2"
                style={{
                  animation: `orbit-spin-reverse ${INNER_DURATION}s linear infinite`,
                  animationPlayState: hovered !== null ? "paused" : "running",
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHovered(skill.name)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(skill.name)}
                  onBlur={() => setHovered(null)}
                  className={`group relative flex h-14 w-14 items-center justify-center rounded-full border bg-card/80 backdrop-blur transition-all duration-300 ${
                    isHovered
                      ? "scale-125 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.7)] z-50"
                      : "border-border hover:border-primary/60"
                  }`}
                  aria-label={skill.name}
                >
                  <skill.Icon
                    className="h-7 w-7 transition-colors"
                  />
                  {/* Glow halo on hover */}
                  <span
                    className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ boxShadow: `0 0 40px ${skill.color}` }}
                  />

                  {/* Tooltip */}
                  <div
                    className={`pointer-events-none absolute left-1/2 top-full mt-3 w-auto min-w-[130px] -translate-x-1/2 rounded-lg border border-primary/40 bg-popover/95 p-2.5 text-popover-foreground shadow-xl backdrop-blur transition-all duration-200 ${
                      isHovered
                        ? "opacity-100 translate-y-0 z-50"
                        : "opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="text-xs font-semibold text-center whitespace-nowrap px-1">
                      {skill.name}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outer Orbiting icons */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          animation: `orbit-spin-reverse ${OUTER_DURATION}s linear infinite`,
          animationPlayState: hovered !== null ? "paused" : "running",
        }}
      >
        {outerSkills.map((skill, i) => {
          const angle = (360 / outerSkills.length) * i;
          const isHovered = hovered === skill.name;
          return (
            <div
              key={skill.name}
              className="absolute top-1/2 left-1/2 pointer-events-auto"
              style={{
                transform: `rotate(${angle}deg) translateX(${OUTER_RADIUS}px) rotate(-${angle}deg)`,
              }}
            >
              {/* Counter-rotation wrapper keeps icons upright */}
              <div
                className="relative -translate-x-1/2 -translate-y-1/2"
                style={{
                  animation: `orbit-spin ${OUTER_DURATION}s linear infinite`,
                  animationPlayState: hovered !== null ? "paused" : "running",
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHovered(skill.name)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(skill.name)}
                  onBlur={() => setHovered(null)}
                  className={`group relative flex h-14 w-14 items-center justify-center rounded-full border bg-card/80 backdrop-blur transition-all duration-300 ${
                    isHovered
                      ? "scale-125 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.7)] z-50"
                      : "border-border hover:border-primary/60"
                  }`}
                  aria-label={skill.name}
                >
                  <skill.Icon
                    className="h-7 w-7 transition-colors"
                  />
                  {/* Glow halo on hover */}
                  <span
                    className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
                      isHovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ boxShadow: `0 0 40px ${skill.color}` }}
                  />

                  {/* Tooltip */}
                  <div
                    className={`pointer-events-none absolute left-1/2 top-full mt-3 w-auto min-w-[130px] -translate-x-1/2 rounded-lg border border-primary/40 bg-popover/95 p-2.5 text-popover-foreground shadow-xl backdrop-blur transition-all duration-200 ${
                      isHovered
                        ? "opacity-100 translate-y-0 z-50"
                        : "opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="text-xs font-semibold text-center whitespace-nowrap px-1">
                      {skill.name}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};
