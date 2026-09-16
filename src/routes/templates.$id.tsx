import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Image as ImageIcon, Music2, Video } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { InvitePreview } from "@/components/InvitePreview";
import { TemplateCard } from "@/components/TemplateCard";
import { pick, useLang } from "@/lib/i18n";
import { templateById, templatesFor } from "@/lib/templates";

export const Route = createFileRoute("/templates/$id")({
  head: ({ params }) => {
    const tpl = templateById(params.id);
    const name = tpl ? tpl.name.en : "Invitation template";
    return {
      meta: [
        { title: `${name} — My Invitation` },
        {
          name: "description",
          content: `Customise the ${name} invitation: your names, date, venue, photo and music. Export as a card or a video.`,
        },
        { property: "og:title", content: name },
        { property: "og:description", content: `Customise and share the ${name} invitation.` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ params }) => {
    if (!templateById(params.id)) throw notFound();
    return null;
  },
  component: TemplateDetail,
});

function TemplateDetail() {
  const { id } = Route.useParams();
  const { lang, t } = useLang();
  const template = templateById(id);
  if (!template) return null;

  const fields = lang === "te" ? template.fieldsTe : template.fields;
  const related = templatesFor(template.occasion).filter((x) => x.id !== template.id);

  return (
    <AppShell title={pick(template.name, lang)} back="/">
      <main className="px-4 pt-4">
        <InvitePreview template={template} fields={fields} animateKey={lang} />

        <div className="anim-rise mt-4 flex flex-wrap gap-2 text-xs font-semibold" style={{ animationDelay: "120ms" }}>
          {template.video ? (
            <span className="btn-ghost-line press flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <Video className="size-3.5 text-primary" /> Video
            </span>
          ) : null}
          {template.photo ? (
            <span className="btn-ghost-line flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <ImageIcon className="size-3.5 text-primary" /> 1 {t("photo")}
            </span>
          ) : null}
          <span className="btn-ghost-line flex items-center gap-1.5 rounded-full px-3 py-1.5">
            <Music2 className="size-3.5 text-primary" /> {t("music")}
          </span>
          <span className="btn-ghost-line rounded-full px-3 py-1.5 text-primary">{t("free")}</span>
        </div>

        <Link
          to="/editor/$id"
          params={{ id: template.id }}
          search={{}}
          className="btn-gold sheen anim-rise press mt-5 flex h-14 items-center justify-center rounded-full text-base"
          style={{ animationDelay: "180ms" }}
        >
          {t("customise")}
        </Link>

        {related.length ? (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">
              {pick({ en: "More like this", te: "ఇలాంటివి మరిన్ని" }, lang)}
            </h2>
            <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
              {related.map((tpl, i) => (
                <TemplateCard key={tpl.id} template={tpl} wide index={i} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </AppShell>
  );
}
