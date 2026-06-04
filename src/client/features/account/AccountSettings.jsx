import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../shared/ui/Button.jsx";
import { TextInput } from "../../shared/ui/TextInput.jsx";

export function AccountSettings({ open, user, saving, onClose, onSave }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!open) return;
    setUsername(user?.username || "");
    setPassword("");
  }, [open, user]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/20 p-4 backdrop-blur-sm max-[520px]:items-end max-[520px]:p-3">
      <form
        className="grid w-[min(440px,100%)] gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.18)] max-[520px]:p-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave({ username, password });
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-xl font-black text-slate-900">账号设置</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">修改管理员用户名或密码</p>
          </div>
          <Button className="h-9 w-9" variant="icon" type="button" onClick={onClose} title="关闭">
            <X size={16} />
          </Button>
        </div>

        <label className="grid gap-1.5 font-bold text-slate-700">
          <span>用户名</span>
          <TextInput value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>

        <label className="grid gap-1.5 font-bold text-slate-700">
          <span>新密码</span>
          <TextInput
            autoComplete="new-password"
            minLength={8}
            placeholder="留空则不修改"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button className="px-4" variant="ghost" type="button" onClick={onClose}>
            取消
          </Button>
          <Button className="px-4" disabled={saving} type="submit">
            <Save size={16} />
            <span>保存</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
