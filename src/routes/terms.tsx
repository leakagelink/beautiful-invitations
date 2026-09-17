import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { pick, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — My Invitation" },
      { property: "og:title", content: "Terms of Service — My Invitation" },
      { property: "og:description", content: "Terms of use for the My Invitation app." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

const SECTIONS: { title: { en: string; te: string }; body: { en: string; te: string } }[] = [
  {
    title: { en: "1. Using the app", te: "1. యాప్ వాడకం" },
    body: {
      en: "My Invitation lets you create invitation cards and videos for personal events such as weddings, birthdays and festivals. You agree to use the app only for lawful, personal and non-abusive purposes.",
      te: "My Invitation తో వివాహం, పుట్టినరోజు, పండుగల వంటి వ్యక్తిగత కార్యక్రమాల కోసం ఆహ్వాన కార్డులు, వీడియోలు తయారు చేసుకోవచ్చు. చట్టబద్ధమైన, వ్యక్తిగత ప్రయోజనాల కోసమే యాప్‌ను వాడాలి.",
    },
  },
  {
    title: { en: "2. Your content", te: "2. మీ కంటెంట్" },
    body: {
      en: "You are responsible for the photos, music and text you add. Only use content you own or have permission to use. Everything stays on your device; we claim no rights over it.",
      te: "మీరు జోడించే ఫోటోలు, పాటలు, టెక్స్ట్‌కు మీరే బాధ్యులు. మీ స్వంతం లేదా అనుమతి ఉన్నవే వాడండి. అన్నీ మీ పరికరంలోనే ఉంటాయి; వాటిపై మాకు హక్కులు లేవు.",
    },
  },
  {
    title: { en: "3. Paid video unlock and vouchers", te: "3. పెయిడ్ వీడియో అన్‌లాక్ మరియు వోచర్లు" },
    body: {
      en: "Video creation is a paid feature. The shown price may be reduced by a valid voucher code. Payments are handled by the app store / payment provider and follow their refund rules. Vouchers have no cash value and may be changed or withdrawn at any time.",
      te: "వీడియో తయారీ ఒక పెయిడ్ ఫీచర్. సరైన వోచర్ కోడ్‌తో ధర తగ్గవచ్చు. చెల్లింపులు యాప్ స్టోర్ / పేమెంట్ ప్రొవైడర్ నిబంధనల ప్రకారం జరుగుతాయి. వోచర్లకు నగదు విలువ ఉండదు, ఎప్పుడైనా మారవచ్చు లేదా రద్దు కావచ్చు.",
    },
  },
  {
    title: { en: "4. Templates", te: "4. టెంప్లేట్లు" },
    body: {
      en: "The invitation designs in the app are for creating your own invitations. You may not copy, resell or redistribute the designs themselves.",
      te: "యాప్‌లోని డిజైన్లు మీ స్వంత ఆహ్వానాలు తయారు చేసుకోవడానికే. డిజైన్లను కాపీ చేయడం, అమ్మడం లేదా పంపిణీ చేయడం నిషిద్ధం.",
    },
  },
  {
    title: { en: "5. No warranty", te: "5. హామీ లేదు" },
    body: {
      en: "The app is provided \"as is\" without warranties of any kind. We are not liable for any loss arising from use of the app.",
      te: "యాప్ \"ఉన్నట్టుగానే\" అందించబడుతుంది, ఎటువంటి హామీ లేదు. వాడకం వల్ల కలిగే నష్టాలకు మేము బాధ్యులం కాము.",
    },
  },
  {
    title: { en: "6. Contact", te: "6. సంప్రదింపు" },
    body: {
      en: "Questions about these terms: sk.ivrahim@gmail.com or call/WhatsApp 9494008762.",
      te: "ఈ నిబంధనల గురించి ప్రశ్నలు: sk.ivrahim@gmail.com లేదా 9494008762 కు కాల్ / వాట్సాప్ చేయండి.",
    },
  },
];

function Terms() {
  const { lang, t } = useLang();
  return (
    <AppShell title={t("terms")} back="/profile">
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
