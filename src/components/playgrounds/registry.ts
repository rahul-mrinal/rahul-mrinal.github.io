import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const registry: Record<string, LazyExoticComponent<ComponentType>> = {
  "bm25-tf-saturation": lazy(
    () => import("./search-engineering/Bm25TfSaturation")
  ),
  "bm25-calculator": lazy(
    () => import("./search-engineering/Bm25Calculator")
  ),
  "brute-force-search": lazy(
    () => import("./search-engineering/BruteForceSearch")
  ),
  "cosine-similarity": lazy(
    () => import("./search-engineering/CosineSimilarity")
  ),
  "hybrid-search-demo": lazy(
    () => import("./search-engineering/HybridSearchDemo")
  ),
  "precision-recall-slider": lazy(
    () => import("./search-engineering/PrecisionRecallSlider")
  ),
  "ndcg-calculator": lazy(
    () => import("./search-engineering/NdcgCalculator")
  ),
  "tfidf-vs-bm25-compare": lazy(
    () => import("./search-engineering/TfIdfVsBm25Compare")
  ),
  "inverted-index-builder": lazy(
    () => import("./search-engineering/InvertedIndexBuilder")
  ),
  "chunk-size-tradeoff": lazy(
    () => import("./search-engineering/ChunkSizeTradeoff")
  ),
  "query-preprocessor": lazy(
    () => import("./search-engineering/QueryPreprocessor")
  ),
  "edit-distance-calculator": lazy(
    () => import("./search-engineering/EditDistanceCalculator")
  ),
  "score-normalizer": lazy(
    () => import("./search-engineering/ScoreNormalizer")
  ),
  "field-boost-playground": lazy(
    () => import("./search-engineering/FieldBoostPlayground")
  ),
  "signal-mixer": lazy(
    () => import("./search-engineering/SignalMixer")
  ),
  "capacity-estimator": lazy(
    () => import("./search-engineering/CapacityEstimator")
  ),
  "shard-calculator": lazy(
    () => import("./search-engineering/ShardCalculator")
  ),
  "batch-vs-realtime": lazy(
    () => import("./search-engineering/BatchVsRealtimeToggle")
  ),
  "chunking-playground": lazy(
    () => import("./search-engineering/ChunkingPlayground")
  ),
  "rag-pipeline-flow": lazy(
    () => import("./search-engineering/RagPipelineFlow")
  ),
  "autocomplete-trie": lazy(
    () => import("./search-engineering/AutocompleteTrie")
  ),
  "mmr-diversity": lazy(
    () => import("./search-engineering/MmrDiversity")
  ),
  "click-debiaser": lazy(
    () => import("./search-engineering/ClickDebiaser")
  ),

  // ─── Agentic AI: Multi-Agent Foundations ───────────────────────────
  "single-vs-multi-agent": lazy(
    () => import("./agentic-ai/SingleVsMultiAgent")
  ),
  "mas-property-toggle": lazy(
    () => import("./agentic-ai/MasPropertyToggle")
  ),
  "agent-vs-tool-quiz": lazy(
    () => import("./agentic-ai/AgentVsToolQuiz")
  ),
  "context-window-sim": lazy(
    () => import("./agentic-ai/ContextWindowSim")
  ),
  "parallel-execution-gantt": lazy(
    () => import("./agentic-ai/ParallelExecutionGantt")
  ),
  "classification-axis": lazy(
    () => import("./agentic-ai/ClassificationAxis")
  ),
  "topology-visualizer": lazy(
    () => import("./agentic-ai/TopologyVisualizer")
  ),

  // ─── Agentic AI: Architecture Patterns ────────────────────────────
  "pipeline-animator": lazy(
    () => import("./agentic-ai/PipelineAnimator")
  ),
  "selector-simulator": lazy(
    () => import("./agentic-ai/SelectorSimulator")
  ),
  "handoff-flow": lazy(
    () => import("./agentic-ai/HandoffFlow")
  ),
  "manager-worker-demo": lazy(
    () => import("./agentic-ai/ManagerWorkerDemo")
  ),
  "debate-simulator": lazy(
    () => import("./agentic-ai/DebateSimulator")
  ),
  "ensemble-voting": lazy(
    () => import("./agentic-ai/EnsembleVoting")
  ),
  "cost-calculator": lazy(
    () => import("./agentic-ai/CostCalculator")
  ),
  "state-machine-viz": lazy(
    () => import("./agentic-ai/StateMachineViz")
  ),
  "blackboard-demo": lazy(
    () => import("./agentic-ai/BlackboardDemo")
  ),
  "auction-sim": lazy(
    () => import("./agentic-ai/AuctionSim")
  ),
  "decentralization-spectrum": lazy(
    () => import("./agentic-ai/DecentralizationSpectrum")
  ),

  // ─── Agentic AI: Communication & Memory ───────────────────────────
  "comm-pattern-switcher": lazy(
    () => import("./agentic-ai/CommPatternSwitcher")
  ),
  "memory-type-explorer": lazy(
    () => import("./agentic-ai/MemoryTypeExplorer")
  ),
  "context-strategy": lazy(
    () => import("./agentic-ai/ContextStrategy")
  ),
  "pattern-matrix": lazy(
    () => import("./agentic-ai/PatternMatrix")
  ),
  "pattern-radar": lazy(
    () => import("./agentic-ai/PatternRadar")
  ),
  "pattern-wizard": lazy(
    () => import("./agentic-ai/PatternWizard")
  ),
  "use-case-matcher": lazy(
    () => import("./agentic-ai/UseCaseMatcher")
  ),

  // ─── Agentic AI: Building Multi-Agent Systems ─────────────────────
  "framework-tabs": lazy(
    () => import("./agentic-ai/FrameworkTabs")
  ),
  "framework-picker": lazy(
    () => import("./agentic-ai/FrameworkPicker")
  ),
  "use-case-carousel": lazy(
    () => import("./agentic-ai/UseCaseCarousel")
  ),
  "principle-cards": lazy(
    () => import("./agentic-ai/PrincipleCards")
  ),
  "anti-pattern-quiz": lazy(
    () => import("./agentic-ai/AntiPatternQuiz")
  ),
  "system-health-checker": lazy(
    () => import("./agentic-ai/SystemHealthChecker")
  ),
  "system-design-wizard": lazy(
    () => import("./agentic-ai/SystemDesignWizard")
  ),
  "query-simulator": lazy(
    () => import("./agentic-ai/QuerySimulator")
  ),
};

export default registry;
