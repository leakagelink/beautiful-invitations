import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TemplateCard } from "@/components/TemplateCard";
import { useLang } from "@/lib/i18n";
import { occasions, templates } from "@/lib/templates";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search invitation designs — UtsavInvites" },
      {
        name: "description",
        content: "Search invitation templates by occasion, style or language, in Telugu or English.",
      },
      { property: "og:title", content: "Search invitation designs" },
      { property: "og:description", content: "Find the invitation design that fits your event." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { t } = useLang();
  const [q, setQ] = useState("");

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return templates;
    return templates.filter((tpl) =>
      [tpl.name.en, tpl.name.te, tpl.occasion, ...tpl.tags].join(" ").toLowerCase().includes(term),
    );
  }, [q]);

  return (
    <AppShell title={t("search")} back="/">
      <main className="px-4 pt-4">
        <div className="flex items-center gap-2 rounded-full border border-input bg-card px-4">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
          {occasions.map((o) => (
            <button
              key={o.slug}
              onClick={() => setQ(o.slug.replace("-", " "))}
              className="btn-ghost-line shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
            >
              {o.name.en}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {results.map((tpl) => (
            <TemplateCard key={tpl.id} template={tpl} />
          ))}
        </div>
        {results.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">{t("noResults")}</p>
        ) : null}
      </main>
    </AppShell>
  );
}
