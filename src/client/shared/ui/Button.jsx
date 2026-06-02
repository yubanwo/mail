import { cn } from "../lib/cn.js";

const variants = {
  primary: "bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.14)] hover:bg-slate-800 disabled:cursor-wait disabled:opacity-70",
  ghost: "border border-slate-200 bg-slate-50 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
  icon: "h-9 w-9 shrink-0 border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:shadow-[0_6px_18px_rgba(15,23,42,0.07)]",
  segmented: "text-slate-600",
};

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-2 rounded-lg font-bold transition",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
