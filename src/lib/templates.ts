import weddingGold from "@/assets/tpl-wedding-gold.jpg";
import weddingBlush from "@/assets/tpl-wedding-blush.jpg";
import birthdayPastel from "@/assets/tpl-birthday-pastel.jpg";
import anniversaryNoir from "@/assets/tpl-anniversary-noir.jpg";
import festivalDiya from "@/assets/tpl-festival-diya.jpg";
import housewarming from "@/assets/tpl-housewarming.jpg";

export type Bilingual = { en: string; te: string };

export type Occasion = {
  slug: string;
  name: Bilingual;
  count: string;
  tint: string;
  icon: "heart" | "gift" | "balloon" | "rose" | "sparkle" | "home";
};

export const occasions: Occasion[] = [
  {
    slug: "wedding",
    name: { en: "Wedding", te: "వివాహం" },
    count: "120+",
    tint: "oklch(0.4 0.11 20)",
    icon: "heart",
  },
  {
    slug: "first-birthday",
    name: { en: "First Birthday", te: "మొదటి పుట్టినరోజు" },
    count: "44+",
    tint: "oklch(0.4 0.08 230)",
    icon: "gift",
  },
  {
    slug: "birthday",
    name: { en: "Birthday", te: "పుట్టినరోజు" },
    count: "60+",
    tint: "oklch(0.45 0.1 250)",
    icon: "balloon",
  },
  {
    slug: "anniversary",
    name: { en: "Anniversary", te: "వార్షికోత్సవం" },
    count: "40+",
    tint: "oklch(0.38 0.1 350)",
    icon: "rose",
  },
  {
    slug: "festivals",
    name: { en: "Festivals", te: "పండుగలు" },
    count: "17+",
    tint: "oklch(0.42 0.11 70)",
    icon: "sparkle",
  },
  {
    slug: "housewarming",
    name: { en: "Housewarming", te: "గృహప్రవేశం" },
    count: "22+",
    tint: "oklch(0.4 0.08 150)",
    icon: "home",
  },
];

export type Template = {
  id: string;
  occasion: string;
  name: Bilingual;
  bg: string;
  ink: string;
  accent: string;
  photo: boolean;
  video: boolean;
  tags: string[];
  fields: {
    title: string;
    subtitle: string;
    date: string;
    message: string;
    footer: string;
  };
  fieldsTe: {
    title: string;
    subtitle: string;
    date: string;
    message: string;
    footer: string;
  };
};

