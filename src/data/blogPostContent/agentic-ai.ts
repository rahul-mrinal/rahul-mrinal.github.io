import type { BlogSection } from "../blogPosts/types";

export const agenticAiContent: Record<string, BlogSection[]> = {
  // ─── Series 9: Multi-Agent Foundations ─────────────────────────────

  "multi-agent-foundations/what-is-multi-agent-system": [
    {
      heading: "Definition",
      content:
        'A multi-agent system (MAS) is a system composed of two or more autonomous agents that interact with each other and their environment to accomplish tasks that are difficult or impossible for a single agent to perform effectively.\n\nIn the context of LLM-powered applications, each "agent" is typically:\n\n- An LLM instance with a specific **system prompt** defining its role\n- A set of **tools** it can call (APIs, databases, code execution)\n- A defined **scope of responsibility** (what it handles, what it doesn\'t)\n- A **communication channel** for interacting with other agents\n\nThe fundamental insight is that **specialization beats generalization** once task complexity crosses a threshold. A single LLM trying to be an expert coder, thorough reviewer, careful planner, and security auditor simultaneously will underperform four focused agents with clear roles.',
      playground: "single-vs-multi-agent",
    },
    {
      heading: "Key Properties of Multi-Agent Systems",
      content:
        "Every multi-agent system exhibits five core properties:\n\n- **Autonomy** - Each agent operates independently with its own reasoning\n- **Specialization** - Agents have distinct roles, tools, and domain knowledge\n- **Interaction** - Agents communicate through defined protocols\n- **Emergence** - System-level behavior arises from individual agent interactions\n- **Scalability** - New agents can be added without redesigning the whole system\n\nThese properties are what separate a multi-agent system from a single agent calling multiple tools. The agents don't just execute - they reason, decide, and coordinate.",
      playground: "mas-property-toggle",
    },
    {
      heading: "Agents vs Tools",
      content:
        "A common misconception is that wrapping each tool call in its own agent makes a system \"multi-agent.\" It doesn't. An agent is justified when the task requires **reasoning**, **judgment**, or **multi-step decision-making** - not when a single function call would suffice.\n\nAsk yourself: does this component need to think, or does it just need to execute? If it just executes, it's a tool. If it reasons about *what* to execute and *when*, it's an agent.",
      playground: "agent-vs-tool-quiz",
    },
    {
      heading: "Key Takeaway",
      content:
        "Multi-agent systems trade coordination overhead for specialization and parallelism. They're not always the right choice - but once your task involves multiple distinct reasoning domains, context that overflows a single window, or quality requirements that benefit from adversarial checking, a multi-agent architecture will outperform a monolithic agent.",
    },
  ],

  "multi-agent-foundations/why-multi-agent": [
    {
      heading: "Context Window Management",
      content:
        "A single agent doing research, planning, coding, and review accumulates enormous context. By step 15, the early research is either truncated or crowding out the current task. Separate agents keep their context focused and relevant.\n\nThis isn't just a theoretical concern. In practice, long-context degradation means the model pays less attention to information in the middle of the window. By giving each agent a focused context, you avoid this \"lost in the middle\" problem entirely.",
      playground: "context-window-sim",
    },
    {
      heading: "Role Clarity",
      content:
        'When an LLM has one clear role - "you are a security auditor" - it performs that role significantly better than when asked to wear multiple hats simultaneously. The system prompt stays focused, and the model doesn\'t need to context-switch between reviewer and implementer mindsets.\n\nThis is analogous to how human teams work. A developer writing code and simultaneously reviewing their own code will miss bugs that a dedicated reviewer would catch.',
    },
    {
      heading: "Parallel Execution",
      content:
        "Independent subtasks can run simultaneously. While one agent researches the codebase, another can analyze requirements, and a third can review related PRs. This is impossible with a serial single-agent loop.\n\nThe wall-clock time for a parallel multi-agent system is determined by the slowest agent, not the sum of all agents. For a three-agent parallel step where each takes 5 seconds, total time is 5 seconds - not 15.",
      playground: "parallel-execution-gantt",
    },
    {
      heading: "Quality Through Adversarial Pressure",
      content:
        "When one agent generates and another critiques, the output quality improves. A single agent reviewing its own work tends to confirm its own biases.\n\nThis is the foundation of the Debate pattern (covered later in this series). Research consistently shows that multi-agent debate reduces hallucination and improves factual accuracy compared to single-agent generation.",
    },
    {
      heading: "Tool Isolation",
      content:
        "Different agents can have different tool access. A read-only research agent can't accidentally modify files. A code-writing agent doesn't have access to deployment tools. This provides natural guardrails.\n\nIn a single-agent system, every tool is one bad reasoning step away from being misused. Multi-agent architectures let you apply the principle of least privilege at the agent level.",
    },
    {
      heading: "When a Single Agent Is Enough",
      content:
        "Not every task needs multiple agents. A single agent is sufficient when:\n\n- The task is linear and well-defined\n- The context fits comfortably in one window\n- There's no meaningful specialization to exploit\n- Latency is more important than quality\n- The tool set is small and coherent\n\nThe overhead of multi-agent coordination (extra LLM calls for routing, message passing, context assembly) only pays off when the task complexity justifies it.",
    },
  ],

  "multi-agent-foundations/classification-framework": [
    {
      heading: "Three Independent Axes",
      content:
        "Multi-agent systems can be classified along three independent axes. Any real system is a combination of one choice from each axis - understanding this framework lets you reason about any MAS you encounter, even novel ones.",
      playground: "classification-axis",
    },
    {
      heading: "Axis 1: Control Structure",
      content:
        "How decisions about \"what happens next\" are made.\n\n- **Centralized** - A single coordinator/manager agent decides. Examples: Hierarchical, Selector.\n- **Decentralized** - Each agent decides independently. Examples: Handoff/Swarm, Market.\n- **Hybrid** - Central planning with autonomous execution. Examples: Graph with agent nodes.\n\nCentralized systems are easier to debug but have a single point of failure. Decentralized systems are more resilient but harder to reason about.",
    },
    {
      heading: "Axis 2: Communication Topology",
      content:
        "How information flows between agents.\n\n- **Star** - All agents communicate through a central hub. Example: Manager-Worker.\n- **Mesh** - Any agent can communicate with any other. Example: Debate, Swarm.\n- **Pipeline** - Information flows linearly A → B → C. Example: Sequential.\n- **Broadcast** - One-to-many communication. Example: Ensemble, Voting.\n- **Blackboard** - Agents read/write to a shared workspace. Example: Blackboard.\n\nThe topology determines latency characteristics. Star and pipeline add sequential hops; broadcast and mesh enable parallelism.",
      playground: "topology-visualizer",
    },
    {
      heading: "Axis 3: Agent Relationships",
      content:
        "How agents relate to each other in terms of authority.\n\n- **Peer** - Equal status, collaborative. Example: Debate, Ensemble.\n- **Hierarchical** - Manager → Worker authority. Example: Hierarchical.\n- **Competitive** - Agents compete for selection. Example: Market/Auction.\n- **Mixed** - Different relationships for different interactions. Example: Real-world systems.\n\nMost production systems use mixed relationships - a manager delegates to peer workers who may compete for subtask assignment.",
    },
    {
      heading: "Using the Framework",
      content:
        "When you see a new multi-agent system, classify it: What's the control structure? What's the communication topology? What are the agent relationships?\n\nFor example, AutoGen's `SelectorGroupChat` is centralized (selector LLM decides) + star (all agents talk through the selector) + peer (agents have equal authority). LangGraph is hybrid (graph structure is predetermined, but nodes can be autonomous) + varies by graph design + varies.\n\nThis framework will help you compare the architecture patterns covered in the next series.",
    },
  ],

  // ─── Series 10: Architecture Patterns ──────────────────────────────

  "architecture-patterns/sequential-and-selector": [
    {
      heading: "Sequential / Pipeline",
      content:
        "Agents execute in a fixed, predetermined order. Each agent's complete output becomes the next agent's input. There is no branching, no skipping, and no decision-making about who goes next.\n\n1. The user's request enters Agent A\n2. Agent A completes its work and passes its full output to Agent B\n3. Agent B processes and passes to Agent C\n4. Agent C produces the final output\n\nEach agent sees only its predecessor's output plus the original request - not the outputs of all prior agents (though this varies by implementation).",
      code: `# Sequential: User → Agent A → Agent B → Agent C → Response
#                  Research    Draft      Review`,
      language: "text",
      playground: "pipeline-animator",
    },
    {
      heading: "Sequential - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Predictable and debuggable.** You always know exactly what ran and in what order.\n- **No routing overhead.** No extra LLM calls to decide who goes next.\n- **Easy to build.** The simplest multi-agent pattern to implement.\n- **Clear responsibility.** Each stage has one job.\n\n**Weaknesses:**\n- **Inflexible.** Every query goes through every agent, even if some stages are irrelevant.\n- **No feedback loops.** If Agent C finds a problem, it can't send work back to Agent A without explicit retry logic.\n- **Cumulative latency.** Total time = sum of all agent times. No parallelism.\n- **Error propagation.** A bad output from Agent A corrupts everything downstream.\n\n**When to use:** Content pipelines (research → draft → edit → format), ETL workflows, code generation (spec → code → test → review). Any workflow where the stages are always needed and always in order.",
    },
    {
      heading: "Sequential - Implementation",
      content:
        "In AutoGen, a `RoundRobinGroupChat` runs agents in a fixed order. Each agent takes one turn, then the next agent goes. The cycle continues until a termination condition is met.",
      code: `from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import MaxMessageTermination

team = RoundRobinGroupChat(
    participants=[researcher, writer, editor],
    termination_condition=MaxMessageTermination(max_messages=6),
)

# Real-world analogy: An assembly line. Each station does its
# specific job on every unit, in order, regardless of what
# the unit needs.`,
      language: "python",
    },
    {
      heading: "Selector / Router",
      content:
        "A dedicated LLM - the \"selector\" - examines the conversation state after every agent turn and picks which agent should speak next. The selector is separate from all participating agents. It reads each agent's description (role, capabilities) along with the conversation history and makes a routing decision.\n\n1. User sends a message\n2. The selector LLM reads the message plus all agent descriptions\n3. It picks the most appropriate agent (e.g., \"FAQAgent\")\n4. That agent takes a turn (possibly calling tools)\n5. The selector reads the updated conversation and picks the next speaker\n6. This continues until a termination condition is met",
      playground: "selector-simulator",
    },
    {
      heading: "Selector - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Dynamic routing.** The system adapts to the query - a billing question goes to the billing agent, a technical question to the technical agent.\n- **Self-correcting.** If one agent's response is insufficient, the selector can route to a different agent or back to a coordinator.\n- **Flexible membership.** Adding a new specialist only requires adding it to the participant list with a good description.\n\n**Weaknesses:**\n- **Extra LLM call per turn.** Every routing decision costs latency and tokens.\n- **Routing errors.** The selector can pick the wrong agent, wasting a full agent turn.\n- **Non-deterministic.** The same query might get routed differently on different runs.\n- **Description sensitivity.** Agent descriptions must be well-written for good routing. Vague descriptions lead to poor decisions.\n\n**When to use:** Customer support systems where query types vary widely, general-purpose assistants with multiple specialist capabilities, scenarios where the right agent depends on context, not just keywords.",
    },
    {
      heading: "Selector - Implementation",
      content:
        "In AutoGen, a `SelectorGroupChat` uses a model client to pick the next speaker. The `selector_prompt` template receives `{roles}`, `{history}`, and `{participants}`.",
      code: `from autogen_agentchat.teams import SelectorGroupChat

team = SelectorGroupChat(
    participants=[orchestrator, faq, knowledge, technical, escalation],
    model_client=model_client,
    selector_prompt=SELECTOR_PROMPT,
    termination_condition=termination,
    allow_repeated_speaker=True,
)

# Real-world analogy: A hospital triage nurse who assesses
# each patient's symptoms and routes them to the appropriate
# specialist - cardiology, orthopedics, neurology.`,
      language: "python",
    },
  ],

  "architecture-patterns/handoff-and-hierarchical": [
    {
      heading: "Handoff / Swarm",
      content:
        "There is no central router. Each agent decides on its own when to transfer control to another agent, and to which one. The transfer is explicit - the agent calls a handoff function/tool that switches the active agent.\n\nEvery agent has access to `transfer_to_X()` functions for the agents it's allowed to hand off to. The agent itself decides whether to handle the request, respond directly, or transfer.\n\n1. User message reaches the currently active agent (initially Agent A)\n2. Agent A processes the message. If it can answer, it does\n3. If Agent A determines another agent is better suited, it calls `transfer_to_agent_b()`\n4. Agent B becomes the active agent and receives the conversation context\n5. Agent B can respond, use tools, or transfer to yet another agent\n\nThe key difference from the selector pattern: **the agents themselves make routing decisions**, not a separate selector LLM.",
      playground: "handoff-flow",
    },
    {
      heading: "Handoff - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **No selector overhead.** No extra LLM call for routing - the agent's own reasoning handles it.\n- **Agent autonomy.** Agents are self-aware about their limitations.\n- **Natural conversational flow.** \"Let me transfer you to our billing department\" feels natural.\n- **Contextual handoffs.** The transferring agent can include context about why it's transferring.\n\n**Weaknesses:**\n- **Potential loops.** Agent A transfers to B, B transfers back to A. Needs loop detection.\n- **Inconsistent handoff quality.** Some agents might be too eager or too reluctant to transfer.\n- **Harder to enforce global routing policy.** Each agent has its own transfer logic.\n- **Transfer graph complexity.** With N agents, you need to carefully design which agents can transfer to which others.\n\n**When to use:** Conversational AI where transfers feel natural (support, sales, helpdesk), agents with clear non-overlapping domains, when the handoff decision is tied to the agent's own analysis.",
    },
    {
      heading: "Handoff - Implementation",
      content:
        "OpenAI's Swarm framework demonstrates the handoff pattern. Each agent has functions that return other agents to transfer control.",
      code: `def transfer_to_billing():
    """Transfer to the billing agent for payment and invoice questions."""
    return billing_agent

def transfer_to_technical():
    """Transfer to technical support for troubleshooting."""
    return technical_agent

triage_agent = Agent(
    name="Triage",
    instructions="Route customers to the right department.",
    functions=[transfer_to_billing, transfer_to_technical, transfer_to_sales],
)

# Real-world analogy: A phone support system where each
# department can transfer you to another. The person you're
# speaking with decides when they can't help and who can.`,
      language: "python",
    },
    {
      heading: "Hierarchical / Manager-Worker",
      content:
        "A manager agent breaks down the task into subtasks, assigns each subtask to a specialist worker agent, collects their results, and synthesizes a final output. The manager is both the orchestrator and a quality reviewer.\n\nUnlike the selector pattern, the manager agent itself decides what to delegate and to whom - it's not a separate routing LLM. The manager is also an active participant who adds its own reasoning.\n\n1. User sends a complex request to the manager\n2. The manager analyzes the request and breaks it into subtasks\n3. The manager delegates each subtask to the appropriate worker\n4. Workers execute their subtasks and report back\n5. The manager reviews all worker outputs\n6. If any output is insufficient, the manager re-delegates or asks for revision\n7. The manager synthesizes the final answer",
      playground: "manager-worker-demo",
    },
    {
      heading: "Hierarchical - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Quality control.** The manager reviews every worker output before it reaches the user.\n- **Task decomposition.** Complex problems are broken into manageable pieces.\n- **Clear accountability.** The manager is responsible for the final output.\n- **Revision loops.** The manager can reject and re-request work.\n\n**Weaknesses:**\n- **Manager bottleneck.** Everything flows through one agent, which can become a token/latency bottleneck.\n- **Manager quality ceiling.** The system can't produce better output than the manager can evaluate.\n- **Single point of failure.** If the manager reasons poorly, the entire system fails.\n- **High token cost.** The manager sees all worker outputs, which can be very large.\n\n**When to use:** Complex research tasks requiring multiple information sources, document generation with multiple sections from different experts, project planning with architectural review - any task where a human manager would naturally delegate and review.",
    },
    {
      heading: "Hierarchical - Implementation",
      content:
        "The manager typically uses a strong model for reasoning, while workers can use faster/cheaper models for execution.",
      code: `manager = AssistantAgent(
    name="ProjectManager",
    system_message="Break tasks into subtasks. Delegate to specialists. "
                   "Review their work. Synthesize the final deliverable.",
    model_client=strong_model,
)

researcher = AssistantAgent(name="Researcher", tools=[search_web, search_docs])
coder = AssistantAgent(name="Coder", tools=[write_code, run_tests])
reviewer = AssistantAgent(name="Reviewer", tools=[analyze_code, check_security])

# Real-world analogy: A project manager who receives a client
# brief, assigns research to one team member, design to another,
# and implementation to a third, then reviews everything before
# presenting to the client.`,
      language: "python",
    },
  ],

  "architecture-patterns/debate-and-ensemble": [
    {
      heading: "Debate / Critic",
      content:
        "Two or more agents engage in structured argumentation about the same problem. One agent proposes a solution, another challenges it, and they iterate until convergence. Optionally, a judge agent arbitrates disagreements or decides when the debate is over.\n\n**Two-Agent Debate:**\n1. Agent A (Proposer) generates an initial solution\n2. Agent B (Critic) evaluates and identifies weaknesses\n3. Agent A revises its solution based on the critique\n4. Agent B re-evaluates\n5. This continues until Agent B approves or a max-round limit is hit\n\n**Multi-Agent Debate:**\n1. Multiple agents independently propose solutions\n2. Each agent reads all other proposals and critiques them\n3. Agents revise based on critiques\n4. A judge agent selects the best solution or synthesizes from all",
      playground: "debate-simulator",
    },
    {
      heading: "Debate - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Higher quality output.** Adversarial pressure catches errors, gaps, and weak reasoning.\n- **Diverse perspectives.** Different agents with different system prompts bring different viewpoints.\n- **Self-correction.** Errors are caught before they reach the user.\n- **Reduced hallucination.** Claims are challenged, forcing agents to ground their reasoning.\n\n**Weaknesses:**\n- **Expensive.** Multiple rounds of back-and-forth, each an LLM call.\n- **Slow.** Latency compounds with each debate round.\n- **Possible deadlock.** Agents may never agree, requiring a hard cutoff.\n- **Sycophancy risk.** The critic may too easily agree after revision rather than finding remaining issues.\n\n**When to use:** Code review, decision analysis, fact-checking, creative work evaluation, high-stakes outputs where correctness is critical.",
    },
    {
      heading: "Debate - Implementation",
      content:
        "A debate can be implemented as a `RoundRobinGroupChat` with a text-based termination condition. The critic says \"APPROVE\" when satisfied.",
      code: `from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination

proposer = AssistantAgent(
    name="Proposer",
    system_message="Generate the best solution. Revise based on feedback.",
)
critic = AssistantAgent(
    name="Critic",
    system_message="Find flaws, edge cases, and risks. Be rigorous. "
                   "Say APPROVE only when there are no remaining issues.",
)

debate = RoundRobinGroupChat(
    participants=[proposer, critic],
    termination_condition=TextMentionTermination("APPROVE"),
)

# Real-world analogy: Peer review in academic publishing.
# A researcher submits, reviewers find issues, the researcher
# revises, reviewers re-evaluate.`,
      language: "python",
    },
    {
      heading: "Broadcast / Ensemble",
      content:
        "The same task is broadcast to multiple agents simultaneously. Each agent works independently on the full problem using its own approach, expertise, or model. An aggregation step then combines or selects from their outputs.\n\n1. The user's request is sent to all agents in parallel\n2. Each agent produces its own independent response\n3. An aggregator receives all responses and applies a strategy:\n   - **Voting/Majority:** Select the answer most agents agree on\n   - **Best-of-N:** Rate each response and pick the best one\n   - **Merge:** Combine the best parts of each response\n   - **Weighted:** Weight responses by agent confidence or historical accuracy",
      playground: "ensemble-voting",
    },
    {
      heading: "Ensemble - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Robustness.** Any single agent failure is mitigated by the others.\n- **Diverse solutions.** Different approaches surface different insights.\n- **Naturally parallel.** All agents run simultaneously - wall-clock time equals one agent's time.\n- **Reduced variance.** Aggregation smooths out individual LLM inconsistencies.\n\n**Weaknesses:**\n- **Very expensive.** N parallel LLM calls for every query.\n- **Aggregation complexity.** The aggregator needs to understand and compare different response formats.\n- **Diminishing returns.** Going from 1 to 3 agents helps a lot; going from 5 to 7 helps very little.\n- **Wasted work.** Most agent outputs are partially or fully discarded.\n\n**When to use:** Code generation where correctness is critical (generate 3 solutions, run tests, pick the one that passes), creative brainstorming, classification where consensus improves accuracy, any task where the cost of failure exceeds the cost of redundancy.",
    },
    {
      heading: "Ensemble - Variants",
      content:
        "**Mixture of Agents (MoA):** A layered approach where Layer 1 agents each generate a response, and Layer 2 agents each receive all Layer 1 outputs and produce refined versions. This creates progressive improvement through rounds.\n\n**Best-of-N with Verifier:** N agents generate solutions, a separate verifier agent scores each one, and the highest-scoring solution is selected. Common in math and coding tasks.\n\nThe key design decision is the aggregation strategy. Voting works for classification-style problems. Best-of-N works when you have a reliable verifier. Merging works for creative tasks where different agents contribute different strengths.",
    },
    {
      heading: "Cost-Quality Trade-offs",
      content:
        "The choice between single-agent, debate, and ensemble approaches comes down to cost, latency, and quality. A single agent is cheapest and fastest but produces the lowest quality. Debate multiplies cost linearly with rounds but yields the highest quality. Ensemble costs scale with the number of parallel agents but keeps latency low since agents run simultaneously.\n\nUse the calculator below to model your specific cost profile - adjust the number of agents, debate rounds, and per-call cost to see how the three strategies compare for your workload.",
      playground: "cost-calculator",
    },
  ],

  "architecture-patterns/graph-and-blackboard": [
    {
      heading: "Graph / State Machine",
      content:
        "You define an explicit directed graph where:\n- **Nodes** are agents, functions, or processing steps\n- **Edges** are transitions with conditions\n- **State** is a shared object that flows through the graph and accumulates results\n\nThe flow follows the edges deterministically based on conditions evaluated against the current state. There is no LLM deciding who goes next - the transitions are programmatic.\n\n1. Define a state schema (TypedDict, Pydantic model, or dataclass)\n2. Define nodes (functions or agent calls that read/write state)\n3. Define edges with conditions (e.g., \"if state['intent'] == 'billing', go to billing_node\")\n4. The runtime executes nodes, evaluates conditions, and follows edges\n5. Branching, looping, and parallel paths are all supported",
      playground: "state-machine-viz",
    },
    {
      heading: "Graph - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Fully deterministic.** The same input always follows the same path.\n- **Auditable.** You can inspect the graph, log every transition, and replay executions.\n- **Testable.** Each node can be unit-tested independently. Edge conditions can be verified.\n- **No routing LLM cost.** Transitions are programmatic, not LLM-decided.\n- **Complex control flow.** Supports loops, branches, parallel execution, error handling, and human-in-the-loop interrupts.\n\n**Weaknesses:**\n- **Requires upfront design.** You must anticipate all possible paths through the graph.\n- **Rigid for novel scenarios.** If a query doesn't fit any anticipated path, the system can't adapt.\n- **More code to maintain.** The graph definition is separate from the agents themselves.\n- **Complexity at scale.** Large graphs with many conditional edges become hard to reason about.\n\n**When to use:** Production systems where reliability and auditability matter, regulated industries, complex workflows with branches and loops, any system that will be maintained by a team.",
    },
    {
      heading: "Graph - LangGraph Implementation",
      content:
        "LangGraph is the primary framework for graph-based multi-agent systems. It uses a `StateGraph` with typed state, conditional edges, and built-in persistence.",
      code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query: str
    intent: str
    response: str

workflow = StateGraph(State)

workflow.add_node("classify", classify_intent)
workflow.add_node("faq", faq_agent)
workflow.add_node("technical", technical_agent)
workflow.add_node("escalation", escalation_agent)

workflow.set_entry_point("classify")
workflow.add_conditional_edges("classify", route_by_intent, {
    "faq": "faq",
    "technical": "technical",
    "escalation": "escalation",
})
workflow.add_edge("faq", END)
workflow.add_conditional_edges("technical", check_escalation, {
    "resolved": END,
    "escalate": "escalation",
})
workflow.add_edge("escalation", END)

app = workflow.compile()`,
      language: "python",
    },
    {
      heading: "Blackboard / Shared Memory",
      content:
        "A shared data structure (the \"blackboard\") is accessible to all agents. Agents watch the blackboard for changes relevant to their expertise. When they see something they can contribute to, they activate, read what they need, do their work, and write results back to the blackboard.\n\nUnlike pipelines or handoffs, there is no explicit message passing between agents. All communication happens through the shared state.\n\n1. The user's request is written to the blackboard\n2. A controller checks which agents should activate based on the current blackboard state\n3. An activated agent reads relevant sections of the blackboard\n4. The agent does its work and writes results to the blackboard\n5. The updated blackboard may trigger other agents\n6. This continues until a completion condition is met",
      playground: "blackboard-demo",
    },
    {
      heading: "Blackboard - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Decoupled agents.** Agents don't need to know about each other - they only know about the blackboard.\n- **Flexible composition.** Adding a new agent just requires defining what it reads and writes.\n- **Incremental progress.** The blackboard accumulates knowledge over time.\n- **Natural for multi-phase problems.** Research → plan → implement → review, with each phase building on the blackboard.\n\n**Weaknesses:**\n- **Coordination complexity.** Multiple agents writing to the same section can conflict.\n- **State management.** The blackboard can grow large and messy.\n- **Ordering challenges.** Without explicit control, agents may activate in suboptimal order.\n- **Debugging difficulty.** Tracing which agent wrote what and when requires careful logging.\n\n**When to use:** Collaborative document creation, complex problem-solving where multiple experts contribute different knowledge, systems where agents contribute incrementally, scenarios where the interaction pattern isn't predictable.",
    },
    {
      heading: "Blackboard - Implementation",
      content:
        "A blackboard is a structured key-value store with logging. Each write records the agent name and timestamp for auditability.",
      code: `class Blackboard:
    def __init__(self):
        self.state = {
            "requirements": None,
            "architecture": None,
            "code": {},
            "test_results": None,
            "review_comments": [],
        }
        self.log = []

    def read(self, key):
        return self.state.get(key)

    def write(self, key, value, agent_name):
        self.state[key] = value
        self.log.append({
            "agent": agent_name,
            "key": key,
            "timestamp": now(),
        })

# Real-world analogy: A team war room with a large whiteboard.
# Team members walk up, read what's been written, add their
# contribution, and step away.`,
      language: "python",
    },
  ],

  "architecture-patterns/market-and-federated": [
    {
      heading: "Market / Auction-Based",
      content:
        "Tasks are announced to all agents. Each agent evaluates the task against its capabilities and resources, then submits a \"bid\" - a self-assessment of how well-suited it is for the task. The task is assigned to the highest bidder (or the bidder selected by a policy).\n\n1. A new task enters the system\n2. The task description is broadcast to all available agents\n3. Each agent evaluates: \"How well can I handle this?\"\n4. Agents submit bids (confidence scores, estimated quality, estimated time)\n5. A selection policy picks the winning agent (highest confidence, lowest cost, fastest, etc.)\n6. The winning agent executes the task",
      playground: "auction-sim",
    },
    {
      heading: "Market - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **Self-organizing.** Agents route themselves based on their own capability assessment.\n- **Load balancing.** Busy agents bid lower; idle agents bid higher.\n- **Naturally scalable.** New agents join by simply participating in auctions.\n- **No central routing intelligence needed.** The routing emerges from bidding.\n\n**Weaknesses:**\n- **Bid quality.** Agents may overestimate or underestimate their ability.\n- **Overhead per task.** Every agent evaluates every task, even ones they can't handle.\n- **Strategic behavior.** Agents might \"game\" bidding if reward structures incentivize it.\n- **Not common in LLM systems.** More theoretical than practical for current AI agent frameworks.\n\n**When to use:** Large agent pools where different instances have different loads, systems with heterogeneous agent capabilities (different models, different tool access), dynamic environments where agent availability changes.",
    },
    {
      heading: "Federated / Decentralized",
      content:
        "There is no central coordinator, manager, or router. Each agent operates autonomously with its own data and tools. Agents communicate peer-to-peer when they need information or collaboration. Decisions are made through negotiation, consensus, or voting among agents.\n\n1. Each agent monitors its own domain/data source\n2. When an agent encounters a problem it can't solve alone, it queries neighboring agents\n3. Agents negotiate directly: \"Can you provide X?\" \"I can, in exchange for Y.\"\n4. Results are assembled collaboratively, without any single agent seeing the full picture\n5. Consensus mechanisms ensure agreement on shared outputs",
    },
    {
      heading: "Federated - Strengths & Weaknesses",
      content:
        "**Strengths:**\n- **No single point of failure.** The system continues if any one agent goes down.\n- **Privacy preserving.** Each agent can keep its data local; only results are shared.\n- **Highly scalable.** No bottleneck at a central coordinator.\n- **Resilient.** Naturally handles partial failures and network partitions.\n\n**Weaknesses:**\n- **Consensus is hard.** Getting agents to agree on a final output requires complex protocols.\n- **Debugging nightmare.** No central log, no single view of what happened.\n- **Coordination overhead.** Peer-to-peer negotiation generates many messages.\n- **Rarely practical for LLM agents.** Current frameworks don't natively support this well.\n\n**When to use:** Multi-organization systems where no single entity should have full control, privacy-sensitive applications (healthcare, finance), large-scale distributed systems, research and experimental settings.",
    },
    {
      heading: "Key Takeaway",
      content:
        "Market and Federated patterns sit at the far end of the decentralization spectrum. They're the most powerful for large, heterogeneous, privacy-sensitive systems - but also the hardest to implement and debug. Most teams won't need them today, but understanding them helps you recognize when simpler patterns aren't enough.\n\nAs the agentic AI ecosystem matures and standards like A2A (Agent-to-Agent protocol) become production-ready, federated architectures will become increasingly practical for multi-organization agent collaboration.",
      playground: "decentralization-spectrum",
    },
  ],

  // ─── Series 11: Agent Communication & Memory ──────────────────────

  "agent-communication-memory/communication-patterns": [
    {
      heading: "Direct Messaging",
      content:
        "Agents send messages to specific other agents. Each message has an explicit sender and receiver.\n\n**Used in:** Handoff, Debate, Hierarchical\n\n**Pros:** Clear communication paths, easy to trace and debug\n\n**Cons:** Agents need to know about each other, creating coupling\n\nThis is the most intuitive pattern - it mirrors how humans communicate. One agent addresses another by name and sends a message. The receiving agent processes it and may respond.",
      playground: "comm-pattern-switcher",
    },
    {
      heading: "Broadcast",
      content:
        "An agent sends a message to all other agents simultaneously.\n\n**Used in:** Ensemble, Market/Auction\n\n**Pros:** Simple to implement, ensures all agents receive information\n\n**Cons:** Every agent processes every message, even irrelevant ones. This creates noise and wastes compute.\n\nBroadcast works well when every agent genuinely needs to see the message (ensemble voting) or when you want competitive selection (auction bids). It fails when most messages are irrelevant to most agents.",
    },
    {
      heading: "Shared State (Blackboard)",
      content:
        "Agents read from and write to a shared data store. No direct messaging between agents.\n\n**Used in:** Blackboard, some Hierarchical implementations\n\n**Pros:** Fully decoupled agents (they only know about the data, not each other), persistent state that survives agent failures\n\n**Cons:** Coordination challenges when multiple agents write to the same section, potential for stale reads and write conflicts\n\nThis is the most decoupled pattern. Agents don't even need to be running at the same time - they just read and write to a shared store.",
    },
    {
      heading: "Publish/Subscribe",
      content:
        "Agents subscribe to topics. Messages are published to topics, not to specific agents.\n\n**Used in:** Event-driven architectures, microservice-inspired agent systems\n\n**Pros:** Very decoupled - publishers don't know about subscribers, dynamic membership (agents can join/leave topics at runtime)\n\n**Cons:** Complex infrastructure, harder to debug (who received what?), message ordering guarantees can be tricky\n\nPub/sub scales best when you have many agents with varied interests. A \"code_ready\" event might interest the test agent and the reviewer agent, but not the research agent.",
    },
    {
      heading: "Streaming / Token-Level",
      content:
        "Agent A streams its output token by token, and Agent B can begin processing before A finishes.\n\n**Used in:** Real-time collaborative generation, chain-of-thought monitoring\n\n**Pros:** Lower latency for downstream agents - they can start reasoning before the full message arrives\n\n**Cons:** Complex implementation, agents need to handle partial input gracefully, error handling becomes more difficult\n\nStreaming communication is increasingly important for real-time multi-agent systems. A monitoring agent can watch the chain-of-thought stream and intervene early if it detects problems, rather than waiting for the full output.",
    },
    {
      heading: "Choosing a Communication Pattern",
      content:
        "The communication pattern should match the architecture pattern:\n\n- **Pipeline** → Direct messaging (each agent sends to the next)\n- **Debate** → Direct messaging (proposer and critic exchange turns)\n- **Ensemble** → Broadcast (all agents receive the same input)\n- **Hierarchical** → Star (all communication through the manager)\n- **Blackboard** → Shared state (read/write to the board)\n- **Graph** → Varies (usually direct messaging along edges, but can use shared state)\n\nMismatching these - for example, using broadcast in a pipeline - adds unnecessary complexity and noise.",
    },
  ],

  "agent-communication-memory/memory-systems": [
    {
      heading: "Why Memory Matters",
      content:
        "Memory is a critical differentiator between toy demos and production multi-agent systems. Without memory, every conversation starts from zero. Every past decision is forgotten. Every user preference is lost. Different memory types serve different purposes, and production systems typically need multiple types working together.",
      playground: "memory-type-explorer",
    },
    {
      heading: "Working Memory (Short-Term)",
      content:
        "The current conversation context - what was said, what was decided, what's in progress.\n\n- **Full buffer** - Keep all messages in context. Simple but hits token limits on long conversations.\n- **Sliding window** - Keep only last N messages. Loses early context that may be important.\n- **Summary + recent** - Summarize old messages, keep recent verbatim. Good balance, but requires a summarization LLM call.\n- **Token-aware truncation** - Drop oldest messages when approaching limit. Automatic but unpredictable.\n\nFor multi-agent systems, working memory also includes the conversation history between agents - not just the user-facing messages.",
      playground: "context-strategy",
    },
    {
      heading: "Long-Term / Episodic Memory",
      content:
        "What happened in previous sessions. Allows the system to remember past interactions with the same user, prior decisions, and historical patterns.\n\n- **Vector store** - Embed and store session summaries, retrieve by similarity. Flexible but requires good embedding models.\n- **Entity store** - Extract and store structured facts about users/topics. Precise but needs extraction logic.\n- **Full session logs** - Store raw conversation logs, search when needed. Complete but expensive to search at scale.\n- **Reflection summaries** - After each session, generate \"lessons learned.\" Compact but lossy.\n\nEpisodic memory is what makes agents feel like they \"remember\" you. Without it, every interaction is a first meeting.",
    },
    {
      heading: "Semantic / Knowledge Memory",
      content:
        "The system's domain knowledge - documentation, FAQs, procedures, reference material.\n\n- **RAG (vector store)** - Embed documents, retrieve relevant chunks per query. The standard approach, well-understood.\n- **Knowledge graph** - Structured relationships between entities. Rich but complex to build and maintain.\n- **Fine-tuned model** - Bake knowledge into model weights. Fast retrieval but hard to update.\n- **Hybrid RAG + graph** - Use both for different query types. Best quality, most complex.\n\nIn a multi-agent system, different agents may have different knowledge bases. A billing agent's semantic memory contains pricing docs, while a technical agent's contains troubleshooting guides.",
    },
    {
      heading: "Procedural Memory",
      content:
        "How to do things - runbooks, standard operating procedures, proven tool-call sequences.\n\n- **System prompt** - Hardcode procedures in agent instructions. Simple but static, doesn't learn.\n- **Retrieval-augmented** - Store procedures in a vector store, retrieve when relevant. Dynamic but requires good retrieval.\n- **Learned from history** - Track which tool sequences solved problems, replay successful patterns. Adaptive but needs data.\n\nProcedural memory is what makes agents get better over time. Instead of reasoning from scratch, they can recall: \"Last time I saw this error, the solution was X.\"",
    },
    {
      heading: "Inter-Agent Shared Memory",
      content:
        "The communication substrate between agents - how information produced by one agent becomes available to others.\n\n- **Conversation stream** - All messages visible to all agents (group chat). Simple but noisy.\n- **Blackboard** - Structured shared workspace. Organized but needs a schema.\n- **Direct passing** - Output of one agent is input to the next. Clean but limited.\n- **Scoped sharing** - Agents only see messages tagged for them. Focused but complex.\n\nThe choice of inter-agent memory directly shapes the architecture. A blackboard implies a blackboard pattern. A conversation stream implies a group chat. Design the memory to match the coordination pattern, not the other way around.",
    },
  ],

  "agent-communication-memory/comparison-matrix": [
    {
      heading: "The Full Comparison",
      content:
        "Here is every architecture pattern compared across seven dimensions. Use this as a reference when evaluating which pattern fits your system.\n\n| Pattern | Control | Deterministic? | LLM Routing Cost | Parallelism | Quality Mechanism | Complexity |\n|---|---|---|---|---|---|---|\n| **Sequential** | Fixed order | Yes | None | None | None | Low |\n| **Selector** | LLM selector | No | High (per turn) | None | Re-routing | Medium |\n| **Handoff** | Each agent | No | None (embedded) | None | Self-assessment | Medium |\n| **Hierarchical** | Manager agent | No | Low | Optional | Manager review | Medium |\n| **Debate** | Turn-taking | No | None | None | Adversarial | Medium |\n| **Ensemble** | Parallel + aggregate | N/A | None | Full | Redundancy | High |\n| **Graph** | Explicit edges | Yes | None | Conditional | Programmatic checks | High |\n| **Blackboard** | Event-driven | Partially | None | Agent-level | Incremental | High |\n| **Market** | Bidding | No | None | Bidding phase | Competition | High |\n| **Federated** | Consensus | No | None | Full | Negotiation | Very High |",
      playground: "pattern-matrix",
    },
    {
      heading: "Reading the Matrix",
      content:
        "**Control** tells you who decides what happens next. Fixed order and explicit edges are deterministic; everything else introduces variability.\n\n**LLM Routing Cost** is the overhead for deciding who goes next. Only the Selector pattern requires a dedicated LLM call for routing. Handoff embeds the routing decision in the agent's own reasoning.\n\n**Parallelism** is your lever for reducing wall-clock time. Ensemble gives you full parallelism. Graph gives you conditional parallelism (parallel branches). Everything else is sequential.\n\n**Quality Mechanism** is how the system catches and corrects errors. Adversarial (debate) and redundancy (ensemble) are the strongest. None (sequential) means errors flow straight through.",
    },
    {
      heading: "The Complexity-Capability Trade-off",
      content:
        "There's a clear spectrum from simple to complex:\n\n**Low complexity:** Sequential → Handoff → Selector → Hierarchical\n\n**High complexity:** Debate → Ensemble → Graph → Blackboard → Market → Federated\n\nMore complexity isn't better. It's only justified when the quality, reliability, or scalability requirements demand it. Start at the simplest pattern that meets your needs, and only add complexity when you can measure the benefit.",
      playground: "pattern-radar",
    },
  ],

  "agent-communication-memory/decision-framework": [
    {
      heading: "The Three Questions",
      content:
        "Start every multi-agent design with these three questions:\n\n**Question 1: How predictable is the workflow?**\n- Very predictable (same steps every time) → **Sequential** or **Graph**\n- Somewhat predictable (known categories, varied handling) → **Selector** or **Handoff**\n- Unpredictable (open-ended tasks, novel queries) → **Hierarchical** or **Ensemble**\n\n**Question 2: How important is output quality vs. speed?**\n- Speed critical, quality acceptable → **Sequential** or **Handoff** (fewest LLM calls)\n- Quality critical, speed acceptable → **Debate** or **Ensemble** (multiple checks)\n- Balanced → **Selector** or **Hierarchical**\n\n**Question 3: Do you need auditability and reproducibility?**\n- Yes, strictly → **Graph** (deterministic paths, explicit state transitions)\n- Yes, mostly → **Sequential** or **Hierarchical** (clear chains of responsibility)\n- Not critical → **Selector**, **Handoff**, or **Ensemble**",
      playground: "pattern-wizard",
    },
    {
      heading: "Pattern Selection by Use Case",
      content:
        "| Use Case | Recommended Pattern | Why |\n|---|---|---|\n| Customer support chatbot | Selector or Handoff | Queries vary widely; need dynamic routing |\n| Code generation + review | Debate or Sequential | Quality benefits from critique; steps are known |\n| Research assistant | Hierarchical | Manager decomposes complex questions |\n| Document processing pipeline | Sequential or Graph | Stages are fixed and ordered |\n| Incident response | Graph + Hierarchical | Needs deterministic triage with expert analysis |\n| Creative brainstorming | Ensemble | Diverse perspectives improve ideation |\n| Production API | Graph | Auditability, reliability, testability |\n| Compliance review | Debate | Multiple reviewers catch different issues |\n| Multi-team collaboration | Blackboard or Federated | Teams work independently on shared artifact |",
      playground: "use-case-matcher",
    },
    {
      heading: "The Maturity Progression",
      content:
        "Most teams follow this evolution:\n\n1. **Start with Sequential.** Get agents working at all. Prove value.\n2. **Move to Selector or Handoff.** Add dynamic routing as query diversity grows.\n3. **Add Debate for quality.** Layer in a reviewer agent for high-stakes outputs.\n4. **Graduate to Graph.** When you need production reliability, encode the workflow explicitly.\n5. **Optimize with Ensemble.** For critical paths, run parallel agents and pick the best output.\n\nDon't skip steps. Each level teaches you something about your system's needs that informs the next level. Teams that jump straight to Graph often build overly complex graphs because they haven't learned which paths actually matter.",
    },
    {
      heading: "Combining Patterns",
      content:
        "Real production systems rarely use a single pattern. Common combinations:\n\n- **Graph + Debate:** Deterministic routing with adversarial quality checks at key nodes.\n- **Hierarchical + Ensemble:** A manager delegates to workers, and critical subtasks use best-of-N.\n- **Selector + Handoff:** A selector picks the initial agent, which can then hand off to specialists.\n- **Graph + Blackboard:** Graph controls the macro flow; agents within each node use a shared blackboard for coordination.\n\nThe architecture patterns are building blocks, not straitjackets. Mix them to match your actual system requirements.",
    },
  ],

  // ─── Series 12: Building Multi-Agent Systems ──────────────────────

  "building-multi-agent-systems/implementation-frameworks": [
    {
      heading: "AutoGen (Microsoft)",
      content:
        "**Version:** 0.4+ (AgentChat API)\n\n**Patterns supported:** Sequential (`RoundRobinGroupChat`), Selector (`SelectorGroupChat`), Custom (Swarm, MagenticOne)\n\n**Strengths:**\n- Clean Python API for agent definitions\n- Built-in tool execution\n- Flexible model client abstraction (OpenAI, Azure, Anthropic, LiteLLM)\n- Team-based orchestration with termination conditions\n\n**Best for:** Rapid prototyping, conversational multi-agent systems",
      code: `from autogen_agentchat.teams import SelectorGroupChat, RoundRobinGroupChat
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.conditions import MaxMessageTermination

# Define agents
researcher = AssistantAgent(
    name="Researcher",
    system_message="You research topics thoroughly.",
    model_client=model_client,
)

writer = AssistantAgent(
    name="Writer",
    system_message="You write clear, engaging content.",
    model_client=model_client,
)

# Sequential team
pipeline = RoundRobinGroupChat(
    participants=[researcher, writer],
    termination_condition=MaxMessageTermination(max_messages=4),
)`,
      language: "python",
      playground: "framework-tabs",
    },
    {
      heading: "LangGraph (LangChain)",
      content:
        "**Patterns supported:** Graph (primary), all others composable within graph nodes\n\n**Strengths:**\n- Explicit state machine with typed state\n- Built-in persistence, streaming, and human-in-the-loop\n- Conditional edges, parallel branches, subgraphs\n- LangSmith integration for observability\n\n**Best for:** Production systems requiring deterministic control flow",
      code: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint import MemorySaver
from typing import TypedDict

class AgentState(TypedDict):
    messages: list
    next_agent: str

workflow = StateGraph(AgentState)
workflow.add_node("researcher", research_node)
workflow.add_node("writer", writer_node)
workflow.add_node("reviewer", reviewer_node)

workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "writer")
workflow.add_conditional_edges("writer", should_review, {
    "needs_review": "reviewer",
    "approved": END,
})
workflow.add_edge("reviewer", "writer")

app = workflow.compile(checkpointer=MemorySaver())`,
      language: "python",
    },
    {
      heading: "CrewAI",
      content:
        "**Patterns supported:** Sequential (`Process.sequential`), Hierarchical (`Process.hierarchical`)\n\n**Strengths:**\n- High-level \"crew\" abstraction (agents, tasks, process)\n- Built-in delegation between agents\n- Memory and caching support\n- Rapid prototyping with minimal code\n\n**Best for:** Team-simulation use cases, rapid prototyping",
      code: `from crewai import Agent, Task, Crew, Process

researcher = Agent(
    role="Researcher",
    goal="Research topics thoroughly",
    backstory="You are an expert researcher.",
    tools=[search_tool],
)

writer = Agent(
    role="Writer",
    goal="Write engaging content",
    backstory="You are a skilled technical writer.",
)

research_task = Task(description="Research {topic}", agent=researcher)
write_task = Task(description="Write article on {topic}", agent=writer)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
)`,
      language: "python",
    },
    {
      heading: "OpenAI Swarm",
      content:
        "**Patterns supported:** Handoff (primary)\n\n**Strengths:**\n- Extremely lightweight (educational framework)\n- Clean handoff model with transfer functions\n- Context variables for state passing\n- Minimal abstraction, easy to understand\n\n**Best for:** Learning handoff patterns, simple multi-agent applications\n\n**Note:** Swarm is explicitly labeled as educational and not production-ready. It's excellent for understanding the handoff pattern, but you'll want AutoGen or LangGraph for production.",
      code: `from swarm import Swarm, Agent

def transfer_to_sales():
    return sales_agent

triage_agent = Agent(
    name="Triage",
    instructions="Route to the right department.",
    functions=[transfer_to_sales, transfer_to_support],
)

sales_agent = Agent(
    name="Sales",
    instructions="Handle sales inquiries.",
)

client = Swarm()
response = client.run(
    agent=triage_agent,
    messages=[{"role": "user", "content": "I want to buy the pro plan"}],
)`,
      language: "python",
    },
    {
      heading: "Framework Comparison",
      content:
        "| Framework | Primary Pattern | Production Ready? | State Management | Learning Curve |\n|---|---|---|---|---|\n| AutoGen 0.4 | Selector, Sequential | Moderate | Team-internal | Medium |\n| LangGraph | Graph | Yes | Built-in persistence | High |\n| CrewAI | Sequential, Hierarchical | Moderate | Built-in memory | Low |\n| OpenAI Swarm | Handoff | No (educational) | Context variables | Very Low |\n\n**Pick LangGraph** when you need production reliability, deterministic control flow, and auditability. **Pick AutoGen** when you want flexible conversational multi-agent systems with rapid iteration. **Pick CrewAI** when you want the simplest possible API for team-simulation patterns. **Pick Swarm** when you're learning.",
      playground: "framework-picker",
    },
  ],

  "building-multi-agent-systems/real-world-applications": [
    {
      heading: "Software Development",
      content:
        "**Pattern:** Hierarchical + Debate\n\n- **PM Agent:** Breaks down requirements into tasks\n- **Architect Agent:** Designs the approach and identifies affected files\n- **Coder Agent:** Writes the implementation\n- **Reviewer Agent:** Critiques the code (debate with coder)\n- **Tester Agent:** Generates and runs tests\n\n**Examples:** ChatDev, MetaGPT, Devin-style systems\n\nThe key insight is that software development naturally maps to specialized roles. The debate between coder and reviewer is where the most value comes from - it catches bugs, security issues, and design problems that a single code-generation agent would miss.",
      playground: "use-case-carousel",
    },
    {
      heading: "Customer Support",
      content:
        "**Pattern:** Selector or Handoff\n\n- **Triage Agent:** Classifies intent and urgency\n- **FAQ Agent:** Handles common questions from a knowledge base\n- **Technical Agent:** Troubleshoots issues, creates tickets\n- **Billing Agent:** Handles payment, invoicing, subscription changes\n- **Escalation Agent:** Hands off to human agents when needed\n\nCustomer support is the canonical use case for the selector and handoff patterns because query types vary enormously. A billing question needs completely different tools and knowledge than a technical troubleshooting request.",
    },
    {
      heading: "Research and Analysis",
      content:
        "**Pattern:** Hierarchical + Ensemble\n\n- **Research Manager:** Decomposes the research question\n- **Web Researcher:** Searches the internet, reads papers\n- **Data Analyst:** Queries databases, produces charts\n- **Writer:** Synthesizes findings into a report\n- **Fact-Checker:** Verifies claims against sources\n\nThe ensemble component is important here: running multiple research agents with different search strategies and combining their findings produces more comprehensive results than a single researcher.",
    },
    {
      heading: "Financial Analysis",
      content:
        "**Pattern:** Graph + Debate\n\n- **Data Collector:** Pulls market data, filings, news\n- **Quantitative Analyst:** Runs models, identifies patterns\n- **Risk Assessor:** Evaluates downside scenarios\n- **Bull/Bear Debate:** Two agents argue opposing investment theses\n- **Report Generator:** Produces the final analysis\n\nThe graph ensures regulatory-compliant, auditable decision paths. The debate between bull and bear analysts forces the system to consider both sides of an investment thesis, reducing confirmation bias.",
    },
    {
      heading: "Content Creation",
      content:
        "**Pattern:** Sequential + Debate\n\n- **Topic Researcher:** Gathers background and source material\n- **Outline Agent:** Structures the content\n- **Writer Agent:** Produces the first draft\n- **Editor Agent:** Critiques and suggests improvements (debate with writer)\n- **SEO/Format Agent:** Optimizes for platform and audience\n\nThe sequential pipeline ensures every piece of content goes through all necessary stages, while the debate between writer and editor improves quality through iteration.",
    },
    {
      heading: "DevOps and Incident Response",
      content:
        "**Pattern:** Graph (deterministic triage) + Hierarchical (investigation)\n\n- **Alert Classifier:** Receives alert, classifies severity and type\n- **Log Analyst:** Searches logs for correlated events\n- **Root Cause Investigator:** Analyzes recent deployments, config changes\n- **Remediation Agent:** Suggests or executes fixes\n- **Communication Agent:** Drafts status updates for stakeholders\n\nThe graph pattern is critical here because incident response needs to be deterministic and auditable. You can't have an LLM randomly deciding to skip the severity classification step. The hierarchical component kicks in once the alert is classified and a lead investigator agent coordinates the analysis.",
    },
  ],

  "building-multi-agent-systems/design-principles": [
    {
      heading: "Principle 1: Single Responsibility per Agent",
      content:
        "Each agent should have one clear role. If you can't describe what an agent does in one sentence, it's too broad. Split it.\n\nBad: \"This agent handles all customer interactions, including sales, support, billing, and escalation.\"\n\nGood: \"This agent classifies customer intent and routes to the appropriate specialist.\"\n\nThe test is simple: if removing any part of the agent's responsibilities would leave a coherent, useful agent, it should be split.",
      playground: "principle-cards",
    },
    {
      heading: "Principle 2: Define Interfaces, Not Implementations",
      content:
        "Specify what each agent receives as input and what it must produce as output. Don't dictate how it reasons internally.\n\nThis makes agents swappable - you can replace a slow, expensive agent with a faster one as long as the interface contract is maintained. It also makes testing easier: you can unit-test each agent by providing mock inputs and checking outputs.",
    },
    {
      heading: "Principle 3: Fail Gracefully",
      content:
        "Every agent should handle \"I don't know\" and \"I can't do this.\" An agent that guesses rather than admitting uncertainty poisons the system.\n\nDesign explicit failure modes: what does the agent do when it can't parse the input? When its tools fail? When it's unsure about the answer? The answer should never be \"make something up.\"",
    },
    {
      heading: "Principle 4: Minimize Shared State",
      content:
        "The more state agents share, the more coordination bugs you'll have. Prefer explicit message passing over implicit shared state.\n\nIf you must use shared state, make writes append-only (immutable history), add versioning, and log every mutation with the agent name and timestamp. Treat shared state like a database - with transactions, not free-form writes.",
    },
    {
      heading: "Principle 5: Design for Observability",
      content:
        "Log every agent turn, every tool call, every routing decision. Without traces, debugging multi-agent systems is nearly impossible.\n\nAt minimum, capture: which agent ran, what input it received, what tools it called, what output it produced, how long it took, and how many tokens it used. This data is essential for debugging, optimization, and cost management.",
    },
    {
      heading: "Principle 6: Start Simple, Add Complexity Only When Measured",
      content:
        "Begin with two agents. Measure where the bottleneck is. Add a third agent only when you can articulate what problem it solves.\n\nEvery additional agent adds latency (more LLM calls), cost (more tokens), and complexity (more coordination logic). The burden of proof is on the new agent to justify its existence with measurable improvement.",
    },
    {
      heading: "Anti-Pattern: The God Agent",
      content:
        "One agent that does everything, with other agents as glorified tool wrappers. This defeats the purpose of multi-agent architecture.\n\nSymptom: one agent has a 2000-word system prompt covering 10 different responsibilities, while other agents have 2-line prompts that just wrap a single tool call.",
      playground: "anti-pattern-quiz",
    },
    {
      heading: "Anti-Pattern: The Echo Chamber",
      content:
        "Agents that only confirm each other's outputs without genuine critique. Debate patterns need agents with genuinely different perspectives or evaluation criteria.\n\nSymptom: the \"critic\" agent always approves after one round. Fix: give the critic a different model, different system prompt, or specific evaluation criteria that force it to look for problems.",
    },
    {
      heading: "Anti-Pattern: The Infinite Loop",
      content:
        "Agent A delegates to B, B determines A should handle it, A delegates back. Every system needs a maximum message count or cycle detection.\n\nSymptom: token costs spike unexpectedly, or the system hangs. Fix: hard maximum on rounds/messages, explicit cycle detection in routing logic.",
    },
    {
      heading: "Anti-Pattern: The Token Black Hole",
      content:
        "A manager agent that ingests every worker's full output, blowing through context limits. Summarize or truncate worker outputs before feeding them to the manager.\n\nSymptom: the manager's context grows linearly with the number of workers, eventually hitting token limits or degrading quality. Fix: require workers to produce structured, concise summaries.",
    },
    {
      heading: "Anti-Pattern: The Premature Subagent",
      content:
        "Creating an agent for a task that a single tool call could handle. Not every function needs its own agent.\n\nSymptom: an \"agent\" whose system prompt is \"call the search API and return results\" - that's a tool, not an agent. Use agents for tasks requiring reasoning, judgment, or multi-step decision-making.",
    },
    {
      heading: "Anti-Pattern: The Invisible Handoff",
      content:
        "Transferring between agents without informing the user or preserving context. Every handoff should carry a summary of what was discussed and why the transfer is happening.\n\nSymptom: the user repeats information after every transfer, or the receiving agent has no idea what was already discussed. Fix: include a handoff summary in the transfer context.",
    },
    {
      heading: "System Health Assessment",
      content:
        "Before deploying a multi-agent system, run it through a health check against all six design principles. Each principle you've implemented strengthens the system; each one you've skipped is a potential failure mode in production.\n\nToggle each principle below to see how your system's health score changes - and what risks you're accepting for any principle you haven't addressed.",
      playground: "system-health-checker",
    },
  ],

  "building-multi-agent-systems/putting-it-all-together": [
    {
      heading: "The Scenario",
      content:
        "Let's design a complete multi-agent customer support system from scratch, applying everything from this series. The system needs to handle FAQ questions, technical troubleshooting, billing inquiries, and escalation to humans - with high quality and full auditability.\n\nWe'll make design decisions at each step and justify them using the frameworks and principles we've covered.",
    },
    {
      heading: "Step 1: Choose the Architecture Pattern",
      content:
        "Using our decision framework:\n\n- **Predictability?** Somewhat predictable - known query categories, but varied handling within each. → Selector or Handoff\n- **Quality vs speed?** Balanced - fast enough for real-time chat, good enough to resolve issues. → Selector or Hierarchical\n- **Auditability?** Yes - we need to trace why the system routed to a particular agent. → Graph or Selector\n\n**Decision:** A **Graph** with a selector at the entry point. The graph gives us auditable, deterministic transitions for the known flow (classify → route → handle → close). The selector within the classification node handles the dynamic routing to specialists.",
      playground: "system-design-wizard",
    },
    {
      heading: "Step 2: Define the Agents",
      content:
        "Following the single-responsibility principle:\n\n- **Classifier Agent** - Classifies intent (FAQ, technical, billing, escalation) and extracts key entities. *No tools.*\n- **FAQ Agent** - Answers common questions from a knowledge base. *Tools:* vector search over FAQ docs.\n- **Technical Agent** - Troubleshoots issues step by step. *Tools:* log search, ticket creation, system status API.\n- **Billing Agent** - Handles payment and subscription questions. *Tools:* billing API (read-only), subscription API.\n- **Escalation Agent** - Prepares a handoff summary for human agents. *No tools.*\n- **Quality Agent** - Reviews the final response before sending. *No tools.*\n\nNotice: every agent has one clear job, and tool access follows the principle of least privilege.",
    },
    {
      heading: "Step 3: Design the Graph",
      content:
        "The state object carries the conversation through the graph:\n\n1. **Entry** → Classifier Agent (determines intent)\n2. **Conditional edge** based on `state.intent`:\n   - `faq` → FAQ Agent\n   - `technical` → Technical Agent\n   - `billing` → Billing Agent\n   - `escalation` → Escalation Agent\n3. **Each specialist** → Quality Agent (reviews response)\n4. **Quality Agent** → Conditional edge:\n   - `approved` → END (send response)\n   - `needs_revision` → Back to the specialist\n5. **Max revision count** of 2 to prevent infinite loops",
      code: `workflow = StateGraph(SupportState)

workflow.add_node("classify", classifier_agent)
workflow.add_node("faq", faq_agent)
workflow.add_node("technical", technical_agent)
workflow.add_node("billing", billing_agent)
workflow.add_node("escalation", escalation_agent)
workflow.add_node("quality", quality_agent)

workflow.set_entry_point("classify")
workflow.add_conditional_edges("classify", route_by_intent, {
    "faq": "faq",
    "technical": "technical",
    "billing": "billing",
    "escalation": "escalation",
})

for node in ["faq", "technical", "billing"]:
    workflow.add_edge(node, "quality")

workflow.add_conditional_edges("quality", check_quality, {
    "approved": END,
    "needs_revision": "route_back",
})
workflow.add_edge("escalation", END)`,
      language: "python",
      playground: "query-simulator",
    },
    {
      heading: "Step 4: Add Observability and Guardrails",
      content:
        "Following the design principles:\n\n**Observability:** Every node logs: agent name, input state, output state, tool calls, token count, and latency. This feeds into a dashboard for monitoring routing accuracy and response quality.\n\n**Guardrails:**\n- The classifier has a confidence threshold - low confidence routes to escalation\n- Each specialist has a max turn count (prevents runaway reasoning)\n- The quality agent has specific evaluation criteria (accuracy, tone, completeness)\n- All tool calls are logged and rate-limited\n\n**Failure modes:**\n- LLM API timeout → Retry once, then escalate to human\n- Tool failure → Agent reports the failure; doesn't guess\n- Low-confidence classification → Route to escalation with explanation",
    },
    {
      heading: "What We Applied",
      content:
        "This design used concepts from across the entire series:\n\n- **Classification framework:** Hybrid control (graph structure + LLM classification), star topology (all specialists connect through the quality node), mixed relationships (classifier is authoritative, specialists are peers)\n- **Architecture patterns:** Graph for the overall flow, with elements of Selector at the classification node and Debate between specialists and the quality agent\n- **Communication:** Direct messaging along graph edges, with structured state passing\n- **Memory:** Working memory within each node's context, semantic memory (RAG) for the FAQ agent, procedural memory (system prompts) for all agents\n- **Principles:** Single responsibility, fail gracefully, observability, tool isolation\n\nThis is how the pieces fit together in practice. Start with the decision framework, choose patterns, define agents with clear boundaries, wire the communication, and add guardrails.",
    },
  ],
};
