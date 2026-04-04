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
    skills: ["Power BI", "Alteryx", "Postman"],
    color: "#ffa94d",
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
    period: "2014 – 2018",
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
