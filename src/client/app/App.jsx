import { useCallback, useEffect, useMemo, useState } from "react";
import { AccountSettings } from "../features/account/AccountSettings.jsx";
import { AuthScreen } from "../features/auth/AuthScreen.jsx";
import { MailToolbar } from "../features/mail/MailToolbar.jsx";
import { MessageDetail } from "../features/mail/MessageDetail.jsx";
import { MessageList } from "../features/mail/MessageList.jsx";
import { Sidebar } from "../layout/Sidebar.jsx";
import { createApiClient } from "../shared/api/client.js";
import { useStoredTokens } from "../shared/hooks/useStoredTokens.js";
import { useToast } from "../shared/hooks/useToast.js";
import { ToastHost } from "../shared/ui/ToastHost.jsx";

export function App() {
  const [tokens, setTokens] = useStoredTokens();
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filterTo, setFilterTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const { clearToast, showToast, toast } = useToast();

  const api = useMemo(() => createApiClient(tokens, setTokens), [tokens, setTokens]);
  const isAuthed = Boolean(tokens?.access_token);
  const hasSelectedEmail = Boolean(selectedEmail);

  const loadEmails = useCallback(async ({ silent = false } = {}) => {
    if (!isAuthed) return;

    if (!silent) {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({ limit: "50" });
      if (filterTo.trim()) params.set("to", filterTo.trim());

      const data = await api.get(`/emails?${params.toString()}`);
      setEmails(data.emails || []);
      if (!silent) {
        setSelectedEmail(null);
      }
    } catch (error) {
      showToast(error.message);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [api, filterTo, isAuthed, showToast]);

  useEffect(() => {
    async function loadMe() {
      if (!isAuthed) return;

      try {
        const data = await api.get("/me");
        setUser(data.user);
        await loadEmails();
      } catch {
        setTokens(null);
      }
    }

    loadMe();
  }, [api, isAuthed, loadEmails, setTokens]);

  useEffect(() => {
    if (!isAuthed) return undefined;

    const timer = setInterval(() => {
      loadEmails({ silent: true });
    }, 15000);

    return () => clearInterval(timer);
  }, [isAuthed, loadEmails]);

  async function saveSettings(values) {
    setSavingSettings(true);

    try {
      const data = await api.patch("/me", {
        username: values.username,
        password: values.password || undefined,
      });
      setUser(data.user);
      setSettingsOpen(false);
      showToast("账号信息已更新。", "success");
    } catch (error) {
      showToast(error.message);
    } finally {
      setSavingSettings(false);
    }
  }

  async function openEmail(email) {
    setLoading(true);

    try {
      const data = await api.get(`/emails/${email.id}`);
      setSelectedEmail(data.email);
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      if (tokens?.refresh_token) {
        await api.post("/auth/logout", { refresh_token: tokens.refresh_token });
      }
    } finally {
      setTokens(null);
      setUser(null);
      setEmails([]);
      setSelectedEmail(null);
    }
  }

  if (!isAuthed) {
    return <AuthScreen setTokens={setTokens} />;
  }

  return (
    <main className="grid h-dvh grid-cols-[260px_minmax(0,1fr)] overflow-hidden bg-[#f4f7f9] bg-[linear-gradient(to_right,rgba(226,232,240,0.42)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.34)_1px,transparent_1px)] bg-[size:32px_32px] max-[860px]:grid-cols-1 max-[860px]:grid-rows-[auto_minmax(0,1fr)]">
      <Sidebar user={user} onLogout={logout} onOpenSettings={() => setSettingsOpen(true)} />

      <section className="flex min-h-0 min-w-0 flex-col overflow-hidden p-7 max-[520px]:p-3.5">
        <MailToolbar
          emailCount={emails.length}
          filterTo={filterTo}
          loading={loading}
          onFilterChange={setFilterTo}
          onRefresh={loadEmails}
        />

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(280px,390px)_minmax(0,1fr)] gap-4 max-[860px]:grid-cols-1 max-[860px]:grid-rows-[minmax(180px,40%)_minmax(0,1fr)] max-[640px]:block max-[520px]:gap-3">
          <MessageList
            className={hasSelectedEmail ? "max-[640px]:hidden" : ""}
            emails={emails}
            loading={loading}
            selectedEmail={selectedEmail}
            onOpenEmail={openEmail}
          />
          <MessageDetail
            className={hasSelectedEmail ? "" : "max-[640px]:hidden"}
            selectedEmail={selectedEmail}
            onBack={() => setSelectedEmail(null)}
          />
        </div>
      </section>

      <AccountSettings
        open={settingsOpen}
        saving={savingSettings}
        user={user}
        onClose={() => setSettingsOpen(false)}
        onSave={saveSettings}
      />
      <ToastHost toast={toast} onClose={clearToast} />
    </main>
  );
}
