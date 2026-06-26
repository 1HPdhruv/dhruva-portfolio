import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, ChevronDown, Sparkles, RotateCcw, Zap } from "lucide-react";

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KB = {
  name: "Dhruva Mishra",
  role: "Full-Stack Developer, ML Engineer, Competitive Programmer",
  tagline: "Building AI Systems That Solve Real Problems",
  motto: "Build. Break. Learn. Repeat.",
  email: "mishradhruva19@gmail.com",
  phone: "+91 9263894272",
  github: "https://github.com/1HPdhruv",
  linkedin: "https://www.linkedin.com/in/1hpdhruv",
  location: "Chennai, India (SRM IST)",
  education: [
    {
      school: "SRM Institute of Science and Technology, Chennai",
      degree: "B.Tech in Computer Science",
      year: "2024 – 2028 (Expected)",
    },
    {
      school: "St. Xavier's School, Bokaro Steel City",
      degree: "Intermediate",
      year: "2024",
    },
    {
      school: "St. Xavier's School, Bokaro Steel City",
      degree: "Matriculation",
      year: "2022",
    },
  ],
  skills: {
    languages: ["Java", "Python", "TypeScript", "JavaScript", "C++"],
    frontend: ["React", "Tailwind CSS", "Vite", "HTML/CSS"],
    backend: ["Node.js", "Express", "Spring Boot", "REST APIs"],
    ml: ["TensorFlow", "Scikit-learn", "Flask", "Data Analysis"],
    databases: ["MongoDB", "SQL", "Firebase"],
    tools: ["Git", "Arduino", "Docker"],
    other: ["DSA", "Competitive Programming", "Robotics"],
  },
  projects: [
    {
      name: "EV Troubleshooter",
      category: "ML",
      desc: "ML system for diagnosing electric vehicle issues using sensor data and predictive analytics.",
      stack: ["Python", "TensorFlow", "Scikit-learn"],
    },
    {
      name: "AI Crop Recommendation System",
      category: "ML",
      desc: "AI platform recommending optimal crops based on soil conditions, climate, and historical data.",
      stack: ["Python", "Flask", "Machine Learning"],
    },
    {
      name: "Maze Solving Robot",
      category: "Robotics",
      desc: "Autonomous robot using sensors and pathfinding algorithms to navigate complex mazes.",
      stack: ["Arduino", "C++", "Sensors"],
    },
    {
      name: "E-Commerce Platform",
      category: "Web",
      desc: "Full-stack e-commerce app with product management, cart, and Stripe payment integration.",
      stack: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      name: "Task Management App",
      category: "Web",
      desc: "Collaborative task management platform with real-time updates and analytics.",
      stack: ["React", "Firebase", "TypeScript"],
    },
    {
      name: "Weather Dashboard",
      category: "Web",
      desc: "Real-time weather application with forecasts, maps, and geolocation alerts.",
      stack: ["React", "API Integration"],
    },
  ],
  research: {
    title: "AI-Based Depth Completion for Immersive AR/VR",
    status: "In Progress",
    overview:
      "Developing ML models to reconstruct depth maps from sparse sensor data for realistic AR/VR experiences.",
    objectives: [
      "Real-time depth map reconstruction",
      "High accuracy with sparse input",
      "Optimization for mobile devices",
      "Novel architecture for depth completion",
    ],
  },
  services: [
    "Full-Stack Development (Java + Spring Boot + React)",
    "Web Applications (SPA, PWA, Responsive Design)",
    "Machine Learning & Data Analysis",
    "Algorithm Design & Problem Solving",
  ],
  achievements: [
    "2x Hackathon Winner",
    "1st Place Ideathon Winner",
    "Creative Ingenuity Prize",
    "10+ Hackathon Participations",
    "5+ Robots Built",
    "10+ Web Applications Built",
  ],
};

