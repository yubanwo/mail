import { cn } from "../lib/cn.js";

export function TextInput({ className, ...props }) {
  return (
    <input
      className={cn(
        "min-h-10 w-full rounded-full border border-slate-200 bg-slate-50 px-3.5 outline-none transition focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,23,42,0.08)]",
        className
      )}
      {...props}
    />
  );
}
