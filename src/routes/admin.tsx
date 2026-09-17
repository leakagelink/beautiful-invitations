import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { pick, useLang } from "@/lib/i18n";
import { occasions } from "@/lib/templates";
import {
  addCustomTemplate,
  deleteCustomTemplate,
  listCustomTemplates,
  toBackgroundDataUrl,
  type CustomTemplate,
} from "@/lib/customTemplates";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin panel — My Invitation" },
      {
        name: "description",
        content:
          "Add or delete your own invitation and video templates: background art, names, date, photo and music options.",
      },
      { property: "og:title", content: "Admin panel — My Invitation" },
      { property: "og:description", content: "Manage your own invitation video templates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPanel,
});

const empty = {
  nameEn: "",
  nameTe: "",
  occasion: "wedding",
  ink: "#5b2a12",
  accent: "#a8761f",
  photo: true,
  video: true,
  tags: "",
  subtitle: "Together with their families",
  title: "Name & Name",
  date: "05 June  •  Wednesday  •  7:30 PM",
  message: "We joyfully invite you to bless our celebration",
  footer: "Venue, City",
  subtitleTe: "కుటుంబ సభ్యులతో కలిసి",
  titleTe: "పేరు & పేరు",
  dateTe: "05 జూన్  •  బుధవారం  •  సాయంత్రం 7:30",
  messageTe: "మా వేడుకకు మీరు రావాలని ఆహ్వానిస్తున్నాము",
  footerTe: "వేదిక, నగరం",
};

