declare module "react-syntax-highlighter" {
  export const Prism: React.ComponentType<Record<string, unknown>>;
  export const Light: React.ComponentType<Record<string, unknown>>;
  export default React.ComponentType<Record<string, unknown>>;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const vscDarkPlus: Record<string, React.CSSProperties>;
  export const oneDark: Record<string, React.CSSProperties>;
  export const materialDark: Record<string, React.CSSProperties>;
  export const dracula: Record<string, React.CSSProperties>;
  const styles: Record<string, Record<string, React.CSSProperties>>;
  export default styles;
}
