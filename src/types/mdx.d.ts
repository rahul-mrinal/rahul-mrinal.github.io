import type { ComponentType, ReactNode } from "react";

interface MDXProps {
  components?: Record<string, ComponentType<Record<string, unknown>>>;
  children?: ReactNode;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  tags: string[];
  readTime: string;
  publishDate: string;
  seriesOrder: number;
  headings: string[];
}

declare module "*.mdx" {
  const MDXContent: ComponentType<MDXProps>;
  export const frontmatter: BlogFrontmatter;
  export default MDXContent;
}
