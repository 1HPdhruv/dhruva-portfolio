import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, ChevronDown, Sparkles, RotateCcw, Zap, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Knowledge Base ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════════
// ─── SLM: Semantic Language Model — TF-IDF Cosine Similarity Engine ───────────
// ═══════════════════════════════════════════════════════════════════════════════

// Stop words to ignore during matching
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "shall",
  "should", "may", "might", "must", "can", "could", "to", "of", "in",
  "for", "on", "with", "at", "by", "from", "as", "into", "through",
  "during", "before", "after", "above", "below", "between", "out",
  "off", "over", "under", "again", "further", "then", "once", "here",
  "there", "when", "where", "why", "how", "all", "each", "every",
  "both", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "about", "also", "and", "but", "or", "if", "while", "because",
  "until", "that", "which", "who", "whom", "this", "these", "those",
  "it", "its", "he", "him", "his", "she", "her", "they", "them",
  "their", "we", "us", "our", "you", "your", "i", "me", "my", "what",
  "tell", "me", "know", "please", "could", "want", "like", "get",
  "give", "show", "let", "see", "need", "much", "many", "any",
]);

// Tokenize: lowercased words, no punctuation, no stop-words
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

// Stemming-lite: reduce common suffixes for better matching
function stem(word: string): string {
  return word
    .replace(/ing$/, "")
    .replace(/tion$/, "t")
    .replace(/sion$/, "s")
    .replace(/ment$/, "")
    .replace(/ness$/, "")
    .replace(/able$/, "")
    .replace(/ible$/, "")
    .replace(/ful$/, "")
    .replace(/ous$/, "")
    .replace(/ive$/, "")
    .replace(/ity$/, "")
    .replace(/ally$/, "")
    .replace(/ly$/, "")
    .replace(/es$/, "")
    .replace(/ed$/, "")
    .replace(/s$/, "");
}

// Build TF vector from token list
function buildTfVector(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  const stemmed = tokens.map(stem);
  for (const t of stemmed) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  // Normalize by total tokens
  const total = stemmed.length || 1;
  for (const [k, v] of tf) {
    tf.set(k, v / total);
  }
  return tf;
}

// Cosine similarity between two TF vectors
function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const [key, val] of a) {
    magA += val * val;
    const bVal = b.get(key);
    if (bVal !== undefined) {
      dotProduct += val * bVal;
    }
  }
  for (const [, val] of b) {
    magB += val * val;
  }

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dotProduct / denom;
}

// ─── Intent definitions with semantic training phrases ────────────────────────
interface IntentDef {
  id: string;
  phrases: string[];    // Training phrases the SLM learns from
  keywords: string[];   // High-weight keywords (boosted matching)
  response: () => string;
}