// ─── Response Engine ──────────────────────────────────────────────────────────
function getDrakeResponse(input: string): string {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|sup|yo|hola|good\s*(morning|evening|afternoon))/.test(q)) {
    return `Hey there! 👋 I'm **DRAKE** — Dhruva's AI assistant. I know everything about him: his skills, projects, research, education, and more. What would you like to know?`;
  }

  // Who are you / what are you
  if (/who are you|what are you|your name|introduce yourself|about (you|drake)/.test(q)) {
    return `I'm **DRAKE** — Digital Responsive AI Knowledge Engine. I'm the personal AI assistant built into Dhruva Mishra's portfolio. Ask me anything about his skills, projects, education, or how to contact him!`;
  }

  // Who is Dhruv / about Dhruv
  if (/who is dhruv|about dhruv|tell me about dhruv|describe dhruv/.test(q)) {
    return `**Dhruva Mishra** is a passionate Full-Stack Developer, ML Engineer, and Competitive Programmer currently pursuing B.Tech in Computer Science at **SRM IST, Chennai** (2024–2028).\n\nHe builds interactive web experiences, trains ML models, and researches immersive AR/VR depth completion. His motto: *"${KB.motto}"*\n\nKey stats: 2 hackathons won · 5+ robots built · 10+ web apps · AR/VR research in progress.`;
  }

  // Skills
  if (/skill|tech|stack|know|language|tool|framework|expert/.test(q)) {
    return `Here's Dhruva's tech arsenal:\n\n🔡 **Languages:** ${KB.skills.languages.join(", ")}\n⚛️ **Frontend:** ${KB.skills.frontend.join(", ")}\n🖥️ **Backend:** ${KB.skills.backend.join(", ")}\n🤖 **ML/AI:** ${KB.skills.ml.join(", ")}\n🗄️ **Databases:** ${KB.skills.databases.join(", ")}\n🔧 **Other:** ${KB.skills.other.join(", ")}`;
  }

  // Projects
  if (/project|built|made|work|portfolio|app|application/.test(q)) {
    const list = KB.projects
      .map((p) => `• **${p.name}** *(${p.category})* — ${p.desc}`)
      .join("\n");
    return `Dhruva has built some impressive projects:\n\n${list}\n\nWant details on any specific project?`;
  }

  // EV Troubleshooter
  if (/ev|electric vehicle|troubleshoot/.test(q)) {
    const p = KB.projects[0];
    return `**${p.name}** is a ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nIt uses predictive analytics to detect faults before they become critical issues.`;
  }

  // Crop AI
  if (/crop|farm|agriculture|recommendation/.test(q)) {
    const p = KB.projects[1];
    return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nThis system integrates weather data, soil analysis, and historical patterns to give farmers actionable insights.`;
  }

  // Maze Robot
  if (/maze|robot|robotics|arduino/.test(q)) {
    const p = KB.projects[2];
    return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nDhruva has built 5+ robots, combining hardware control with software intelligence!`;
  }

  // E-commerce
  if (/ecommerce|e-commerce|shop|store|payment|stripe/.test(q)) {
    const p = KB.projects[3];
    return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nIncludes full authentication, product catalog, cart management, and Stripe-powered checkout.`;
  }

  // Research
  if (/research|ar|vr|depth|immersive|paper|publication/.test(q)) {
    const r = KB.research;
    return `**Research: ${r.title}** *(${r.status})*\n\n${r.overview}\n\n**Key objectives:**\n${r.objectives.map((o) => `• ${o}`).join("\n")}\n\nOpen to collaboration with researchers and institutions in AR/VR and computer vision!`;
  }

  // Education
  if (/education|study|college|university|school|degree|srm|b\.?tech/.test(q)) {
    const list = KB.education
      .map((e) => `• **${e.school}** — ${e.degree} *(${e.year})*`)
      .join("\n");
    return `**Dhruva's Educational Journey:**\n\n${list}`;
  }

  // Contact
  if (/contact|email|phone|reach|hire|get in touch|collaborate/.test(q)) {
    return `Want to reach Dhruva? Here you go:\n\n📧 **Email:** ${KB.email}\n📞 **Phone:** ${KB.phone}\n💼 **LinkedIn:** [linkedin.com/in/1hpdhruv](${KB.linkedin})\n🐙 **GitHub:** [github.com/1HPdhruv](${KB.github})\n📍 **Location:** ${KB.location}\n\nHe's open to freelance projects, collaborations, and full-time opportunities!`;
  }

  // GitHub / LinkedIn
  if (/github/.test(q)) {
    return `You can find Dhruva's code at **GitHub:** [github.com/1HPdhruv](${KB.github})\n\nHe regularly commits to open-source projects and personal experiments!`;
  }
  if (/linkedin/.test(q)) {
    return `Connect with Dhruva professionally at **LinkedIn:** [linkedin.com/in/1hpdhruv](${KB.linkedin})`;
  }

  // Services / hire
  if (/service|offer|freelance|hire|availability|available/.test(q)) {
    const list = KB.services.map((s) => `• ${s}`).join("\n");
    return `Dhruva offers the following services:\n\n${list}\n\nInterested in working together? Drop him a message at ${KB.email} or visit the Contact section!`;
  }

  // Achievements / awards
  if (/achiev|award|win|hackathon|prize|accomplishment|ideathon/.test(q)) {
    const list = KB.achievements.map((a) => `🏆 ${a}`).join("\n");
    return `Dhruva's achievements:\n\n${list}\n\nHe's consistently placed in competitive events and loves the challenge!`;
  }

  // Java / backend
  if (/java|spring|backend|api|rest/.test(q)) {
    return `Java is Dhruva's primary backend language. He builds **RESTful APIs**, microservices with **Spring Boot**, and connects them to databases like **MongoDB** and **SQL**. He's also proficient in **Node.js + Express** for JavaScript-based backends.`;
  }

  // Python / ML
  if (/python|tensorflow|scikit|ml|machine learning|ai|data science/.test(q)) {
    return `Dhruva is well-versed in Python for ML/AI:\n\n• **TensorFlow & Scikit-learn** for model training\n• **Flask** for deploying ML models as APIs\n• **Data Analysis** with Pandas and NumPy\n• Active **research** in depth completion for AR/VR\n\nHis EV Troubleshooter and Crop Recommendation projects are great examples!`;
  }

  // React / frontend
  if (/react|frontend|tailwind|typescript|vite|ui/.test(q)) {
    return `On the frontend, Dhruva uses:\n\n• **React + TypeScript** for component-based UIs\n• **Tailwind CSS** for utility-first styling\n• **Vite** as the build tool\n• Modern design patterns: glassmorphism, dark mode, animations\n\nThis very portfolio is built with React + Vite + Tailwind! 😄`;
  }

  // DSA / competitive programming
  if (/dsa|competitive|algorithm|leetcode|codeforces|atcoder|cp/.test(q)) {
    return `Dhruva is a competitive programmer with a strong DSA foundation:\n\n• Practices on **LeetCode**, **Codeforces**, and **AtCoder**\n• Expertise in graph algorithms, dynamic programming, and greedy approaches\n• His competitive mindset directly influences how he approaches complex engineering problems`;
  }

  // Motto / philosophy
  if (/motto|philosophy|approach|belief|mantra/.test(q)) {
    return `Dhruva's philosophy: **"${KB.motto}"**\n\nThis reflects his iterative approach to development — shipping, learning from mistakes, and constantly improving. He believes the best engineers are the ones who aren't afraid to break things.`;
  }

  // Fun / personal
  if (/fun|hobby|interest|passion|personal|like|love/.test(q)) {
    return `Beyond code, Dhruva is passionate about:\n\n🤖 Building robots from scratch\n🧩 Solving algorithmic puzzles\n🔬 Pushing the boundaries of AR/VR\n🌍 Contributing to open-source\n📚 Reading about AI advancements\n\nHe truly lives the *Build. Break. Learn. Repeat.* mantra!`;
  }

  // Help / what can you do
  if (/help|what can you|command|option|capability/.test(q)) {
    return `I can answer questions about:\n\n• 👤 **Who is Dhruva?**\n• 💻 **His skills & tech stack**\n• 🚀 **His projects**\n• 🔬 **His AR/VR research**\n• 🎓 **His education**\n• 🏆 **His achievements**\n• 📬 **How to contact him**\n• 🛠️ **Services he offers**\n\nJust ask naturally — I'll understand!`;
  }

  // Resume
  if (/resume|cv|download/.test(q)) {
    return `You can download Dhruva's resume directly from the hero section of this portfolio (the "Download Resume" button), or ask him to send it directly at **${KB.email}**!`;
  }

  // Location
  if (/location|where|city|country|live/.test(q)) {
    return `Dhruva is currently based in **Chennai, India** where he's pursuing his B.Tech at SRM IST. He's originally from **Bokaro Steel City, Jharkhand**.`;
  }

  // Fallback
  return `Hmm, I didn't quite catch that. 🤔 Try asking about:\n\n• Dhruva's **skills** or **projects**\n• His **research** or **education**\n• How to **contact** him\n• His **achievements**\n\nOr just say *"help"* to see all topics I can help with!`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  id: number;
  role: "user" | "drake";
  text: string;
  timestamp: Date;
};

