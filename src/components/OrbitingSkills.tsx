import { useState } from "react";
import { Brain, Code2, Cpu, Database, Atom, Server, Sigma, Bot } from "lucide-react";

type Skill = {
  name: string;
  level: number;
  Icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const skills: Skill[] = [
  { name: "Java", level: 90, Icon: Code2, color: "#f89820" },
  { name: "React & Tailwind", level: 95, Icon: Atom, color: "#61dafb" },
  { name: "Node.js & Express", level: 85, Icon: Server, color: "#68a063" },
  { name: "Python", level: 88, Icon: Sigma, color: "#ffd43b" },
  { name: "Machine Learning", level: 82, Icon: Bot, color: "#ff6b6b" },
  { name: "DSA & CP", level: 87, Icon: Cpu, color: "#a78bfa" },
  { name: "Databases (SQL)", level: 80, Icon: Database, color: "#22d3ee" },
];

const ORBIT_RADIUS = 180;
const ORBIT_DURATION = 24; // seconds for full revolution

export const OrbitingSkills = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative mx-auto flex items-center justify-center w-full max-w-[520px] aspect-square">
      {/* Orbit rings */}
      <div
        className="absolute rounded-full border border-primary/20"
        style={{ width: ORBIT_RADIUS * 2, height: ORBIT_RADIUS * 2 }}
      />
      <div
        className="absolute rounded-full border border-primary/10"
        style={{ width: ORBIT_RADIUS * 2 - 60, height: ORBIT_RADIUS * 2 - 60 }}
      />

      {/* Central AI brain */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse-glow" />
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/40 flex items-center justify-center backdrop-blur-sm glow-primary">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          AI Core
        </span>
      </div>

      {/* Orbiting icons */}
      <div
        className="absolute inset-0"
        style={{
          animation: `orbit-spin ${ORBIT_DURATION}s linear infinite`,
          animationPlayState: hovered !== null ? "paused" : "running",
        }}
      >
        {skills.map((skill, i) => {
          const angle = (360 / skills.length) * i;
          const isHovered = hovered === i;
          return (
            <div
              key={skill.name}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `rotate(${angle}deg) translateX(${ORBIT_RADIUS}px) rotate(-${angle}deg)`,
              }}
            >
              {/* Counter-rotation wrapper keeps icons upright */}
              <div
                className="relative -translate-x-1/2 -translate-y-1/2"
                style={{
                  animation: `orbit-spin-reverse ${ORBIT_DURATION}s linear infinite`,
                  animationPlayState: hovered !== null ? "paused" : "running",
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  className={`group relative flex h-14 w-14 items-center justify-center rounded-full border bg-card/80 backdrop-blur transition-all duration-300 ${
                    isHovered
                      ? "scale-125 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.7)]"
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
                    className={`pointer-events-none absolute left-1/2 top-full mt-3 w-44 -translate-x-1/2 rounded-lg border border-primary/40 bg-popover/95 p-3 text-popover-foreground shadow-xl backdrop-blur transition-all duration-200 ${
                      isHovered
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-1"
                    }`}
                  >
                    <div className="text-xs font-medium text-center">
                      {skill.name}
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted mt-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
                        style={{ width: isHovered ? `${skill.level}%` : "0%" }}
                      />
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
