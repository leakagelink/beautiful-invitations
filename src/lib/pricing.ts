/** Video plans + voucher offers, stored on the device (no backend). */

export type Plan = {
  id: string;
  name: { en: string; te: string };
  price: number;
  videos: number;
  note: { en: string; te: string };
};

export type Offer = {
  id: string;
  code: string;
  /** "flat" = rupees off, "percent" = % off, "price" = final price */
  kind: "flat" | "percent" | "price";
  value: number;
  label: { en: string; te: string };
  active: boolean;
};

const PLANS_KEY = "utsav.plans";
const OFFERS_KEY = "utsav.offers";
const UNLOCK_KEY = "utsav.unlocked";
export const PRICING_EVENT = "utsav:pricing";

export const defaultPlans: Plan[] = [
  {
    id: "plan-single",
    name: { en: "This video", te: "ఈ వీడియో" },
    price: 500,
    videos: 1,
    note: { en: "One-time payment · Yours to keep", te: "ఒకసారి చెల్లింపు · మీదే" },
  },
  {
    id: "plan-pro",
    name: { en: "Pro · 5 videos", te: "ప్రో · 5 వీడియోలు" },
    price: 999,
    videos: 5,
    note: { en: "Creating in bulk? Pro is cheaper", te: "ఎక్కువ వీడియోలా? ప్రో చౌక" },
  },
];

export const defaultOffers: Offer[] = [
  {
    id: "offer-launch",
    code: "MYINVITE",
    kind: "price",
    value: 150,
    label: { en: "Launch offer — video for ₹150", te: "లాంచ్ ఆఫర్ — వీడియో ₹150" },
    active: true,
  },
];

function read<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(PRICING_EVENT));
}

export const listPlans = () => read<Plan>(PLANS_KEY, defaultPlans);
export const listOffers = () => read<Offer>(OFFERS_KEY, defaultOffers);

export function savePlan(plan: Omit<Plan, "id"> & { id?: string }): Plan {
  const plans = listPlans();
  const id = plan.id ?? `plan-${Date.now().toString(36)}`;
  const next: Plan = { ...plan, id };
  const index = plans.findIndex((p) => p.id === id);
  if (index >= 0) plans[index] = next;
  else plans.push(next);
  write(PLANS_KEY, plans);
  return next;
}

export function deletePlan(id: string) {
  write(PLANS_KEY, listPlans().filter((p) => p.id !== id));
}

export function saveOffer(offer: Omit<Offer, "id"> & { id?: string }): Offer {
  const offers = listOffers();
  const id = offer.id ?? `offer-${Date.now().toString(36)}`;
  const next: Offer = { ...offer, id, code: offer.code.trim().toUpperCase() };
  const index = offers.findIndex((o) => o.id === id);
  if (index >= 0) offers[index] = next;
  else offers.push(next);
  write(OFFERS_KEY, offers);
  return next;
}

export function deleteOffer(id: string) {
  write(OFFERS_KEY, listOffers().filter((o) => o.id !== id));
}

export function findOffer(code: string): Offer | null {
  const wanted = code.trim().toUpperCase();
  if (!wanted) return null;
  return listOffers().find((o) => o.active && o.code === wanted) ?? null;
}

/** Price after applying an offer, never below zero. */
export function applyOffer(price: number, offer: Offer | null): number {
  if (!offer) return price;
  if (offer.kind === "price") return Math.max(0, Math.round(offer.value));
  if (offer.kind === "percent") return Math.max(0, Math.round(price * (1 - offer.value / 100)));
  return Math.max(0, Math.round(price - offer.value));
}

export const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

/* ---------- unlocked videos (device) ---------- */

export function isUnlocked(creationId: string): boolean {
  if (typeof window === "undefined") return false;
  return read<string>(UNLOCK_KEY, []).includes(creationId);
}

export function markUnlocked(creationId: string) {
  const list = read<string>(UNLOCK_KEY, []);
  if (!list.includes(creationId)) write(UNLOCK_KEY, [...list, creationId]);
}

export function subscribePricing(fn: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PRICING_EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(PRICING_EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}
