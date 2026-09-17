import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ShieldCheck, X } from "lucide-react";
import { pick, useLang } from "@/lib/i18n";
import {
  applyOffer,
  findOffer,
  formatPrice,
  listPlans,
  subscribePricing,
  type Offer,
  type Plan,
} from "@/lib/pricing";

type Props = {
  titleText: string;
  onClose: () => void;
  onUnlock: (plan: Plan, price: number) => void;
};

export function UnlockSheet({ titleText, onClose, onUnlock }: Props) {
  const { lang } = useLang();
  const [plans, setPlans] = useState<Plan[]>(() => listPlans());
  const [planId, setPlanId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [offer, setOffer] = useState<Offer | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => subscribePricing(() => setPlans(listPlans())), []);

  const selected = useMemo(
    () => plans.find((p) => p.id === planId) ?? plans[0] ?? null,
    [plans, planId],
  );
  const finalPrice = selected ? applyOffer(selected.price, offer) : 0;

  function redeem() {
    const found = findOffer(code);
    setOffer(found);
    setNote(
      found
        ? pick(found.label, lang)
        : pick({ en: "This voucher code is not valid.", te: "ఈ వోచర్ కోడ్ చెల్లదు." }, lang),
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 sm:items-center sm:p-6">
      <div className="surface-card max-h-[92vh] w-full overflow-y-auto rounded-t-3xl p-5 sm:mx-auto sm:max-w-md sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              {pick({ en: "Unlock video", te: "వీడియో అన్‌లాక్" }, lang)}
            </p>
            <h2 className="font-display mt-1 text-2xl font-bold leading-tight">
              {pick({ en: "Unlock", te: "అన్‌లాక్" }, lang)} {titleText || pick({ en: "your video", te: "మీ వీడియో" }, lang)}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              {pick(
                { en: "One-time payment · No subscription · Yours to keep", te: "ఒకసారి చెల్లింపు · సబ్‌స్క్రిప్షన్ లేదు · మీదే" },
                lang,
              )}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="btn-ghost-line press rounded-full p-2">
            <X className="size-4" />
          </button>
        </div>

        <ul className="mt-4 space-y-2 rounded-2xl border border-border p-3 text-sm">
          {[
            { en: "5 free revisions included", te: "5 ఉచిత మార్పులు" },
            { en: "Swap or adjust photos", te: "ఫోటోలు మార్చుకోవచ్చు" },
            { en: "Fix names, dates or any detail", te: "పేర్లు, తేదీలు సరిచేసుకోవచ్చు" },
            { en: "Change the audio", te: "ఆడియో మార్చుకోవచ్చు" },
          ].map((item) => (
            <li key={item.en} className="flex items-start gap-2">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{pick(item, lang)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2">
          {plans.map((plan) => {
            const active = selected?.id === plan.id;
            const price = applyOffer(plan.price, offer);
            return (
              <button
                key={plan.id}
                onClick={() => setPlanId(plan.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                  active ? "border-primary bg-primary/10" : "border-border"
                }`}
              >
                <span>
                  <span className="block text-sm font-bold">{pick(plan.name, lang)}</span>
                  <span className="block text-xs text-muted-foreground">{pick(plan.note, lang)}</span>
                </span>
                <span className="text-right">
                  {price !== plan.price ? (
                    <span className="block text-xs text-muted-foreground line-through">
                      {formatPrice(plan.price)}
                    </span>
                  ) : null}
                  <span className="block text-lg font-bold text-primary">{formatPrice(price)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={pick({ en: "Gift voucher code", te: "వోచర్ కోడ్" }, lang)}
            className="h-11 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none focus:border-primary"
          />
          <button onClick={redeem} className="btn-ghost-line press h-11 rounded-full px-4 text-sm font-semibold">
            {pick({ en: "Apply", te: "వర్తించు" }, lang)}
          </button>
        </div>
        {note ? <p className="mt-2 text-center text-xs text-primary">{note}</p> : null}

        <button
          onClick={() => selected && onUnlock(selected, finalPrice)}
          disabled={!selected}
          className="btn-gold sheen press mt-4 h-12 w-full rounded-full text-sm font-bold disabled:opacity-60"
        >
          {pick({ en: "Unlock my video", te: "నా వీడియో అన్‌లాక్ చేయండి" }, lang)} ·{" "}
          {formatPrice(finalPrice)} →
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {pick({ en: "Secure UPI · PhonePe · GPay · Paytm", te: "సురక్షిత UPI · PhonePe · GPay · Paytm" }, lang)}
        </p>
      </div>
    </div>
  );
}
