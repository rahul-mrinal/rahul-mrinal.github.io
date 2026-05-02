import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Experience from "../components/home/Experience";
import Projects from "../components/home/Projects";
import Skills from "../components/home/Skills";
import Education from "../components/home/Education";
import FeaturedBlog from "../components/home/FeaturedBlog";
import Contact from "../components/home/Contact";
import { usePageMeta } from "../hooks/usePageMeta";

const HOME_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rahul Mrinal",
    "url": "https://rahul-mrinal.github.io",
    "sameAs": [
      "https://github.com/rahul-mrinal",
      "https://linkedin.com/in/rahulmrinal"
    ],
    "jobTitle": "Generative AI Lead & Engineering Manager",
    "description": "AI engineer and engineering manager specializing in search engineering, multi-agent systems, agentic AI, and distributed architecture.",
    "knowsAbout": [
      "Generative AI", "Search Engineering", "Multi-Agent Systems",
      "Agentic AI", "RAG Systems", "LLM", "Python", "Distributed Systems",
      "Engineering Management", "AWS", "Azure"
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Rahul Mrinal",
    "url": "https://rahul-mrinal.github.io",
    "description": "Portfolio and technical blog of Rahul Mrinal — AI engineer writing about search engineering, multi-agent AI, and distributed systems.",
    "author": {
      "@type": "Person",
      "name": "Rahul Mrinal"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rahul-mrinal.github.io/blog?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Rahul Mrinal — Portfolio",
    "url": "https://rahul-mrinal.github.io",
    "mainEntity": {
      "@type": "Person",
      "name": "Rahul Mrinal",
      "jobTitle": "Generative AI Lead & Engineering Manager"
    }
  }
];

export default function Home() {
  usePageMeta({
    title: "Rahul Mrinal — Portfolio & Technical Blog | GitHub | AI Engineer",
    description:
      "Portfolio of Rahul Mrinal, AI engineer and engineering manager. Technical blog on GitHub with deep-dive posts on search engineering, multi-agent AI systems, agentic AI, RAG, and distributed architecture.",
    keywords:
      "Rahul Mrinal, rahul mrinal, portfolio, GitHub, AI engineer, generative AI, search engineering, agentic AI, multi-agent systems, blog, engineering manager, LLM, RAG, distributed systems, rahul mrinal blog, rahul mrinal github, rahul mrinal AI",
    canonical: "https://rahul-mrinal.github.io/",
    ogType: "website",
    jsonLd: HOME_JSON_LD,
  });

  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <FeaturedBlog />
      <Contact />
    </main>
  );
}
