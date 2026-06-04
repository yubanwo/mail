import { useState } from "react";
import { KeyRound, RefreshCw, ShieldCheck, UserPlus } from "lucide-react";
import { readJsonResponse } from "../../shared/api/response.js";
import { useToast } from "../../shared/hooks/useToast.js";
import { cn } from "../../shared/lib/cn.js";
import { BrandMark } from "../../shared/ui/BrandMark.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { TextInput } from "../../shared/ui/TextInput.jsx";
import { ToastHost } from "../../shared/ui/ToastHost.jsx";

export function AuthScreen({ setTokens }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { clearToast, showToast, toast } = useToast();

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(mode === "login" ? "/auth/login" : "/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || "请求失败");
      }

      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
    } catch (requestError) {
      showToast(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-[#f4f7f9] bg-[linear-gradient(to_right,rgba(226,232,240,0.45)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.38)_1px,transparent_1px)] bg-[size:32px_32px] p-5 max-[520px]:p-3.5">
      <form className="grid w-[min(420px,100%)] gap-4 rounded-lg border border-slate-200 bg-white p-8 shadow-[0_12px_44px_rgba(15,23,42,0.08)] max-[520px]:p-5" onSubmit={submit}>
        <div className="flex items-center gap-2.5 font-bold">
          <BrandMark size={20} />
          <div>
            <h1 className="m-0 text-2xl font-black leading-none text-slate-900">Mail Console</h1>
            <p className="mt-1 text-xs font-extrabold text-slate-400">Cloudflare Worker Inbox</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 rounded-full bg-slate-100 p-1">
          <button
            className={cn(
              "inline-flex min-h-9 items-center justify-center gap-2 rounded-full text-sm font-bold",
              mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            )}
            type="button"
            onClick={() => setMode("login")}
          >
            <KeyRound size={15} />
            <span>登录</span>
          </button>
          <button
            className={cn(
              "inline-flex min-h-9 items-center justify-center gap-2 rounded-full text-sm font-bold",
              mode === "register" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
            )}
            type="button"
            onClick={() => setMode("register")}
          >
            <UserPlus size={15} />
            <span>注册</span>
          </button>
        </div>

        <label className="grid gap-1.5 font-bold text-slate-700">
          <span>用户名</span>
          <TextInput
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label className="grid gap-1.5 font-bold text-slate-700">
          <span>密码</span>
          <TextInput
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            minLength={8}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <Button className="min-h-11 w-full" disabled={loading} type="submit">
          {loading ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
          <span>{mode === "login" ? "进入" : "创建"}</span>
        </Button>
      </form>
      <ToastHost toast={toast} onClose={clearToast} />
    </main>
  );
}
