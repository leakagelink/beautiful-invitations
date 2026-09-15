import { Link } from "@tanstack/react-router";
import { Image as ImageIcon, Video } from "lucide-react";
import { pick, useLang } from "@/lib/i18n";
import type { Template } from "@/lib/templates";

export function TemplateCard({
  template,
  wide,
  index = 0,
}: {
  template: Template;
  wide?: boolean;
  index?: number;
}) {
  const { lang, t } = useLang();
  return (
    <Link
      to="/templates/$id"
      params={{ id: template.id }}
      style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
      className={`group anim-rise lift press relative block overflow-hidden rounded-2xl border border-border/80 bg-card ${
        wide ? "w-44 shrink-0" : ""
      }`}
    >
      <img
        src={template.bg}
        alt={pick(template.name, lang)}
        loading="lazy"
        width={768}
        height={1024}
        className="aspect-[3/4] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-2">
        <span className="flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
          {template.photo ? <ImageIcon className="size-3" /> : null}
          {template.photo ? "1 photo" : "No photos"}
        </span>
        {template.video ? (
          <span className="anim-glow flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[10px] font-bold text-primary-foreground">
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
