import { RefreshCw, Search } from "lucide-react";
import { Button } from "../../shared/ui/Button.jsx";

export function MailToolbar({ emailCount, filterTo, loading, onFilterChange, onRefresh }) {
  return (
    <header className="relative mb-4 flex items-center justify-between gap-4 overflow-hidden rounded-lg border border-slate-200 bg-white bg-[linear-gradient(to_right,rgba(226,232,240,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.45)_1px,transparent_1px)] bg-[size:32px_32px] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:p-5">
      <div className="relative z-10">
        <span className="mb-2.5 inline-flex min-h-5 items-center rounded-full border border-blue-600/15 bg-blue-50/80 px-2.5 text-[11px] font-black text-blue-600">
          MAIL WORKSPACE
        </span>
        <h1 className="m-0 text-3xl font-black leading-tight text-slate-900">邮件</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500">{emailCount} 封邮件，按收件人筛选和查看原始内容</p>
      </div>

      <form
        className="relative z-10 flex min-w-[min(480px,100%)] items-center gap-2 rounded-full border border-slate-200 bg-slate-50/90 py-1.5 pl-3 pr-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] focus-within:border-slate-400 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(15,23,42,0.08)] max-[860px]:min-w-0"
        onSubmit={(event) => {
          event.preventDefault();
          onRefresh();
        }}
      >
        <Search size={16} className="ml-1.5 text-slate-500" />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
          value={filterTo}
          onChange={(event) => onFilterChange(event.target.value)}
          placeholder="收件人"
          type="email"
        />
        <Button variant="icon" type="submit" title="搜索">
          <Search size={16} />
        </Button>
        <Button variant="icon" type="button" onClick={onRefresh} title="刷新">
          <RefreshCw size={16} className={loading ? "spin" : ""} />
        </Button>
      </form>
    </header>
  );
}
