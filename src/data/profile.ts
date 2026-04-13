export const profile = {
  name: "Rahul Mrinal",
  title: "Generative AI Lead / Engineering Manager",
  tagline: "Building scalable AI-driven platforms & distributed systems",
  location: "Bangalore, India",
  linkedin: "https://www.linkedin.com/in/rahul-mrinal/",
  summary:
    "Generative AI Lead and Engineering Manager with ~8 years of experience building scalable AI-driven platforms and distributed systems across AWS and Azure. Specialized in Generative AI, agentic workflows, and cloud-native architectures for enterprise applications. Experienced in designing multi-agent systems, LLM-powered platforms, and data-intensive systems supporting decision-making, automation, analytics, and compliance use cases.",
  highlights: [
    "Built and scaled AI-powered enterprise platforms using LLMs, agentic workflows, and retrieval systems across AWS and Azure",
    "Drove enterprise AI adoption through solution accelerators, client demos, and cross-functional delivery",
    "Architected cloud-native systems including serverless and microservices-based platforms supporting large-scale workflows",
    "Delivered solutions across compliance automation, predictive analytics, and regulatory intelligence domains",
    "Led engineering teams, hiring, mentoring, client demos, and technical discussions across multiple enterprise engagements",
  ],
};

export interface Experience {
  company: string;
  location: string;
  roles: {
    title: string;
    period: string;
    bullets: string[];
  }[];
}

export const experience: Experience[] = [
  {
    company: "PwC Acceleration Centers",
    location: "Bangalore, India",
    roles: [
      {
        title: "Manager, Generative AI (Engineering Lead)",
        period: "Jul 2025 – Present",
        bullets: [
          "Lead development of AI-powered enterprise platforms for automation, decision-making, and analytics use cases",
          "Architect multi-agent and LLM-driven systems for processing and analyzing large-scale documents and enterprise data",
          "Design microservices and event-driven architectures using AWS for scalable, resilient, and high-throughput systems",
          "Build data pipelines for ingestion, processing, and analysis of structured and unstructured datasets",
          "Contribute to technical roadmap, architecture decisions, client demos, RFPs, and solution strategy",
          "Mentor engineers and conduct technical interviews to scale GenAI and engineering capabilities",
        ],
      },
      {
        title: "Senior Associate, Generative AI",
        period: "Jul 2023 – Jun 2025",
        bullets: [
          "Built AI-powered solutions using LLMs and agentic workflows for enterprise applications",
          "Designed systems for document processing, knowledge retrieval, and intelligent automation",
          "Developed backend services and data pipelines for scalable AI applications across AWS and Azure",
          "Delivered proofs of concept, client demos, and solution accelerators to drive enterprise AI adoption",
          "Supported growth of the GenAI practice through delivery, interviews, and knowledge sharing",
        ],
      },
      {
        title: "Associate, Data & Analytics",
        period: "Jan 2022 – Jul 2023",
        bullets: [
          "Built ETL pipelines and data workflows using SQL Server and AWS for enterprise analytics use cases",
          "Developed dashboards and reporting solutions using Power BI for business insights and decision support",
          "Automated workflows using Alteryx, improving operational efficiency and reducing manual effort",
          "Supported cloud-based data solutions for downstream analytics and reporting applications",
        ],
      },
    ],
  },
  {
    company: "Accenture",
    location: "Pune, India",
    roles: [
      {
        title: "Software Engineering Analyst",
        period: "Jun 2020 – Dec 2021",
        bullets: [
          "Designed and developed data processing solutions for utilities clients in the electricity and gas domain",
          "Built distributed data pipelines using AWS Glue and EMR for large-scale ingestion, transformation, and analytics",
          "Contributed to solution design and enterprise implementations in the SAP Utilities domain",
          "Worked with high-volume operational datasets, supporting scalable processing and system performance",
        ],
      },
      {
        title: "Associate Software Engineer",
        period: "May 2018 – May 2020",
        bullets: [
          "Developed and supported applications using Python and AWS, building foundations in backend development and cloud systems",
          "Contributed to enterprise applications handling high-volume operational data in the utilities domain",
          "Collaborated with cross-functional teams on feature development, issue resolution, and production support",
        ],
      },
    ],
  },
];

export interface SkillGroup {
  category: string;
  skills: string[];
  color: string;
}

