import { cn } from "../lib/cn.js";

export function Panel({ className, ...props }) {
  return (
    <section
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]",
        className
      )}
      {...props}
    />
  );
}
