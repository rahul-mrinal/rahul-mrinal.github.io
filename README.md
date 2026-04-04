# Rahul Mrinal - Portfolio & Technical Blog

Personal portfolio and technical blog built with React, TypeScript, and Tailwind CSS. Features a structured blog series on search engineering (from fundamentals through RAG systems), interactive code playgrounds, and a resume-style home page.

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** for build tooling
- **Tailwind CSS 4** (via `@tailwindcss/vite` plugin)
- **Framer Motion** for animations
- **React Router v7** for client-side routing
- **react-syntax-highlighter** (Prism) for code blocks
- **react-markdown** for safe content rendering
- **Playwright** for E2E testing
- **GitHub Actions** for CI/CD to GitHub Pages

## Project Structure

```
src/
  components/
    blog/        # BlogCard, CodeBlock, SeriesNav, ReadingProgress, ShareButton, TableOfContents
    home/        # Hero, About, Experience, Skills, Education, FeaturedBlog, Contact
    layout/      # Navbar, Footer, ScrollToTop, BackToTop
  data/          # Blog posts (metadata + content), profile, series, category icons
  hooks/         # useScrollReveal
  pages/         # Home, Blog, BlogPost, NotFound
  styles/        # Tailwind globals with theme variables
public/
  topics/        # Interactive HTML playground pages
  sitemap.xml    # SEO sitemap
  robots.txt     # Crawler directives
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
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright tests with UI |

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `main` or `dev`. The workflow runs E2E tests, builds, and deploys the `dist/` directory.

## Blog Content

The blog features 36 posts across 8 series in the Search Engineering category:

1. **Search Fundamentals** - BM25, vector search, hybrid search, evaluation metrics
2. **Indexing** - Inverted indexes, chunking, metadata, CRUD operations
3. **Query Processing** - Preprocessing, retrieval pipelines, filtering, spell correction
4. **Ranking & Relevance** - Multi-stage ranking, hybrid scoring, tuning, signals
5. **System Design** - Capacity estimation, sharding, caching, architecture walkthroughs
6. **Data Pipelines** - Batch vs real-time, ETL, index updates, data quality
7. **RAG Systems** - Retrieval-augmented generation, chunking, evaluation, advanced patterns
8. **Advanced Search** - Learning to rank, click models, personalization, autocomplete, diversity