export const skills: SkillGroup[] = [
  {
    category: "Generative AI & Intelligent Systems",
    skills: [
      "Generative AI",
      "Agentic AI",
      "LLMs",
      "Prompt Engineering",
      "Multi-agent Systems",
      "RAG",
      "Semantic Retrieval",
    ],
    color: "#6c63ff",
  },
  {
    category: "Architecture & Distributed Systems",
    skills: [
      "System Design",
      "Distributed Systems",
      "Microservices",
      "Event-driven Architecture",
      "High Availability",
      "Scalable Systems",
      "API Design",
    ],
    color: "#00c9a7",
  },
  {
    category: "AWS",
    skills: [
      "Lambda",
      "Step Functions",
      "API Gateway",
      "S3",
      "DynamoDB",
      "RDS",
      "SQS",
      "SNS",
      "EventBridge",
      "Glue",
      "EMR",
      "Bedrock",
      "CloudFormation",
      "CloudWatch",
      "IAM",
      "VPC",
      "ECS",
      "ECR",
      "Secrets Manager",
      "Kinesis",
    ],
    color: "#ff6b6b",
  },
  {
    category: "Azure",
    skills: [
      "Azure OpenAI",
      "AI Search",
      "Cosmos DB",
      "Blob Storage",
      "Container Apps",
      "Functions",
      "Document Intelligence",
      "Azure AD / Entra ID",
      "Key Vault",
      "Service Bus",
      "Event Grid",
      "API Management",
      "App Service",
      "Virtual Network",
      "Monitor / Log Analytics",
    ],
    color: "#4fc3f7",
  },
  {
    category: "DevOps & Infrastructure",
    skills: [
      "Docker",
      "CI/CD",
      "Terraform",
      "GitHub Actions",
      "Infrastructure as Code",
      "Serverless Architecture",
      "Microservices",
    ],
    color: "#c77dff",
  },
  {
    category: "Backend & Data Engineering",
    skills: [
      "Python",
      "FastAPI",
      "REST APIs",
      "SQL",
      "Data Pipelines",
      "ETL Workflows",
      "Data Processing",
    ],
    color: "#ffd93d",
  },

  {
    category: "Tools & Visualization",
    skills: ["Power BI", "Alteryx", "Git", "Langfuse", "Postman", "OCR Workflows"],
    color: "#ffa94d",
  },
];

export interface Project {
  title: string;
  subtitle: string;
  role: string;
  highlights: string[];
  techStack: string[];
}

