import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles, RotateCcw, Zap, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

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
// ─── Siri-like Animated Orb (Canvas) ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
type OrbState = "idle" | "listening" | "thinking" | "speaking";

function DrakeOrb({ state, statusText, onDismiss }: { state: OrbState; statusText: string; onDismiss: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 280;
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(2, 2);

    const cx = size / 2;
    const cy = size / 2;
    let animId: number;

    const draw = () => {
      frameRef.current++;
      const t = frameRef.current * 0.018;
      ctx.clearRect(0, 0, size, size);

      const intensity = state === "listening" ? 1.6 : state === "thinking" ? 2.2 : state === "speaking" ? 1.8 : 0.5;
      const baseRadius = state === "listening" ? 68 : state === "thinking" ? 60 : state === "speaking" ? 72 : 55;
      const blobCount = 5;
      const layers = state === "idle" ? 3 : 5;

      for (let layer = 0; layer < layers; layer++) {
        const layerAlpha = state === "idle" ? 0.15 - layer * 0.03 : 0.22 - layer * 0.03;
        const hueShift = layer * 55 + t * 25 * intensity;
        const colors = [
          `hsla(${190 + hueShift}, 90%, 60%, ${layerAlpha})`,
          `hsla(${270 + hueShift}, 85%, 55%, ${layerAlpha})`,
          `hsla(${330 + hueShift}, 80%, 55%, ${layerAlpha})`,
          `hsla(${140 + hueShift}, 85%, 50%, ${layerAlpha})`,
        ];

        ctx.beginPath();
        const steps = 180;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          let r = baseRadius + layer * 6;
          for (let b = 0; b < blobCount; b++) {
            const freq = b + 1.5;
            const phase = b * 1.3 + layer * 0.7;
            const amp = (6 + layer * 3) * intensity * Math.sin(t * (0.8 + b * 0.3) + phase);
            r += amp * Math.sin(freq * angle + t * intensity + phase);
          }
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius + 40);
        grad.addColorStop(0, colors[layer % colors.length]);
        grad.addColorStop(0.6, colors[(layer + 1) % colors.length]);
        grad.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
      const coreHue = state === "listening" ? 160 : state === "thinking" ? 270 : state === "speaking" ? 200 : 210;
      const corePulse = 0.3 + Math.sin(t * 3) * 0.15;
      coreGrad.addColorStop(0, `hsla(${coreHue}, 100%, 80%, ${corePulse + 0.3})`);
      coreGrad.addColorStop(0.5, `hsla(${coreHue}, 90%, 60%, ${corePulse})`);
      coreGrad.addColorStop(1, "hsla(0,0%,0%,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 30 + Math.sin(t * 2) * 5, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [state]);

  const stateLabels: Record<OrbState, string> = {
    idle: "Say \"Hey Drake\" to activate",
    listening: "Listening…",
    thinking: "Processing…",
    speaking: "Speaking…",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none cursor-pointer"
      onClick={onDismiss}
      style={{
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%)",
        backdropFilter: "blur(20px)",
        animation: "orb-fadein 0.4s ease-out forwards",
      }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: 340, height: 340,
          background: state === "listening"
            ? "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)"
            : state === "thinking"
            ? "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
          animation: "orb-ring-pulse 2s ease-in-out infinite",
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{
          filter: `drop-shadow(0 0 40px ${
            state === "listening" ? "rgba(16,185,129,0.5)"
            : state === "thinking" ? "rgba(168,85,247,0.5)"
            : state === "speaking" ? "rgba(6,182,212,0.6)"
            : "rgba(6,182,212,0.3)"
          })`,
        }}
      />
      <div className="relative z-10 mt-6 text-center">
        <div className="font-mono font-bold text-white text-lg tracking-widest mb-2"
          style={{ textShadow: "0 0 20px rgba(6,182,212,0.6)" }}>
          DRAKE
        </div>
        <div className="font-mono text-sm text-cyan-300/90 tracking-wide">
          {statusText || stateLabels[state]}
        </div>
      </div>
      <div className="absolute bottom-8 font-mono text-xs text-white/20 tracking-wider">
        TAP ANYWHERE TO DISMISS
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── Main Drake Component ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const GREETING_TEXT = `Hello! I'm **DRAKE** — Dhruva's AI assistant. 🚀\n\nI know everything about Dhruva: his skills, projects, research, achievements, and more.\n\nWhat would you like to know?`;

export function Drake() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "drake",
      text: GREETING_TEXT,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [newMsgId, setNewMsgId] = useState<number | null>(null);
  const [pulse, setPulse] = useState(false);
  const [unread, setUnread] = useState(0);
  const hasGreeted = useRef(false);

  // Voice state machine: passive → active → processing → passive
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicePhase, setVoicePhase] = useState<"passive" | "active" | "processing">("passive");
  const [speechOutput, setSpeechOutput] = useState(true);
  const [listeningStatus, setListeningStatus] = useState("");
  const [showOrb, setShowOrb] = useState(false);
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [orbStatusText, setOrbStatusText] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgIdCounter = useRef(1);
  const recognitionRef = useRef<any>(null);
  const voiceEnabledRef = useRef(voiceEnabled);
  voiceEnabledRef.current = voiceEnabled;
  const voicePhaseRef = useRef(voicePhase);
  voicePhaseRef.current = voicePhase;
  const speechOutputRef = useRef(speechOutput);
  speechOutputRef.current = speechOutput;
  const activeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, listeningStatus]);

  useEffect(() => {
    if (open) return;
    const t = setInterval(() => setPulse((p) => !p), 3000);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
      // Speak greeting only the first time the panel opens
      if (!hasGreeted.current) {
        hasGreeted.current = true;
        const greetingClean = `Hello! I'm DRAKE, Dhruva's AI assistant. I know everything about Dhruva: his skills, projects, research, achievements, and more. What would you like to know?`;
        speakVoice(greetingClean, speechOutputRef.current);
      }
    }
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

      if (speechOutputRef.current) {
        setOrbState("speaking");
        setOrbStatusText("");
      }
      speakVoice(reply, speechOutputRef.current);

      const speechDuration = Math.min(reply.length * 50, 12000) + 1500;
      setTimeout(() => {
        setVoicePhase("passive");
        setOrbState("idle");
        setTimeout(() => setShowOrb(false), 1200);
      }, speechDuration);
    }, delay);
  }, [thinking, open]);

  // ─── Web Speech API: Two-Phase Wake Word System ─────────────────────────────
  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      if (voicePhaseRef.current === "passive") {
        setListeningStatus("Say \"Hey Drake\" to activate…");
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setVoiceEnabled(false);
        setListeningStatus("Microphone access denied.");
      }
    };

    recognition.onend = () => {
      if (voiceEnabledRef.current && recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (_e) { /* */ }
      } else {
        setListeningStatus("");
      }
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.trim();
      if (transcript.length < 2) return;
      const lower = transcript.toLowerCase();

      // ── PASSIVE: only wake words ──
      if (voicePhaseRef.current === "passive") {
        const wakeWords = ["hey drake", "ok drake", "hello drake", "drake"];
        const hasWake = wakeWords.some((w) => lower.includes(w));
        if (!hasWake) return;

        let command = lower;
        for (const w of wakeWords) {
          if (command.includes(w)) {
            command = command.substring(command.indexOf(w) + w.length).trim();
            break;
          }
        }

        if (command.length > 3) {
          setVoicePhase("processing");
          setShowOrb(true);
          setOrbState("thinking");
          setOrbStatusText(`"${command}"`);
          setOpen(true);
          setUnread(0);
          send(command);
        } else {
          setVoicePhase("active");
          setShowOrb(true);
          setOrbState("listening");
          setOrbStatusText("");
          setListeningStatus("Drake activated — listening for command…");
          speakVoice("Yes?", speechOutputRef.current);

          if (activeTimeoutRef.current) clearTimeout(activeTimeoutRef.current);
          activeTimeoutRef.current = setTimeout(() => {
            if (voicePhaseRef.current === "active") {
              setVoicePhase("passive");
              setOrbState("idle");
              setTimeout(() => setShowOrb(false), 800);
              setListeningStatus("Say \"Hey Drake\" to activate…");
            }
          }, 8000);
        }
        return;
      }

      // ── ACTIVE: capture command ──
      if (voicePhaseRef.current === "active") {
        if (activeTimeoutRef.current) clearTimeout(activeTimeoutRef.current);

        let command = lower;
        const wakeWords = ["hey drake", "ok drake", "hello drake", "drake"];
        for (const w of wakeWords) {
          if (command.includes(w)) {
            command = command.substring(command.indexOf(w) + w.length).trim();
            break;
          }
        }
        if (command.length < 2) command = transcript;

        setVoicePhase("processing");
        setOrbState("thinking");
        setOrbStatusText(`"${command}"`);
        setOpen(true);
        setUnread(0);
        send(command);
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
      if (activeTimeoutRef.current) clearTimeout(activeTimeoutRef.current);
    };
  }, [send]);

  useEffect(() => {
    if (!recognitionRef.current) return;
    if (voiceEnabled) {
      const timer = setTimeout(() => {
        try { recognitionRef.current.start(); } catch (_e) { /* */ }
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      try { recognitionRef.current.abort(); } catch (_e) { /* */ }
      setListeningStatus("");
      setShowOrb(false);
    }
  }, [voiceEnabled]);

  const toggleVoice = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Voice AI is not supported in this browser (try Chrome, Edge, or Safari).");
      return;
    }
    setVoiceEnabled((prev) => !prev);
    if (voiceEnabled) { setShowOrb(false); setVoicePhase("passive"); }
  };

  const dismissOrb = () => {
    setShowOrb(false);
    setVoicePhase("passive");
    setOrbState("idle");
    if (activeTimeoutRef.current) clearTimeout(activeTimeoutRef.current);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  const reset = () => {
    setMessages([{ id: 0, role: "drake", text: `Hello again! I'm **DRAKE**. Ask me anything about Dhruva! 🚀`, timestamp: new Date() }]);
    setNewMsgId(0); setUnread(0); msgIdCounter.current = 1;
  };

  return (
    <>
      {showOrb && <DrakeOrb state={orbState} statusText={orbStatusText} onDismiss={dismissOrb} />}

      {/* ── Premium AI Button ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <button
          id="drake-toggle-btn"
          onClick={() => setOpen((o) => !o)}
          aria-label="Open DRAKE AI Assistant"
          className="relative group cursor-pointer select-none"
          style={{ outline: "none" }}
        >
          {/* Ambient glow ring */}
          {!open && (
            <span
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow: "0 0 0 0 rgba(6,182,212,0.5)",
                animation: pulse ? "drake-ring-pulse 2.4s ease-out infinite" : "none",
                borderRadius: "9999px",
              }}
            />
          )}

          {/* Button body */}
          <div
            className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300
              bg-gradient-to-br from-[#050f1e] via-[#0a0520] to-[#050f1e]
              ${
                open
                  ? "border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.35),inset_0_1px_0_rgba(6,182,212,0.2)]"
                  : "border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:border-cyan-400/60 hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]"
              }
              group-active:scale-95`}
            style={{ backdropFilter: "blur(16px)" }}
          >
            {/* Shimmer line */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

            {/* Orb icon */}
            <div
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600
                shadow-[0_0_18px_rgba(6,182,212,0.6)]
                ${!open && pulse ? "scale-105" : ""}`}
            >
              {open
                ? <X className="w-4 h-4 text-white" />
                : <Sparkles className="w-4 h-4 text-white" />}
            </div>

            {/* Labels */}
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white font-mono tracking-[0.2em] text-sm">DRAKE</span>
                <span className="text-[9px] font-mono text-cyan-400/70 border border-cyan-500/30 rounded px-1 py-0.5 leading-none">AI</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* Voice dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    voiceEnabled ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                  style={voiceEnabled ? { animation: "drake-mic-pulse 1.8s ease-in-out infinite" } : {}}
                />
                <span className="text-[10px] font-mono text-cyan-400/60 tracking-wide">
                  {open ? "tap to close" : voiceEnabled ? 'say "hey drake"' : "ask anything"}
                </span>
              </div>
            </div>

            {/* Unread badge */}
            {unread > 0 && !open && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.6)] border border-background">
                {unread}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* ── Chat Panel ── */}
      <div
        className={`fixed z-50 w-[380px] max-w-[calc(100vw-1.5rem)] rounded-3xl overflow-hidden
          transition-all duration-500 origin-bottom-right
          ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none"}`}
        style={{
          bottom: "6rem",
          right: "1.5rem",
          background: "linear-gradient(160deg, rgba(4,9,24,0.98) 0%, rgba(8,3,22,0.98) 100%)",
          border: "1px solid rgba(6,182,212,0.25)",
          boxShadow: "0 0 80px rgba(6,182,212,0.12), 0 0 160px rgba(168,85,247,0.07), inset 0 1px 0 rgba(6,182,212,0.12), inset 0 -1px 0 rgba(168,85,247,0.06)",
          maxHeight: "82vh",
        }}
      >
        {/* Header */}
        <div
          className="relative px-5 py-4"
          style={{
            background: "linear-gradient(90deg, rgba(6,182,212,0.06) 0%, rgba(168,85,247,0.06) 50%, rgba(6,182,212,0.04) 100%)",
            borderBottom: "1px solid rgba(6,182,212,0.15)",
          }}
        >
          {/* Top shimmer */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 flex items-center justify-center"
                style={{ boxShadow: "0 0 24px rgba(6,182,212,0.55)" }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2"
                style={{ borderColor: "#040918", boxShadow: "0 0 8px rgba(74,222,128,0.9)" }}
              />
            </div>

            {/* Name block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-mono tracking-[0.15em] text-sm">DRAKE</span>
                <span className="text-[9px] font-mono text-cyan-400/60 border border-cyan-500/25 rounded-md px-1.5 py-0.5 leading-none">SLM</span>
              </div>
              <div className="text-[11px] text-cyan-300/50 font-mono mt-0.5 truncate">Semantic AI · Voice-enabled</div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-0.5 ml-auto">
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-xl hover:bg-white/5 transition-all duration-200 ${
                  voiceEnabled ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
                }`}
                title={voiceEnabled ? "Disable voice" : "Enable voice"}
              >
                {voiceEnabled
                  ? <Mic className="w-3.5 h-3.5" style={{ filter: "drop-shadow(0 0 4px rgba(52,211,153,0.8))" }} />
                  : <MicOff className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setSpeechOutput((prev) => !prev)}
                className={`p-2 rounded-xl hover:bg-white/5 transition-all duration-200 ${
                  speechOutput ? "text-cyan-400" : "text-slate-500 hover:text-slate-400"
                }`}
                title={speechOutput ? "Mute" : "Unmute"}
              >
                {speechOutput ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={reset}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all duration-200"
                title="Reset chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Voice status strip */}
          {voiceEnabled && (
            <div
              className="mt-3 text-[11px] font-mono rounded-xl px-3 py-1.5 flex items-center gap-2 animate-fade-in-up"
              style={{
                background: voicePhase === "active" ? "rgba(251,191,36,0.06)" : voicePhase === "processing" ? "rgba(168,85,247,0.06)" : "rgba(16,185,129,0.06)",
                border: `1px solid ${ voicePhase === "active" ? "rgba(251,191,36,0.25)" : voicePhase === "processing" ? "rgba(168,85,247,0.25)" : "rgba(16,185,129,0.2)"}`,
                color: voicePhase === "active" ? "rgba(251,191,36,0.9)" : voicePhase === "processing" ? "rgba(196,148,255,0.9)" : "rgba(52,211,153,0.85)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{
                  background: voicePhase === "active" ? "#fbbf24" : voicePhase === "processing" ? "#a855f7" : "#10b981",
                  animation: "drake-mic-pulse 1.5s ease-in-out infinite",
                }}
              />
              <span className="truncate">
                {voicePhase === "active"
                  ? "Listening for your command…"
                  : voicePhase === "processing"
                  ? "Processing…"
                  : listeningStatus || 'Say "Hey Drake" to activate…'}
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div
          className="overflow-y-auto px-4 py-4 space-y-3"
          style={{ height: voiceEnabled ? "300px" : "336px", scrollbarWidth: "none" }}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isNew={msg.id === newMsgId} />
          ))}
          {thinking && (
            <div className="flex gap-2.5 items-end animate-fade-in-up">
              <div
                className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0"
                style={{ boxShadow: "0 0 14px rgba(6,182,212,0.5)" }}
              >
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <div
                className="rounded-2xl rounded-bl-sm"
                style={{
                  background: "rgba(6,182,212,0.04)",
                  border: "1px solid rgba(6,182,212,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-3">
            <div className="text-[10px] text-cyan-400/40 font-mono mb-2 tracking-widest uppercase">Quick Ask</div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] font-mono px-3 py-1.5 rounded-xl border cursor-pointer transition-all duration-200"
                  style={{
                    background: "rgba(6,182,212,0.04)",
                    borderColor: "rgba(6,182,212,0.2)",
                    color: "rgba(103,232,249,0.75)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(6,182,212,0.5)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(103,232,249,1)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(6,182,212,0.2)";
                    (e.currentTarget as HTMLButtonElement).style.color = "rgba(103,232,249,0.75)";
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(6,182,212,0.04)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div
          className="px-4 pb-4 pt-2"
          style={{ borderTop: "1px solid rgba(6,182,212,0.1)" }}
        >
          <div
            className="flex gap-2 items-center rounded-2xl px-4 py-2.5 transition-all duration-200"
            style={{
              background: "rgba(6,182,212,0.04)",
              border: "1px solid rgba(6,182,212,0.18)",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.45)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(6,182,212,0.1)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.18)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything about Dhruva…"
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none font-mono min-w-0"
              maxLength={300}
              disabled={thinking}
              id="drake-input"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || thinking}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #7c3aed)",
                boxShadow: input.trim() ? "0 0 16px rgba(6,182,212,0.45)" : "none",
              }}
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="text-[9px] text-center text-slate-700 mt-2 font-mono tracking-widest">
            DRAKE · SEMANTIC AI · VOICE-ENABLED
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        @keyframes orb-fadein {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes orb-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes drake-ring-pulse {
          0% { box-shadow: 0 0 0 0 rgba(6,182,212,0.55); }
          70% { box-shadow: 0 0 0 14px rgba(6,182,212,0); }
          100% { box-shadow: 0 0 0 0 rgba(6,182,212,0); }
        }
        @keyframes drake-mic-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        div[style*="scrollbar-width: none"]::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
