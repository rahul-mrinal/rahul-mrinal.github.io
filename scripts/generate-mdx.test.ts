// @vitest-environment node
import { it } from "vitest";
import fs from "fs";
import path from "path";
import { blogPosts } from "../src/data/blogPosts";
import blogPostContent from "../src/data/blogPostContent";
import type { BlogSection } from "../src/data/blogPosts/types";

const ROOT = process.cwd();
const OUT = path.resolve(ROOT, "src/content/blog");

function yamlEsc(s: string): string {
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function escapeMdxText(text: string): string {
  // < before digits would be parsed as invalid JSX tag by MDX
  return text.replace(/<(?=\d)/g, "&lt;");
}

function sectionToMdx(s: BlogSection): string {
  const content = escapeMdxText(s.content);
  let out = `## ${s.heading}\n\n${content}\n\n`;
  if (s.code) {
    const lang = s.language ?? "python";
    out += `\`\`\`${lang}\n${s.code.trim()}\n\`\`\`\n\n`;
  }
  if (s.playground) {
    // PlaygroundAccordion and PlaygroundComponent are injected via BlogPost.tsx components prop
    out += `<PlaygroundAccordion title="Try it: ${s.heading}">\n  <PlaygroundComponent name="${s.playground}" />\n</PlaygroundAccordion>\n\n`;
  }
  return out;
}

it("generates MDX content files", () => {
  for (const post of blogPosts) {
    const dir = path.resolve(OUT, post.series);
    fs.mkdirSync(dir, { recursive: true });

    const sections = blogPostContent[`${post.series}/${post.slug}`] ?? [];

    const fm = [
      "---",
      `title: ${yamlEsc(post.title)}`,
      `description: ${yamlEsc(post.description)}`,
      `tags:`,
      ...post.tags.map((t) => `  - "${t}"`),
      `readTime: "${post.readTime}"`,
      `publishDate: "${post.publishDate}"`,
      `seriesOrder: ${post.seriesOrder}`,
      `headings:`,
      ...sections.map((s) => `  - ${yamlEsc(s.heading)}`),
      "---",
      "",
    ].join("\n");

    const body = sections.map(sectionToMdx).join("");
    fs.writeFileSync(path.resolve(dir, `${post.slug}.mdx`), fm + body);
  }

  console.log(`Generated ${blogPosts.length} MDX files in src/content/blog/`);
});
