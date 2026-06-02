import { Mail } from "lucide-react";
import { cn } from "../lib/cn.js";

export function BrandMark({ className, size = 18 }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)]",
        className
      )}
    >
      <Mail size={size} />
    </span>
  );
}
