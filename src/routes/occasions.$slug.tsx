import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TemplateCard } from "@/components/TemplateCard";
import { pick, useLang } from "@/lib/i18n";
import { occasions, templatesFor } from "@/lib/templates";

export const Route = createFileRoute("/occasions/$slug")({
  head: ({ params }) => {
    const occasion = occasions.find((o) => o.slug === params.slug);
    const name = occasion?.name.en ?? "Invitation";
    return {
      meta: [
        { title: `${name} invitation templates — UtsavInvites` },
        {
          name: "description",
          content: `Browse ${name.toLowerCase()} invitation cards and video templates. Add photos, your own text in Telugu or English, and a song.`,
        },
        { property: "og:title", content: `${name} invitation templates` },
        {
          property: "og:description",
          content: `Ready-to-customise ${name.toLowerCase()} invitations you can share on WhatsApp.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: OccasionPage,
});

function OccasionPage() {
  const { slug } = Route.useParams();
  const { lang, t } = useLang();
  const occasion = occasions.find((o) => o.slug === slug);
  const list = templatesFor(slug);

  return (
    <AppShell title={occasion ? pick(occasion.name, lang) : slug} back="/">
      <main className="px-4 pt-4">
        <p className="text-sm text-muted-foreground">
          {occasion?.count ?? list.length} {t("designs")}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {list.map((tpl, i) => (
            <TemplateCard key={tpl.id} template={tpl} index={i} />
          ))}
        </div>
        {list.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">{t("noResults")}</p>
        ) : null}
      </main>
    </AppShell>
  );
}
