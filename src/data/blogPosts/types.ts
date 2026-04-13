export interface BlogSection {
  heading: string;
  content: string;
  code?: string;
  language?: string;
  filename?: string;
  playground?: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  series: string;
  seriesOrder: number;
  description: string;
  tags: string[];
  readTime: string;
  publishDate: string;
}

export interface BlogPost extends BlogPostMeta {
  sections: BlogSection[];
}
