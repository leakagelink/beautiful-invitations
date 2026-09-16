import weddingGold from "@/assets/tpl-wedding-gold.webp";
import weddingBlush from "@/assets/tpl-wedding-blush.webp";
import weddingCrimson from "@/assets/tpl-wedding-crimson.webp";
import weddingLotus from "@/assets/tpl-wedding-lotus.webp";
import birthdayPastel from "@/assets/tpl-birthday-pastel.webp";
import firstBirthdayTeddy from "@/assets/tpl-firstbirthday-teddy.webp";
import firstBirthdayUnicorn from "@/assets/tpl-firstbirthday-unicorn.webp";
import anniversaryNoir from "@/assets/tpl-anniversary-noir.webp";
import anniversaryMoon from "@/assets/tpl-anniversary-moon.webp";
import anniversaryWine from "@/assets/tpl-anniversary-wine.webp";
import festivalDiya from "@/assets/tpl-festival-diya.webp";
import festivalKites from "@/assets/tpl-festival-kites.webp";
import festivalGanesh from "@/assets/tpl-festival-ganesh.webp";
import housewarming from "@/assets/tpl-housewarming.webp";
import housewarmingTorana from "@/assets/tpl-housewarming-torana.webp";
import housewarmingBotanical from "@/assets/tpl-housewarming-botanical.webp";
import birthdayGaming from "@/assets/tpl-birthday-gaming.webp";
import birthdayChampagne from "@/assets/tpl-birthday-champagne.webp";

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
    count: "140+",
    tint: "oklch(0.4 0.11 20)",
    icon: "heart",
  },
  {
    slug: "first-birthday",
    name: { en: "First Birthday", te: "మొదటి పుట్టినరోజు" },
    count: "46+",
    tint: "oklch(0.4 0.08 230)",
    icon: "gift",
  },
  {
    slug: "birthday",
    name: { en: "Birthday", te: "పుట్టినరోజు" },
    count: "62+",
    tint: "oklch(0.45 0.1 250)",
    icon: "balloon",
  },
  {
    slug: "anniversary",
    name: { en: "Anniversary", te: "వార్షికోత్సవం" },
    count: "42+",
    tint: "oklch(0.38 0.1 350)",
    icon: "rose",
  },
  {
    slug: "festivals",
    name: { en: "Festivals", te: "పండుగలు" },
    count: "19+",
    tint: "oklch(0.42 0.11 70)",
    icon: "sparkle",
  },
  {
    slug: "housewarming",
    name: { en: "Housewarming", te: "గృహప్రవేశం" },
    count: "24+",
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
    id: "royal-crimson",
    occasion: "wedding",
    name: { en: "Royal Crimson Paisley", te: "రాయల్ క్రిమ్సన్ పైస్లే" },
    bg: weddingCrimson,
    ink: "#f5e6c8",
    accent: "#d4a24a",
    photo: true,
    video: true,
    tags: ["wedding", "telugu", "traditional", "red"],
    fields: {
      title: "Aditi & Rohan",
      subtitle: "Two families, one celebration",
      date: "18 November  •  Tuesday  •  6:30 PM",
      message: "Join us as we begin our forever",
      footer: "Lakshmi Kalyana Mandapam, Vijayawada",
    },
    fieldsTe: {
      title: "అదితి & రోహన్",
      subtitle: "రెండు కుటుంబాలు, ఒక వేడుక",
      date: "18 నవంబర్  •  మంగళవారం  •  సాయంత్రం 6:30",
      message: "మా శాశ్వత ప్రయాణం ప్రారంభంలో మీరు ఉండండి",
      footer: "లక్ష్మీ కళ్యాణ మండపం, విజయవాడ",
    },
  },
  {
    id: "lotus-mandap",
    occasion: "wedding",
    name: { en: "Lotus Mandap Telugu", te: "లోటస్ మండపం తెలుగు" },
    bg: weddingLotus,
    ink: "#3d5c3a",
    accent: "#8b6c3e",
    photo: true,
    video: true,
    tags: ["wedding", "telugu", "temple", "green"],
    fields: {
      title: "Meera & Arjun",
      subtitle: "With elders' blessings",
      date: "08 December  •  Sunday  •  Muhurtham 10:11 AM",
      message: "We invite you to our sacred union",
      footer: "Sita Rama Kalyana Mandapam, Rajahmundry",
    },
    fieldsTe: {
      title: "మీరా & అర్జున్",
      subtitle: "పెద్దల ఆశీర్వాదాలతో",
      date: "08 డిసెంబర్  •  ఆదివారం  •  ముహూర్తం ఉదయం 10:11",
      message: "మా పవిత్ర కళ్యాణానికి మీరు రావాలి",
      footer: "సీతా రామ కళ్యాణ మండపం, రాజమండ్రి",
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
    id: "teddy-stars",
    occasion: "first-birthday",
    name: { en: "Teddy Bear & Stars", te: "టెడ్డీ బేర్ & స్టార్స్" },
    bg: firstBirthdayTeddy,
    ink: "#4a5568",
    accent: "#8ba4c7",
    photo: true,
    video: true,
    tags: ["first birthday", "boys", "cute", "teddy"],
    fields: {
      title: "Vihaan turns One!",
      subtitle: "Our baby boy",
      date: "03 May  •  Sunday  •  5 PM",
      message: "Cake, balloons and a whole lot of cuddles",
      footer: "Home, Hyderabad",
    },
    fieldsTe: {
      title: "విహాన్‌కు ఒక సంవత్సరం!",
      subtitle: "మా బేబీ బాయ్",
      date: "03 మే  •  ఆదివారం  •  సాయంత్రం 5",
      message: "కేక్, బెలూన్లు, మరియు చాలా ప్రేమ",
      footer: "హోం, హైదరాబాద్",
    },
  },
  {
    id: "unicorn-rainbow",
    occasion: "first-birthday",
    name: { en: "Unicorn Rainbow Magic", te: "యునికార్న్ రెయిన్బో మేజిక్" },
    bg: firstBirthdayUnicorn,
    ink: "#7a3b69",
    accent: "#c97baf",
    photo: true,
    video: true,
    tags: ["first birthday", "girls", "unicorn", "rainbow"],
    fields: {
      title: "Myra is One!",
      subtitle: "Our little princess",
      date: "22 July  •  Saturday  •  4 PM",
      message: "A magical day for our magical girl",
      footer: "Garden Party Lawn",
    },
    fieldsTe: {
      title: "మైరా ఒక సంవత్సరం!",
      subtitle: "మా చిన్న రాకుమారి",
      date: "22 జులై  •  శనివారం  •  సాయంత్రం 4",
      message: "మా మాయా చిన్నారి కోసం ఒక మాయా రోజు",
      footer: "గార్డెన్ పార్టీ లాన్",
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
    id: "neon-gamer",
    occasion: "birthday",
    name: { en: "Neon Gamer Party", te: "నియాన్ గేమర్ పార్టీ" },
    bg: birthdayGaming,
    ink: "#00f0ff",
    accent: "#bc13fe",
    photo: true,
    video: true,
    tags: ["birthday", "gaming", "teen", "neon"],
    fields: {
      title: "Level 18 Unlocked",
      subtitle: "Happy Birthday Kiran",
      date: "14 September  •  Saturday  •  7 PM",
      message: "Join the squad for an epic night",
      footer: "GameZone, Gachibowli",
    },
    fieldsTe: {
      title: "లెవెల్ 18 అన్‌లాక్",
      subtitle: "పుట్టినరోజు శుభాకాంక్షలు కిరణ్",
      date: "14 సెప్టెంబర్  •  శనివారం  •  సాయంత్రం 7",
      message: "ఒక గొప్ప రాత్రి కోసం స్క్వాడ్‌లో చేరండి",
      footer: "గేమ్‌జోన్, గచ్చిబౌలి",
    },
  },
  {
    id: "champagne-elegance",
    occasion: "birthday",
    name: { en: "Champagne & Gold", te: "షాంపెయిన్ & గోల్డ్" },
    bg: birthdayChampagne,
    ink: "#f3e2b8",
    accent: "#e6c473",
    photo: true,
    video: true,
    tags: ["birthday", "adult", "luxury", "gold"],
    fields: {
      title: "Cheers to 30 Years",
      subtitle: "Sanjay's Birthday Bash",
      date: "05 October  •  Friday  •  8 PM",
      message: "Dress to impress and raise a toast",
      footer: "Sky Lounge, Jubilee Hills",
    },
    fieldsTe: {
      title: "30 సంవత్సరాలకు జై",
      subtitle: "సంజయ్ పుట్టినరోజు వేడుక",
      date: "05 అక్టోబర్  •  శుక్రవారం  •  రాత్రి 8",
      message: "ఉత్తమ దుస్తులలో వచ్చి టోస్ట్ చేయండి",
      footer: "స్కై లౌంజ్, జూబ్లీ హిల్స్",
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
    id: "silver-moon",
    occasion: "anniversary",
    name: { en: "Silver Moonlit Love", te: "సిల్వర్ చంద్ర కాంతి ప్రేమ" },
    bg: anniversaryMoon,
    ink: "#e2e8f0",
    accent: "#94a3b8",
    photo: true,
    video: true,
    tags: ["anniversary", "romantic", "silver", "moon"],
    fields: {
      title: "10 Years of Us",
      subtitle: "Neha & Vikram",
      date: "20 June  •  Friday  •  7 PM",
      message: "A decade down, forever to go",
      footer: "Rooftop Dinner, Marriott",
    },
    fieldsTe: {
      title: "మన 10 సంవత్సరాలు",
      subtitle: "నేహా & విక్రమ్",
      date: "20 జూన్  •  శుక్రవారం  •  సాయంత్రం 7",
      message: "పది సంవత్సరాలు పూర్తయ్యాయి, శాశ్వతం ముందుంది",
      footer: "రూఫ్‌టాప్ డిన్నర్, మ్యారియట్",
    },
  },
  {
    id: "vintage-wine",
    occasion: "anniversary",
    name: { en: "Vintage Wine & Roses", te: "వింటేజ్ వైన్ & రోజెస్" },
    bg: anniversaryWine,
    ink: "#5c1e1e",
    accent: "#b8860b",
    photo: true,
    video: true,
    tags: ["anniversary", "romantic", "classic", "roses"],
    fields: {
      title: "Happy Anniversary",
      subtitle: "Priya & Suresh",
      date: "11 November  •  Tuesday",
      message: "Love that grows richer with time",
      footer: "Wine & Dine, Banjara Hills",
    },
    fieldsTe: {
      title: "వార్షికోత్సవ శుభాకాంక్షలు",
      subtitle: "ప్రియా & సురేష్",
      date: "11 నవంబర్  •  మంగళవారం",
      message: "కాలంతో పాటు మరింత గాఢమైన ప్రేమ",
      footer: "వైన్ & డైన్, బంజారా హిల్స్",
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
    id: "sankranti-kites",
    occasion: "festivals",
    name: { en: "Sankranti Kites & Sweets", te: "సంక్రాంతి పతంగులు & మిఠాయిలు" },
    bg: festivalKites,
    ink: "#7c2d12",
    accent: "#15803d",
    photo: false,
    video: true,
    tags: ["festival", "sankranti", "kites", "telugu"],
    fields: {
      title: "Happy Sankranti",
      subtitle: "From our home to yours",
      date: "May the festival of harvest bring happiness",
      message: "Wishing you sweetness, sunshine, and soaring spirits",
      footer: "— The Rao Family",
    },
    fieldsTe: {
      title: "సంక్రాంతి శుభాకాంక్షలు",
      subtitle: "మా ఇంటి నుండి మీ ఇంటికి",
      date: "ఈ పండుగ మీకు సంతోషం తీసుకురావాలి",
      message: "మిఠాయి, మంచి కాలం, ఎగిరే ఆత్మవిశ్వాసం మీ సొంతం",
      footer: "— రావు కుటుంబం",
    },
  },
  {
    id: "ganesh-chaturthi",
    occasion: "festivals",
    name: { en: "Ganesh Chaturthi Blessings", te: "వినాయక చవితి ఆశీర్వాదాలు" },
    bg: festivalGanesh,
    ink: "#f5e6c8",
    accent: "#d4a24a",
    photo: false,
    video: true,
    tags: ["festival", "ganesh", "telugu", "blessings"],
    fields: {
      title: "Ganpati Bappa Morya",
      subtitle: "Join our celebration",
      date: "Wishing you wisdom and prosperity",
      message: "Come home for modak, aarti, and blessings",
      footer: "— The Sharma Family",
    },
    fieldsTe: {
      title: "గణపతి బప్పా మోరియా",
      subtitle: "మా వేడుకలో పాల్గొనండి",
      date: "జ్ఞానం, సంపద మీ సొంతం కావాలి",
      message: "మోదకం, హారతి, ఆశీర్వాదాల కోసం రండి",
      footer: "— శర్మ కుటుంబం",
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
    id: "marigold-torana",
    occasion: "housewarming",
    name: { en: "Marigold Torana Entrance", te: "బంతి పువ్వు తోరణం ప్రవేశం" },
    bg: housewarmingTorana,
    ink: "#5c3a10",
    accent: "#a06a33",
    photo: true,
    video: true,
    tags: ["housewarming", "telugu", "marigold", "traditional"],
    fields: {
      title: "New Home Puja",
      subtitle: "The Naidu Family",
      date: "21 June  •  Saturday  •  9:00 AM",
      message: "We invite you to our new beginning",
      footer: "Green Valley, Madhapur",
    },
    fieldsTe: {
      title: "కొత్త ఇల్లు పూజ",
      subtitle: "నాయుడు కుటుంబం",
      date: "21 జూన్  •  శనివారం  •  ఉదయం 9:00",
      message: "మా కొత్త ప్రారంభానికి మీరు రావాలి",
      footer: "గ్రీన్ వ్యాలీ, మాధాపూర్",
    },
  },
  {
    id: "botanical-home",
    occasion: "housewarming",
    name: { en: "Botanical Modern Home", te: "బొటానికల్ మోడర్న్ హోమ్" },
    bg: housewarmingBotanical,
    ink: "#4a5d43",
    accent: "#7c9a6e",
    photo: true,
    video: true,
    tags: ["housewarming", "modern", "green", "minimal"],
    fields: {
      title: "Home Sweet Home",
      subtitle: "Kiran & Family",
      date: "15 August  •  Friday  •  6 PM",
      message: "Come warm our new home with your presence",
      footer: "Serene County, Kondapur",
    },
    fieldsTe: {
      title: "ఇల్లు మధుర ఇల్లు",
      subtitle: "కిరణ్ & కుటుంబం",
      date: "15 ఆగస్టు  •  శుక్రవారం  •  సాయంత్రం 6",
      message: "మా కొత్త ఇంటిని మీ రాకతో వెచ్చబరచండి",
      footer: "సెరీన్ కౌంటీ, కొండాపూర్",
    },
  },
];

export function templatesFor(occasion: string) {
  return templates.filter((t) => t.occasion === occasion);
}

export function templateById(id: string) {
  return templates.find((t) => t.id === id);
}
