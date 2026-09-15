import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Layers, Plus, Search, User } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-xs font-semibold">
      {(["en", "te"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1.5 transition-colors ${
            lang === l ? "btn-gold" : "text-muted-foreground"
          }`}
        >
          {l === "en" ? "English" : "తెలుగు"}
        </button>
      ))}
    </div>
  );
}

export function TopBar({ title, back }: { title?: string | undefined; back?: string | undefined }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur-xl">
      {back ? (
        <Link
          to={back}
          className="btn-ghost-line grid size-9 shrink-0 place-items-center rounded-full text-lg"
          aria-label="Back"
        >
          ←
        </Link>
      ) : null}
      {title ? (
        <h2 className="truncate text-lg font-semibold">{title}</h2>
      ) : (
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          <span className="text-gilded">Utsav</span>
          <span className="text-foreground">Invites</span>
        </Link>
      )}
      <div className="ml-auto">
        <LangToggle />
      </div>
    </header>
  );
}

const navItems = [
  { to: "/", icon: Compass, labelKey: "explore" as const },
  { to: "/creations", icon: Layers, labelKey: "creations" as const },
  { to: "/search", icon: Search, labelKey: "search" as const },
  { to: "/profile", icon: User, labelKey: "profile" as const },
];

export function BottomNav() {
  const { t } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-end justify-between px-6 pb-3 pt-2">
        {navItems.slice(0, 2).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            active={pathname === item.to}
            label={t(item.labelKey)}
          />
        ))}
        <Link
          to="/search"
          className="btn-gold -mt-6 grid size-14 place-items-center rounded-full"
          aria-label={t("create")}
        >
          <Plus className="size-7" strokeWidth={2.5} />
        </Link>
        {navItems.slice(2).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            active={pathname === item.to}
            label={t(item.labelKey)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavLink({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: typeof Compass;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex w-16 flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="size-5" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function AppShell({
  children,
  title,
  back,
}: {
  children: ReactNode;
  title?: string | undefined;
  back?: string | undefined;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-lg pb-28">
      <TopBar title={title} back={back} />
      {children}
      <BottomNav />
    </div>
  );
}
