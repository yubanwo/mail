import { CheckCircle, X, XCircle } from "lucide-react";
import { useEffect } from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./Button.jsx";

export function ToastHost({ onClose, toast }) {
  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(onClose, 3600);
    return () => clearTimeout(timer);
  }, [onClose, toast]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const Icon = isSuccess ? CheckCircle : XCircle;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-[60] max-w-[min(360px,calc(100vw-40px))]">
      <div
        className={cn(
          "pointer-events-auto flex items-start gap-3 rounded-lg border bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.18)]",
          isSuccess ? "border-emerald-200" : "border-red-200"
        )}
      >
        <Icon className={isSuccess ? "text-emerald-600" : "text-red-600"} size={18} />
        <p className="m-0 flex-1 text-sm font-semibold text-slate-700">{toast.message}</p>
        <Button className="h-7 w-7 rounded-md" variant="icon" type="button" onClick={onClose} title="关闭">
          <X size={14} />
        </Button>
      </div>
    </div>
  );
}
