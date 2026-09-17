import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chrome, Lock, Mail, User as UserIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — My Invitation" },
      { property: "og:title", content: "Sign in — My Invitation" },
      {
        property: "og:description",
        content: "Sign in or create your My Invitation account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() } },
        });
        if (err) throw err;
        // Email auto-confirm is on: the session is active right away.
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
      }
      navigate({ to: "/profile" });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) setError(result.error.message ?? String(result.error));
  }

  return (
    <AppShell title={mode === "up" ? t("signUp") : t("signIn")} back="/profile">
      <main className="space-y-4 px-4 pt-4">
        <p className="text-sm text-muted-foreground">{t("signInSub")}</p>

        <button
          type="button"
          onClick={google}
          className="btn-ghost-line press flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold"
        >
          <Chrome className="size-4" /> {t("continueGoogle")}
        </button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> {t("or")}{" "}
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="surface-card space-y-3 rounded-2xl p-5">
          {mode === "up" && (
            <label className="block">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <UserIcon className="size-3.5" /> {t("yourName")}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={40}
                autoComplete="name"
                className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Mail className="size-3.5" /> {t("email")}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Lock className="size-3.5" /> {t("password")}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              className="h-12 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-gold press h-12 w-full rounded-xl text-sm font-bold disabled:opacity-60"
          >
            {busy ? "…" : mode === "up" ? t("createAccount") : t("signIn")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "up" ? "in" : "up");
            setError(null);
          }}
          className="w-full py-2 text-center text-sm font-semibold text-primary"
        >
          {mode === "up" ? t("haveAccount") : t("noAccount")}
        </button>
      </main>
    </AppShell>
  );
}
