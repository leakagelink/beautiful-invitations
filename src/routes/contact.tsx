import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { pick, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Support — My Invitation" },
      { property: "og:title", content: "Contact & Support — My Invitation" },
      { property: "og:description", content: "Get help with the My Invitation app — call, WhatsApp or email support." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { lang, t } = useLang();
  return (
    <AppShell title={t("contact")} back="/profile">
      <main className="space-y-4 px-4 pt-4">
        <section className="surface-card rounded-2xl p-5">
          <h2 className="text-sm font-semibold">{t("support")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {pick(
              {
                en: "Facing a problem or have a question? Message us — we usually reply within 24 hours.",
                te: "సమస్య లేదా ప్రశ్న ఉందా? మాకు మెసేజ్ చేయండి — సాధారణంగా 24 గంటల్లో రిప్లై ఇస్తాం.",
              },
              lang,
            )}
          </p>
        </section>

        <a
          href="tel:+919494008762"
          className="surface-card press flex items-center gap-3 rounded-2xl p-5 text-sm font-semibold"
        >
          <Phone className="size-4 text-primary" />
          <span>
            {pick({ en: "Call us", te: "కాల్ చేయండి" }, lang)}
            <span className="block text-xs font-normal text-muted-foreground">+91 94940 08762</span>
          </span>
        </a>

        <a
          href="https://wa.me/919494008762"
          target="_blank"
          rel="noreferrer"
          className="surface-card press flex items-center gap-3 rounded-2xl p-5 text-sm font-semibold"
        >
          <MessageCircle className="size-4 text-primary" />
          <span>
            {pick({ en: "WhatsApp support", te: "వాట్సాప్ సపోర్ట్" }, lang)}
            <span className="block text-xs font-normal text-muted-foreground">+91 94940 08762</span>
          </span>
        </a>

        <a
          href="mailto:sk.ivrahim@gmail.com"
          className="surface-card press flex items-center gap-3 rounded-2xl p-5 text-sm font-semibold"
        >
          <Mail className="size-4 text-primary" />
          <span>
            {pick({ en: "Email us", te: "మెయిల్ చేయండి" }, lang)}
            <span className="block text-xs font-normal text-muted-foreground">sk.ivrahim@gmail.com</span>
          </span>
        </a>
      </main>
    </AppShell>
  );
}
