import type { BlogSection } from "../blogPosts/types";
import { searchEngineeringContent } from "./search-engineering";
import { agenticAiContent } from "./agentic-ai";

const blogPostContent: Record<string, BlogSection[]> = {
  ...searchEngineeringContent,
  ...agenticAiContent,
};

export function getPostSections(
  series: string,
  slug: string
): BlogSection[] {
  return blogPostContent[`${series}/${slug}`] ?? [];
}

export default blogPostContent;
