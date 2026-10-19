/* enigma-store.js — shared catalogue, cart and wishlist for Enigma Perfumes.
   Include this on every page BEFORE the page's own script.
   Function names mirror Liquid Emotions' store.js (le... becomes en...) so the
   two sites can be merged later. Cart and wishlist live in localStorage. */

const EN_CART_KEY      = "en_cart_v1";
const EN_WISHLIST_KEY  = "en_wishlist_v1";
const EN_NEW_DAYS      = 10;   // how long a listing shows the "New" tag
const EN_LOW_STOCK     = 3;    // not used any more: stock numbers are never shown to customers
const EN_MAX_PER_ORDER = 1;    // how many of one perfume a single order can hold (real stock is never stored here)
const EN_SHOW_SOLD_OUT = true; // true = sold-out perfumes stay visible (greyed out); false = hide them

const EN_WHATSAPP_NUMBER = "917982410620";

/* Your live website address, e.g. "https://enigmaperfumes.in/". Used for the "Share on WhatsApp"
   links. Leave "" while building: links then point at whatever address the page is opened from. */
const EN_SITE_URL = "";

const EN_RECENT_KEY = "en_recent_v1";   // "Recently viewed" perfumes, kept on the visitor's own device
const EN_RECENT_MAX = 8;

/* Thin bar at the very top of every page. One short line each; edit freely.
   Leave the list empty ([]) to hide the bar. */
const EN_ANNOUNCEMENTS = [
  "BNIB perfumes are sealed and boxed",
  "Limited stock: popular perfumes sell out fast"
];

/* ============================================================
   HOME PAGE BANNERS: the big brand ads that change by themselves.
   One entry per banner, in the order they appear.

   - brand:        must match the brand name on your listings, e.g. "Afnan".
                   Clicking the banner opens that brand on the Shop page.
   - image:        your finished banner picture, e.g. "banners/afnan.jpg".
                   Leave "" and the site builds an ad from that brand's perfumes.
   - mobileImage:  optional square picture for phones, e.g. "banners/afnan-phone.jpg".
                   Leave "" to use the main picture on phones too.
   - link:         optional. Where a click goes. Leave "" for the brand's Shop page.
   - theme:        0 to 5, the colour of the built-in ad (used only when image is "").
   - headline, text: optional words for the built-in ad. Leave out to fill from your listings.

   For a banner that is not one brand (a sale, new arrivals), leave brand out,
   set link to something like "shop.html?sort=newest", and give it your own image.
   Good picture sizes: 1600 x 600 for desktop, 1000 x 1000 for phones.

   EASIEST WAY, no editing needed: put your banner pictures in a folder called  banners
   (next to index.html) and name them like this, using lowercase letters:
     - after the brand:  banners/afnan.jpg, banners/lattafa.png, banners/arabiyat-prestige.jpg
       (a click opens that brand on the Shop page)
     - or by number:     banners/1.jpg, banners/2.jpg ... up to 8  (a click opens the Shop page)
   A phone version is optional: add -mobile, e.g. banners/afnan-mobile.jpg or banners/1-mobile.jpg.
   Allowed endings: .jpg .jpeg .png .webp   (a name like AFNAN.JPG will not be found).
   Numbered pictures show first, then brand pictures. To check what the site can see,
   open  index.html?bannercheck  in your browser. */
const EN_KEEP_BUILTIN_ADS = true;   // true: brands without a picture keep the built-in ad. false: once you add pictures, only your pictures show.
const EN_BANNER_SECONDS = 5.5;   // how long each banner stays before it changes
const BANNERS = [
  { brand: "Afnan",             image: "", mobileImage: "", link: "", theme: 0 },
  { brand: "Lattafa",           image: "", mobileImage: "", link: "", theme: 1 },
  { brand: "Rasasi",            image: "", mobileImage: "", link: "", theme: 2 },
  { brand: "Armaf",             image: "", mobileImage: "", link: "", theme: 3 },
  { brand: "Arabiyat Prestige", image: "", mobileImage: "", link: "", theme: 4 },
  { brand: "Mykonos",           image: "", mobileImage: "", link: "", theme: 5 },
  { brand: "French Avenue",     image: "", mobileImage: "", link: "", theme: 1 },
  { brand: "Paris Corner",      image: "", mobileImage: "", link: "", theme: 3 },
  { brand: "Rayhaan",           image: "", mobileImage: "", link: "", theme: 0 },
  { brand: "Diptyque",          image: "", mobileImage: "", link: "", theme: 4 },
  { brand: "Dolce & Gabbana",   image: "", mobileImage: "", link: "", theme: 2 }
];

/* Optional: a Google Apps Script URL that hands out order numbers (like the
   Liquid Emotions counter). Leave "" to use a date-based code such as
   EN-260929-K7QF instead. Do NOT reuse the Liquid Emotions URL, or the two
   shops will share one number sequence. */
const EN_ORDER_COUNTER_URL = "";

/* ============================================================
   LISTINGS — one entry per perfume you sell.

   Add a new perfume by copying one entry below and changing it.
   Fields:
   - id:            short unique name with no spaces, e.g. "mykonos-reflection"
   - type:          "bnib" (brand new, sealed, with box), "tester", or "vial" (small sample vial)
   - name, house:   perfume name and brand
   - bottleSize:    full retail size, e.g. "100ml" (for a vial, the vial size, e.g. "1.5ml")
   - price:         one price in rupees, numbers only
   - available:     true while you have it, false when it is sold out. No stock numbers are kept
                   in this file, so nobody can read them here. Each perfume can be ordered
                   once per order (EN_MAX_PER_ORDER above); you confirm on WhatsApp.
                    When one sells, lower this number. At 0 it shows Sold out.
   - dateAdded:     "YYYY-MM-DD", used for the New tag and Newest sort
   - images:        list of photo paths, e.g. ["bottles/reflection-1.jpg", "bottles/reflection-2.jpg"]
                    Leave [] to show a name tile until photos are ready.

   Testers only:
   - boxIncluded:   true or false (BNIB is always boxed, so leave it out; leave it out on a tester
                    too if you have not checked, and the site says "Ask us on WhatsApp")
   - conditionNotes: e.g. "Cap has a small scuff. Fill level about 95%."

   Optional on any listing:
   - gender, season, fragranticaUrl
   - notes: { top: ["..."], heart: ["..."], base: ["..."] }
   Anything left out is simply not shown.
   ============================================================ */