const INTENTS: IntentDef[] = [
  // ── Greetings ──
  {
    id: "greeting",
    phrases: [
      "hi", "hello", "hey", "hi there", "hey there", "good morning",
      "good afternoon", "good evening", "howdy", "yo", "sup",
      "what's up", "hola", "greetings",
    ],
    keywords: ["hi", "hello", "hey", "greet", "morning", "evening", "afternoon", "hola"],
    response: () =>
      `Hey there! 👋 I'm **DRAKE** — Dhruva's AI assistant. I know everything about him: his skills, projects, research, education, and more. What would you like to know?`,
  },

  // ── Identity / About Drake ──
  {
    id: "about_drake",
    phrases: [
      "who are you", "what are you", "your name", "introduce yourself",
      "about you", "about drake", "what is drake", "tell me about yourself",
      "who made you", "what can you do", "your purpose",
    ],
    keywords: ["drake", "yourself", "purpose", "introduce", "assistant"],
    response: () =>
      `I'm **DRAKE** — Digital Responsive AI Knowledge Engine. I'm the personal AI assistant built into Dhruva Mishra's portfolio. I use a semantic language model to understand your questions and match them to my knowledge base.\n\nAsk me anything about Dhruva's skills, projects, education, research, achievements, or how to contact him!`,
  },

  // ── About Dhruva ──
  {
    id: "about_dhruva",
    phrases: [
      "who is dhruva", "about dhruva", "tell me about dhruva", "describe dhruva",
      "who is dhruv", "about dhruv", "tell me about dhruv", "who is he",
      "what does dhruva do", "introduce dhruva", "about the developer",
      "who built this", "who created this portfolio", "about the owner",
    ],
    keywords: ["dhruv", "dhruva", "developer", "creator", "owner", "built", "who"],
    response: () =>
      `**Dhruva Mishra** is a passionate Full-Stack Developer, ML Engineer, and Competitive Programmer currently pursuing B.Tech in Computer Science at **SRM IST, Chennai** (2024–2028).\n\nHe builds interactive web experiences, trains ML models, and researches immersive AR/VR depth completion. His motto: *"${KB.motto}"*\n\nKey stats: 2 hackathons won · 5+ robots built · 10+ web apps · AR/VR research in progress.`,
  },

  // ── Skills & Tech Stack ──
  {
    id: "skills",
    phrases: [
      "what are his skills", "skills", "tech stack", "technologies",
      "what does he know", "technical skills", "programming languages",
      "what languages does he know", "frameworks", "tools he uses",
      "expertise", "proficiency", "what tech does he use", "capabilities",
      "what is he good at", "strong at", "specialization",
    ],
    keywords: ["skill", "tech", "stack", "language", "tool", "framework", "expert", "proficien", "technolog", "capabil"],
    response: () =>
      `Here's Dhruva's tech arsenal:\n\n🔡 **Languages:** ${KB.skills.languages.join(", ")}\n⚛️ **Frontend:** ${KB.skills.frontend.join(", ")}\n🖥️ **Backend:** ${KB.skills.backend.join(", ")}\n🤖 **ML/AI:** ${KB.skills.ml.join(", ")}\n🗄️ **Databases:** ${KB.skills.databases.join(", ")}\n🔧 **Other:** ${KB.skills.other.join(", ")}`,
  },

  // ── All Projects ──
  {
    id: "projects",
    phrases: [
      "projects", "what has he built", "portfolio projects", "his work",
      "applications he made", "apps he built", "show me his projects",
      "list projects", "what projects", "his creations", "things he built",
      "work samples", "project list", "what has dhruva built",
    ],
    keywords: ["project", "built", "made", "work", "portfolio", "app", "application", "creation"],
    response: () => {
      const list = KB.projects
        .map((p) => `• **${p.name}** *(${p.category})* — ${p.desc}`)
        .join("\n");
      return `Dhruva has built some impressive projects:\n\n${list}\n\nWant details on any specific project?`;
    },
  },

  // ── EV Troubleshooter ──
  {
    id: "ev_project",
    phrases: [
      "ev troubleshooter", "electric vehicle", "ev project", "vehicle diagnostics",
      "car diagnostics", "ev fault detection", "tell me about ev troubleshooter",
    ],
    keywords: ["ev", "electric", "vehicle", "troubleshoot", "diagnos"],
    response: () => {
      const p = KB.projects[0];
      return `**${p.name}** is a ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nIt uses predictive analytics to detect faults before they become critical issues. This project demonstrates Dhruva's ability to apply ML to real-world engineering problems.`;
    },
  },

  // ── Crop AI ──
  {
    id: "crop_project",
    phrases: [
      "crop recommendation", "agriculture project", "farming ai",
      "crop prediction", "soil analysis", "tell me about crop system",
    ],
    keywords: ["crop", "farm", "agricultur", "soil", "recommend"],
    response: () => {
      const p = KB.projects[1];
      return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nThis system integrates weather data, soil analysis, and historical patterns to give farmers actionable insights. A great example of AI for social good!`;
    },
  },

  // ── Maze Robot ──
  {
    id: "robot_project",
    phrases: [
      "maze robot", "robotics project", "robot", "arduino project",
      "maze solving", "autonomous robot", "hardware project",
    ],
    keywords: ["maze", "robot", "robotic", "arduino", "hardware", "autonomous"],
    response: () => {
      const p = KB.projects[2];
      return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nDhruva has built 5+ robots, combining hardware control with software intelligence! He loves the intersection of physical computing and algorithms.`;
    },
  },

  // ── E-Commerce ──
  {
    id: "ecommerce_project",
    phrases: [
      "ecommerce", "e-commerce", "online store", "shopping app",
      "stripe payment", "product management", "cart system",
    ],
    keywords: ["ecommerce", "commerce", "shop", "store", "payment", "stripe", "cart"],
    response: () => {
      const p = KB.projects[3];
      return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nIncludes full authentication, product catalog, cart management, and Stripe-powered checkout. A complete production-ready solution!`;
    },
  },

  // ── Task Management ──
  {
    id: "task_project",
    phrases: [
      "task management", "task app", "productivity app", "todo app",
      "collaborative tool", "task tracker",
    ],
    keywords: ["task", "todo", "productiv", "tracker", "collaborat"],
    response: () => {
      const p = KB.projects[4];
      return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nFeatures real-time synchronization, analytics dashboards, and a clean UI for team collaboration.`;
    },
  },

  // ── Weather Dashboard ──
  {
    id: "weather_project",
    phrases: [
      "weather dashboard", "weather app", "forecast application",
      "weather project", "climate app",
    ],
    keywords: ["weather", "forecast", "climate", "dashboard"],
    response: () => {
      const p = KB.projects[5];
      return `**${p.name}**: ${p.desc}\n\n**Stack:** ${p.stack.join(", ")}\n\nIncludes interactive maps, geolocation-based alerts, and beautiful data visualizations.`;
    },
  },

  // ── Research ──
  {
    id: "research",
    phrases: [
      "research", "ar vr", "augmented reality", "virtual reality",
      "depth completion", "immersive", "paper", "publication",
      "academic work", "research paper", "what is he researching",
      "depth maps", "computer vision",
    ],
    keywords: ["research", "ar", "vr", "depth", "immers", "paper", "publicat", "vision", "academ"],
    response: () => {
      const r = KB.research;
      return `**Research: ${r.title}** *(${r.status})*\n\n${r.overview}\n\n**Key objectives:**\n${r.objectives.map((o) => `• ${o}`).join("\n")}\n\nOpen to collaboration with researchers and institutions in AR/VR and computer vision!`;
    },
  },

  // ── Education ──
  {
    id: "education",
    phrases: [
      "education", "where did he study", "college", "university",
      "school", "degree", "srm", "btech", "b tech", "academic background",
      "qualification", "where does he study", "student",
    ],
    keywords: ["educat", "study", "colleg", "univers", "school", "degree", "srm", "btech", "qualificat", "student"],
    response: () => {
      const list = KB.education
        .map((e) => `• **${e.school}** — ${e.degree} *(${e.year})*`)
        .join("\n");
      return `**Dhruva's Educational Journey:**\n\n${list}`;
    },
  },

  // ── Contact ──
  {
    id: "contact",
    phrases: [
      "contact", "email", "phone", "reach him", "hire him",
      "get in touch", "collaborate", "how to contact", "reach dhruva",
      "connect with him", "his email", "his phone", "talk to him",
      "send message", "message him",
    ],
    keywords: ["contact", "email", "phone", "reach", "hire", "touch", "collaborat", "connect", "message"],
    response: () =>
      `Want to reach Dhruva? Here you go:\n\n📧 **Email:** ${KB.email}\n📞 **Phone:** ${KB.phone}\n💼 **LinkedIn:** [linkedin.com/in/1hpdhruv](${KB.linkedin})\n🐙 **GitHub:** [github.com/1HPdhruv](${KB.github})\n📍 **Location:** ${KB.location}\n\nHe's open to freelance projects, collaborations, and full-time opportunities!`,
  },

  // ── GitHub ──
  {
    id: "github",
    phrases: [
      "github", "github profile", "source code", "repositories",
      "open source", "code repositories", "his github",
    ],
    keywords: ["github", "repositor", "source", "code", "opensource"],
    response: () =>
      `You can find Dhruva's code at **GitHub:** [github.com/1HPdhruv](${KB.github})\n\nHe regularly commits to open-source projects and personal experiments!`,
  },

  // ── LinkedIn ──
  {
    id: "linkedin",
    phrases: [
      "linkedin", "linkedin profile", "professional profile",
      "connect professionally", "his linkedin",
    ],
    keywords: ["linkedin", "professional", "profile"],
    response: () =>
      `Connect with Dhruva professionally at **LinkedIn:** [linkedin.com/in/1hpdhruv](${KB.linkedin})`,
  },

  // ── Services ──
  {
    id: "services",
    phrases: [
      "services", "what does he offer", "freelance", "hire",
      "availability", "consulting", "what can he do for me",
      "work with him", "outsource", "contract work",
    ],
    keywords: ["servic", "offer", "freelanc", "hire", "availab", "consult", "contract"],
    response: () => {
      const list = KB.services.map((s) => `• ${s}`).join("\n");
      return `Dhruva offers the following services:\n\n${list}\n\nInterested in working together? Drop him a message at ${KB.email} or visit the Contact section!`;
    },
  },

  // ── Achievements ──
  {
    id: "achievements",
    phrases: [
      "achievements", "awards", "accomplishments", "hackathon wins",
      "prizes", "competitions", "trophies", "what has he won",
      "ideathon", "accolades", "honors",
    ],
    keywords: ["achiev", "award", "win", "hackathon", "prize", "accomplish", "compet", "ideathon", "honor"],
    response: () => {
      const list = KB.achievements.map((a) => `🏆 ${a}`).join("\n");
      return `Dhruva's achievements:\n\n${list}\n\nHe's consistently placed in competitive events and loves the challenge!`;
    },
  },

  // ── Java / Backend ──
  {
    id: "java_backend",
    phrases: [
      "java", "spring boot", "backend development", "server side",
      "rest api", "microservices", "java programming",
    ],
    keywords: ["java", "spring", "backend", "api", "rest", "microservic", "server"],
    response: () =>
      `Java is Dhruva's primary backend language. He builds **RESTful APIs**, microservices with **Spring Boot**, and connects them to databases like **MongoDB** and **SQL**. He's also proficient in **Node.js + Express** for JavaScript-based backends.`,
  },

  // ── Python / ML ──
  {
    id: "python_ml",
    phrases: [
      "python", "machine learning", "tensorflow", "scikit learn",
      "data science", "ai", "artificial intelligence", "deep learning",
      "neural network", "ml models", "data analysis",
    ],
    keywords: ["python", "tensorflow", "scikit", "ml", "machin", "learn", "ai", "artific", "deep", "neural", "data"],
    response: () =>
      `Dhruva is well-versed in Python for ML/AI:\n\n• **TensorFlow & Scikit-learn** for model training\n• **Flask** for deploying ML models as APIs\n• **Data Analysis** with Pandas and NumPy\n• Active **research** in depth completion for AR/VR\n\nHis EV Troubleshooter and Crop Recommendation projects are great examples!`,
  },

  // ── React / Frontend ──
  {
    id: "react_frontend",
    phrases: [
      "react", "frontend", "tailwind", "typescript", "vite",
      "user interface", "ui design", "web design", "front end",
      "css", "html", "responsive design",
    ],
    keywords: ["react", "frontend", "front", "tailwind", "typescript", "vite", "ui", "design", "css", "html"],
    response: () =>
      `On the frontend, Dhruva uses:\n\n• **React + TypeScript** for component-based UIs\n• **Tailwind CSS** for utility-first styling\n• **Vite** as the build tool\n• Modern design patterns: glassmorphism, dark mode, animations\n\nThis very portfolio is built with React + Vite + Tailwind! 😄`,
  },

  // ── DSA / CP ──
  {
    id: "dsa_cp",
    phrases: [
      "dsa", "data structures", "algorithms", "competitive programming",
      "leetcode", "codeforces", "atcoder", "problem solving",
      "coding competitions", "competitive coding",
    ],
    keywords: ["dsa", "competit", "algorithm", "leetcode", "codeforce", "atcoder", "problem", "structur"],
    response: () =>
      `Dhruva is a competitive programmer with a strong DSA foundation:\n\n• Practices on **LeetCode**, **Codeforces**, and **AtCoder**\n• Expertise in graph algorithms, dynamic programming, and greedy approaches\n• His competitive mindset directly influences how he approaches complex engineering problems`,
  },

  // ── Motto / Philosophy ──
  {
    id: "motto",
    phrases: [
      "motto", "philosophy", "approach", "belief", "mantra",
      "guiding principle", "work ethic", "mindset",
    ],
    keywords: ["motto", "philosoph", "approach", "belief", "mantra", "princip", "ethic", "mindset"],
    response: () =>
      `Dhruva's philosophy: **"${KB.motto}"**\n\nThis reflects his iterative approach to development — shipping, learning from mistakes, and constantly improving. He believes the best engineers are the ones who aren't afraid to break things.`,
  },

  // ── Hobbies / Personal ──
  {
    id: "personal",
    phrases: [
      "hobbies", "interests", "passion", "personal life",
      "fun facts", "what does he like", "beyond coding",
      "free time", "spare time", "outside work",
    ],
    keywords: ["hobb", "interest", "passion", "personal", "fun", "free", "spare", "outsid"],
    response: () =>
      `Beyond code, Dhruva is passionate about:\n\n🤖 Building robots from scratch\n🧩 Solving algorithmic puzzles\n🔬 Pushing the boundaries of AR/VR\n🌍 Contributing to open-source\n📚 Reading about AI advancements\n\nHe truly lives the *Build. Break. Learn. Repeat.* mantra!`,
  },

  // ── Help ──
  {
    id: "help",
    phrases: [
      "help", "what can you do", "commands", "options",
      "capabilities", "features", "how to use", "guide",
    ],
    keywords: ["help", "command", "option", "capabil", "featur", "guid"],
    response: () =>
      `I can answer questions about:\n\n• 👤 **Who is Dhruva?**\n• 💻 **His skills & tech stack**\n• 🚀 **His projects** (EV, Crop AI, Robot, E-Commerce, etc.)\n• 🔬 **His AR/VR research**\n• 🎓 **His education**\n• 🏆 **His achievements**\n• 📬 **How to contact him**\n• 🛠️ **Services he offers**\n• 🐙 **GitHub & LinkedIn**\n\nJust ask naturally — my semantic engine understands you!`,
  },

  // ── Resume ──
  {
    id: "resume",
    phrases: [
      "resume", "cv", "download resume", "curriculum vitae",
      "work history", "professional summary",
    ],
    keywords: ["resum", "cv", "download", "curriculum"],
    response: () =>
      `You can download Dhruva's resume directly from the hero section of this portfolio (the "Download Resume" button), or ask him to send it directly at **${KB.email}**!`,
  },

  // ── Location ──
  {
    id: "location",
    phrases: [
      "location", "where is he", "city", "country", "where does he live",
      "hometown", "based in", "from where",
    ],
    keywords: ["locat", "where", "city", "country", "live", "hometown", "based"],
    response: () =>
      `Dhruva is currently based in **Chennai, India** where he's pursuing his B.Tech at SRM IST. He's originally from **Bokaro Steel City, Jharkhand**.`,
  },

  // ── Thank you / Goodbye ──
  {
    id: "thanks",
    phrases: [
      "thank you", "thanks", "bye", "goodbye", "see you",
      "appreciate it", "great", "awesome", "nice", "cool",
    ],
    keywords: ["thank", "bye", "goodbye", "appreciat", "great", "awesome"],
    response: () =>
      `You're welcome! 😊 If you have more questions about Dhruva, I'm always here. Feel free to ask anytime!\n\n*— DRAKE, signing off for now.*`,
  },

  // ── Age / Year ──
  {
    id: "age",
    phrases: [
      "how old is he", "age", "what year", "born when", "birthday",
      "when was he born",
    ],
    keywords: ["old", "age", "year", "born", "birthday"],
    response: () =>
      `Dhruva is currently in his first year of B.Tech (2024–2028) at SRM IST. He completed his schooling from **St. Xavier's School, Bokaro Steel City**.`,
  },

  // ── Experience / Internship ──
  {
    id: "experience",
    phrases: [
      "experience", "internship", "work experience", "job",
      "professional experience", "career", "employment",
    ],
    keywords: ["experienc", "internship", "job", "career", "employ", "profession"],
    response: () =>
      `Dhruva is currently a B.Tech student focused on building real-world projects. His experience includes:\n\n• **${KB.projects.length} major projects** spanning ML, Web Dev, and Robotics\n• **2x Hackathon Winner** with 10+ participations\n• Active **AR/VR research** (${KB.research.status})\n• **5+ robots built** from scratch\n\nHe's actively seeking internship and collaboration opportunities! Contact: ${KB.email}`,
  },

  // ── Database ──
  {
    id: "database",
    phrases: [
      "database", "mongodb", "sql", "firebase", "data storage",
      "nosql", "relational database",
    ],
    keywords: ["databas", "mongodb", "sql", "firebase", "nosql", "relat", "storage"],
    response: () =>
      `Dhruva works with multiple database technologies:\n\n• **MongoDB** — NoSQL document database for flexible schemas\n• **SQL** — Relational databases for structured data\n• **Firebase** — Real-time database & cloud backend\n\nHe integrates these with his backend services built in Spring Boot and Node.js.`,
  },
];

