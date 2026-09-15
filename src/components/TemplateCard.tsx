import { Link } from "@tanstack/react-router";
import { Image as ImageIcon, Video } from "lucide-react";
import { pick, useLang } from "@/lib/i18n";
import type { Template } from "@/lib/templates";

export function TemplateCard({ template, wide }: { template: Template; wide?: boolean }) {
  const { lang, t } = useLang();
  return (
    <Link
      to="/templates/$id"
      params={{ id: template.id }}
      className={`group relative block overflow-hidden rounded-2xl border border-border/80 bg-card ${
        wide ? "w-44 shrink-0" : ""
      }`}
    >
      <img
        src={template.bg}
        alt={pick(template.name, lang)}
        loading="lazy"
        width={768}
        height={1024}
        className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2">
        <span className="flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
          {template.photo ? <ImageIcon className="size-3" /> : null}
          {template.photo ? "1 photo" : "No photos"}
        </span>
        {template.video ? (
          <span className="flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[10px] font-bold text-primary-foreground">
            <Video className="size-3" /> {t("free")}
          </span>
        ) : null}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5 pt-8">
        <p className="line-clamp-2 text-[12px] font-semibold leading-tight text-white">
          {pick(template.name, lang)}
        </p>
      </div>
    </Link>
  );
}