export const templates: Template[] = [
  {
    id: "royal-gold-green",
    occasion: "wedding",
    name: { en: "Royal Gold & Green Wedding", te: "రాయల్ గోల్డ్ గ్రీన్ వివాహం" },
    bg: weddingGold,
    ink: "#6c2b12",
    accent: "#a8761f",
    photo: true,
    video: true,
    tags: ["wedding", "telugu", "traditional", "gold"],
    fields: {
      title: "Priyanka & Naveen",
      subtitle: "Together with their families",
      date: "05 June  •  Wednesday  •  7:30 PM",
      message: "We joyfully invite you to bless our wedding",
      footer: "Kalyana Mandapam, Hyderabad",
    },
    fieldsTe: {
      title: "ప్రియాంక & నవీన్",
      subtitle: "మా కుటుంబ సభ్యులతో కలిసి",
      date: "05 జూన్  •  బుధవారం  •  సాయంత్రం 7:30",
      message: "మా కళ్యాణం చూతము రారండి",
      footer: "కళ్యాణ మండపం, హైదరాబాద్",
    },
  },
  {
    id: "blush-roses",
    occasion: "wedding",
    name: { en: "Blush Roses Invite", te: "బ్లష్ రోజెస్ ఆహ్వానం" },
    bg: weddingBlush,
    ink: "#7d3550",
    accent: "#b2836a",
    photo: true,
    video: true,
    tags: ["wedding", "floral", "modern", "pink"],
    fields: {
      title: "Bride & Groom",
      subtitle: "A new story begins",
      date: "26 October  •  Monday",
      message: "Be there to witness a moment that means everything to us",
      footer: "Reception at 7 PM",
    },
    fieldsTe: {
      title: "వధువు & వరుడు",
      subtitle: "ఒక కొత్త ప్రయాణం",
      date: "26 అక్టోబర్  •  సోమవారం",
      message: "మా జీవితంలోని ఈ క్షణానికి మీరు సాక్షిగా ఉండండి",
      footer: "రిసెప్షన్ సాయంత్రం 7 గంటలకు",
    },
  },
  {
    id: "pastel-first-birthday",
    occasion: "first-birthday",
    name: { en: "Pastel Balloons First Birthday", te: "పాస్టెల్ బెలూన్స్ మొదటి పుట్టినరోజు" },
    bg: birthdayPastel,
    ink: "#4a6b63",
    accent: "#d98872",
    photo: true,
    video: true,
    tags: ["birthday", "first birthday", "kids", "pastel"],
    fields: {
      title: "Aarav turns One!",
      subtitle: "Our little star",
      date: "12 April  •  Saturday  •  11 AM",
      message: "Join us for cake, laughter and lots of photos",
      footer: "Sunshine Banquet Hall",
    },
    fieldsTe: {
      title: "ఆరవ్‌కు ఒక సంవత్సరం!",
      subtitle: "మా చిన్న నక్షత్రం",
      date: "12 ఏప్రిల్  •  శనివారం  •  ఉదయం 11",
      message: "కేక్, నవ్వులు, ఫోటోల కోసం మాతో చేరండి",
      footer: "సన్‌షైన్ బాంక్వెట్ హాల్",
    },
  },
  {
    id: "golden-hearts",
    occasion: "anniversary",
    name: { en: "Golden Hearts Anniversary", te: "గోల్డెన్ హార్ట్స్ వార్షికోత్సవం" },
    bg: anniversaryNoir,
    ink: "#f3e2b8",
    accent: "#e6c473",
    photo: true,
    video: true,
    tags: ["anniversary", "luxury", "gold", "night"],
    fields: {
      title: "25 Years Together",
      subtitle: "Rama & Lakshmi",
      date: "14 February  •  Friday",
      message: "Celebrate a silver jubilee of love with us",
      footer: "Dinner at 8 PM",
    },
    fieldsTe: {
      title: "25 సంవత్సరాల ప్రేమ",
      subtitle: "రామ & లక్ష్మి",
      date: "14 ఫిబ్రవరి  •  శుక్రవారం",
      message: "మా రజతోత్సవ వేడుకలో పాల్గొనండి",
      footer: "రాత్రి 8 గంటలకు విందు",
    },
  },
  {
    id: "diya-festival",
    occasion: "festivals",
    name: { en: "Diya Rangoli Festival Greeting", te: "దీపం రంగోలి పండుగ శుభాకాంక్షలు" },
    bg: festivalDiya,
    ink: "#7b2412",
    accent: "#9c3a12",
    photo: false,
    video: true,
    tags: ["festival", "diwali", "sankranti", "greeting"],
    fields: {
      title: "Happy Diwali",
      subtitle: "From our family to yours",
      date: "Wishing you light and laughter",
      message: "May this festival fill your home with joy and prosperity",
      footer: "— The Reddy Family",
    },
    fieldsTe: {
      title: "దీపావళి శుభాకాంక్షలు",
      subtitle: "మా కుటుంబం నుండి మీ కుటుంబానికి",
      date: "వెలుగులు, నవ్వులు మీ సొంతం కావాలి",
      message: "ఈ పండుగ మీ ఇంటిని ఆనందంతో నింపాలి",
      footer: "— రెడ్డి కుటుంబం",
    },
  },
  {
    id: "kalash-housewarming",
    occasion: "housewarming",
    name: { en: "Kalash Griha Pravesham", te: "కలశ గృహప్రవేశం" },
    bg: housewarming,
    ink: "#6b3a20",
    accent: "#a06a33",
    photo: true,
    video: true,
    tags: ["housewarming", "griha pravesham", "traditional"],
    fields: {
      title: "Griha Pravesham",
      subtitle: "Sarma & Family",
      date: "09 May  •  Thursday  •  6:30 AM",
      message: "Bless our new home with your presence",
      footer: "Plot 42, Jubilee Hills",
    },
    fieldsTe: {
      title: "గృహప్రవేశం",
      subtitle: "శర్మ & కుటుంబం",
      date: "09 మే  •  గురువారం  •  ఉదయం 6:30",
      message: "మా కొత్త ఇంటిని మీ రాకతో ఆశీర్వదించండి",
      footer: "ప్లాట్ 42, జూబ్లీ హిల్స్",
    },
  },
  {
    id: "blush-birthday",
    occasion: "birthday",
    name: { en: "Rose Garden Birthday", te: "రోజ్ గార్డెన్ పుట్టినరోజు" },
    bg: weddingBlush,
    ink: "#7d3550",
    accent: "#b2836a",
    photo: true,
    video: true,
    tags: ["birthday", "floral", "modern"],
    fields: {
      title: "Happy Birthday Ananya",
      subtitle: "Turning 21",
      date: "18 August  •  Sunday  •  6 PM",
      message: "Come celebrate with us",
      footer: "Cafe Terrace, Banjara Hills",
    },
    fieldsTe: {
      title: "పుట్టినరోజు శుభాకాంక్షలు అనన్య",
      subtitle: "21వ పుట్టినరోజు",
      date: "18 ఆగస్టు  •  ఆదివారం  •  సాయంత్రం 6",
      message: "మాతో కలిసి వేడుక చేసుకోండి",
      footer: "కేఫ్ టెరస్, బంజారా హిల్స్",
    },
  },
  {
    id: "mandap-gold",
    occasion: "wedding",
    name: { en: "Mandap Gold Telugu Invite", te: "మండప గోల్డ్ తెలుగు ఆహ్వానం" },
    bg: weddingGold,
    ink: "#5c3a10",
    accent: "#9c7420",
    photo: false,
    video: true,
    tags: ["wedding", "telugu", "gold", "no photo"],
    fields: {
      title: "Sri Rama Kalyanam",
      subtitle: "With the blessings of elders",
      date: "22 April  •  Wednesday  •  Muhurtham 9:12 AM",
      message: "Your presence is our blessing",
      footer: "Vontimitta, Kadapa",
    },
    fieldsTe: {
      title: "శ్రీ రామ కళ్యాణం",
      subtitle: "పెద్దల ఆశీస్సులతో",
      date: "22 ఏప్రిల్  •  బుధవారం  •  ముహూర్తం ఉదయం 9:12",
      message: "మీ రాక మాకు ఆశీర్వాదం",
      footer: "ఒంటిమిట్ట, కడప",
    },
  },
];

export function templatesFor(occasion: string) {
  return templates.filter((t) => t.occasion === occasion);
}

export function templateById(id: string) {
  return templates.find((t) => t.id === id);
}
