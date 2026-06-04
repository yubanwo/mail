import { Inbox } from "lucide-react";
import { cn } from "../../shared/lib/cn.js";
import { Panel } from "../../shared/ui/Panel.jsx";
import { formatDate } from "../../shared/utils/formatDate.js";

export function MessageList({ className, emails, loading, selectedEmail, onOpenEmail }) {
  return (
    <Panel className={cn("h-full min-h-0 overflow-auto", className)} aria-label="邮件列表">
      {emails.map((email) => (
        <button
          className={cn(
            "grid min-h-[86px] w-full gap-1 border-0 border-b border-slate-100 bg-transparent p-4 text-left transition max-[520px]:min-h-[78px] max-[520px]:p-3.5",
            selectedEmail?.id === email.id
              ? "bg-slate-50 shadow-[inset_3px_0_0_#2563eb]"
              : "hover:bg-slate-50"
          )}
          key={email.id}
          type="button"
          onClick={() => onOpenEmail(email)}
        >
          <span className="min-w-0 truncate font-bold text-slate-900">{email.subject || "(无主题)"}</span>
          <span className="min-w-0 truncate text-[13px] text-slate-500">{email.mail_from || "unknown"}</span>
          <span className="min-w-0 truncate text-[13px] text-slate-500">{formatDate(email.created_at)}</span>
        </button>
      ))}

      {!emails.length && !loading ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-2.5 font-bold text-slate-500">
          <Inbox size={26} />
          <span>暂无邮件</span>
        </div>
      ) : null}
    </Panel>
  );
}
