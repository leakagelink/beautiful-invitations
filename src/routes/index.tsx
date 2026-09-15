import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Gift, Heart, Home, PartyPopper, Flower2, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { TemplateCard } from "@/components/TemplateCard";
import { pick, useLang } from "@/lib/i18n";
import { occasions, templates, templatesFor, type Occasion } from "@/lib/templates";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UtsavInvites — Wedding & Birthday Invitation Maker" },
      {
        name: "description",
        content:
          "Make Telugu and English invitation cards and invitation videos in minutes. Add your photo, your text and your song, then share on WhatsApp.",
      },
      { property: "og:title", content: "UtsavInvites — Invitation Maker" },
      {
        property: "og:description",
        content: "Beautiful wedding, birthday and festival invitation cards and videos. Telugu supported.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

const icons: Record<Occasion["icon"], typeof Heart> = {
  heart: Heart,
  gift: Gift,
  balloon: PartyPopper,
  rose: Flower2,
  sparkle: Sparkles,
  home: Home,
};

function Explore() {
  const { lang, t } = useLang();

  return (
    <AppShell>
      <main className="px-4">
        <section className="pt-4">
          <h1 className="font-display text-3xl font-bold leading-tight">
            {t("browseByOccasion")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("browseSub")}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {occasions.map((o) => {
              const Icon = icons[o.icon];
              return (
                <Link
                  key={o.slug}
                  to="/occasions/$slug"
                  params={{ slug: o.slug }}
                  className="relative overflow-hidden rounded-2xl border border-border/70 p-4 transition-transform active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(150deg, ${o.tint}, color-mix(in oklab, ${o.tint} 45%, var(--card)))`,
                  }}
                >
                  <Icon className="size-6 text-primary" />
                  <p className="mt-6 font-semibold leading-tight">{pick(o.name, lang)}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.count} {t("designs")}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <Rail title={t("trending")} items={templates.slice(0, 6)} to="/occasions/$slug" slug="wedding" />
        <Rail
          title={t("videoReady")}
          items={templates.filter((tpl) => tpl.video).slice(2)}
          to="/occasions/$slug"
          slug="festivals"
        />

        <section className="mt-8">
          <h2 className="font-display text-xl font-bold">
            {pick({ en: "Wedding favourites", te: "వివాహ డిజైన్లు" }, lang)}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {templatesFor("wedding").map((tpl) => (
              <TemplateCard key={tpl.id} template={tpl} />
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function Rail({
  title,
  items,
  slug,
}: {
  title: string;
  items: typeof templates;
  to: string;
  slug: string;
}) {
  const { t } = useLang();
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        <Link
          to="/occasions/$slug"
          params={{ slug }}
          className="flex items-center gap-0.5 text-sm font-semibold text-primary"
        >
          {t("viewAll")} <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
        {items.map((tpl) => (
          <TemplateCard key={tpl.id} template={tpl} wide />
        ))}
      </div>
    </section>
  );
}