function AdminPanel() {
  const { lang } = useLang();
  const [form, setForm] = useState(empty);
  const [bg, setBg] = useState<string | null>(null);
  const [list, setList] = useState<CustomTemplate[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => setList(listCustomTemplates()), []);

  const set = <K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function submit() {
    if (!form.nameEn.trim() || !bg) {
      setStatus(pick({ en: "Add a template name and a background image.", te: "టెంప్లేట్ పేరు, బ్యాక్‌గ్రౌండ్ ఇమేజ్ ఇవ్వండి." }, lang));
      return;
    }
    try {
      addCustomTemplate({
        occasion: form.occasion,
        name: { en: form.nameEn.trim(), te: form.nameTe.trim() || form.nameEn.trim() },
        bg,
        ink: form.ink,
        accent: form.accent,
        photo: form.photo,
        video: form.video,
        tags: form.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        fields: {
          title: form.title,
          subtitle: form.subtitle,
          date: form.date,
          message: form.message,
          footer: form.footer,
        },
        fieldsTe: {
          title: form.titleTe,
          subtitle: form.subtitleTe,
          date: form.dateTe,
          message: form.messageTe,
          footer: form.footerTe,
        },
      });
      setList(listCustomTemplates());
      setForm(empty);
      setBg(null);
      setStatus(pick({ en: "Template added.", te: "టెంప్లేట్ జోడించబడింది." }, lang));
    } catch {
      setStatus(
        pick(
          { en: "Storage is full — delete a template and try again.", te: "స్టోరేజ్ నిండింది — ఒక టెంప్లేట్ తీసి మళ్లీ ప్రయత్నించండి." },
          lang,
        ),
      );
    }
  }

  function remove(id: string) {
    deleteCustomTemplate(id);
    setList(listCustomTemplates());
  }

  const inputCls =
    "mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary";

  return (
    <AppShell title={pick({ en: "Admin panel", te: "అడ్మిన్ ప్యానెల్" }, lang)} back="/profile">
      <main className="px-4 pt-4 pb-4">
        <p className="text-sm text-muted-foreground">
          {pick(
            {
              en: "Add your own wedding or festival designs, set the default names, date and photo options, and delete any template you no longer need.",
              te: "మీ సొంత డిజైన్లు జోడించండి, పేర్లు, తేదీ, ఫోటో ఆప్షన్లు సెట్ చేయండి, అవసరం లేని టెంప్లేట్‌ను తొలగించండి.",
            },
            lang,
          )}
        </p>

        <section className="surface-card mt-4 rounded-2xl p-4">
          <h2 className="flex items-center gap-2 text-sm font-bold">
            <Plus className="size-4 text-primary" />
            {pick({ en: "Add template", te: "టెంప్లేట్ జోడించండి" }, lang)}
          </h2>

          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Template name (English)</span>
              <input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">Template name (తెలుగు)</span>
              <input value={form.nameTe} onChange={(e) => set("nameTe", e.target.value)} className={inputCls} />
            </label>

            <label className="block">
              <span className="text-xs text-muted-foreground">Occasion</span>
              <select
                value={form.occasion}
                onChange={(e) => set("occasion", e.target.value)}
                className={inputCls}
              >
                {occasions.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name.en}
                  </option>
                ))}
              </select>
            </label>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setBg(await toBackgroundDataUrl(file));
              }}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInput.current?.click()}
                className="btn-gold press flex h-11 flex-1 items-center justify-center gap-2 rounded-full text-sm"
              >
                <ImagePlus className="size-4" />
                {pick({ en: "Background image", te: "బ్యాక్‌గ్రౌండ్ ఇమేజ్" }, lang)}
              </button>
              {bg ? (
                <img src={bg} alt="" className="h-16 w-12 rounded-lg object-cover" />
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-muted-foreground">Text colour</span>
                <input
                  type="color"
                  value={form.ink}
                  onChange={(e) => set("ink", e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-1"
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">Accent colour</span>
                <input
                  type="color"
                  value={form.accent}
                  onChange={(e) => set("accent", e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-1"
                />
              </label>
            </div>

            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.photo} onChange={(e) => set("photo", e.target.checked)} />
                {pick({ en: "Photo option", te: "ఫోటో ఆప్షన్" }, lang)}
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.video} onChange={(e) => set("video", e.target.checked)} />
                {pick({ en: "Video option", te: "వీడియో ఆప్షన్" }, lang)}
              </label>
            </div>

            <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {pick({ en: "Default text (English)", te: "డిఫాల్ట్ టెక్స్ట్ (English)" }, lang)}
            </p>
            {(
              [
                ["subtitle", "Top line"],
                ["title", "Names"],
                ["date", "Date & time"],
                ["message", "Message"],
                ["footer", "Venue"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs text-muted-foreground">{label}</span>
                <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputCls} />
              </label>
            ))}

            <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {pick({ en: "Default text (తెలుగు)", te: "డిఫాల్ట్ టెక్స్ట్ (తెలుగు)" }, lang)}
            </p>
            {(
              [
                ["subtitleTe", "Top line"],
                ["titleTe", "Names"],
                ["dateTe", "Date & time"],
                ["messageTe", "Message"],
                ["footerTe", "Venue"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-xs text-muted-foreground">{label}</span>
                <input value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputCls} />
              </label>
            ))}

            <label className="block">
              <span className="text-xs text-muted-foreground">Tags (comma separated)</span>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} className={inputCls} />
            </label>

            <button onClick={submit} className="btn-gold sheen press h-12 w-full rounded-full text-sm">
              {pick({ en: "Save template", te: "టెంప్లేట్ సేవ్ చేయండి" }, lang)}
            </button>
            {status ? <p className="text-center text-sm text-primary">{status}</p> : null}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-xl font-bold">
            {pick({ en: "My templates", te: "నా టెంప్లేట్లు" }, lang)} ({list.length})
          </h2>
          {list.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {pick({ en: "No added templates yet.", te: "ఇంకా టెంప్లేట్లు లేవు." }, lang)}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {list.map((tpl) => (
                <li key={tpl.id} className="surface-card flex items-center gap-3 rounded-2xl p-3">
                  <img src={tpl.bg} alt="" className="h-16 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{pick(tpl.name, lang)}</p>
                    <p className="text-xs text-muted-foreground">{tpl.occasion}</p>
                  </div>
                  <Link
                    to="/templates/$id"
                    params={{ id: tpl.id }}
                    className="btn-ghost-line press rounded-full px-3 py-2 text-xs font-semibold"
                  >
                    {pick({ en: "Open", te: "తెరవండి" }, lang)}
                  </Link>
                  <button
                    onClick={() => remove(tpl.id)}
                    aria-label="Delete template"
                    className="btn-ghost-line press rounded-full p-2.5 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AppShell>
  );
}
