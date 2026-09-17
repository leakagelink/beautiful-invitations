import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { pick, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — My Invitation" },
      { property: "og:title", content: "Privacy Policy — My Invitation" },
      { property: "og:description", content: "How My Invitation handles your data — everything stays on your device." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

const SECTIONS: { title: { en: string; te: string }; body: { en: string; te: string } }[] = [
  {
    title: { en: "1. Information we collect", te: "1. మేము సేకరించే సమాచారం" },
    body: {
      en: "My Invitation does not collect, upload or share any personal information. The names, dates, messages, photos and music you add to an invitation are stored only on your own device.",
      te: "My Invitation మీ వ్యక్తిగత సమాచారాన్ని సేకరించదు, అప్‌లోడ్ చేయదు, షేర్ చేయదు. మీరు జోడించే పేర్లు, తేదీలు, సందేశాలు, ఫోటోలు మరియు పాటలు మీ పరికరంలోనే నిల్వ ఉంటాయి.",
    },
  },
  {
    title: { en: "2. Photos and music", te: "2. ఫోటోలు మరియు సంగీతం" },
    body: {
      en: "Photos and songs you pick are read directly by your browser/phone to build the invitation. They never leave your device and are never sent to any server.",
      te: "మీరు ఎంచుకున్న ఫోటోలు, పాటలు ఆహ్వానం తయారు చేయడానికి మీ ఫోన్‌లోనే వాడబడతాయి. అవి ఎప్పుడూ సర్వర్‌కు పంపబడవు.",
    },
  },
  {
    title: { en: "3. Saved invitations", te: "3. సేవ్ చేసిన ఆహ్వానాలు" },
    body: {
      en: "Your creations are saved in this device's local storage. Clearing the app/browser data or uninstalling the app will delete them. We keep no copy.",
      te: "మీ క్రియేషన్స్ ఈ పరికరంలోనే సేవ్ అవుతాయి. యాప్ డేటా క్లియర్ చేస్తే లేదా అన్‌ఇన్‌స్టాల్ చేస్తే అవి తొలగిపోతాయి. మా వద్ద కాపీ ఉండదు.",
    },
  },
  {
    title: { en: "4. Payments and vouchers", te: "4. చెల్లింపులు మరియు వోచర్లు" },
    body: {
      en: "Video unlock purchases are processed by the app store / payment provider. We do not see or store your card or UPI details. Voucher codes only change the price inside the app.",
      te: "వీడియో అన్‌లాక్ చెల్లింపులు యాప్ స్టోర్ / పేమెంట్ ప్రొవైడర్ ద్వారా జరుగుతాయి. మీ కార్డ్ లేదా UPI వివరాలు మా దగ్గర ఉండవు. వోచర్ కోడ్ కేవలం ధరను మాత్రమే మారుస్తుంది.",
    },
  },
  {
    title: { en: "5. Sharing", te: "5. షేరింగ్" },
    body: {
      en: "When you share an invitation image or video, it is sent through the app you choose (for example WhatsApp). That app's own privacy policy applies to the shared file.",
      te: "మీరు ఇమేజ్ లేదా వీడియో షేర్ చేసినప్పుడు అది మీరు ఎంచుకున్న యాప్ (ఉదా: వాట్సాప్) ద్వారా పంపబడుతుంది. ఆ యాప్ యొక్క ప్రైవసీ పాలసీ వర్తిస్తుంది.",
    },
  },
  {
    title: { en: "6. Contact", te: "6. సంప్రదింపు" },
    body: {
      en: "For any privacy question, contact us at sk.ivrahim@gmail.com or call/WhatsApp 9494008762.",
      te: "ప్రైవసీ గురించి ఏ ప్రశ్నైనా sk.ivrahim@gmail.com కు మెయిల్ చేయండి లేదా 9494008762 కు కాల్ / వాట్సాప్ చేయండి.",
    },
  },
];

function Privacy() {
  const { lang, t } = useLang();
  return (
    <AppShell title={t("privacy")} back="/profile">
      <main className="space-y-4 px-4 pt-4">
        <p className="text-xs text-muted-foreground">
          {pick({ en: "Last updated: 17 September 2026", te: "చివరి నవీకరణ: 17 సెప్టెంబర్ 2026" }, lang)}
        </p>
        {SECTIONS.map((s) => (
          <section key={s.title.en} className="surface-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold">{pick(s.title, lang)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pick(s.body, lang)}</p>
          </section>
        ))}
      </main>
    </AppShell>
  );
}