export const projects: Project[] = [
  {
    title: "AI-Powered Enterprise Desktop Assistant",
    subtitle: "Multi-Platform AI Copilot",
    role: "Solution Architect & Technical Lead",
    highlights: [
      "Designed end-to-end architecture for an enterprise AI assistant featuring a 3D animated avatar with real-time voice interaction, deployed across desktop (Electron), web (React widget), and mobile (React Native) from a single platform-agnostic core SDK",
      "Engineered a configurable voice provider abstraction layer supporting OpenAI Realtime, Google Gemini Live, and Azure OpenAI, enabling enterprise-tunable cost-quality tradeoffs across speech-to-speech AI models",
      "Built an MCP (Model Context Protocol) integration framework with 4-tier enterprise governance (built-in, verified, approved, blocked), admin-controlled policies, tool-level filtering, and full audit logging",
      "Implemented long-term memory system using Azure AI Search (vector embeddings) and Cosmos DB for cross-session personalization, RAG-based context injection, and communication style modeling",
      "Designed Azure deployment topology with Front Door (WAF), API Management (JWT validation), VNet-integrated Functions, Private Endpoints for all data services, and Bicep IaC across dev/staging/prod environments",
      "Led Phase 1 delivery: Turborepo monorepo (5 packages), Electron shell with auto-launch, frameless window, system tray, and Azure Entra ID SSO via MSAL PKCE, establishing foundation for the full 12-phase product roadmap",
    ],
    techStack: ["Azure OpenAI", "Azure AI Search", "Cosmos DB", "Electron", "React Native", "Turborepo", "MCP", "Bicep IaC", "Azure Entra ID"],
  },
  {
    title: "AI Regulatory Intelligence Platform",
    subtitle: "Responsible AI Compliance",
    role: "Solution Architect & Technical Lead",
    highlights: [
      "Architected an intelligent regulatory analysis system that ingests and decomposes global regulatory documents across jurisdictions, enabling automated identification of compliance gaps, obligation mapping, and cross-border regulatory alignment",
      "Built high-fidelity document ingestion and structured extraction pipelines using Azure Document Intelligence, converting long-form regulatory PDFs into clause-level structured data with obligation tagging, entity extraction, and hierarchical section parsing",
      "Designed and implemented multi-agent workflows that decompose complex regulatory documents into searchable units, classify obligation types, and map external regulations against internal policy knowledge bases",
      "Developed a retrieval and alignment engine that programmatically matches incoming regulatory requirements to existing internal policies, surfacing gaps, conflicts, and areas requiring legal review with confidence-scored recommendations",
      "Automated large-scale cross-jurisdictional analysis workflows that previously required weeks of manual legal review, significantly improving consistency of compliance assessments and reducing time-to-regulatory-readiness",
    ],
    techStack: ["Azure Document Intelligence", "Multi-agent Systems", "LLMs", "RAG", "Azure AI Search", "Python"],
  },
  {
    title: "AI-Powered Predictive Insights & Search Platform",
    subtitle: "Aviation MRO Analytics",
    role: "Solution Architect",
    highlights: [
      "Designed and built an AI-powered aviation maintenance analytics platform for a major aerospace manufacturer, enabling reliability engineers, supervisors, and executive leadership to go from question to cited, decision-ready insight in minutes",
      "Architected a multi-agent system on Azure AI Foundry with 5 specialized agents (Text-to-SQL, Data Extraction, Non-safety Report AI, Analytics, Graph Analytics), each routing queries to the optimal retrieval strategy based on intent",
      "Engineered a hybrid retrieval pipeline (SQL + Vector + Graph) that fuses structured data queries with semantic document search and relationship-aware entity linking, delivering confidence-scored answers with inline citations",
      "Built a governed Prompt Library with persona-aware one-click starters parameterized by fleet, date, and tail number — capturing expert analytical workflows as reusable, vetted templates",
      "Deployed on Azure with enterprise-grade architecture: Application Gateway with WAF and DDoS protection, multi-zone App Service, Container Apps with private VNet ingress, Cosmos DB for session state, and Azure AI Search for vector indices",
      "Delivered role-aware analytics enabling root-cause investigation, fleet reliability analysis, and executive-ready summaries with exportable charts — all grounded in governed, auditable data sources",
    ],
    techStack: ["Azure AI Foundry", "Multi-agent Systems", "Text-to-SQL", "Azure AI Search", "Cosmos DB", "Graph Analytics", "Python"],
  },
  {
    title: "AI-Powered Compliance Validation Platform",
    subtitle: "Pharma MLR Review",
    role: "Solution Architect & Technical Lead",
    highlights: [
      "Architected and led development of an AI-powered compliance review platform for pharmaceutical marketing materials, automating Medical-Legal-Regulatory (MLR) validation across promotional emails, brochures, and websites against FDA-approved labels",
      "Designed and built a serverless processing engine spanning multiple AWS services (Lambdas, ECS Fargate workers, Step Functions), orchestrating a parallel fan-out pipeline that decomposes documents into structured elements and executes AI-powered compliance checks simultaneously",
      "Engineered a multi-model LLM integration layer (GPT-4o, o4-mini, GPT-5) with a custom token-bucket rate limiter, Redis-backed response caching, async queue processing, and S3 payload offload — handling high-throughput inference across all 19 check types",
      "Built a semantic claim matching system using OpenSearch vector indices for AFD similarity, reference validation, and visual comparison, enabling automated detection of unsupported claims, missing citations, and inconsistent safety language",
      "Developed a full-featured Admin Portal (FastAPI + Next.js) with multi-tenant RBAC (4 roles, granular permissions), a two-tier check configuration system, business rule management, and audit logging across 17 API route modules",
      "Implemented multi-tenant architecture partitioned by RCO, with a shared Lambda layer, multi-auth SSO (MS Entra, Ping Federate, SAML), and a dual-repo deployment strategy porting across CI/CD environments (GitHub Actions to Azure DevOps)",
    ],
    techStack: ["AWS Lambda", "Step Functions", "ECS Fargate", "OpenSearch", "Redis", "FastAPI", "Next.js", "GPT-4o", "S3"],
  },
];

export interface Education {
  degree: string;
  institution: string;
  period: string;
  ongoing?: boolean;
}

export const education: Education[] = [
  {
    degree: "M.Tech, Artificial Intelligence",
    institution: "Birla Institute of Technology and Science (BITS), Pilani",
    period: "Jan 2026 – Jan 2028",
    ongoing: true,
  },
  {
    degree: "B.E, Electronics & Communication Engineering",
    institution: "NMAM Institute of Technology, NITTE",
    period: "May 2014 – May 2018",
  },
];

export interface Certification {
  name: string;
  issuer: string;
  detail?: string;
}

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    detail: "Issued Nov 2022",
  },
  {
    name: "Programming, Data Structures and Algorithms using Python",
    issuer: "NPTEL",
  },
  {
    name: "MTA: Networking Fundamentals",
    issuer: "Microsoft",
    detail: "2017",
  },
];

export interface Award {
  title: string;
  category: string;
  company: string;
  date: string;
}

export const awards: Award[] = [
  {
    title: "Above & Beyond Award",
    category: "Rainmaker Category",
    company: "PwC Acceleration Centers",
    date: "Aug 2024",
  },
  {
    title: "Above & Beyond Award",
    category: "Centre of Excellence Category",
    company: "PwC Acceleration Centers",
    date: "Mar 2024",
  },
  {
    title: "ACE Award",
    category: "The Extra Mile Award Category",
    company: "Accenture",
    date: "May 2021",
  },
  {
    title: "Apex Award",
    category: "The Extra-Miler Award Category",
    company: "Accenture",
    date: "Sep 2020",
  },
];
