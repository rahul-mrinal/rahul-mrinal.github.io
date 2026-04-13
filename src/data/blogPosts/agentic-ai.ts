import type { BlogPostMeta } from "./types";

export const agenticAiPosts: BlogPostMeta[] = [
  // ─── Series 9: Multi-Agent Foundations ─────────────────────────────
  {
    slug: "what-is-multi-agent-system",
    title: "What Is a Multi-Agent System?",
    series: "multi-agent-foundations",
    seriesOrder: 1,
    description:
      "Two or more autonomous agents, each with its own prompt, tools, and scope - why specialization beats generalization once complexity crosses a threshold.",
    tags: ["multi-agent", "MAS", "agents", "specialization"],
    readTime: "8 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "why-multi-agent",
    title: "Why Multi-Agent Over Single-Agent?",
    series: "multi-agent-foundations",
    seriesOrder: 2,
    description:
      "Context window management, role clarity, parallel execution, adversarial quality, and tool isolation - the five reasons to go multi-agent.",
    tags: ["multi-agent", "context-window", "parallelism", "tool-isolation"],
    readTime: "10 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "classification-framework",
    title: "Classification Framework",
    series: "multi-agent-foundations",
    seriesOrder: 3,
    description:
      "Classify any multi-agent system along three independent axes: control structure, communication topology, and agent relationships.",
    tags: ["classification", "topology", "centralized", "decentralized"],
    readTime: "10 min",
    publishDate: "2026-04-13",
  },

  // ─── Series 10: Architecture Patterns ──────────────────────────────
  {
    slug: "sequential-and-selector",
    title: "Sequential & Selector Patterns",
    series: "architecture-patterns",
    seriesOrder: 1,
    description:
      "The pipeline - fixed order, zero routing cost, cumulative latency. The selector - an LLM picks the next speaker, dynamic but one extra call per turn.",
    tags: ["sequential", "pipeline", "selector", "router", "autogen"],
    readTime: "14 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "handoff-and-hierarchical",
    title: "Handoff & Hierarchical Patterns",
    series: "architecture-patterns",
    seriesOrder: 2,
    description:
      "Handoff/Swarm - agents self-route via transfer functions. Manager-Worker - a manager decomposes, delegates, and reviews.",
    tags: ["handoff", "swarm", "hierarchical", "manager-worker", "delegation"],
    readTime: "14 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "debate-and-ensemble",
    title: "Debate & Ensemble Patterns",
    series: "architecture-patterns",
    seriesOrder: 3,
    description:
      "Debate/Critic - adversarial pressure catches errors. Broadcast/Ensemble - run N agents in parallel and aggregate the best output.",
    tags: ["debate", "critic", "ensemble", "voting", "best-of-n"],
    readTime: "14 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "graph-and-blackboard",
    title: "Graph & Blackboard Patterns",
    series: "architecture-patterns",
    seriesOrder: 4,
    description:
      "Graph/State Machine - deterministic edges, typed state, LangGraph-style. Blackboard - decoupled agents writing to a shared workspace.",
    tags: ["graph", "state-machine", "langgraph", "blackboard", "shared-memory"],
    readTime: "15 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "market-and-federated",
    title: "Market & Federated Patterns",
    series: "architecture-patterns",
    seriesOrder: 5,
    description:
      "Market/Auction - agents bid for tasks, self-organizing load balance. Federated - peer-to-peer, no single point of failure, consensus-based.",
    tags: ["market", "auction", "federated", "decentralized", "consensus"],
    readTime: "12 min",
    publishDate: "2026-04-13",
  },

  // ─── Series 11: Agent Communication & Memory ──────────────────────
  {
    slug: "communication-patterns",
    title: "Communication Patterns",
    series: "agent-communication-memory",
    seriesOrder: 1,
    description:
      "Five ways agents talk: direct messaging, broadcast, shared state, publish/subscribe, and streaming token-level communication.",
    tags: ["communication", "messaging", "pub-sub", "streaming", "broadcast"],
    readTime: "10 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "memory-systems",
    title: "Memory in Multi-Agent Systems",
    series: "agent-communication-memory",
    seriesOrder: 2,
    description:
      "Working memory, long-term episodic, semantic knowledge, procedural how-to, and inter-agent shared memory - the five memory types that separate demos from production.",
    tags: ["memory", "working-memory", "episodic", "semantic", "procedural"],
    readTime: "12 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "comparison-matrix",
    title: "Pattern Comparison Matrix",
    series: "agent-communication-memory",
    seriesOrder: 3,
    description:
      "All ten architecture patterns compared side-by-side across control, determinism, routing cost, parallelism, quality mechanism, and complexity.",
    tags: ["comparison", "matrix", "trade-offs", "patterns"],
    readTime: "8 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "decision-framework",
    title: "Decision Framework: When to Use What",
    series: "agent-communication-memory",
    seriesOrder: 4,
    description:
      "Three questions to pick the right pattern, a use-case selection table, and the maturity progression most teams follow.",
    tags: ["decision-framework", "use-cases", "maturity", "selection"],
    readTime: "10 min",
    publishDate: "2026-04-13",
  },

  // ─── Series 12: Building Multi-Agent Systems ──────────────────────
  {
    slug: "implementation-frameworks",
    title: "Implementation Frameworks",
    series: "building-multi-agent-systems",
    seriesOrder: 1,
    description:
      "AutoGen, LangGraph, CrewAI, and OpenAI Swarm compared - APIs, pattern support, production readiness, and code examples for each.",
    tags: ["autogen", "langgraph", "crewai", "swarm", "frameworks"],
    readTime: "14 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "real-world-applications",
    title: "Real-World Applications",
    series: "building-multi-agent-systems",
    seriesOrder: 2,
    description:
      "Multi-agent systems in practice: software development, customer support, research, financial analysis, content creation, and DevOps incident response.",
    tags: ["applications", "software-dev", "support", "finance", "devops"],
    readTime: "12 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "design-principles",
    title: "Design Principles & Anti-Patterns",
    series: "building-multi-agent-systems",
    seriesOrder: 3,
    description:
      "Six principles (single responsibility, fail gracefully, observability) and six anti-patterns (god agent, echo chamber, infinite loop) for multi-agent design.",
    tags: ["design-principles", "anti-patterns", "best-practices", "observability"],
    readTime: "10 min",
    publishDate: "2026-04-13",
  },
  {
    slug: "putting-it-all-together",
    title: "Putting It All Together",
    series: "building-multi-agent-systems",
    seriesOrder: 4,
    description:
      "End-to-end design of a multi-agent customer support system - choosing patterns, defining agents, wiring communication, and adding guardrails.",
    tags: ["end-to-end", "system-design", "customer-support", "capstone"],
    readTime: "15 min",
    publishDate: "2026-04-13",
  },
];
