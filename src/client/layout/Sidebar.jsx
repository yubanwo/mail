import { Inbox, LogOut, Settings, ShieldCheck } from "lucide-react";
import { BrandMark } from "../shared/ui/BrandMark.jsx";
import { Button } from "../shared/ui/Button.jsx";

export function Sidebar({ user, onLogout, onOpenSettings }) {
  return (
    <aside className="flex h-screen flex-col gap-5 border-r border-slate-200/70 bg-white px-5 py-6 text-slate-900 shadow-[8px_0_32px_rgba(15,23,42,0.04)] max-[860px]:h-auto max-[860px]:min-h-0 max-[860px]:flex-row max-[860px]:items-center max-[860px]:px-4 max-[860px]:py-3.5 max-[520px]:gap-2.5">
      <div className="flex items-center gap-2.5 font-bold">
        <BrandMark />
        <span className="max-[520px]:hidden">
          <strong className="block text-[15px] font-black leading-none">Mail Console</strong>
          <small className="mt-1 block text-[11px] font-extrabold leading-none text-slate-400">Worker Inbox</small>
        </span>
      </div>

      <nav className="mt-3 grid gap-2 max-[860px]:hidden" aria-label="主导航">
        <span className="relative flex min-h-11 items-center gap-2.5 rounded-lg bg-slate-900 px-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] before:absolute before:left-0 before:h-5 before:w-[3px] before:rounded-r-full before:bg-blue-600">
          <Inbox size={17} />
          <span>邮件</span>
        </span>
      </nav>

      <div className="mt-auto flex min-w-0 items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] max-[860px]:ml-auto max-[860px]:mt-0 max-[860px]:max-w-[38%] max-[520px]:max-w-none">
        <ShieldCheck size={18} />
        <span className="min-w-0">
          <strong className="block truncate text-[15px] font-black leading-none">{user?.username || "authorized"}</strong>
          <small className="mt-1 block text-[11px] font-extrabold leading-none text-slate-400">已授权</small>
        </span>
      </div>

      <Button
        className="w-full px-3 max-[860px]:w-auto max-[520px]:px-2"
        variant="ghost"
        type="button"
        onClick={onOpenSettings}
      >
        <Settings size={16} />
        <span className="max-[520px]:hidden">设置</span>
      </Button>

      <Button
        className="w-full px-3 max-[860px]:w-auto max-[520px]:px-2"
        variant="ghost"
        type="button"
        onClick={onLogout}
      >
        <LogOut size={16} />
        <span className="max-[520px]:hidden">退出</span>
      </Button>
    </aside>
  );
}
