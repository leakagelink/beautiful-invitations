import { useEffect, useState } from "react";
import { Pencil, Plus, Tag, Trash2, Wallet } from "lucide-react";
import { pick, useLang } from "@/lib/i18n";
import {
  deleteOffer,
  deletePlan,
  formatPrice,
  listOffers,
  listPlans,
  saveOffer,
  savePlan,
  subscribePricing,
  type Offer,
  type Plan,
} from "@/lib/pricing";

const inputCls =
  "mt-1 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary";

const emptyPlan = { nameEn: "", nameTe: "", price: 500, videos: 1, noteEn: "", noteTe: "" };
const emptyOffer = {
  code: "",
  kind: "price" as Offer["kind"],
  value: 150,
  labelEn: "",
  labelTe: "",
  active: true,
};

export function PricingAdmin() {
  const { lang } = useLang();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [plan, setPlan] = useState(emptyPlan);
  const [planId, setPlanId] = useState<string | null>(null);
  const [offer, setOffer] = useState(emptyOffer);
  const [offerId, setOfferId] = useState<string | null>(null);

  const refresh = () => {
    setPlans(listPlans());
    setOffers(listOffers());
  };
  useEffect(() => {
    refresh();
    return subscribePricing(refresh);
  }, []);

  function submitPlan() {
    if (!plan.nameEn.trim()) return;
    savePlan({
      ...(planId ? { id: planId } : {}),
      name: { en: plan.nameEn.trim(), te: plan.nameTe.trim() || plan.nameEn.trim() },
      price: Math.max(0, Math.round(Number(plan.price) || 0)),
      videos: Math.max(1, Math.round(Number(plan.videos) || 1)),
      note: { en: plan.noteEn.trim(), te: plan.noteTe.trim() || plan.noteEn.trim() },
    });
    setPlan(emptyPlan);
    setPlanId(null);
    refresh();
  }

  function editPlan(p: Plan) {
    setPlanId(p.id);
    setPlan({
      nameEn: p.name.en,
      nameTe: p.name.te,
      price: p.price,
      videos: p.videos,
      noteEn: p.note.en,
      noteTe: p.note.te,
    });
  }

  function submitOffer() {
    if (!offer.code.trim()) return;
    saveOffer({
      ...(offerId ? { id: offerId } : {}),
      code: offer.code,
      kind: offer.kind,
      value: Math.max(0, Math.round(Number(offer.value) || 0)),
      label: { en: offer.labelEn.trim() || "Offer applied", te: offer.labelTe.trim() || offer.labelEn.trim() || "ఆఫర్ వర్తించింది" },
      active: offer.active,
    });
    setOffer(emptyOffer);
    setOfferId(null);
    refresh();
  }

  function editOffer(o: Offer) {
    setOfferId(o.id);
    setOffer({
      code: o.code,
      kind: o.kind,
      value: o.value,
      labelEn: o.label.en,
      labelTe: o.label.te,
      active: o.active,
    });
  }

  const kindLabel = (o: Offer) =>
    o.kind === "price"
      ? `${pick({ en: "Final price", te: "చివరి ధర" }, lang)} ${formatPrice(o.value)}`
      : o.kind === "percent"
        ? `${o.value}% ${pick({ en: "off", te: "తగ్గింపు" }, lang)}`
        : `${formatPrice(o.value)} ${pick({ en: "off", te: "తగ్గింపు" }, lang)}`;

  return (
    <>
      <section className="surface-card mt-6 rounded-2xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Wallet className="size-4 text-primary" />
          {pick({ en: "Video price plans", te: "వీడియో ధర ప్లాన్‌లు" }, lang)}
        </h2>

        <ul className="mt-3 space-y-2">
          {plans.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-border p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{pick(p.name, lang)}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(p.price)} · {p.videos} {pick({ en: "video(s)", te: "వీడియో(లు)" }, lang)}
                </p>
              </div>
              <button onClick={() => editPlan(p)} aria-label="Edit plan" className="btn-ghost-line press rounded-full p-2.5">
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => {
                  deletePlan(p.id);
                  refresh();
                }}
                aria-label="Delete plan"
                className="btn-ghost-line press rounded-full p-2.5 text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {planId
              ? pick({ en: "Edit plan", te: "ప్లాన్ మార్చండి" }, lang)
              : pick({ en: "Add plan", te: "ప్లాన్ జోడించండి" }, lang)}
          </p>
          <label className="block">
            <span className="text-xs text-muted-foreground">Plan name (English)</span>
            <input value={plan.nameEn} onChange={(e) => setPlan({ ...plan, nameEn: e.target.value })} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Plan name (తెలుగు)</span>
            <input value={plan.nameTe} onChange={(e) => setPlan({ ...plan, nameTe: e.target.value })} className={inputCls} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Price (₹)</span>
              <input
                type="number"
                value={plan.price}
                onChange={(e) => setPlan({ ...plan, price: Number(e.target.value) })}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">Videos</span>
              <input
                type="number"
                value={plan.videos}
                onChange={(e) => setPlan({ ...plan, videos: Number(e.target.value) })}
                className={inputCls}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted-foreground">Note (English)</span>
            <input value={plan.noteEn} onChange={(e) => setPlan({ ...plan, noteEn: e.target.value })} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Note (తెలుగు)</span>
            <input value={plan.noteTe} onChange={(e) => setPlan({ ...plan, noteTe: e.target.value })} className={inputCls} />
          </label>
          <div className="flex gap-2">
            <button onClick={submitPlan} className="btn-gold press h-11 flex-1 rounded-full text-sm font-semibold">
              <Plus className="mr-1 inline size-4" />
              {planId ? pick({ en: "Update plan", te: "అప్‌డేట్" }, lang) : pick({ en: "Save plan", te: "సేవ్" }, lang)}
            </button>
            {planId ? (
              <button
                onClick={() => {
                  setPlanId(null);
                  setPlan(emptyPlan);
                }}
                className="btn-ghost-line press h-11 rounded-full px-4 text-sm font-semibold"
              >
                {pick({ en: "Cancel", te: "రద్దు" }, lang)}
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="surface-card mt-6 rounded-2xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Tag className="size-4 text-primary" />
          {pick({ en: "Voucher offers", te: "వోచర్ ఆఫర్‌లు" }, lang)}
        </h2>

        <ul className="mt-3 space-y-2">
          {offers.map((o) => (
            <li key={o.id} className="flex items-center gap-3 rounded-2xl border border-border p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {o.code} {o.active ? "" : `· ${pick({ en: "off", te: "ఆఫ్" }, lang)}`}
                </p>
                <p className="text-xs text-muted-foreground">{kindLabel(o)}</p>
              </div>
              <button onClick={() => editOffer(o)} aria-label="Edit offer" className="btn-ghost-line press rounded-full p-2.5">
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => {
                  deleteOffer(o.id);
                  refresh();
                }}
                aria-label="Delete offer"
                className="btn-ghost-line press rounded-full p-2.5 text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {offerId
              ? pick({ en: "Edit offer", te: "ఆఫర్ మార్చండి" }, lang)
              : pick({ en: "Add offer", te: "ఆఫర్ జోడించండి" }, lang)}
          </p>
          <label className="block">
            <span className="text-xs text-muted-foreground">Voucher code</span>
            <input
              value={offer.code}
              onChange={(e) => setOffer({ ...offer, code: e.target.value.toUpperCase() })}
              className={inputCls}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">Type</span>
              <select
                value={offer.kind}
                onChange={(e) => setOffer({ ...offer, kind: e.target.value as Offer["kind"] })}
                className={inputCls}
              >
                <option value="price">Final price (₹)</option>
                <option value="flat">Flat off (₹)</option>
                <option value="percent">Percent off (%)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">Value</span>
              <input
                type="number"
                value={offer.value}
                onChange={(e) => setOffer({ ...offer, value: Number(e.target.value) })}
                className={inputCls}
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs text-muted-foreground">Offer text (English)</span>
            <input value={offer.labelEn} onChange={(e) => setOffer({ ...offer, labelEn: e.target.value })} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-xs text-muted-foreground">Offer text (తెలుగు)</span>
            <input value={offer.labelTe} onChange={(e) => setOffer({ ...offer, labelTe: e.target.value })} className={inputCls} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={offer.active} onChange={(e) => setOffer({ ...offer, active: e.target.checked })} />
            {pick({ en: "Active", te: "యాక్టివ్" }, lang)}
          </label>
          <div className="flex gap-2">
            <button onClick={submitOffer} className="btn-gold press h-11 flex-1 rounded-full text-sm font-semibold">
              <Plus className="mr-1 inline size-4" />
              {offerId ? pick({ en: "Update offer", te: "అప్‌డేట్" }, lang) : pick({ en: "Save offer", te: "సేవ్" }, lang)}
            </button>
            {offerId ? (
              <button
                onClick={() => {
                  setOfferId(null);
                  setOffer(emptyOffer);
                }}
                className="btn-ghost-line press h-11 rounded-full px-4 text-sm font-semibold"
              >
                {pick({ en: "Cancel", te: "రద్దు" }, lang)}
              </button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
