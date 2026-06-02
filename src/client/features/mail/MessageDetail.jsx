import { Mail } from "lucide-react";
import { Panel } from "../../shared/ui/Panel.jsx";
import { formatDate } from "../../shared/utils/formatDate.js";

export function MessageDetail({ selectedEmail }) {
  return (
    <Panel className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden" aria-label="邮件详情">
      {selectedEmail ? (
        <>
          <div className="border-b border-slate-100 p-5">
            <h2 className="mb-3.5 text-xl font-bold leading-tight text-slate-900 break-words">{selectedEmail.subject || "(无主题)"}</h2>
            <dl className="m-0 grid gap-2 text-sm">
              <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-2">
                <dt className="text-slate-500">From</dt>
                <dd className="m-0 break-words">{selectedEmail.mail_from || "-"}</dd>
              </div>
              <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-2">
                <dt className="text-slate-500">To</dt>
                <dd className="m-0 break-words">{selectedEmail.mail_to || "-"}</dd>
              </div>
              <div className="grid grid-cols-[58px_minmax(0,1fr)] gap-2">
                <dt className="text-slate-500">Date</dt>
                <dd className="m-0 break-words">{formatDate(selectedEmail.created_at)}</dd>
              </div>
            </dl>
          </div>
          <EmailBody email={selectedEmail} />
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2.5 font-bold text-slate-500">
          <Mail size={28} />
          <span>选择一封邮件</span>
        </div>
      )}
    </Panel>
  );
}

function EmailBody({ email }) {
  if (email.content_type === "text/html") {
    return (
      <iframe
        className="min-h-0 flex-1 border-0 bg-white"
        sandbox=""
        srcDoc={email.content}
        title="邮件正文"
      />
    );
  }

  return (
    <pre className="m-0 min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words bg-slate-50 p-5 text-[13px] text-slate-900">
      {email.content}
    </pre>
  );
}