const LISTINGS = [
  {
    id: "arabiyat-prestige-marwa-extrait",
    type: "bnib",
    name: "Marwa Extrait",
    house: "Arabiyat Prestige",
    bottleSize: "60ml",
    price: 3550,
    mrp: 7499,
    available: true,
    dateAdded: "2026-09-29",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Marwa-Extrait-142642.html",
    notes: { top: ["Ginger", "Bergamot", "Petitgrain"], heart: ["Incense", "Floral Notes", "Tea"], base: ["Ambroxan", "Musk", "Guaiac Wood"]},
    images: ["bottles/arabiyat-prestige-marwa-extrait.jpg"]
  },
  {
    id: "armaf-club-de-nuit-untold",
    type: "bnib",
    name: "Club de Nuit Untold",
    house: "Armaf",
    bottleSize: "105ml",
    price: 3550,
    mrp: 6999,
    available: true,
    dateAdded: "2026-09-29",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-de-Nuit-Untold-78476.html",
    notes: { top: ["Saffron", "Jasmine"], heart: ["Amberwood", "Ambergris"], base: ["Fir Resin", "Cedar"]},
    images: ["bottles/armaf-club-de-nuit-untold.png"]
  },
  {
    id: "mykonos-reflection",
    type: "bnib",
    name: "Reflection",
    house: "Mykonos",
    bottleSize: "50ml",
    price: 1850,
    mrp: 3000,
    available: true,
    dateAdded: "2026-09-29",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Mykonos/Reflection-121124.html",
    notes: { top: ["Grapefruit", "Ginger", "Bergamot"], heart: ["Marine Notes", "Cardamom", "Lily of the Valley"], base: ["Musk", "Patchouli", "Amber", "Ambroxan"]},
    images: ["bottles/mykonos-reflection.png"]
  },
  {
    id: "afnan-9pm",
    type: "bnib",
    name: "9PM",
    house: "Afnan",
    bottleSize: "100ml",
    price: 2850,
    mrp: 5500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9pm-65414.html",
    notes: { top: ["Apple", "Cinnamon", "Wild Lavender", "Bergamot"], heart: ["Orange Blossom", "Lily-of-the-Valley"], base: ["Vanilla", "Tonka Bean", "Amber", "Patchouli"] },
    images: ["bottles/afnan-9pm.jpg"]
  },
  {
    id: "afnan-9pm-rebel",
    type: "bnib",
    name: "9PM Rebel",
    house: "Afnan",
    bottleSize: "100ml",
    price: 2850,
    mrp: 5500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9-PM-Rebel-99238.html",
    notes: { top: ["Pineapple", "Granny Smith Apple", "Mandarin"], heart: ["Oakmoss", "Cedarwood", "Vanilla"], base: ["Ambergris", "Dry Wood", "Musk", "Caramel"] },
    images: ["bottles/afnan-9pm-rebel.jpg"]
  },
  {
    id: "afnan-9pm-nightout",
    type: "bnib",
    name: "9PM Nightout",
    house: "Afnan",
    bottleSize: "100ml",
    price: 3350,
    mrp: 6500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9-PM-Night-Out-123313.html",
    notes: { top: ["Dragon Fruit", "Bergamot", "Cognac", "Lavender", "Apple"], heart: ["Cardamom", "Mahonial", "Suede", "Toffee", "Cedar"], base: ["Tonka Bean", "Akigalawood", "Ambrofix", "Patchouli"] },
    images: ["bottles/afnan-9pm-nightout.jpg"]
  },
  {
    id: "afnan-lynked-freedom",
    type: "bnib",
    name: "Lynked Freedom",
    house: "Afnan",
    bottleSize: "100ml",
    price: 3400,
    mrp: 6500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Lynked-Freedom-119003.html",
    notes: { top: ["Bergamot", "Grapefruit", "Sage"], heart: ["Lavender", "Cardamom", "Juniper Berry"], base: ["Caramel", "Oriental Notes", "Vetiver"] },
    images: ["bottles/afnan-lynked-freedom.png"]
  },
  {
    id: "afnan-rare-reef",
    type: "bnib",
    name: "Rare Reef",
    house: "Afnan",
    bottleSize: "100ml",
    price: 2650,
    mrp: 5000,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Rare-Reef-106835.html",
    notes: { top: ["Black Currant", "Orange", "Citron", "Mint", "Coriander", "Grapefruit"], heart: ["Apricot", "Basil", "Rose", "Violet Leaf"], base: ["Fig", "Dates", "Ambrette", "Amberwood"] },
    images: ["bottles/afnan-rare-reef.png"]
  },
  {
    id: "afnan-supremacy-not-only-intense",
    type: "bnib",
    name: "Supremacy Not Only Intense",
    house: "Afnan",
    bottleSize: "150ml",
    price: 3900,
    mrp: 7500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Supremacy-Not-Only-Intense-68271.html",
    notes: { top: ["Bergamot", "Apple", "Black Currant"], heart: ["Lavender", "Patchouli", "Oak Moss"], base: ["Saffron", "Musk", "Ambergris"] },
    images: ["bottles/afnan-supremacy-not-only-intense.png"]
  },
  {
    id: "afnan-supremacy-collectors-edition",
    type: "bnib",
    name: "Supremacy Collector's Edition",
    house: "Afnan",
    bottleSize: "100ml",
    price: 3650,
    mrp: 7500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Supremacy-Collector-s-Edition-Pour-Homme-98689.html",
    notes: { top: ["Pineapple", "Bergamot", "White Flowers", "Apple"], heart: ["Orange Blossom", "Birch", "Amber"], base: ["Oak Moss", "Musk", "Ambergris"] },
    images: ["bottles/afnan-supremacy-collectors-edition.png"]
  },
  {
    id: "lattafa-fahad",
    type: "bnib",
    name: "Fahad",
    house: "Lattafa",
    bottleSize: "80ml",
    price: 2750,
    mrp: 5000,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Fahad-136650.html",
    notes: { top: ["Mandarin", "Black Pepper", "Pineapple"], heart: ["Orange Blossom", "Lavender", "Artemisia"], base: ["Patchouli", "Cedarwood", "Ambroxan", "Incense"] },
    images: ["bottles/lattafa-fahad.png"]
  },
  {
    id: "lattafa-teriaq-intense",
    type: "bnib",
    name: "Teriaq Intense",
    house: "Lattafa",
    bottleSize: "100ml",
    price: 3300,
    mrp: 6000,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Teriaq-Intense-99586.html",
    notes: { top: ["Saffron", "Bergamot"], heart: ["Plum Liquor", "Cinnamon"], base: ["Amber", "Tonka Bean", "Benzoin"] },
    images: ["bottles/lattafa-teriaq-intense.png"]
  },
  {
    id: "lattafa-khamrah-qahwa",
    type: "bnib",
    name: "Khamrah Qahwa",
    house: "Lattafa",
    bottleSize: "100ml",
    price: 3100,
    mrp: 5500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Khamrah-Qahwa-88175.html",
    notes: { top: ["Cinnamon", "Cardamom", "Ginger"], heart: ["Praline", "Candied Fruits", "White Flowers"], base: ["Coffee", "Vanilla", "Tonka Bean", "Benzoin", "Musk"] },
    images: ["bottles/lattafa-khamrah-qahwa.png"]
  },
  {
    id: "rasasi-hawas-for-him",
    type: "bnib",
    name: "Hawas for Him",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 2500,
    mrp: 5500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-for-Him-46890.html",
    notes: { top: ["Apple", "Bergamot", "Lemon", "Cinnamon"], heart: ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"], base: ["Ambergris", "Musk", "Patchouli", "Driftwood"] },
    images: ["bottles/rasasi-hawas-for-him.png"]
  },
  {
    id: "rasasi-hawas-ice",
    type: "bnib",
    name: "Hawas Ice",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 2700,
    mrp: 5500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Ice-89050.html",
    notes: { top: ["Apple", "Italian Lemon", "Sicilian Bergamot", "Star Anise"], heart: ["Plum", "Orange Blossom", "Cardamom"], base: ["Musk", "Amber", "Driftwood", "Moss"] },
    images: ["bottles/rasasi-hawas-ice.png"]
  },
  {
    id: "rasasi-hawas-kobra",
    type: "bnib",
    name: "Hawas Kobra",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 2500,
    mrp: 5500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Kobra-112706.html",
    notes: { top: ["Ginger", "Bergamot", "Tangerine"], heart: ["Green Tea", "Cinnamon", "Neroli"], base: ["Musk", "Woody Notes", "Amber"] },
    images: ["bottles/rasasi-hawas-kobra.png"]
  },
  {
    id: "rasasi-hawas-elixir",
    type: "bnib",
    name: "Hawas Elixir",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 2500,
    mrp: 5500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Elixir-110808.html",
    notes: { top: ["Mint", "Bergamot", "Artemisia"], heart: ["Dark Chocolate", "Lavender", "Benzoin"], base: ["Vanilla", "Tonka Bean", "White Musk"] },
    images: ["bottles/rasasi-hawas-elixir.png"]
  },
  {
    id: "rasasi-fattan",
    type: "bnib",
    name: "Fattan",
    house: "Rasasi",
    bottleSize: "50ml",
    price: 1500,
    mrp: 2500,
    available: true,
    dateAdded: "2026-09-30",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Fattan-53484.html",
    notes: { top: ["Grapefruit", "Bergamot", "Pink Pepper"], heart: ["Vetiver", "Cedar", "Patchouli", "Lily-of-the-Valley"], base: ["Oakmoss", "Benzoin", "Amber"] },
    images: ["bottles/rasasi-fattan.png"]
  },
  {
    id: "paris-corner-khair-pistachio",
    type: "bnib",
    name: "Khair Pistachio",
    house: "Paris Corner",
    bottleSize: "100ml",
    price: 1500,
    mrp: 2599,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Khair-Pistachio-92766.html",
    notes: { top: ["Bergamot", "Pistachio", "Hazelnut", "Rum", "Cardamom"], heart: ["Peony", "Jasmine", "Raspberry", "White Peach"], base: ["Marshmallow", "Cotton Candy", "Tonka Bean", "Cedarwood"] },
    images: []
  },
  {
    id: "paris-corner-mawj-moscow-mule",
    type: "bnib",
    name: "Mawj Moscow Mule",
    house: "Paris Corner",
    bottleSize: "100ml",
    price: 2600,
    mrp: 3499,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Mawj-Moscow-Mule-98580.html",
    notes: { top: ["Ginger", "Lemon", "Bergamot"], heart: ["Mint", "Cypress"], base: ["Moss"] },
    images: []
  },
  {
    id: "rayhaan-cedrus-blanc",
    type: "bnib",
    name: "Cedrus Blanc",
    house: "Rayhaan",
    bottleSize: "100ml",
    price: 2300,
    mrp: 4500,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Cedrus-Blanc-138575.html",
    notes: { top: ["Aldehydes", "Bergamot"], heart: ["Orange"], base: ["Cedarwood"] },
    images: []
  },
  {
    id: "rayhaan-lion",
    type: "bnib",
    name: "Lion",
    house: "Rayhaan",
    bottleSize: "100ml",
    price: 2200,
    mrp: 4500,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Lion-105031.html",
    notes: { top: ["Lavender", "Pear", "Mint", "Bergamot"], heart: ["Cinnamon", "Clary Sage", "Cumin"], base: ["Vanilla", "Amber", "Cedar", "Patchouli"] },
    images: []
  },
  {
    id: "rasasi-hawas-verde",
    type: "bnib",
    name: "Hawas Verde",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 3450,
    mrp: 5500,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Verde-117625.html",
    notes: { top: ["Lime", "Green Apple", "Rosemary"], heart: [], base: ["Patchouli", "Amber"] },
    images: []
  },
  {
    id: "rasasi-hawas-venom",
    type: "bnib",
    name: "Hawas Venom",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 3550,
    mrp: 5500,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Venom-138569.html",
    notes: { top: ["Incense", "Labdanum"], heart: ["Leather"], base: ["Incense", "Patchouli", "Vanilla"] },
    images: []
  },
  {
    id: "rasasi-hawas-sapphire",
    type: "bnib",
    name: "Hawas Sapphire",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 3550,
    mrp: 5500,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Sapphire-136382.html",
    notes: { top: ["Guava", "Blackcurrant", "Bergamot"], heart: ["Orange Blossom", "Sandalwood"], base: ["Musk", "Tonka Bean", "Ambergris"] },
    images: []
  },
  {
    id: "rasasi-hawas-fire",
    type: "bnib",
    name: "Hawas Fire",
    house: "Rasasi",
    bottleSize: "100ml",
    price: 3550,
    mrp: 5500,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Fire-101665.html",
    notes: { top: ["Clary Sage"], heart: ["Egyptian Jasmine", "Marine Notes"], base: ["Amber", "Mineral Notes", "Ambergris"] },
    images: []
  },
  {
    id: "arabiyat-prestige-hamdan-the-sheikh",
    type: "bnib",
    name: "Hamdan The Sheikh",
    house: "Arabiyat Prestige",
    bottleSize: "75ml",
    price: 2850,
    mrp: 5750,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Hamdan-The-Sheikh-103400.html",
    notes: { top: ["Bergamot", "Mandarin", "Elemi"], heart: ["Sandalwood", "Amber", "Cedar", "Patchouli"], base: ["Olibanum", "Tonka Bean", "Musk", "Vanilla"] },
    images: []
  },
  {
    id: "dolce-gabbana-the-one-edp",
    type: "bnib",
    name: "The One for Men Eau de Parfum",
    house: "Dolce & Gabbana",
    bottleSize: "150ml",
    price: 7700,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Dolce-Gabbana/The-One-for-Men-Eau-de-Parfum-31909.html",
    notes: { top: ["Grapefruit", "Coriander", "Basil"], heart: ["Cardamom", "Ginger", "Orange Blossom"], base: ["Amber", "Tobacco", "Cedar"] },
    images: []
  },
  {
    id: "diptyque-tam-dao-edp",
    type: "bnib",
    name: "Tam Dao Eau de Parfum",
    house: "Diptyque",
    bottleSize: "75ml",
    price: 16500,
    mrp: 21950,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/Diptyque/Tam-Dao-Eau-de-Parfum-49104.html",
    notes: { top: ["Cypress", "Coriander"], heart: ["Sandalwood", "Cedar"], base: [] },
    images: []
  },
  {
    id: "french-avenue-liquid-brun",
    type: "bnib",
    name: "Liquid Brun",
    house: "French Avenue",
    bottleSize: "100ml",
    price: 2950,
    mrp: 4399,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Liquid-Brun-94713.html",
    notes: { top: ["Cinnamon", "Orange Blossom", "Cardamom", "Bergamot"], heart: ["Bourbon Vanilla", "Elemi"], base: ["Praline", "Ambroxan", "Musk", "Guaiac Wood"] },
    images: []
  },
  {
    id: "french-avenue-liquid-brun-limited-edition",
    type: "bnib",
    name: "Liquid Brun Limited Edition",
    house: "French Avenue",
    bottleSize: "150ml",
    price: 3900,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Liquid-Brun-Limited-Edition-123526.html",
    notes: { top: ["Cardamom", "Lavender", "Citrus"], heart: ["Orange Blossom", "Guaiac Wood", "Rose"], base: ["Vanilla", "Tonka", "Amber", "Oak Moss"] },
    images: ["bottles/french-avenue-liquid-brun-limited-edition.png"]
  },
  {
    id: "french-avenue-zenith-santal",
    type: "bnib",
    name: "Zenith Santal",
    house: "French Avenue",
    bottleSize: "100ml",
    price: 3050,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Zenith-Santal-120869.html",
    notes: { top: ["Saffron"], heart: ["Chestnut", "Lavender"], base: ["Sandalwood", "Vanilla", "Cedarwood"] },
    images: ["bottles/french-avenue-zenith-santal.png"]
  },
  {
    id: "french-avenue-zenith-blue",
    type: "bnib",
    name: "Zenith Blue",
    house: "French Avenue",
    bottleSize: "100ml",
    price: 3050,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Zenith-Blue-106865.html",
    notes: { top: ["Bergamot", "Elemi"], heart: ["Pepper", "Lavender", "Geranium"], base: ["Ambroxan", "Vetiver", "Patchouli"] },
    images: ["bottles/french-avenue-zenith-blue.png"]
  },
  {
    id: "french-avenue-spectre-ghost",
    type: "bnib",
    name: "Spectre Ghost",
    house: "French Avenue",
    bottleSize: "80ml",
    price: 2900,
    mrp: 4299,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Men",
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Spectre-Ghost-94697.html",
    notes: { top: ["Ginger", "Cardamom", "Bergamot"], heart: ["Pink Pepper", "Blackcurrant", "Rose"], base: ["Vanilla", "Cedarwood", "Patchouli"] },
    images: ["bottles/french-avenue-spectre-ghost.png"]
  },
  {
    id: "french-avenue-vulcan-feu",
    type: "bnib",
    name: "Vulcan Feu",
    house: "French Avenue",
    bottleSize: "100ml",
    price: 3200,
    mrp: 4699,
    available: true,
    dateAdded: "2026-10-12",
    gender: "Unisex",
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Vulcan-Feu-105520.html",
    notes: { top: ["Mango", "Lemon", "Ginger", "Rhubarb"], heart: ["Pink Pepper", "Jasmine", "Violet", "Praline"], base: ["Tonka Bean", "Cedarwood", "Ambergris", "Moss"] },
    images: ["bottles/french-avenue-vulcan-feu.png"]
  },
  {
    id: "bvlgari-man-in-black-eau-de-parfum-vial",
    type: "vial",
    name: "Man in Black Eau de Parfum",
    house: "Bvlgari",
    bottleSize: "1.5ml",
    price: 200,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "creed-aventus-vial",
    type: "vial",
    name: "Aventus",
    house: "Creed",
    bottleSize: "1.7ml",
    price: 500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "creed-green-irish-tweed-vial",
    type: "vial",
    name: "Green Irish Tweed",
    house: "Creed",
    bottleSize: "1.7ml",
    price: 500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "creed-delphinus-vial",
    type: "vial",
    name: "Delphinus",
    house: "Creed",
    bottleSize: "1.7ml",
    price: 500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "creed-centaurus-vial",
    type: "vial",
    name: "Centaurus",
    house: "Creed",
    bottleSize: "1.7ml",
    price: 500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "creed-silver-mountain-water-vial",
    type: "vial",
    name: "Silver Mountain Water",
    house: "Creed",
    bottleSize: "1.7ml",
    price: 500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "issey-miyake-leau-dissey-pour-homme-sport-tester",
    type: "tester",
    name: "L'Eau d'Issey Pour Homme Sport",
    house: "Issey Miyake",
    bottleSize: "100ml",
    price: 2600,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Plain tester box.",
    images: []
  },
  {
    id: "creed-aventus-tester",
    type: "tester",
    name: "Aventus",
    house: "Creed",
    bottleSize: "100ml",
    price: 23500,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Without cap. Plain tester box.",
    images: []
  },
  {
    id: "dolce-gabbana-light-blue-eau-intense-tester",
    type: "tester",
    name: "Light Blue Eau Intense",
    house: "Dolce & Gabbana",
    bottleSize: "100ml",
    price: 9000,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Plain tester box.",
    images: []
  },
  {
    id: "narciso-rodriguez-for-him-eau-de-toilette-tester",
    type: "tester",
    name: "For Him Eau de Toilette",
    house: "Narciso Rodriguez",
    bottleSize: "100ml",
    price: 9500,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Without cap. Plain tester box.",
    images: []
  },
  {
    id: "narciso-rodriguez-for-him-eau-de-parfum-tester",
    type: "tester",
    name: "For Him Eau de Parfum",
    house: "Narciso Rodriguez",
    bottleSize: "100ml",
    price: 10500,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Plain tester box.",
    images: []
  },
  {
    id: "narciso-rodriguez-for-him-bleu-noir-parfum-tester",
    type: "tester",
    name: "For Him Bleu Noir Parfum",
    house: "Narciso Rodriguez",
    bottleSize: "100ml",
    price: 6800,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Plain tester box.",
    images: []
  },
  {
    id: "montale-arabians-tonka-tester",
    type: "tester",
    name: "Arabians Tonka",
    house: "Montale",
    bottleSize: "100ml",
    price: 8000,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Plain tester box.",
    images: []
  },
  {
    id: "chopard-oud-malaki-tester",
    type: "tester",
    name: "Oud Malaki",
    house: "Chopard",
    bottleSize: "80ml",
    price: 4500,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Plain tester box.",
    images: []
  },
  {
    id: "arabiyat-prestige-marwa-extrait-tester",
    type: "tester",
    name: "Marwa Extrait",
    house: "Arabiyat Prestige",
    bottleSize: "60ml",
    price: 3100,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: true,
    conditionNotes: "Plain tester box.",
    images: []
  },
  {
    id: "al-nashma-caprice",
    type: "bnib",
    name: "Caprice",
    house: "Al Nashma",
    bottleSize: "100ml",
    price: 2350,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "riiffs-momento",
    type: "bnib",
    name: "Momento",
    house: "Riiffs",
    bottleSize: "100ml",
    price: 2800,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "mykonos-conquer",
    type: "bnib",
    name: "Conquer",
    house: "Mykonos",
    bottleSize: "100ml",
    price: 2800,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "mykonos-inception",
    type: "bnib",
    name: "Inception",
    house: "Mykonos",
    bottleSize: "100ml",
    price: 2900,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "mykonos-sorrento",
    type: "bnib",
    name: "Sorrento",
    house: "Mykonos",
    bottleSize: "100ml",
    price: 3000,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "mykonos-reflection-elixir",
    type: "bnib",
    name: "Reflection Elixir",
    house: "Mykonos",
    bottleSize: "50ml",
    price: 1950,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "mykonos-slow-living",
    type: "bnib",
    name: "Slow Living",
    house: "Mykonos",
    bottleSize: "100ml",
    price: 2900,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "mykonos-inferno",
    type: "bnib",
    name: "Inferno",
    house: "Mykonos",
    bottleSize: "100ml",
    price: 3550,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "arabiyat-prestige-al-noor",
    type: "bnib",
    name: "Al Noor",
    house: "Arabiyat Prestige",
    bottleSize: "100ml",
    price: 2850,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "mancera-cedrat-boise-intense",
    type: "bnib",
    name: "Cedrat Boisé Intense",
    house: "Mancera",
    bottleSize: "120ml",
    price: 8500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "rayhaan-italia",
    type: "bnib",
    name: "Italia",
    house: "Rayhaan",
    bottleSize: "100ml",
    price: 2200,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "rasasi-shuhrah",
    type: "bnib",
    name: "Shuhrah",
    house: "Rasasi",
    bottleSize: "90ml",
    price: 2850,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "azzaro-the-most-wanted-parfum",
    type: "bnib",
    name: "The Most Wanted Parfum",
    house: "Azzaro",
    bottleSize: "100ml",
    price: 5600,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "azzaro-wanted-by-night",
    type: "bnib",
    name: "Wanted by Night",
    house: "Azzaro",
    bottleSize: "100ml",
    price: 6300,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "ajmal-wave",
    type: "bnib",
    name: "Wave",
    house: "Ajmal",
    bottleSize: "100ml",
    price: 1100,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "armaf-club-de-nuit-intense-man-pure-parfum",
    type: "bnib",
    name: "Club de Nuit Intense Man Pure Parfum",
    house: "Armaf",
    bottleSize: "150ml",
    price: 3850,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "maison-alhambra-jean-lowe-immortel",
    type: "bnib",
    name: "Jean Lowe Immortel",
    house: "Maison Alhambra",
    bottleSize: "100ml",
    price: 2500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "hugo-boss-hugo",
    type: "bnib",
    name: "Hugo",
    house: "Hugo Boss",
    bottleSize: "200ml",
    price: 4700,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "guerlain-lhomme-ideal-eau-de-parfum",
    type: "bnib",
    name: "L'Homme Idéal Eau de Parfum",
    house: "Guerlain",
    bottleSize: "100ml",
    price: 7600,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "rochas-moustache-eau-de-parfum",
    type: "bnib",
    name: "Moustache Eau de Parfum",
    house: "Rochas",
    bottleSize: "125ml",
    price: 4400,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "ahmed-al-maghribi-kaaf",
    type: "bnib",
    name: "Kaaf",
    house: "Ahmed Al Maghribi",
    bottleSize: "100ml",
    price: 2500,
    available: true,
    dateAdded: "2026-10-19",
    images: []
  },
  {
    id: "guerlain-habit-rouge-tester",
    type: "tester",
    name: "Habit Rouge",
    house: "Guerlain",
    bottleSize: "100ml",
    price: 6800,
    available: true,
    dateAdded: "2026-10-19",
    boxIncluded: false,
    images: []
  }
];

/* ============================================================
   Small helpers
   ============================================================ */
function enEsc(s){
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function enById(id){ return LISTINGS.find(f => f.id === id); }

/* Photos: if a listing has no images set, look for bottles/<id>.jpg. If a photo
   fails to load, try the same name with other extensions (jpg, jpeg, png, webp,
   upper or lower case) before falling back to the name tile. So any photo named
   exactly like the listing id shows up, whatever its file type. */
const EN_PHOTO_EXTS = ["jpg","jpeg","png","webp","JPG","JPEG","PNG","WEBP"];
function enPhotos(f){
  return (f.images && f.images.length) ? f.images : ["bottles/" + f.id + ".jpg"];
}
document.addEventListener("error", function(e){
  const im = e.target;
  if(!im || im.tagName !== "IMG") return;
  const src = im.getAttribute("src") || "";
  const m = src.match(/^(bottles\/.+)\.([A-Za-z]+)$/);
  if(!m) return;
  const tried = (im.dataset.tried || "").split(",").filter(Boolean);
  if(!tried.includes(m[2])) tried.push(m[2]);
  const next = EN_PHOTO_EXTS.find(x => !tried.includes(x));
  if(next){
    im.dataset.tried = tried.join(",");
    im.src = m[1] + "." + next;
    return;
  }
  /* A photo that fails inside a brand tile is simply dropped; the tile keeps its other photos. */
  if(im.classList.contains("bt-slide")){
    const bt = im.closest(".brand-tile");
    im.remove();
    if(bt){
      const left = bt.querySelectorAll(".bt-slide");
      if(!left.length) bt.classList.remove("has-img");
      else if(!bt.querySelector(".bt-slide.on")) left[0].classList.add("on");
    }
    return;
  }
  const id = m[1].replace(/^bottles\//, "");
  const f = LISTINGS.find(x => x.id === id);
  const tile = document.createElement("span");
  tile.className = "mono-tile";
  tile.setAttribute("aria-hidden", "true");
  tile.textContent = f ? f.house : "";
  im.replaceWith(tile);
}, true);

/* Photos used as CSS backgrounds (brand tiles on the home page): check the file
   exists, try other extensions, and drop the background if there is none. */
function enProbePhoto(path){
  return new Promise(resolve => {
    const m = path.match(/^(.*)\.([A-Za-z]+)$/);
    if(!m) return resolve(null);
    const exts = [m[2]].concat(EN_PHOTO_EXTS.filter(x => x !== m[2]));
    let i = 0;
    (function next(){
      if(i >= exts.length) return resolve(null);
      const p = m[1] + "." + exts[i++];
      const im = new Image();
      im.onload = () => resolve(p);
      im.onerror = next;
      im.src = p;
    })();
  });
}
function enFixBackgrounds(){
  document.querySelectorAll('[style*="bottles/"]').forEach(async el => {
    if(el.dataset.enChecked) return;
    el.dataset.enChecked = "1";
    const mm = (el.style.backgroundImage || "").match(/url\(["']?([^"')]+)["']?\)/);
    if(!mm) return;
    const ok = await enProbePhoto(decodeURI(mm[1]));
    el.style.backgroundImage = ok ? 'url("' + ok + '")' : "none";
  });
}
function enStartBackgroundFix(){
  enFixBackgrounds();
  new MutationObserver(enFixBackgrounds).observe(document.body, { childList: true, subtree: true });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", enStartBackgroundFix);
else enStartBackgroundFix();


const enCurrencyFormatter = new Intl.NumberFormat("en-IN", { style:"currency", currency:"INR", maximumFractionDigits:0 });
function enFormatPrice(amount){ return enCurrencyFormatter.format(amount); }

function enConditionLabel(f){ return f.type === "tester" ? "Tester" : f.type === "vial" ? "Vial" : "BNIB"; }
function enTypeClass(f){ return f.type === "tester" ? "tester" : f.type === "vial" ? "vial" : "bnib"; }
function enStock(f){ return f.available === false ? 0 : EN_MAX_PER_ORDER; }
function enIsSoldOut(f){ return enStock(f) <= 0; }
function enIsNew(f){
  if(!f.dateAdded) return false;
  const since = new Date(f.dateAdded + "T00:00:00");
  if(isNaN(since)) return false;
  const age = (Date.now() - since.getTime()) / 86400000;
  return age >= 0 && age < EN_NEW_DAYS;
}
/* Short note shown on cards: "Sold out" or nothing. The quantity itself is never shown. */
function enStockNote(f){
  return enStock(f) <= 0 ? "Sold out" : "";
}
/* Availability text for the detail view: never a number. */
function enStockText(f){
  return enStock(f) <= 0 ? "Sold out" : "In stock";
}
/* Price with optional MRP: add  mrp: 4500  to a listing to show a strike-through
   price and a "% off" tag. Leave mrp out to show the price alone. */
function enPriceHtml(f){
  const mrp = Number(f.mrp) || 0;
  if(mrp > f.price){
    const off = Math.round((1 - f.price / mrp) * 100);
    return `<span class="price">${enFormatPrice(f.price)}</span> <s class="mrp">${enFormatPrice(mrp)}</s> <span class="off-tag">${off}% off</span>`;
  }
  return `<span class="price">${enFormatPrice(f.price)}</span>`;
}
function enBoxText(f){
  if(f.type === "vial") return "Vial only";
  if(f.type === "tester") return f.boxIncluded === true ? "With box" : f.boxIncluded === false ? "No box" : "Ask us on WhatsApp";
  return "Sealed pack, with box";
}
function enVisibleListings(){
  return EN_SHOW_SOLD_OUT ? LISTINGS.slice() : LISTINGS.filter(f => !enIsSoldOut(f));
}

/* ============================================================
   WhatsApp helpers: notify-me, share, recently viewed
   ============================================================ */
function enNotifyUrl(f){
  const msg = `Hi! Please let me know when ${f.house} ${f.name} (${f.bottleSize}) is back in stock.`;
  return `https://wa.me/${EN_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
/* A link that opens the shop with this perfume's details already showing. */
function enBottleLink(f){
  try{ return new URL("shop.html", EN_SITE_URL || location.href).href + "?open=" + encodeURIComponent(f.id); }
  catch(e){ return "shop.html?open=" + encodeURIComponent(f.id); }
}
function enShareBottle(id){
  const f = enById(id);
  if(!f) return;
  const msg = `${f.house} ${f.name} (${f.bottleSize}, ${enConditionLabel(f)}), ${enFormatPrice(f.price)} at Enigma Perfumes\n${enBottleLink(f)}`;
  window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank", "noopener");
}

function enGetRecent(){
  try{
    const raw = localStorage.getItem(EN_RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  }catch(e){ return []; }
}
function enAddRecent(id){
  const list = [id].concat(enGetRecent().filter(x => x !== id)).slice(0, EN_RECENT_MAX);
  try{ localStorage.setItem(EN_RECENT_KEY, JSON.stringify(list)); }catch(e){ /* storage unavailable */ }
}
function enClearRecent(){
  try{ localStorage.removeItem(EN_RECENT_KEY); }catch(e){ /* ignore */ }
}
function enRecentItems(){ return enGetRecent().map(enById).filter(Boolean); }
function enRecentCardHtml(f){
  return `<button type="button" class="recent-item${enIsSoldOut(f) ? " soldout" : ""}" data-recent="${enEsc(f.id)}" aria-label="View ${enEsc(f.house + " " + f.name)} again">
    ${enThumbHtml(f)}
    <span class="recent-house">${enEsc(f.house)}</span>
    <span class="recent-name">${enEsc(f.name)}</span>
    <span class="recent-price">${enFormatPrice(f.price)}</span>
  </button>`;
}

/* ============================================================
   Toast
   ============================================================ */
function enShowToast(message, ms){
  if(typeof document === "undefined") return;
  let box = document.getElementById("enToastBox");
  if(!box){
    box = document.createElement("div");
    box.id = "enToastBox";
    box.className = "en-toast-box";
    box.setAttribute("aria-live", "polite");
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.className = "en-toast";
  t.textContent = message;
  box.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 220);
  }, ms || 2800);
}

/* ============================================================
   Cart — each line is one listing; qty can never exceed stock
   ============================================================ */
function enGetCart(){
  try{
    const raw = localStorage.getItem(EN_CART_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    return Array.isArray(cart) ? cart : [];
  }catch(e){ return []; }
}
function enSetCart(cart){
  try{ localStorage.setItem(EN_CART_KEY, JSON.stringify(cart)); }catch(e){ /* storage unavailable */ }
  enUpdateBadges();
}
function enCartQtyFor(id){
  const item = enGetCart().find(i => i.id === id);
  return item ? item.qty : 0;
}
function enAddToCart(id, qty){
  qty = qty || 1;
  const f = enById(id);
  if(!f) return false;
  const stock = enStock(f);
  if(stock <= 0){ enShowToast(`${f.name} is sold out.`); return false; }
  const cart = enGetCart();
  const existing = cart.find(i => i.id === id);
  const have = existing ? existing.qty : 0;
  if(have >= stock){
    enShowToast(`${f.name} is already in your cart.`);
    return false;
  }
  const next = Math.min(have + qty, stock);
  if(existing) existing.qty = next; else cart.push({ id, qty: next });
  enSetCart(cart);
  enShowToast(`Added ${f.name} to your cart`);
  return true;
}
function enUpdateQty(id, qty){
  const f = enById(id);
  const cart = enGetCart();
  const item = cart.find(i => i.id === id);
  if(!item || !f) return;
  if(qty <= 0){ enSetCart(cart.filter(i => i !== item)); return; }
  item.qty = Math.min(qty, enStock(f));
  enSetCart(cart);
}
function enRemoveFromCart(id){ enSetCart(enGetCart().filter(i => i.id !== id)); }
function enClearCart(){ enSetCart([]); }
function enCartCount(){ return enGetCart().reduce((n, i) => n + i.qty, 0); }
function enCartLines(){
  return enGetCart().map(i => {
    const f = enById(i.id);
    if(!f) return null;
    return { id: i.id, qty: i.qty, listing: f, unitPrice: f.price, lineTotal: f.price * i.qty, maxQty: enStock(f) };
  }).filter(Boolean);
}
/* Removes sold-out or unknown items and trims quantities to stock.
   Returns a list of messages describing what changed (empty if nothing did). */
function enValidateCart(){
  const before = JSON.stringify(enGetCart());
  const kept = [];
  const msgs = [];
  enGetCart().forEach(i => {
    const f = enById(i.id);
    if(!f) return;
    const stock = enStock(f);
    if(stock <= 0){ msgs.push(`${f.name} is sold out and was removed from your cart.`); return; }
    const qty = Math.max(1, parseInt(i.qty, 10) || 1);
    if(qty > stock){ msgs.push(`Some of ${f.name} is no longer available. Your cart was updated.`); kept.push({ id: i.id, qty: stock }); }
    else kept.push({ id: i.id, qty });
  });
  if(JSON.stringify(kept) !== before) enSetCart(kept);
  return msgs;
}

/* ============================================================
   Wishlist
   ============================================================ */
function enGetWishlist(){
  try{
    const raw = localStorage.getItem(EN_WISHLIST_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  }catch(e){ return []; }
}
function enSetWishlist(list){
  try{ localStorage.setItem(EN_WISHLIST_KEY, JSON.stringify(list)); }catch(e){ /* ignore */ }
  enUpdateBadges();
}
function enIsWishlisted(id){ return enGetWishlist().includes(id); }
function enToggleWishlist(id){
  const list = enGetWishlist();
  const f = enById(id);
  if(list.includes(id)){
    enSetWishlist(list.filter(x => x !== id));
    enShowToast(`Removed ${f ? f.name : "item"} from wishlist`);
    return false;
  }
  list.push(id);
  enSetWishlist(list);
  enShowToast(`Saved ${f ? f.name : "item"} to wishlist`);
  return true;
}
function enWishlistCount(){ return enGetWishlist().length; }
function enWishlistItems(){ return enGetWishlist().map(enById).filter(Boolean); }

function enUpdateBadges(){
  const c = enCartCount(), w = enWishlistCount();
  document.querySelectorAll("[data-cart-count]").forEach(el => { el.textContent = c; });
  document.querySelectorAll("[data-wishlist-count]").forEach(el => { el.textContent = w; });
}

/* ============================================================
   Shared markup: media tile, badge, product card
   ============================================================ */
function enBadgeHtml(f){
  return `<span class="badge badge-${enTypeClass(f)}">${enConditionLabel(f)}</span>`;
}
/* Photo if there is one, otherwise a name tile. withSeal adds the size seal. */
function enMediaHtml(f, withSeal){
  const img = enPhotos(f)[0];
  const seal = withSeal ? `<span class="seal seal-${enTypeClass(f)}" aria-hidden="true">${enEsc(f.bottleSize)}</span>` : "";
  if(img){
    return `<img src="${enEsc(img)}" alt="${enEsc(f.house + " " + f.name)}" loading="lazy">${seal}`;
  }
  return `<span class="mono-tile" aria-hidden="true">${enEsc(f.house)}</span>${seal}`;
}
function enThumbHtml(f){
  return `<div class="thumb">${enMediaHtml(f, false)}</div>`;
}
function enCardHtml(f){
  const sold = enIsSoldOut(f);
  const wished = enIsWishlisted(f.id);
  const note = enStockNote(f);
  const full = `${f.house} ${f.name}`;
  return `
  <article class="card${sold ? " soldout" : ""}" data-id="${enEsc(f.id)}">
    <button class="wish-btn${wished ? " on" : ""}" type="button" data-action="wish" aria-pressed="${wished}" aria-label="${wished ? "Remove from" : "Add to"} wishlist: ${enEsc(full)}">${wished ? "♥" : "♡"}</button>
    <button class="card-media" type="button" data-action="open" aria-label="View details for ${enEsc(full)}">
      ${enMediaHtml(f, true)}
      ${sold ? '<span class="soldout-tag">Sold out</span>' : ""}
    </button>
    <div class="card-body">
      ${enBadgeHtml(f)}
      <div class="card-house">${enEsc(f.house)}${enIsNew(f) ? ' <span class="new-tag">New</span>' : ""}</div>
      <h3 class="card-name"><button type="button" data-action="open">${enEsc(f.name)}</button></h3>
      <div class="card-line">
        <span class="price-wrap">${enPriceHtml(f)}</span>
        <span class="stock-note">${enEsc(sold ? "" : note)}</span>
      </div>
      ${sold
        ? `<a class="btn btn-ghost btn-block" href="${enEsc(enNotifyUrl(f))}" target="_blank" rel="noopener">Notify me when back</a>`
        : `<button class="btn btn-block" type="button" data-action="add">Add to cart</button>`}
    </div>
  </article>`;
}
/* One click handler for a container of cards (catalogue or wishlist). */
function enWireCards(container, opts){
  opts = opts || {};
  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if(!btn) return;
    const card = btn.closest(".card");
    if(!card) return;
    const id = card.dataset.id;
    const action = btn.dataset.action;
    if(action === "open"){ enOpenProductModal(id); }
    else if(action === "add"){ enAddToCart(id, 1); }
    else if(action === "wish"){
      const on = enToggleWishlist(id);
      if(opts.onWishChange){ opts.onWishChange(id, on); }
      else{
        btn.classList.toggle("on", on);
        btn.textContent = on ? "♥" : "♡";
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      }
    }
  });
}

/* ============================================================
   Product detail modal
   ============================================================ */
let enModalEl = null;
function enEnsureModal(){
  if(enModalEl) return enModalEl;
  enModalEl = document.createElement("dialog");
  enModalEl.className = "product";
  enModalEl.setAttribute("aria-label", "Perfume details");
  enModalEl.addEventListener("click", (e) => {
    if(e.target === enModalEl){ enCloseProductModal(); return; }
    const el = e.target.closest("[data-pm]");
    if(!el) return;
    const id = enModalEl.dataset.id;
    const act = el.dataset.pm;
    if(act === "close") enCloseProductModal();
    else if(act === "add"){ if(enAddToCart(id, 1)) enRefreshModalActions(); }
    else if(act === "share") enShareBottle(id);
    else if(act === "wish"){ enToggleWishlist(id); enRefreshModalActions(); refreshAfterWishChange(); }
    else if(act === "thumb"){
      const f = enById(id);
      const i = parseInt(el.dataset.i, 10);
      const main = enModalEl.querySelector(".pm-main");
      if(f && main && enPhotos(f)[i]){
        main.innerHTML = `<img src="${enEsc(enPhotos(f)[i])}" alt="${enEsc(f.house + " " + f.name)}">`;
        enModalEl.querySelectorAll(".pm-thumbs button").forEach(b => b.classList.toggle("on", b === el));
      }
    }
  });
  enModalEl.addEventListener("close", () => {
    if(typeof window.enOnRecentChange === "function") window.enOnRecentChange();
  });
  document.body.appendChild(enModalEl);
  return enModalEl;
}
/* Pages can define window.enOnWishlistChange to re-render their lists. */
function refreshAfterWishChange(){
  if(typeof window.enOnWishlistChange === "function") window.enOnWishlistChange();
}
function enRefreshModalActions(){
  if(!enModalEl || !enModalEl.open) return;
  const f = enById(enModalEl.dataset.id);
  if(!f) return;
  const wrap = enModalEl.querySelector(".pm-actions");
  if(wrap) wrap.innerHTML = enModalActionsHtml(f);
}
function enModalActionsHtml(f){
  const sold = enIsSoldOut(f);
  const wished = enIsWishlisted(f.id);
  return `
    ${sold
      ? `<a class="btn" href="${enEsc(enNotifyUrl(f))}" target="_blank" rel="noopener">Notify me when back</a>`
      : `<button class="btn" type="button" data-pm="add">Add to cart</button>`}
    <button class="btn btn-ghost" type="button" data-pm="wish" aria-pressed="${wished}">${wished ? "♥ Saved" : "♡ Save"}</button>`;
}
function enNotesRow(label, list){
  return list && list.length ? `<li><span>${label}</span><span>${list.map(enEsc).join(", ")}</span></li>` : "";
}
function enOpenProductModal(id){
  const f = enById(id);
  if(!f) return;
  const dlg = enEnsureModal();
  dlg.dataset.id = id;
  enAddRecent(id);
  const imgs = enPhotos(f);
  const main = imgs.length
    ? `<img src="${enEsc(imgs[0])}" alt="${enEsc(f.house + " " + f.name)}">`
    : `<span class="mono-tile" aria-hidden="true">${enEsc(f.house)}</span>`;
  const thumbs = imgs.length > 1
    ? `<div class="pm-thumbs">${imgs.map((src, i) => `<button type="button" data-pm="thumb" data-i="${i}" class="${i === 0 ? "on" : ""}" aria-label="Photo ${i + 1}"><img src="${enEsc(src)}" alt=""></button>`).join("")}</div>`
    : "";
  const n = f.notes || {};
  const notesRows = enNotesRow("Top", n.top) + enNotesRow("Heart", n.heart) + enNotesRow("Base", n.base);
  dlg.innerHTML = `
    <div class="pm">
      <button class="pm-close" type="button" data-pm="close" aria-label="Close">✕</button>
      <div class="pm-media">
        <div class="pm-main">${main}<span class="seal seal-${enTypeClass(f)}" aria-hidden="true">${enEsc(f.bottleSize)}</span></div>
        ${thumbs}
      </div>
      <div class="pm-info">
        ${enBadgeHtml(f)}
        <div class="pm-house">${enEsc(f.house)}</div>
        <h2>${enEsc(f.name)}</h2>
        <div class="pm-price">${enPriceHtml(f)}</div>
        <ul class="pm-facts">
          <li><span>Size</span><span>${enEsc(f.bottleSize)}</span></li>
          <li><span>Box</span><span>${enEsc(enBoxText(f))}</span></li>
          <li><span>Availability</span><span>${enEsc(enStockText(f))}</span></li>
          ${f.gender ? `<li><span>For</span><span>${enEsc(f.gender)}</span></li>` : ""}
          ${f.season ? `<li><span>Season</span><span>${enEsc(f.season)}</span></li>` : ""}
          ${notesRows}
        </ul>
        ${f.type === "tester" && f.conditionNotes ? `<p class="pm-notes-text"><strong>Condition:</strong> ${enEsc(f.conditionNotes)}</p>` : ""}
        ${f.fragranticaUrl ? `<a class="pm-link" href="${enEsc(f.fragranticaUrl)}" target="_blank" rel="noopener">View on Fragrantica</a>` : ""}
        <div class="pm-actions">${enModalActionsHtml(f)}</div>
        <button class="pm-share" type="button" data-pm="share">Share on WhatsApp</button>
      </div>
    </div>`;
  if(typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
}
function enCloseProductModal(){
  if(enModalEl && enModalEl.open) enModalEl.close();
}

/* ============================================================
   Checkout helpers
   ============================================================ */
function enCheckoutGuard(redirectUrl){
  redirectUrl = redirectUrl || "cart.html";
  enValidateCart();
  if(enCartCount() === 0){
    enShowToast("Your cart is empty. Add a perfume first.");
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}
async function enGetNextOrderNumber(){
  if(!EN_ORDER_COUNTER_URL) return null;
  try{
    const res = await fetch(EN_ORDER_COUNTER_URL, { method: "POST" });
    if(!res.ok) throw new Error("Bad response " + res.status);
    const data = await res.json();
    return data.orderNumber || null;
  }catch(err){
    console.error("enGetNextOrderNumber failed:", err);
    return null;
  }
}
/* Date-based code, e.g. EN-260929-K7QF. Used when no counter URL is set. */
function enFallbackOrderNumber(){
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const stamp = String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate());
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "";
  for(let i = 0; i < 4; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return `EN-${stamp}-${r}`;
}


/* ============================================================
   Find numbered images in a folder: folder/1.jpg, folder/2.png ...
   Used for the customer review screenshots (reviews/ folder).
   Allowed: .jpg .jpeg .png .webp (lowercase). Returns a list of paths.
   ============================================================ */
const EN_IMAGE_EXTS = ["jpg", "jpeg", "png", "webp"];
function enLoadImg(src){
  return new Promise(res => {
    const im = new Image();
    im.onload = () => res(src);
    im.onerror = () => res(null);
    im.src = src;
  });
}
async function enFindImage(folder, n){
  const hits = await Promise.all(EN_IMAGE_EXTS.map(e => enLoadImg(`${folder}/${n}.${e}`)));
  return hits.find(Boolean) || null;
}
async function enDiscoverImages(folder){
  const found = [];
  const BATCH = 12, MAX = 300;
  for(let start = 1; start <= MAX; start += BATCH){
    const nums = Array.from({length: BATCH}, (_, i) => start + i);
    const res = await Promise.all(nums.map(n => enFindImage(folder, n)));
    const hits = res.filter(Boolean);
    found.push(...hits);
    if(!hits.length) break;
  }
  return found;
}

/* ============================================================
   Brands and banners (home page)
   ============================================================ */
/* One summary per brand: listings and perfumes in stock, lowest price, and a photo
   if any of that brand's perfumes has one. Most perfumes first, then A to Z. */
function enBrandSummaries(){
  const map = new Map();
  LISTINGS.forEach(f => {
    if(!map.has(f.house)) map.set(f.house, { brand: f.house, listings: 0, bottles: 0, from: null, image: "" });
    const b = map.get(f.house);
    if(!b.image && f.images && f.images[0]) b.image = f.images[0];
    if(!b.guess) b.guess = enPhotos(f)[0];
    if(enIsSoldOut(f)) return;
    b.listings += 1;
    b.bottles += enStock(f);
    b.from = b.from === null ? f.price : Math.min(b.from, f.price);
  });
  /* A brand whose perfumes have no photo path set uses the first perfume's bottles/<id> photo. */
  map.forEach(b => { if(!b.image) b.image = b.guess; delete b.guess; });
  return Array.from(map.values()).sort((a, b) => (b.bottles - a.bottles) || a.brand.localeCompare(b.brand));
}
function enShopLinkForBrand(brand){ return "shop.html?brand=" + encodeURIComponent(brand); }

/* Everything one banner needs, worked out from BANNERS and LISTINGS. */
function enBannerModel(b, index){
  const brand = b.brand || "";
  const inStock = brand ? LISTINGS.filter(f => f.house === brand && !enIsSoldOut(f)) : [];
  const names = inStock.map(f => f.name);
  const shown = names.slice(0, 3);
  const more = names.length - shown.length;
  const from = inStock.length ? Math.min.apply(null, inStock.map(f => f.price)) : null;
  const theme = (typeof b.theme === "number" ? b.theme : index) % 6;
  return {
    index, brand, theme, from,
    link: b.link || (brand ? enShopLinkForBrand(brand) : "shop.html"),
    headline: b.headline || brand || "Enigma Perfumes",
    text: b.text || (shown.length ? shown.join(", ") + (more > 0 ? ` and ${more} more` : "") : ""),
    image: b.image || "", mobileImage: b.mobileImage || "",
    cta: brand ? `Shop ${brand}` : "Shop now",
    label: brand ? `${brand} perfumes` : (b.headline || "Enigma Perfumes")
  };
}
/* A brand with nothing in stock and no picture would make an empty ad, so it is skipped. */
function enActiveBanners(){
  return BANNERS.map(enBannerModel).filter(m => m.image || !m.brand || m.text);
}

/* ---------- Banner pictures found in the banners/ folder ---------- */
function enSlug(text){
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
async function enFindNamed(folder, name){
  const hits = await Promise.all(EN_IMAGE_EXTS.map(e => enLoadImg(`${folder}/${name}.${e}`)));
  return hits.find(Boolean) || null;
}
const EN_BANNER_NUMBERS = 8;
/* The file names the site looks for in banners/ : each brand's name, then 1 to 8. */
function enBannerCandidateNames(){
  const brands = Array.from(new Set(LISTINGS.map(f => f.house)));
  const names = brands.map(b => ({ name: enSlug(b), brand: b }));
  for(let n = 1; n <= EN_BANNER_NUMBERS; n++) names.push({ name: String(n), brand: "", number: n });
  return names;
}
/* Finds the pictures and returns banner models, numbered ones first, then brands in BANNERS order.
   The result is remembered for the visit so moving between pages does not look again. */
async function enDiscoverBanners(skipCache){
  const KEY = "en_banner_scan_v1";
  if(!skipCache){
    try{
      const cached = sessionStorage.getItem(KEY);
      if(cached) return JSON.parse(cached).map((m, i) => enBannerModel(m, i));
    }catch(e){ /* no session storage */ }
  }
  const order = BANNERS.map(b => b.brand);
  const found = (await Promise.all(enBannerCandidateNames().map(async it => {
    const image = await enFindNamed("banners", it.name);
    if(!image) return null;
    const mobileImage = (await enFindNamed("banners", it.name + "-mobile")) || "";
    return {
      brand: it.brand, number: it.number || 0, image, mobileImage, link: "",
      headline: it.brand ? "" : `Featured banner ${it.number}`
    };
  }))).filter(Boolean);
  found.sort((a, b) => {
    if(a.number && b.number) return a.number - b.number;
    if(a.number) return -1;
    if(b.number) return 1;
    const ia = order.indexOf(a.brand), ib = order.indexOf(b.brand);
    return ((ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib)) || a.brand.localeCompare(b.brand);
  });
  try{ sessionStorage.setItem(KEY, JSON.stringify(found)); }catch(e){ /* ignore */ }
  return found.map((m, i) => enBannerModel(m, i));
}
/* The final list of banners that carry a picture: ones set in BANNERS plus ones found in the folder.
   Empty when there are none, so the page keeps the built-in brand ads. */
async function enPictureBanners(){
  const configured = BANNERS.map(enBannerModel).filter(m => m.image);
  const found = await enDiscoverBanners();
  const seen = new Set(configured.map(m => m.image));
  const pics = configured.concat(found.filter(m => !seen.has(m.image))).map((m, i) => Object.assign({}, m, { index: i }));
  if(!pics.length) return [];
  if(!EN_KEEP_BUILTIN_ADS) return pics;
  const covered = new Set(pics.map(m => m.brand).filter(Boolean));
  return pics.concat(enActiveBanners().filter(m => !m.image && !covered.has(m.brand)));
}
/* For index.html?bannercheck : says what the site can and cannot see. */
async function enBannerReport(){
  const lines = [];
  for(const b of BANNERS){
    for(const key of ["image", "mobileImage"]){
      if(b[key]){
        const ok = !!(await enLoadImg(b[key]));
        lines.push({ path: b[key], ok, where: `BANNERS list (${b.brand || "no brand"}, ${key})` });
      }
    }
  }
  const found = await enDiscoverBanners(true);
  found.forEach(m => {
    lines.push({ path: m.image, ok: true, where: "banners folder" });
    if(m.mobileImage) lines.push({ path: m.mobileImage, ok: true, where: "banners folder, phone version" });
  });
  return {
    lines,
    names: enBannerCandidateNames().map(n => n.name),
    exts: EN_IMAGE_EXTS.slice()
  };
}

function enRenderAnnouncement(){
  const el = document.getElementById("announce");
  if(!el) return;
  if(!EN_ANNOUNCEMENTS.length){ el.remove(); return; }
  el.innerHTML = EN_ANNOUNCEMENTS.map(t => `<span>${enEsc(t)}</span>`).join("");
}

/* ============================================================
   Page setup: mobile menu, badges, keep tabs in sync
   ============================================================ */
window.addEventListener("storage", (e) => {
  if(e.key === EN_CART_KEY || e.key === EN_WISHLIST_KEY) enUpdateBadges();
});
document.addEventListener("DOMContentLoaded", () => {
  const msgs = enValidateCart();
  enUpdateBadges();
  enRenderAnnouncement();
  msgs.forEach(m => enShowToast(m, 4200));
  const btn = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("mobileMenu");
  if(btn && menu){
    btn.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }));
  }
});


/* ============================================================
   SEARCH: one search for brands, perfumes and notes.
   - enSearch(text) does the matching (used by the header search and the Shop page).
   - A Search button is added to the header of every page and opens the search panel.
   ============================================================ */
function enSearch(text, limits){
  const lim = Object.assign({ brands: 3, notes: 4, perfumes: 6 }, limits || {});
  const words = String(text || "").toLowerCase().split(/\s+/).filter(Boolean);
  if(!words.length) return { words, brands: [], notes: [], perfumes: [] };
  const all = enVisibleListings();
  const has = (hay) => words.every(w => hay.includes(w));

  const brandMap = new Map();
  all.forEach(f => brandMap.set(f.house, (brandMap.get(f.house) || 0) + 1));
  const brands = Array.from(brandMap.entries())
    .filter(([b]) => has(b.toLowerCase()))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, lim.brands).map(([brand, count]) => ({ brand, count }));

  const noteMap = new Map();
  all.forEach(f => {
    const n = f.notes || {};
    new Set([...(n.top || []), ...(n.heart || []), ...(n.base || [])]).forEach(label => {
      const key = label.toLowerCase();
      if(!noteMap.has(key)) noteMap.set(key, { note: label, count: 0 });
      noteMap.get(key).count += 1;
    });
  });
  const notes = Array.from(noteMap.values())
    .filter(n => has(n.note.toLowerCase()))
    .sort((a, b) => b.count - a.count || a.note.localeCompare(b.note))
    .slice(0, lim.notes);

  const perfumes = all.filter(f => {
    const n = f.notes || {};
    return has([f.house, f.name, f.gender, f.season, ...(n.top || []), ...(n.heart || []), ...(n.base || [])].join(" ").toLowerCase());
  }).sort((a, b) => {
    const sa = enIsSoldOut(a) ? 1 : 0, sb = enIsSoldOut(b) ? 1 : 0;
    if(sa !== sb) return sa - sb;
    const na = (a.house + " " + a.name).toLowerCase().includes(words[0]) ? 0 : 1;
    const nb = (b.house + " " + b.name).toLowerCase().includes(words[0]) ? 0 : 1;
    return na - nb || a.name.localeCompare(b.name);
  }).slice(0, lim.perfumes);

  return { words, brands, notes, perfumes };
}

function enMountSearch(){
  if(document.getElementById("gs")) return;
  const right = document.querySelector(".nav-right");
  if(!right) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "pill gs-open";
  btn.setAttribute("aria-label", "Search");
  btn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><span class="pill-label">Search</span>';
  right.insertBefore(btn, right.firstChild);

  const box = document.createElement("div");
  box.className = "gs";
  box.id = "gs";
  box.hidden = true;
  box.innerHTML = `
    <div class="gs-panel" role="dialog" aria-modal="true" aria-label="Search">
      <div class="gs-form">
        <input type="search" id="gsInput" placeholder="Search brands, perfumes or notes" autocomplete="off" enterkeyhint="search" aria-label="Search brands, perfumes or notes">
        <button type="button" class="gs-close" id="gsClose" aria-label="Close search">✕</button>
      </div>
      <div class="gs-results" id="gsResults"></div>
    </div>`;
  document.body.appendChild(box);

  const input = box.querySelector("#gsInput");
  const out = box.querySelector("#gsResults");
  let idx = -1;

  const shopQ = (q) => "shop.html?q=" + encodeURIComponent(q);
  const row = (href, kind, main, side) =>
    `<a class="gs-item" href="${href}"><span class="gs-main"><span class="gs-kind">${kind}</span><span class="gs-name">${main}</span></span><span class="gs-side">${side}</span></a>`;

  function quickPicks(){
    const brands = enBrandSummaries().filter(b => b.bottles).slice(0, 6);
    const noteCount = new Map();
    enVisibleListings().forEach(f => {
      const n = f.notes || {};
      new Set([...(n.top || []), ...(n.heart || []), ...(n.base || [])]).forEach(x => noteCount.set(x, (noteCount.get(x) || 0) + 1));
    });
    const notes = Array.from(noteCount.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8).map(e => e[0]);
    out.innerHTML =
      `<p class="gs-head">Brands</p><div class="gs-chips">${brands.map(b => `<a class="chip" href="${enEsc(enShopLinkForBrand(b.brand))}">${enEsc(b.brand)}</a>`).join("")}<a class="chip" href="brands.html">All brands</a></div>` +
      (notes.length ? `<p class="gs-head">Popular notes</p><div class="gs-chips">${notes.map(n => `<a class="chip" href="${shopQ(n)}">${enEsc(n)}</a>`).join("")}</div>` : "");
  }

  function render(){
    idx = -1;
    const q = input.value.trim();
    if(!q){ quickPicks(); return; }
    const r = enSearch(q);
    let html = "";
    if(r.brands.length) html += `<p class="gs-head">Brands</p>` + r.brands.map(b =>
      row(enEsc(enShopLinkForBrand(b.brand)), "Brand", enEsc(b.brand), b.count === 1 ? "1 perfume" : b.count + " perfumes")).join("");
    if(r.notes.length) html += `<p class="gs-head">Notes</p>` + r.notes.map(n =>
      row(shopQ(n.note), "Note", enEsc(n.note), n.count === 1 ? "1 perfume" : n.count + " perfumes")).join("");
    if(r.perfumes.length) html += `<p class="gs-head">Perfumes</p>` + r.perfumes.map(f =>
      row("shop.html?open=" + encodeURIComponent(f.id), enEsc(f.house), enEsc(f.name), enIsSoldOut(f) ? "Sold out" : enFormatPrice(f.price))).join("");
    out.innerHTML = html
      ? html + `<a class="gs-all" href="${shopQ(q)}">See all results for “${enEsc(q)}”</a>`
      : `<p class="gs-empty">Nothing found for “${enEsc(q)}”. Try a brand, a perfume name or a note like musk or vanilla.</p>`;
  }

  function open(){
    box.hidden = false;
    document.documentElement.style.overflow = "hidden";
    input.value = "";
    render();
    setTimeout(() => input.focus(), 30);
  }
  function close(){
    box.hidden = true;
    document.documentElement.style.overflow = "";
    btn.focus();
  }
  btn.addEventListener("click", open);
  box.querySelector("#gsClose").addEventListener("click", close);
  box.addEventListener("click", (e) => { if(e.target === box) close(); });
  out.addEventListener("click", () => { document.documentElement.style.overflow = ""; });
  input.addEventListener("input", render);
  input.addEventListener("keydown", (e) => {
    const items = Array.from(out.querySelectorAll(".gs-item, .gs-all"));
    if((e.key === "ArrowDown" || e.key === "ArrowUp") && items.length){
      e.preventDefault();
      idx = (idx + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((a, i) => a.classList.toggle("on", i === idx));
      items[idx].scrollIntoView({ block: "nearest" });
    }else if(e.key === "Enter"){
      e.preventDefault();
      if(idx >= 0 && items[idx]) location.href = items[idx].getAttribute("href");
      else if(input.value.trim()) location.href = shopQ(input.value.trim());
    }
  });
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && !box.hidden) close();
    if(e.key === "/" && box.hidden && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "")){ e.preventDefault(); open(); }
  });
}
document.addEventListener("DOMContentLoaded", enMountSearch);


/* ============================================================
   BRAND TILES: each tile fades through the photos of that brand's own perfumes.
   Nothing to set up: add a perfume with a photo and it joins its brand's tile.
   ============================================================ */
function enBrandSlides(brand){
  const list = LISTINGS.filter(f => f.house === brand)
    .sort((a, b) => (enIsSoldOut(a) ? 1 : 0) - (enIsSoldOut(b) ? 1 : 0));
  const out = [];
  list.forEach(f => { const p = enPhotos(f)[0]; if(p && !out.includes(p)) out.push(p); });
  return out.slice(0, 8);
}
function enBrandSlidesHtml(b){
  const slides = enBrandSlides(b.brand);
  if(!slides.length && b.image) slides.push(b.image);
  return slides.map((src, i) =>
    `<img class="bt-slide${i === 0 ? " on" : ""}" src="${enEsc(src)}" alt="" loading="lazy">`).join("");
}
let enRotationStarted = false;
function enStartBrandRotation(){
  if(enRotationStarted) return;
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const tiles = Array.from(document.querySelectorAll(".brand-tile")).filter(t => t.querySelectorAll(".bt-slide").length > 1);
  if(!tiles.length) return;
  enRotationStarted = true;
  const visible = new Set();
  const io = "IntersectionObserver" in window
    ? new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)))
    : null;
  tiles.forEach((tile, i) => {
    if(io) io.observe(tile); else visible.add(tile);
    /* Staggered starts so the tiles do not all change at the same moment. */
    setTimeout(() => setInterval(() => {
      if(document.hidden || !visible.has(tile)) return;
      const slides = Array.from(tile.querySelectorAll(".bt-slide"));
      if(slides.length < 2) return;
      const cur = slides.findIndex(s => s.classList.contains("on"));
      if(cur < 0){ slides[0].classList.add("on"); return; }
      for(let step = 1; step <= slides.length; step++){
        const next = slides[(cur + step) % slides.length];
        if(next.complete && next.naturalWidth === 0) continue;   // skip a photo that failed to load
        slides[cur].classList.remove("on");
        next.classList.add("on");
        break;
      }
    }, 3500), (i % 6) * 600);
  });
}
