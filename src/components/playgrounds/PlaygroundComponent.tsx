import { Suspense } from "react";
import registry from "./registry";

interface Props {
  name: string;
}

export default function PlaygroundComponent({ name }: Props) {
  const Component = registry[name];

  if (!Component) {
    return (
      <div className="text-text-secondary text-sm italic">
        Playground "{name}" not found.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2 text-text-secondary text-sm py-4">
          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          Loading playground...
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
