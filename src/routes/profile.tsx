import { createFileRoute } from "@tanstack/react-router";
import { Globe2, HeartHandshake, Info, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { pick, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & settings — My Invitation" },
{ property: "og:title", content: "Profile & settings — My Invitation" },
      { property: "og:description", content: "Language and app settings for My Invitation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { lang, setLang, t } = useLang();

  return (
    <AppShell title={t("profile")} back="/">
      <main className="space-y-4 px-4 pt-4">
        <section className="surface-card rounded-2xl p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Globe2 className="size-4 text-primary" /> {t("language")}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["en", "te"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`h-12 rounded-xl text-sm font-semibold ${
                  lang === l ? "btn-gold" : "btn-ghost-line"
                }`}
              >
                {l === "en" ? "English" : "తెలుగు"}
              </button>
            ))}
          </div>
        </section>

        <Link
          to="/admin"
          className="surface-card press flex items-center gap-3 rounded-2xl p-5 text-sm font-semibold"
        >
          <Wrench className="size-4 text-primary" />
          {pick({ en: "Admin panel — add or delete templates", te: "అడ్మిన్ ప్యానెల్ — టెంప్లేట్లు జోడించు / తొలగించు" }, lang)}
        </Link>

        {[
          {
            icon: ShieldCheck,
            title: { en: "Your files stay on your phone", te: "మీ ఫైల్స్ మీ ఫోన్‌లోనే ఉంటాయి" },
            body: {
              en: "Photos, music and saved invitations are stored on this device only. Nothing is uploaded.",
              te: "ఫోటోలు, సంగీతం, ఆహ్వానాలు ఈ పరికరంలోనే సేవ్ అవుతాయి. ఏదీ అప్‌లోడ్ కాదు.",
            },
          },
          {
            icon: HeartHandshake,
            title: { en: "Made without AI", te: "AI లేకుండా తయారు" },
            body: {
              en: "Every design is hand-made artwork. You only add your own words, photo and song.",
              te: "అన్ని డిజైన్లు కళాకారుల చేతిపని. మీరు మీ మాటలు, ఫోటో, పాట మాత్రమే జోడిస్తారు.",
            },
          },
          {
            icon: Info,
            title: { en: "Sharing", te: "షేరింగ్" },
            body: {
              en: "Export a card image or an invitation video and send it straight to WhatsApp.",
              te: "కార్డ్ ఇమేజ్ లేదా వీడియో తయారు చేసి నేరుగా వాట్సాప్‌కు పంపండి.",
            },
          },
        ].map((item) => (
          <section key={item.title.en} className="surface-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <item.icon className="size-4 text-primary" /> {pick(item.title, lang)}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{pick(item.body, lang)}</p>
          </section>
        ))}
      </main>
    </AppShell>
  );
}