const SUGGESTED = [
  "Who is Dhruva?",
  "What are his skills?",
  "Tell me about his projects",
  "How to contact him?",
  "What's his research about?",
  "His achievements?",
];

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i} className="text-cyan-300 font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i} className="text-purple-300 italic">{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
          className="text-cyan-400 underline hover:text-cyan-200 transition-colors">
          {linkMatch[1]}
        </a>
      );
    }
    // Handle newlines
    return part.split("\n").map((line, j) => (
      <span key={`${i}-${j}`}>
        {line}
        {j < part.split("\n").length - 1 && <br />}
      </span>
    ));
  });
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-cyan-400"
          style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isNew }: { msg: Message; isNew: boolean }) {
  const [displayed, setDisplayed] = useState(isNew && msg.role === "drake" ? "" : msg.text);
  const [done, setDone] = useState(!isNew || msg.role === "user");
  const idx = useRef(0);

  useEffect(() => {
    if (msg.role === "user" || !isNew) return;
    idx.current = 0;
    const chars = msg.text.split("");
    const tick = () => {
      if (idx.current >= chars.length) { setDone(true); return; }
      const chunkSize = chars[idx.current] === "\n" ? 1 : Math.floor(Math.random() * 3) + 1;
      setDisplayed((prev) => prev + chars.slice(idx.current, idx.current + chunkSize).join(""));
      idx.current += chunkSize;
      setTimeout(tick, 12 + Math.random() * 10);
    };
    setTimeout(tick, 80);
  }, []);

  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"} items-end animate-fade-in-up`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 mb-1 shadow-[0_0_12px_rgba(6,182,212,0.5)]">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-purple-600/80 to-blue-600/80 text-white rounded-br-sm border border-purple-400/30"
            : "bg-black/50 border border-cyan-500/20 text-slate-200 rounded-bl-sm backdrop-blur-sm"
        }`}
        style={{ boxShadow: isUser ? "0 0 20px rgba(168,85,247,0.2)" : "0 0 20px rgba(6,182,212,0.08)" }}
      >
        <div className="whitespace-pre-wrap break-words">
          {isUser ? msg.text : renderMarkdown(displayed)}
          {!done && <span className="inline-block w-0.5 h-3.5 bg-cyan-400 ml-0.5 align-middle animate-pulse" />}
        </div>
        <div className={`text-[10px] mt-1.5 opacity-40 ${isUser ? "text-right text-white" : "text-cyan-400"}`}>
          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mb-1 border border-purple-400/40">
          <span className="text-[10px] font-bold text-white">YOU</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Drake Component ─────────────────────────────────────────────────────
export function Drake() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "drake",
      text: `Hello! I'm **DRAKE** — Dhruva's AI assistant. 🚀\n\nI know everything about Dhruva: his skills, projects, research, achievements, and more.\n\nWhat would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [newMsgId, setNewMsgId] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);
  const [unread, setUnread] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdCounter = useRef(1);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  // Pulse the button occasionally when closed
  useEffect(() => {
    if (open) return;
    const t = setInterval(() => setPulse((p) => !p), 3000);
    return () => clearInterval(t);
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 300); setUnread(0); }
  }, [open]);

  const send = useCallback((text: string) => {
    if (!text.trim() || thinking) return;
    const userId = msgIdCounter.current++;
    const userMsg: Message = { id: userId, role: "user", text: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    setNewMsgId(null);

    // Simulate async AI "thinking"
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const drakeId = msgIdCounter.current++;
      const reply = getDrakeResponse(text);
      const drakeMsg: Message = { id: drakeId, role: "drake", text: reply, timestamp: new Date() };
      setMessages((prev) => [...prev, drakeMsg]);
      setNewMsgId(drakeId);
      setThinking(false);
      if (!open) setUnread((u) => u + 1);
    }, delay);
  }, [thinking, open]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const reset = () => {
    setMessages([{
      id: 0, role: "drake",
      text: `Hello again! I'm **DRAKE**. Ask me anything about Dhruva! 🚀`,
      timestamp: new Date(),
    }]);
    setNewMsgId(0);
    setUnread(0);
    msgIdCounter.current = 1;
  };

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <button
        id="drake-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open DRAKE AI Assistant"
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
          bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600
          shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)]
          hover:scale-110 active:scale-95
          ${pulse && !open ? "animate-bounce" : ""}
          ${open ? "rotate-0" : ""}`}
      >
        {open ? (
          <ChevronDown className="w-6 h-6 text-white" />
        ) : (
          <Sparkles className="w-6 h-6 text-white" />
        )}
        {/* Ping ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-40" />
        )}
        {/* Unread badge */}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border border-background">
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden
          border border-cyan-500/30 backdrop-blur-xl
          transition-all duration-400 origin-bottom-right
          ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}`}
        style={{
          background: "linear-gradient(135deg, rgba(5,10,30,0.97) 0%, rgba(10,5,30,0.97) 100%)",
          boxShadow: "0 0 60px rgba(6,182,212,0.15), 0 0 120px rgba(168,85,247,0.08), inset 0 1px 0 rgba(6,182,212,0.1)",
          maxHeight: "80vh",
        }}
      >
        {/* ── Header ── */}
        <div className="relative px-4 py-3 border-b border-cyan-500/20"
          style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.08), rgba(168,85,247,0.08))" }}>
          {/* Animated top bar */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-background shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            </div>
            <div>
              <div className="font-bold text-white font-mono tracking-wider text-sm flex items-center gap-1.5">
                DRAKE
                <span className="text-[9px] font-normal text-cyan-400/60 border border-cyan-500/30 rounded px-1 py-0.5">AI</span>
              </div>
              <div className="text-[11px] text-cyan-400/70 font-mono">Digital Responsive AI Knowledge Engine</div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={reset}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-cyan-400 transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Messages ── */}
        <div className="overflow-y-auto p-3 space-y-3" style={{ height: "340px" }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isNew={msg.id === newMsgId} />
          ))}
          {thinking && (
            <div className="flex gap-2 items-end animate-fade-in-up">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-black/50 border border-cyan-500/20 rounded-2xl rounded-bl-sm backdrop-blur-sm"
                style={{ boxShadow: "0 0 20px rgba(6,182,212,0.08)" }}>
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* ── Suggested prompts ── */}
        {messages.length <= 2 && (
          <div className="px-3 pb-2">
            <div className="text-[10px] text-cyan-400/50 font-mono mb-1.5 tracking-wider">QUICK QUESTIONS</div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-cyan-500/30 text-cyan-400/80
                    hover:border-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-500/5
                    transition-all duration-200 cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input ── */}
        <div className="px-3 pb-3 border-t border-cyan-500/10 pt-2">
          <div className="flex gap-2 items-center bg-black/40 border border-cyan-500/20 rounded-xl px-3 py-2
            focus-within:border-cyan-400/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.1)]
            transition-all duration-200">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about Dhruva…"
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none font-mono min-w-0"
              maxLength={300}
              disabled={thinking}
              id="drake-input"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || thinking}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer
                disabled:opacity-30 disabled:cursor-not-allowed
                bg-gradient-to-br from-cyan-500 to-purple-600
                hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-90"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="text-[9px] text-center text-slate-600 mt-1.5 font-mono">
            DRAKE · Powered by Dhruva's knowledge base
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
