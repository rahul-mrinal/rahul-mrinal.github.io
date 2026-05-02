/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import path from 'path'

export default defineConfig({
  plugins: [
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'vendor-charts';
          if (id.includes('react-syntax-highlighter') || id.includes('react-markdown') || id.includes('remark-gfm') || id.includes('hast') || id.includes('unist') || id.includes('mdast') || id.includes('micromark') || id.includes('lowlight') || id.includes('highlight.js')) return 'vendor-markdown';
          if (id.includes('react-icons')) return 'vendor-icons';
          if (id.includes('react-router') || id.includes('react-router-dom') || id.includes('@remix-run')) return 'vendor-router';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('scheduler')) return 'vendor-react';
          if (id.includes('node_modules')) return 'vendor-misc';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
