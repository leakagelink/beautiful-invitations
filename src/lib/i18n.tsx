import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "te";

type Dict = Record<string, { en: string; te: string }>;

export const strings: Dict = {
  appTagline: { en: "Invitations made in minutes", te: "నిమిషాల్లో ఆహ్వానాలు" },
  browseByOccasion: { en: "Browse by occasion", te: "సందర్భం ఎంచుకోండి" },
  browseSub: {
    en: "Pick an occasion to see designs made for it",
    te: "మీ సందర్భానికి తగిన డిజైన్లను చూడండి",
  },
  designs: { en: "designs", te: "డిజైన్లు" },
  viewAll: { en: "View all", te: "అన్నీ చూడండి" },
  trending: { en: "Trending this week", te: "ఈ వారం ట్రెండింగ్" },
  videoReady: { en: "Video ready templates", te: "వీడియో టెంప్లేట్లు" },
  explore: { en: "Explore", te: "అన్వేషించు" },
  creations: { en: "Creations", te: "నా సృష్టి" },
  search: { en: "Search", te: "వెతకండి" },
  profile: { en: "Profile", te: "ప్రొఫైల్" },
  customise: { en: "Customise this design", te: "ఈ డిజైన్‌ను మార్చండి" },
  preview: { en: "Preview", te: "ప్రివ్యూ" },
  text: { en: "Text", te: "వచనం" },
  photo: { en: "Photo", te: "ఫోటో" },
  music: { en: "Music", te: "సంగీతం" },
  addPhoto: { en: "Add photo", te: "ఫోటో జోడించండి" },
  removePhoto: { en: "Remove photo", te: "ఫోటో తీసేయండి" },
  addMusic: { en: "Add music", te: "సంగీతం జోడించండి" },
  removeMusic: { en: "Remove music", te: "సంగీతం తీసేయండి" },
  saveInvite: { en: "Save invitation", te: "ఆహ్వానం సేవ్ చేయండి" },
  downloadImage: { en: "Download image", te: "ఇమేజ్ డౌన్‌లోడ్" },
  makeVideo: { en: "Create video", te: "వీడియో చేయండి" },
  making: { en: "Creating video…", te: "వీడియో తయారవుతోంది…" },
  share: { en: "Share", te: "షేర్ చేయండి" },
  shareWhatsapp: { en: "Share on WhatsApp", te: "వాట్సాప్‌లో షేర్" },
  download: { en: "Download", te: "డౌన్‌లోడ్" },
  noCreations: { en: "No invitations yet", te: "ఇంకా ఆహ్వానాలు లేవు" },
  noCreationsSub: {
    en: "Pick a template and your first invitation is two minutes away.",
    te: "ఒక టెంప్లేట్ ఎంచుకోండి, రెండు నిమిషాల్లో ఆహ్వానం సిద్ధం.",
  },
  startNow: { en: "Browse templates", te: "టెంప్లేట్లు చూడండి" },
  searchPlaceholder: { en: "Search wedding, birthday, Telugu…", te: "పెళ్లి, పుట్టినరోజు…" },
  noResults: { en: "Nothing matched that search", te: "ఫలితాలు లేవు" },
  language: { en: "Language", te: "భాష" },
  free: { en: "FREE", te: "ఉచితం" },
  videoLen: { en: "Video length", te: "వీడియో నిడివి" },
  seconds: { en: "seconds", te: "సెకన్లు" },
  fields: { en: "Invitation details", te: "ఆహ్వాన వివరాలు" },
  saved: { en: "Saved to your creations", te: "మీ సృష్టిలో సేవ్ అయింది" },
  edit: { en: "Edit", te: "మార్చు" },
  delete: { en: "Delete", te: "తొలగించు" },
  music_hint: {
    en: "Pick a song from your phone. It plays in the video you export.",
    te: "మీ ఫోన్ నుండి పాట ఎంచుకోండి. వీడియోలో అది వినిపిస్తుంది.",
  },
  photo_hint: {
    en: "Your photo sits inside the gold frame of the design.",
    te: "మీ ఫోటో డిజైన్‌లోని బంగారు ఫ్రేమ్‌లో కనిపిస్తుంది.",
  },
  editPhoto: { en: "Crop / zoom", te: "క్రాప్ / జూమ్" },
  cropTitle: { en: "Adjust photo", te: "ఫోటో సరిచేయండి" },
  cropHint: { en: "Drag to move • slider to zoom", te: "కదపడానికి లాగండి • జూమ్ కొరకు స్లైడర్" },
  zoom: { en: "Zoom", te: "జూమ్" },
  zoomIn: { en: "Zoom in", te: "జూమ్ ఇన్" },
  zoomOut: { en: "Zoom out", te: "జూమ్ అవుట్" },
  applyCrop: { en: "Apply", te: "వర్తింపజేయి" },
  cancelCrop: { en: "Cancel", te: "రద్దు" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof strings) => string };
const LangContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => strings[k]?.en ?? String(k),
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("utsav.lang");
    if (stored === "te" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("utsav.lang", l);
  }, []);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (k) => strings[k]?.[lang] ?? String(k) }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function pick(v: { en: string; te: string }, lang: Lang) {
  return v[lang];
}
