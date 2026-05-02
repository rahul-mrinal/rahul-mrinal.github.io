interface SyntaxHighlighterProps {
  language?: string;
  style?: Record<string, React.CSSProperties>;
  children?: string;
  customStyle?: React.CSSProperties;
  showLineNumbers?: boolean;
  lineNumberStyle?: React.CSSProperties;
  PreTag?: string | React.ComponentType;
  [key: string]: unknown;
}

type PrismLightHighlighter = React.FC<SyntaxHighlighterProps> & {
  registerLanguage(name: string, language: unknown): void;
};

declare module "react-syntax-highlighter" {
  export const Prism: React.ComponentType<SyntaxHighlighterProps>;
  export const Light: React.ComponentType<SyntaxHighlighterProps>;
  export default React.ComponentType<SyntaxHighlighterProps>;
}

declare module "react-syntax-highlighter/dist/esm/prism-light" {
  const SyntaxHighlighter: PrismLightHighlighter;
  export default SyntaxHighlighter;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const vscDarkPlus: Record<string, React.CSSProperties>;
  export const oneDark: Record<string, React.CSSProperties>;
  export const materialDark: Record<string, React.CSSProperties>;
  export const dracula: Record<string, React.CSSProperties>;
  const styles: Record<string, Record<string, React.CSSProperties>>;
  export default styles;
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/python" {
  const lang: unknown; export default lang;
}
declare module "react-syntax-highlighter/dist/esm/languages/prism/javascript" {
  const lang: unknown; export default lang;
}
declare module "react-syntax-highlighter/dist/esm/languages/prism/typescript" {
  const lang: unknown; export default lang;
}
declare module "react-syntax-highlighter/dist/esm/languages/prism/json" {
  const lang: unknown; export default lang;
}
declare module "react-syntax-highlighter/dist/esm/languages/prism/bash" {
  const lang: unknown; export default lang;
}
declare module "react-syntax-highlighter/dist/esm/languages/prism/sql" {
  const lang: unknown; export default lang;
}
declare module "react-syntax-highlighter/dist/esm/languages/prism/yaml" {
  const lang: unknown; export default lang;
}
