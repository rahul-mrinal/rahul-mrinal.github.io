# Rahul Mrinal - Portfolio & Technical Blog

Personal portfolio and technical blog built with React, TypeScript, and Tailwind CSS. Features deep-dive blog series on search engineering and agentic AI (multi-agent systems), inline interactive playground widgets (Chart.js, simulations, quizzes), and a resume-style home page.

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** for build tooling
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin)
- **Framer Motion** for animations
- **React Router v7** for client-side routing
- **react-syntax-highlighter** (Prism) for code blocks
- **react-markdown** for safe content rendering
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **react-icons** for icons
- **Husky** for git hooks
- **GitHub Actions** for CI/CD to GitHub Pages

## Project Structure

```
src/
  components/
    blog/        # BlogCard, CodeBlock, SeriesNav, ReadingProgress, ShareButton, TableOfContents
    home/        # Hero, About, Experience, Skills, Education, FeaturedBlog, Contact
    layout/      # Navbar, Footer, ScrollToTop, BackToTop
    playgrounds/ # Inline interactive widgets (accordion, registry, Chart.js theme, per-category components)
  data/
    blogPosts/   # Post metadata split by category (types, search-engineering, agentic-ai, barrel index)
    blogPostContent/  # Post body content split by category (search-engineering, agentic-ai, barrel index)
    series.ts    # Categories and series definitions
    profile.ts   # Resume/profile data
    categoryIcons.tsx  # Category icon mappings
  hooks/         # useScrollReveal, useActiveSection
  pages/         # Home, Blog, BlogPost, NotFound
  styles/        # Tailwind globals with theme variables
  test/          # Vitest setup and data integrity tests
  types/         # Custom type declarations
public/
  sitemap.xml    # SEO sitemap
  robots.txt     # Crawler directives
  feed.xml       # RSS feed
  404.html       # GitHub Pages SPA fallback
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright tests with UI |

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `main` or `dev`. The workflow runs E2E tests, builds, and deploys the `dist/` directory.

## Blog Content

The blog features **52 posts** across **12 series** in 2 active categories, with **56 inline interactive widgets** (expandable accordions with sliders, charts, quizzes, and simulations):

### Search Engineering (36 posts, 8 series)

1. **Search Fundamentals** - BM25, vector search, hybrid search, evaluation metrics
2. **Indexing** - Inverted indexes, chunking, metadata, CRUD operations
3. **Query Processing** - Preprocessing, retrieval pipelines, filtering, spell correction
4. **Ranking & Relevance** - Multi-stage ranking, hybrid scoring, tuning, signals
5. **System Design** - Capacity estimation, sharding, caching, architecture walkthroughs
6. **Data Pipelines** - Batch vs real-time, ETL, index updates, data quality
7. **RAG Systems** - Retrieval-augmented generation, chunking, evaluation, advanced patterns
8. **Advanced Search** - Learning to rank, click models, personalization, autocomplete, diversity

### Agentic AI (16 posts, 4 series)

9. **Multi-Agent Foundations** - What is a MAS, why multi-agent, classification framework
10. **Architecture Patterns** - Sequential, selector, handoff, hierarchical, debate, ensemble, graph, blackboard, market, federated
11. **Agent Communication & Memory** - Communication patterns, memory systems, comparison matrix, decision framework
12. **Building Multi-Agent Systems** - AutoGen/LangGraph/CrewAI/Swarm, real-world applications, design principles, capstone
