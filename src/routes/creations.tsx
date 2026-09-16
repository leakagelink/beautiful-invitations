import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { deleteCreation, listCreations, type Creation } from "@/lib/creations";
import { pick, useLang } from "@/lib/i18n";
import { templateById } from "@/lib/templates";

export const Route = createFileRoute("/creations")({
  head: () => ({
    meta: [
      { title: "My invitations — UtsavInvites" },
      {
        name: "description",
        content: "Every invitation you have made, saved on this device and ready to edit or share again.",
      },
      { property: "og:title", content: "My invitations" },
      { property: "og:description", content: "Your saved invitation cards and videos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Creations,
});

function Creations() {
  const { lang, t } = useLang();
  const [items, setItems] = useState<Creation[]>([]);

  useEffect(() => setItems(listCreations()), []);

  return (
    <AppShell title={t("creations")} back="/">
      <main className="px-4 pt-4">
        {items.length === 0 ? (
          <div className="surface-card mt-10 rounded-3xl p-8 text-center">
            <h2 className="font-display text-2xl font-bold">{t("noCreations")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("noCreationsSub")}</p>
            <Link to="/" className="btn-gold press mt-6 inline-flex h-12 items-center rounded-full px-6">
              {t("startNow")}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((c) => {
              const tpl = templateById(c.templateId);
              return (
                <li key={c.id} className="surface-card flex items-center gap-3 rounded-2xl p-3">
                  {tpl ? (
                    <img
                      src={c.photo ?? tpl.bg}
                      alt=""
                      loading="lazy"
                      className="size-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.fields.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {tpl ? pick(tpl.name, lang) : c.templateId}
                    </p>
                  </div>
                  <Link
                    to="/editor/$id"
                    params={{ id: c.templateId }}
                    search={{ c: c.id }}
                    className="btn-ghost-line press rounded-full px-4 py-2 text-sm font-semibold"
                  >
                    {t("edit")}
                  </Link>
                  <button
                    onClick={() => {
                      deleteCreation(c.id);
                      setItems(listCreations());
                    }}
                    aria-label={t("delete")}
                    className="btn-ghost-line grid size-9 place-items-center rounded-full text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </AppShell>
  );
}