// ─── Pre-compute TF vectors for all intents ──────────────────────────────────
const INTENT_VECTORS: { intent: IntentDef; vectors: Map<string, number>[]; keywordSet: Set<string> }[] =
  INTENTS.map((intent) => ({
    intent,
    vectors: intent.phrases.map((p) => buildTfVector(tokenize(p))),
    keywordSet: new Set(intent.keywords.map(stem)),
  }));

// ─── Main SLM Query Function ─────────────────────────────────────────────────
function getDrakeResponse(input: string): string {
  const q = input.toLowerCase().trim();
  if (!q) return INTENTS.find((i) => i.id === "help")!.response();

  const queryTokens = tokenize(q);
  if (queryTokens.length === 0) {
    // Only stop words — check for simple greetings
    if (/^(hi|hello|hey|yo|sup|hola)$/i.test(q.replace(/[^a-z]/g, ""))) {
      return INTENTS.find((i) => i.id === "greeting")!.response();
    }
    return INTENTS.find((i) => i.id === "help")!.response();
  }

  const queryVector = buildTfVector(queryTokens);
  const queryStemmed = new Set(queryTokens.map(stem));

  let bestScore = 0;
  let bestIntent: IntentDef | null = null;

  for (const { intent, vectors, keywordSet } of INTENT_VECTORS) {
    // 1. Cosine similarity against each training phrase
    let maxCosine = 0;
    for (const vec of vectors) {
      const sim = cosineSimilarity(queryVector, vec);
      if (sim > maxCosine) maxCosine = sim;
    }

    // 2. Keyword overlap bonus (boosted by 2x weight)
    let keywordHits = 0;
    for (const kw of keywordSet) {
      for (const qs of queryStemmed) {
        // Partial match — if stemmed query word starts with or contains keyword
        if (qs.includes(kw) || kw.includes(qs)) {
          keywordHits++;
          break;
        }
      }
    }
    const keywordBonus = keywordSet.size > 0 ? (keywordHits / keywordSet.size) * 0.5 : 0;

    // 3. Exact substring match bonus for short queries
    let exactBonus = 0;
    for (const phrase of intent.phrases) {
      if (q.includes(phrase) || phrase.includes(q)) {
        exactBonus = 0.3;
        break;
      }
    }

    const finalScore = maxCosine * 0.5 + keywordBonus + exactBonus;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestIntent = intent;
    }
  }

  // Threshold: if best score is too low, return fallback
  if (bestScore < 0.12 || !bestIntent) {
    return `I'm not sure I understood that perfectly, but here's what I can help with:\n\n• 👤 **About Dhruva** — "Who is Dhruva?"\n• 💻 **Skills** — "What are his skills?"\n• 🚀 **Projects** — "Tell me about his projects"\n• 🔬 **Research** — "What's his research about?"\n• 🎓 **Education** — "Where did he study?"\n• 🏆 **Achievements** — "What has he won?"\n• 📬 **Contact** — "How to reach him?"\n\nTry rephrasing or ask one of these!`;
  }

  return bestIntent.response();
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Speech Synthesis ─────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
function speakVoice(text: string, enabled: boolean) {
  if (!enabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const clean = text
    .replace(/[#*`_~]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/📧|📞|💼|🐙|📍|🔡|⚛️|🖥️|🤖|🗄️|🔧|🏆|👋|🚀|🤔|😄|😊/g, "");

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.05;
  utterance.pitch = 0.95;
  window.speechSynthesis.speak(utterance);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Types & Constants ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Markdown-lite renderer ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Drake Component ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
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

  // Voice & Listening State — defaults ON
  const [voiceListening, setVoiceListening] = useState(true);
  const [speechOutput, setSpeechOutput] = useState(true);
  const [listeningStatus, setListeningStatus] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdCounter = useRef(1);
  const recognitionRef = useRef<any>(null);
  const voiceListeningRef = useRef(voiceListening);
  voiceListeningRef.current = voiceListening;

  const speechOutputRef = useRef(speechOutput);
  speechOutputRef.current = speechOutput;

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, listeningStatus]);

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

    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const drakeId = msgIdCounter.current++;
      const reply = getDrakeResponse(text);
      const drakeMsg: Message = { id: drakeId, role: "drake", text: reply, timestamp: new Date() };
      setMessages((prev) => [...prev, drakeMsg]);
      setNewMsgId(drakeId);
      setThinking(false);
      if (!open) setUnread((u) => u + 1);

      speakVoice(reply, speechOutputRef.current);
    }, delay);
  }, [thinking, open]);

  // ─── Web Speech API: Background Listening (always-on, no wake word needed) ──
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn("SpeechRecognition API not supported in this browser.");
      return;
    }

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListeningStatus("🎙️ DRAKE listening — speak your question…");
    };

    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setVoiceListening(false);
        setListeningStatus("Microphone access denied.");
      }
      // For network/no-speech errors, keep auto-restarting
    };

    recognition.onend = () => {
      if (voiceListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          // Already started — ignore
        }
      } else {
        setListeningStatus("");
      }
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.trim();
      const confidence = event.results[current][0].confidence;
      console.log("Heard:", transcript, "Confidence:", confidence);

      if (transcript.length < 2) return; // Ignore noise

      // Strip any "hey drake" prefix if present, but don't require it
      let command = transcript;
      const wakeWords = ["hey drake", "ok drake", "hello drake"];
      for (const w of wakeWords) {
        if (command.toLowerCase().includes(w)) {
          command = command.substring(command.toLowerCase().indexOf(w) + w.length).trim();
          break;
        }
      }

      // If nothing remains after stripping wake word, just acknowledge
      if (command.length < 2) {
        const wakeReply = "Yes, I'm listening. What would you like to know about Dhruva?";
        setListeningStatus("Drake activated — awaiting command…");
        setOpen(true);
        speakVoice(wakeReply, speechOutputRef.current);
        const drakeId = msgIdCounter.current++;
        setMessages((prev) => [
          ...prev,
          { id: drakeId, role: "drake", text: wakeReply, timestamp: new Date() },
        ]);
        setNewMsgId(drakeId);
        return;
      }

      // Process the voice query
      setListeningStatus(`Heard: "${command}"`);
      setOpen(true);
      setUnread(0);
      send(command);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
    };
  }, [send]);

  // Auto-start recognition when component mounts (or when voiceListening changes)
  useEffect(() => {
    if (!recognitionRef.current) return;
    if (voiceListening) {
      // Small delay to let the browser settle after intro sequence interaction
      const timer = setTimeout(() => {
        try { recognitionRef.current.start(); } catch (_e) { /* already started */ }
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      try { recognitionRef.current.abort(); } catch (_e) { /* not running */ }
      setListeningStatus("");
    }
  }, [voiceListening]);

  const toggleVoiceListening = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice AI feature is not supported in your browser (try Chrome, Edge, or Safari).");
      return;
    }
    setVoiceListening((prev) => !prev);
  };

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
      {/* ── Floating Trigger Button & Voice Indicator ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Floating Voice Status Badge */}
        {!open && (
          <button
            onClick={toggleVoiceListening}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-md border transition-all duration-300 shadow-lg cursor-pointer ${
              voiceListening
                ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse"
                : "bg-black/60 border-cyan-500/30 text-cyan-400/80 hover:border-cyan-500/60 hover:text-cyan-300"
            }`}
            title={voiceListening ? "DRAKE is actively listening. Click to mute." : "Click to enable DRAKE voice assistant"}
          >
            {voiceListening ? (
              <>
                <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>DRAKE LISTENING</span>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span>VOICE AI: OFF</span>
              </>
            )}
          </button>
        )}

        <button
          id="drake-toggle-btn"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open DRAKE AI Assistant"
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
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
          {!open && (
            <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-40" />
          )}
          {unread > 0 && !open && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border border-background">
              {unread}
            </span>
          )}
        </button>
      </div>

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
                <span className="text-[9px] font-normal text-cyan-400/60 border border-cyan-500/30 rounded px-1 py-0.5">SLM</span>
              </div>
              <div className="text-[11px] text-cyan-400/70 font-mono">Semantic Language Model · Always On</div>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={toggleVoiceListening}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${voiceListening ? "text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "text-slate-400 hover:text-cyan-400"}`}
                title={voiceListening ? "Mute voice input" : "Enable voice input"}
              >
                {voiceListening ? <Mic className="w-3.5 h-3.5 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setSpeechOutput((prev) => !prev)}
                className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${speechOutput ? "text-cyan-400" : "text-slate-500 hover:text-slate-400"}`}
                title={speechOutput ? "Mute AI voice responses" : "Unmute AI voice responses"}
              >
                {speechOutput ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
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

          {/* Listening Status Bar */}
          {voiceListening && (
            <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded px-2 py-1 flex items-center gap-1.5 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="truncate">{listeningStatus || "🎙️ DRAKE listening — speak your question…"}</span>
            </div>
          )}
        </div>

        {/* ── Messages ── */}
        <div className="overflow-y-auto p-3 space-y-3" style={{ height: voiceListening ? "310px" : "340px" }}>
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
            DRAKE · Semantic Language Model · Always Listening
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
