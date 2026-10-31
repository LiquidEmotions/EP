/* store.js — shared catalogue + cart for Liquid Emotions
   Include this on every page BEFORE the page's own script.
   Cart lives in localStorage so it survives navigation between
   index.html, cart.html and checkout.html. */

const LE_CART_KEY = "le_cart_v1";

/* Each fragrance can optionally include an "image" field with a
   URL to a real bottle photo, e.g. "images/9pm-nightout.jpg" or a
   hosted URL. When set, every page (catalogue, cart, wishlist,
   checkout, and the product modal) automatically shows that photo
   instead of the illustrated vial / color swatch. Leave it out
   (or "") to keep the illustrated vial as-is.

   Two more optional fields:
   - "inspiredBy": a short "smells like" reference shown under the
     name, e.g. "YSL Y EDT". Only add this where you can personally
     verify it — comparative fragrance claims should be accurate.
   - "fragranticaUrl": a link to the fragrance's real Fragrantica
     page, shown as a small external link in the product modal.

   - "newSince": the date (YYYY-MM-DD) you added the fragrance,
     e.g. "2026-09-27". Just stamp today's date — no need to
     remove it later. Every fragrance automatically shows a "New"
     badge and counts toward the New filter for LE_NEW_DAYS days
     after that date, then stops on its own. See leIsNew() below. */
const LE_ALL_FRAGRANCES = [
  {
    id: "9am-dive",
    name: "9AM Dive",
    house: "Afnan",
    inspiredBy: "Bleu de Chanel + YSL Y EDP",
    notes: { top: "Lemon, Mint, Black Currant, Pink Pepper", heart: "Apple, Incense, Cedar", base: "Ginger, Sandalwood, Patchouli, Jasmine" },
    color: "#36454F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.78611.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9am-Dive-78611.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "9pm",
    name: "9PM",
    house: "Afnan",
    inspiredBy: "JPG Ultra Male",
    notes: { top: "Apple, Cinnamon, Bergamot", heart: "Orange Blossom, Lily of the Valley", base: "Vanilla, Tonka Bean, Amber" },
    color: "#36454F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.65414.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9pm-65414.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "9pm-nightout",
    name: "9PM Nightout",
    house: "Afnan",
    notes: { top: "Dragon fruit, Lavender", heart: "Toffee, Suede", base: "Tonka bean, Akigalawood" },
    color: "#36454F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.123313.2x.avif",
    gender: "Unisex",
    season: ["Winter","Spring","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9-PM-Night-Out-123313.html",
    prices: { "5ml": 225, "10ml": 390, "20ml": 740, "30ml": 1070 }
  },
{
    id: "9-pm-rebel",
    name: "9PM Rebel",
    inspiredBy: "Creed Aventus Absolu + MFK BR540",
    house: "Afnan",
    notes: { top: "Pineapple, Granny Smith Apple", heart: "Oakmoss, Cedarwood", base: "Drywood, Ambergris" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.99238.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/9-PM-Rebel-99238.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "lynked-freedom",
    name: "Lynked Freedom",
    inspiredBy: "Azzaro Most Wanted Parfum + YSL Myself",
    house: "Afnan",
    notes: { top: "Bergamot, Grapefruit", heart: "Lavender, Cardamom", base: "Caramel, Oriental notes" },
    color: "#B2BEB5",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.119003.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Lynked-Freedom-119003.html",
    prices: { "5ml": 235, "10ml": 400, "20ml": 760, "30ml": 1100 }
  },
  {
    id: "rare-reef",
    name: "Rare Reef",
    inspiredBy: "LV Pacific Chill",
    house: "Afnan",
    notes: { top: "Orange, Mint", heart: "Apricot, Basil", base: "Fig" },
    color: "#5560C9",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106835.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Rare-Reef-106835.html",
    prices: { "5ml": 190, "10ml": 330, "20ml": 620, "30ml": 850 }
  },
  {
    id: "rare-carbon",
    hidden: true,
    name: "Rare Carbon",
    inspiredBy: "Tom Ford Ombre Leather",
    house: "Afnan",
    notes: { top: "Leather, Violet Leaf, Nutmeg", heart: "Violet, Agarwood, Rose", base: "Vetiver, Sandalwood, Amber" },
    color: "#5C4657",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.66627.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Rare-Carbon-66627.html",
    prices: { "5ml": 190, "10ml": 330, "20ml": 620, "30ml": 850 }
  },
  {
    id: "supremacy-not-only-intense",
    name: "Supremacy Not Only Intense",
    inspiredBy: "Creed Aventus",
    house: "Afnan",
    notes: { top: "Black Currant, Bergamot, Apple", heart: "Oakmoss, Patchouli", base: "Ambergris, Musk" },
    color: "#6B5D42",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.68271.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Supremacy-Not-Only-Intense-68271.html",
    prices: { "5ml": 190, "10ml": 330, "20ml": 620, "30ml": 850 }
  },
  {
    id: "supremacy-collectors-edition",
    name: "Supremacy Collector's Edition",
    inspiredBy: "Creed Aventus Absolu",
    house: "Afnan",
    notes: { top: "Pineapple, Bergamot, White Flower", heart: "Orange Blossom, Birch", base: "Oakmoss, Ambergris, Musk" },
    color: "#D2A23E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98689.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Supremacy-Collector-s-Edition-Pour-Homme-98689.html",
    prices: { "5ml": 245, "10ml": 430, "20ml": 810, "30ml": 1190 }
  },
  {
    id: "turathi-blue",
    name: "Turathi Blue",
    inspiredBy: "Bvlgari Tygar",
    house: "Afnan",
    notes: { top: "Citruses", heart: "Woodsy Notes, Amber", base: "Musk, Spices, Patchouli" },
    color: "#D2A23E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.70839.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Afnan/Turathi-Blue-70839.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    id: "bin-shaikh",
    name: "Bin Shaikh",
    house: "Ahmed Al Maghribi",
    notes: { top: "French Lavender, Saffron, Rose, Citruses, Oakmoss", heart: "Incense Bakhoor, Crystalline Sugar, Jasmine, Orchid, Violet", base: "Agarwood, Amber Resins, Patchouli, White Musk, Ambroxan" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.66619.2x.avif",
    gender: "Unisex",
    season: ["Winter"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Bin-Shaikh-66619.html",
    prices: { "5ml": 340, "10ml": 620, "20ml": 1190, "30ml": 1750 }
  },
  {
    id: "kaaf",
    name: "Kaaf",
    inspiredBy: "PDM Percival",
    house: "Ahmed Al Maghribi",
    notes: { top: "Lavender, Watermelon", heart: "Lily of the Valley", base: "White Musk, Ambroxan" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.102460.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Kaaf-102460.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "marj",
    name: "Marj",
    house: "Ahmed Al Maghribi",
    notes: { top: "Oud, Honey, Bergamot, Mandarin/Tangerine, Pink Pepper, Nutmeg, Elemi", heart: "Cashmere Wood, Saffron, Rose, Jasmine, Orange Blossom, Patchouli, Vetiver, Cinnamon, Aromatic Accords", base: "Agarwood, Leather, Amber, Ambergris, Musk, Sandalwood, Raspberry, Pear, Violet, Oakmoss, Ambrette Seeds, Ambroxan" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.104339.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Marj-104339.html",
    prices: { "5ml": 360, "10ml": 660, "20ml": 1300, "30ml": 1880 }
  },
  {
    id: "evoke-gold",
    name: "Evoke Gold",
    inspiredBy: "Prada L'Homme",
    house: "Ajmal",
    notes: { top: "Neroli,Pepper", heart: "Orris Root, Amber,Geranium", base: "Cedar,Patchouli" },
    color: "#3E8FB0",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.51252.2x.avif",
    gender: "Men",
    season: ["Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ajmal/Evoke-Gold-For-Him-51252.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },

  {
    id: "aqua-dubai",
    name: "Aqua Dubai",
    inspiredBy: "LV Imagination",
    house: "Al Haramain",
    notes: { top: "Bergamot, Green Notes, Mandarin Orange", heart: "Melon, Amber, Black Currant", base: "Petitgrain, Musk" },
    color: "#3E8FB0",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.96482.2x.avif",
    gender: "Unisex",
    season: ["Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Al-Haramain-Perfumes/Amber-Oud-Aqua-Dubai-96482.html",
    prices: { "5ml": 310, "10ml": 560, "20ml": 1080, "30ml": 1580 }
  },
  {
    id: "l-aventure-knight",
    hidden: true,
    name: "L'Aventure Knight",
    inspiredBy: "Creed Green Irish Tweed",
    house: "Al Haramain",
    notes: { top: "Lemon Verbena, Bergamot, Tea", heart: "Violet Leaf, Iris", base: "Powdery Notes, Ambergris, Musk" },
    color: "#4A8067",
    image: "https://shop.alharamainperfumes.com/media/catalog/product/cache/490c4e3bbae272be3ce2b30a9945698e/1/9/1905p-image.jpg",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Al-Haramain-Perfumes/L-Aventure-Knight-51824.html",
    prices: { "5ml": 200, "10ml": 360, "20ml": 680, "30ml": 940 }
  },
  {
    id: "bois-blanc",
    name: "Bois Blanc",
    inspiredBy: "Bois Impérial by Essential Parfums",
    house: "Arabiyat Prestige",
    notes: { top: "Grapefruit, Elemi, Pink Pepper", heart: "Lily of the valley, Amber, Violet", base: "Patchouli, Ambergris" },
    color: "#7C9473",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.137297.2x.avif?t=1783675275",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Bois-Blanc-137297.html",
    prices: { "5ml": 225, "10ml": 390, "20ml": 720, "30ml": 1050 }
  },
  {
    id: "revolt-uncaged",
    name: "Revolt Uncaged",
    inspiredBy: "Nishane Tero",
    house: "Arabiyat Prestige",
    notes: { top: "Caramel, Black Pepper, Sichuan Pepper, Salt", heart: "Patchouli, Cinnamon", base: "Amber, Vetiver" },
    color: "#A85C2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.134072.2x.avif",
    gender: "Unisex",
    season: ["Winter", "Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Revolt-Uncaged-134072.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "revolt-uprising",
    name: "Revolt Uprising",
    inspiredBy: "Nishane Ani X",
    house: "Arabiyat Prestige",
    notes: { top: "Pink Pepper, Bergamot, Ginger", heart: "Black Currant, Green Apple", base: "Vanilla, Caramel" },
    color: "#C15C7A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.134073.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Revolt-Uprising-134073.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "stronger-with-you-intensely",
    name: "Stronger With You Intensely",
    house: "Emporio Armani",
    notes: { top: "Pink Pepper, Juniper", heart: "Toffee, Cinnamon", base: "Vanilla, Amber" },
    color: "#9C6B3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.52802.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Giorgio-Armani/Emporio-Armani-Stronger-With-You-Intensely-52802.html",
    prices: { "3ml": 265, "5ml": 400, "10ml": 740, "20ml": 1440, "30ml": 2120 }
  },
  {
    id: "eros-flame",
    name: "Eros Flame",
    house: "Versace",
    notes: { top: "Mandarin Orange, Madagascar Pepper, Lemon, Chinotto", heart: "Geranium, Rose", base: "Vanilla, Tonka Bean, Sandalwood, Texas Cedar" },
    color: "#C1542E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.52180.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Versace/Eros-Flame-52180.html",
    prices: { "3ml": 200, "5ml": 260, "10ml": 460, "20ml": 880, "30ml": 1280 }
  },
  {
    id: "polo-67-edp",
    name: "Polo 67 EDP",
    house: "Ralph Lauren",
    notes: { top: "Green Mandarin, Cardamom, Bergamot", heart: "Pineapple, Lavender", base: "Benzoin, Cedarwood" },
    color: "#6B8250",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.108720.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ralph-Lauren/Polo-67-Eau-de-Parfum-108720.html",
    prices: { "3ml": 180, "5ml": 250, "10ml": 440, "20ml": 840, "30ml": 1220 }
  },
  {
    id: "bleu-noir",
    name: "Bleu Noir Parfum",
    house: "Narciso Rodriguez",
    notes: { top: "Cardamom, Cypress, Bergamot", heart: "Iris, Musk", base: "Tonka Bean, Sandalwood" },
    color: "#2C3E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.71783.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-for-Him-Bleu-Noir-Parfum-71783.html",
    prices: { "3ml": 265, "5ml": 400, "10ml": 740, "20ml": 1440, "30ml": 2120 }
  },
  {
    id: "aoud-lemon-mint",
    name: "Aoud Lemon Mint",
    house: "Mancera",
    notes: { top: "Lemon, Almond, Black Pepper", heart: "Agarwood, Patchouli, Mint", base: "Vanilla, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.39181.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Mancera/Aoud-Lemon-Mint-39181.html",
    prices: { "3ml": 265, "5ml": 390, "10ml": 720, "20ml": 1400, "30ml": 2060 }
  },
  {
    id: "intense-red-tobacco",
    name: "Intense Red Tobacco",
    house: "Mancera",
    notes: { top: "Agarwood (Oud), Cinnamon, Incense, Saffron, Pear, Nutmeg", heart: "Tobacco, Leather, Patchouli, Vetiver, Jasmine", base: "Vanilla, Musk, Sandalwood, Guaiac Wood, Ambergris" },
    color: "#6B2A24",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.84246.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Mancera/Red-Tobacco-Intense-84246.html",
    prices: { "3ml": 240, "5ml": 360, "10ml": 660, "20ml": 1280, "30ml": 1880 }
  },
  {
    id: "arabians-tonka",
    name: "Arabians Tonka",
    house: "Montale",
    notes: { top: "Saffron, Bergamot", heart: "Agarwood (Oud), Bulgarian Rose", base: "Tonka Bean, Sugar Cane, Amber, White Musk, Oakmoss" },
    color: "#8A5A32",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.57384.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Montale/Arabians-Tonka-57384.html",
    prices: { "3ml": 300, "5ml": 460, "10ml": 860, "20ml": 1680, "30ml": 2480 }
  },
  {
    id: "al-noor",
    name: "Al Noor",
    inspiredBy: "BDK Gris Charnel",
    house: "Arabiyat Prestige",
    notes: { top: "Cardamom, Nutmeg, Saffron", heart: "Fig, Iris", base: "Leather, Tonka Bean" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.115515.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Al-Noor-115515.html",
    prices: { "5ml": 200, "10ml": 360, "20ml": 680, "30ml": 940 }
  },
  {
    id: "marwa",
    name: "Marwa",
    inspiredBy: "LV Imagination",
    house: "Arabiyat Prestige",
    notes: { top: "Calabrian Bergamot, Lemon", heart: "Nigerian Ginger, Ceylon Cinnamon", base: "Chinese Black Tea" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.107084.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Marwa-107084.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "mahd-al-dahab",
    hidden: true,
    name: "Mahd Al Dahab",
    inspiredBy: "Borntostandout Drunk Lovers",
    house: "Arabiyat Prestige",
    notes: { top: "Bergamot, Spices, Lemon", heart: "Amber, Patchouli, Oud", base: "Vanilla, Sandalwood, White Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.107083.2x.avif",
    gender: "Unisex",
    season: ["Winter","Spring","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Mahd-Al-Dhahab-107083.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "hamdan-the-sheikh",
    name: "Hamdan The Sheikh",
    inspiredBy: "Dior Sauvage EDP",
    house: "Arabiyat Prestige",
    notes: { top: "Bergamot, Mandarin, Elemi", heart: "Sandalwood, Amber", base: "Olibanum, Tonka Bean, Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.103400.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Hamdan-The-Sheikh-103400.html",
    prices: { "5ml": 250, "10ml": 440, "20ml": 830, "30ml": 1200 }
  },
  
  {
    id: "dunescape",
    name: "Dunescape",
    inspiredBy: "YSL Y EDP",
    house: "Armaf",
    notes: { top: "Blood Orange, Bergamot, Mandarin", heart: "Apple, Ozonic Notes, Geranium", base: "Musk, Sandalwood, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.130942.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Dunescape-130942.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  
  {
    id: "precieux-I",
    name: "Precieux I",
    inspiredBy: "Creed Aventus Absolu",
    house: "Armaf",
    notes: { top: "Pineapple, Bergamot, Lemon", heart: "Oakmoss, White Wood", base: "Ambroxan, White Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.93272.2x.avif",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-de-Nuit-Precieux-I-93272.html",
    prices: { "5ml": 470, "10ml": 860, "20ml": 1680, "30ml": 2500 }
  },
  {
    id: "infinity",
    name: "Infinity",
    inspiredBy: "YSL L'Homme Ultime",
    house: "Armaf",
    notes: { top: "Bergamot, Ginger", heart: "Rose, Apple", base: "Cedar, Vetiver" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98715.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Black-98715.html",
    prices: { "5ml": 230, "10ml": 410, "20ml": 780, "30ml": 1150 }
  },
  {
    id: "platine-blanc",
    name: "Platine Blanc",
    inspiredBy: "Xerjoff Torino 21",
    house: "Aromatix",
    notes: { top: "Mint, Lemon", heart: "Rosemary, Blackcurrant", base: "Musk, Ambergris" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106068.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Aromatix-X-French-Avenue/Platine-Blanc-106068.html",
    prices: { "5ml": 260, "10ml": 460, "20ml": 880, "30ml": 1280 }
  },
  
  
  {
    id: "vulcan-feu",
    name: "Vulcan Feu",
    inspiredBy: "SHL God of Fire",
    house: "French Avenue",
    notes: { top: "Mango, Lemon, Ginger", heart: "Pink Pepper, Jasmine", base: "Tonka Bean, Cedarwood" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.105520.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Vulcan-Feu-105520.html",
    prices: { "5ml": 200, "10ml": 360, "20ml": 680, "30ml": 940 }
  },
  
  
  {
    id: "le-male-elixir",
    name: "Le Male Elixir",
    house: "Jean Paul Gaultier",
    notes: { top: "Lavender, Mint", heart: "Vanilla, Benzoin", base: "Honey, Tonka Bean, Tobacco" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.81642.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Jean-Paul-Gaultier/Le-Male-Elixir-81642.html",
    prices: { "3ml": 265, "5ml": 390, "10ml": 720, "20ml": 1400, "30ml": 2060 }
  },
  
  {
    id: "asad-elixir",
    name: "Asad Elixir",
    inspiredBy: "Boss Bottled Absolu",
    house: "Lattafa",
    notes: { top: "Pink Pepper, Saffron", heart: "Tobacco, Vanilla", base: "Light Amber, Frankincense" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.117616.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Asad-Elixir-117616.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "jean-lowe-immortel",
    name: "Jean Lowe Immortel",
    inspiredBy: "LV L'Immensite",
    house: "Maison Al Hambra",
    notes: { top: "Ginger, Grapefruit, Bergamot", heart: "Rosemary, Water Notes", base: "Ambroxan, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.83666.2x.avif",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Maison-Alhambra/Jean-Lowe-Immortal-83666.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "toscano-leather",
    name: "Toscano Leather",
    inspiredBy: "Tom Ford Tuscan Leather",
    house: "Maison Al Hambra",
    notes: { top: "Animal Notes, Saffron", heart: "Leather, Raspberry", base: "Leather, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.79942.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Maison-Alhambra/Toscano-Leather-79942.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 500, "30ml": 755 }
  },
  {
    id: "luna-rossa-carbon",
    name: "Luna Rossa Carbon EDT",
    house: "Prada",
    notes: { top: "Bergamot, Pepper", heart: "Lavender, Metallic Notes", base: "Ambroxan, Patchouli" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.43402.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Prada/Luna-Rossa-Carbon-Eau-de-Toilette-43402.html",
    prices: { "3ml": 240, "5ml": 360, "10ml": 660, "20ml": 1280, "30ml": 1880 }
  },
  {
    id: "hawas",
    name: "Hawas for him",
    inspiredBy: "Paco Rabanne Invictus",
    house: "Rasasi",
    notes: { top: "Apple, Bergamot, Lemon", heart: "Watery Notes, Plum", base: "Ambergris, Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.46890.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-for-Him-46890.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "hawas-elixir",
    name: "Hawas Elixir",
    inspiredBy: "JPG Le Male Elixir",
    house: "Rasasi",
    notes: { top: "Mint, Bergamot", heart: "Dark Chocolate, Lavender", base: "Vanilla, Tonka Bean, Musk" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.110808.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Elixir-110808.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "lion",
    name: "Lion",
    inspiredBy: "JPG Le Male",
    house: "Rayhaan",
    notes: { top: "Lavender, Pear, Mint", heart: "Cinnamon, Clary Sage", base: "Vanilla, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.105031.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Lion-105031.html",
    prices: { "5ml": 165, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "spicebomb-extreme",
    name: "Spicebomb Extreme",
    house: "Viktor & Rolf",
    notes: { top: "Grapefruit, Pimento, Black Pepper", heart: "Cinnamon, Saffron, Cumin", base: "Tobacco, Bourbon Whiskey, Black Vanilla, Amber" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.30499.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Viktor-Rolf/Spicebomb-Extreme-30499.html",
    prices: { "3ml": 275, "5ml": 410, "10ml": 760, "20ml": 1480, "30ml": 2180 }
  },
  {
    id: "acqua-di-gio",
    name: "Acqua Di Gio Parfum",
    house: "Giorgio Armani",
    notes: { top: "Marine Notes, Bergamot", heart: "Rosemary, Clary Sage", base: "Olibanum, Patchouli" },
    color: "#4A8067",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.81508.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Giorgio-Armani/Acqua-di-Gio-Parfum-81508.html",
    prices: { "3ml": 285, "5ml": 440, "10ml": 810, "20ml": 1580, "30ml": 2330 }
  }  ,
  {
    id: "kaaf-noir",
    name: "Kaaf Noir",
    house: "Ahmed Al Maghribi",
    inspiredBy: "Dolce & Gabbana K",
    notes: { top: "Blood Orange, Sicilian Lemon, Juniper Berries, Cardamom", heart: "Lavender, Clary Sage, Geranium, Iso E Super, Hedione", base: "Ambroxan, Cedarwood, Patchouli, Vetiver, White Musk" },
    color: "#1C1C2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.130637.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ahmed-Al-Maghribi/Kaaf-Noir-130637.html",
    prices: { "5ml": 205, "10ml": 350, "20ml": 660, "30ml": 950 }
  },
  {
    id: "kohl-opulence",
    name: "Kohl Opulence",
    inspiredBy: "Ex Nihilo Blue Talisman",
    house: "Arabiyat Prestige",
    notes: { top: "Pear, Bergamot, Ginger", heart: "Orange Blossom, Jasmine, Woody Notes", base: "Musk, Vanilla, Amber" },
    color: "#C9A66B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.115528.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Kohl-Opulence-115528.html",
    prices: { "5ml": 190, "10ml": 320, "20ml": 600, "30ml": 860 }
  },
  {
    id: "ramad-oriental",
    name: "Ramad Oriental",
    inspiredBy: "Amouage Outlands",
    house: "Arabiyat Prestige",
    notes: { top: "Cardamom, Elemi, Pepper, Lemon, Bergamot", heart: "Patchouli, Saffron, Cumin, Geranium, Jasmine", base: "Olibanum, Opoponax, Vanilla, Benzoin, Amber" },
    color: "#6E5A3C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.115548.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Arabiyat-Prestige/Ramad-Oriental-115548.html",
    prices: { "5ml": 180, "10ml": 300, "20ml": 560, "30ml": 800 }
  },
  {
    id: "al-dirgham-limited-edition",
    name: "Al Dirgham Limited Edition",
    inspiredBy: "Chanel Allure Homme Sport Eau Extreme",
    house: "Ard Al Zafran",
    notes: { top: "Tangerine, Lemongrass, Geranium", heart: "Tuberose, Lily of the Valley, Jasmine, Rose, Cinnamon, Cloves", base: "Musk, Floral Notes, Tonka Bean, Vanilla" },
    color: "#8FA6A3",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.87214.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ard-Al-Zaafaran/Al-Dirgham-87214.html",
    prices: { "5ml": 130, "10ml": 200, "20ml": 360, "30ml": 500 }
  },
  {
    id: "club-de-nuit-intense-man-pp",
    name: "Club de Nuit Intense Man PP",
    inspiredBy: "Creed Aventus",
    house: "Armaf",
    notes: { top: "Lemon, Pineapple, Bergamot, Black Currant, Apple", heart: "Birch, Jasmine, Rose", base: "Ambergris, Musk, Patchouli, Vanilla" },
    color: "#2E2E2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.72842.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-de-Nuit-Intense-Man-Parfum-72842.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  
  {
    id: "club-de-nuit-intense-man-limited-edition",
    name: "Club de Nuit Intense Man Limited Edition",
    house: "Armaf",
    newSince: "2026-09-29",
    inspiredBy: "Creed Aventus",
    notes: { top: "Lemon, Pineapple, Lime,Black pepper,Bergamot,Pink Pepper", heart: "Jasmine,Rose,Lily of the valley,Freesia", base: "White Musk,Ambroxan, Ambergris, Cedar,Leather,Patchouli" },
    color: "#1F2A44",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.77861.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-de-Nuit-Intense-Man-Limited-Edition-Parfum-77861.html",
    prices: { "5ml": 350, "10ml": 635, "20ml": 1230, "30ml": 1800 }
  },
  {
    id: "club-de-nuit-intense-Overdose",
    name: "Club de Nuit Intense Overdose",
    house: "Armaf",
    inspiredBy: "Creed Aventus Absolu",
    notes: { top: "Pineapple,Bergamot,Tangarine,blue Crystal", heart: "Oakmoss,Vanilla Flower,Plum", base: "Patchouli,Amber,White Powder,Tonka Bean" },
    color: "#1F2A44",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.136770.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Club-De-Nuit-Intense-Overdose-136770.html",
    prices: { "5ml": 245, "10ml": 430, "20ml": 820, "30ml": 1190 }
  },
  {
    id: "odyssey-mandarin-sky-elixir",
    name: "Odyssey Mandarin Sky Elixir",
    inspiredBy: "YSL Scandal Le Parfum",
    house: "Armaf",
    notes: { top: "Mandarin, Orange, Lavender, Cardamom, Black Pepper", heart: "Caramel, Tonka Bean, Patchouli, Incense", base: "Vanilla, Vetiver" },
    color: "#B5651D",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106709.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Odyssey-Mandarin-Sky-Elixir-106709.html",
    prices: { "5ml": 170, "10ml": 270, "20ml": 500, "30ml": 710 }
  },
  {
    id: "spartacus",
    name: "Spartacus",
    house: "Armaf",
    inspiredBy: "JPG Le Male Elixir",
    notes: { top: "Orange Blossom, Cinnamon, Cardamom, Plum, Bergamot", heart: "Bourbon Vanilla, Candied Almond, Lavender, Davana, Elemi", base: "Praline, Musk, Tonka Bean, Amber, Labdanum, Patchouli, Guaiac Wood, Benzoin" },
    color: "#7A5C3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.129502.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Armaf/Spartacus-129502.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 820 }
  },
  {
    id: "sunkissed",
    name: "Sunkissed",
    house: "Aromatix",
    notes: { top: "Bitter Orange, Pomelo, Bergamot", heart: "Tea, Aperol, Cream Soda, Cardamom", base: "Cedarwood, Vetiver, Ambertonic, Vanilla, Cashmeran" },
    color: "#E08E45",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.117530.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Aromatix-X-French-Avenue/Sun-Kissed-117530.html",
    prices: { "5ml": 260, "10ml": 460, "20ml": 880, "30ml": 1280 }
  },
  {
    id: "atlantis",
    name: "Atlantis",
    house: "French Avenue",
    inspiredBy: "Room 1015 Wave Child",
    notes: { top: "Orange, Mandarin, Lemon", heart: "Watermelon, Coconut", base: "Ambergris, Cacao, Amberwood" },
    color: "#2E6E7A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.113595.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Atlantis-Extrait-113595.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1140 }
  },
  {
    id: "liquid-brun",
    name: "Liquid Brun",
    house: "French Avenue",
    inspiredBy: "Parfums de Marly Althaïr",
    notes: { top: "Cinnamon, Orange Blossom, Cardamom, Bergamot", heart: "Bourbon Vanilla, Elemi", base: "Praline, Ambroxan, Musk, Guaiac Wood" },
    color: "#5A3A2A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.94713.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Liquid-Brun-94713.html",
    prices: { "5ml": 205, "10ml": 350, "20ml": 660, "30ml": 950 }
  },
  {
    id: "liquid-brun-limited-edition",
    name: "Liquid Brun Limited Edition",
    house: "French Avenue",
    inspiredBy: "Parfums de Marly Althaïr",
    notes: { top: "Cardamom, Lavender, Citrus", heart: "Orange Blossom, Guaiac Wood, Rose", base: "Vanilla, Tonka, Amber, Oak Moss" },
    color: "#4A3020",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.123526.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Liquid-Brun-Limited-Edition-123526.html",
    prices: { "5ml": 190, "10ml": 320, "20ml": 600, "30ml": 860 }
  },
  {
    id: "spectre-ghost",
    name: "Spectre Ghost",
    house: "French Avenue",
    inspiredBy: "Nishane Ani",
    notes: { top: "Ginger, Cardamom, Bergamot", heart: "Pink Pepper, Blackcurrant, Rose", base: "Vanilla, Cedarwood, Patchouli" },
    color: "#3A3F4A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.94697.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Spectre-Ghost-94697.html",
    prices: { "5ml": 245, "10ml": 430, "20ml": 810, "30ml": 1190 }
  },
  {
    id: "zenith-blue",
    name: "Zenith Blue",
    inspiredBy: "Dior Sauvage",
    house: "French Avenue",
    notes: { top: "Bergamot, Elemi", heart: "Pepper, Lavender, Geranium", base: "Ambroxan, Vetiver, Patchouli" },
    color: "#2A4B7C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.106865.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/French-Avenue/Zenith-Blue-106865.html",
    prices: { "5ml": 210, "10ml": 370, "20ml": 700, "30ml": 1010 }
  },
  {
    id: "black-diamond-incense",
    name: "Black Diamond Incense",
    house: "IBRAQ",
    notes: { top: "Black Currant, Aquatic Notes, Birch", heart: "Incense, Vanilla, Sandalwood", base: "Leather, Oud, Smoke, Amber" },
    color: "#22252B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.100548.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ibraheem-AlQurashi/Black-Diamond-Incense-100548.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "french-tobacco",
    name: "French Tobacco",
    inspiredBy: "Louis Vuitton Imagination",
    house: "IBRAQ",
    notes: { top: "Mandarin, Blood Orange, Green Apple", heart: "Ginger, Neroli, Cinnamon, Tobacco", base: "Lemongrass, Frankincense, Guaiac Wood, Iris" },
    color: "#8A7048",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.100552.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ibraheem-AlQurashi/French-Tobacco-100552.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    id: "ibraq-sandalwood",
    name: "Sandalwood",
    house: "IBRAQ",
    inspiredBy: "Van Cleef & Arpels Moonlight Patchouli",
    notes: { top: "Damask Rose, Raspberry", heart: "Powder, Cedarwood", base: "Amber, Sandalwood" },
    color: "#7A5C44",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.100577.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Ibraheem-AlQurashi/Sandalwood-100577.html",
    prices: { "5ml": 230, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    id: "island-dreams",
    name: "Island Dreams",
    house: "Khadlaj",
    inspiredBy: "Louis Vuitton Symphony",
    notes: { top: "Bergamot, Ginger", heart: "Grapefruit", base: "Musk, Ambroxan" },
    color: "#3FA0A8",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.113593.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Khadlaj-Perfumes/Island-Dreams-113593.html",
    prices: { "5ml": 160, "10ml": 260, "20ml": 480, "30ml": 680 }
  },
  {
    id: "shiyaaka-sky",
    name: "Shiyaaka Sky",
    house: "Khadlaj",
    inspiredBy: "Guerlain Herbes Troublantes",
    notes: { top: "Bergamot, Verbena, Mandarin", heart: "Green Accord, Neroli, Orange Blossom, Geranium", base: "Musk, Ambroxan, Vetiver, Sandalwood" },
    color: "#8FB8C9",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.137096.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Khadlaj-Perfumes/Shiyaaka-Sky-137096.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "fahad",
    name: "Fahad",
    house: "Lattafa",
    notes: { top: "Mandarin, Pineapple, Black Pepper", heart: "Orange Blossom, Lavender, Artemisia", base: "Incense, Patchouli, Cedarwood, Ambroxan" },
    color: "#25282C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.136650.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Fahad-136650.html",
    prices: { "5ml": 240, "10ml": 420, "20ml": 800, "30ml": 1150 }
  },
  {
    id: "teriaq-intense",
    name: "Teriaq Intense",
    house: "Lattafa",
    inspiredBy: "Kilian Angels' Share",
    notes: { top: "Saffron, Bergamot", heart: "Plum Liquor, Cinnamon", base: "Amber, Tonka Bean, Benzoin" },
    color: "#5C2A2A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.99586.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Teriaq-Intense-99586.html",
    prices: { "5ml": 215, "10ml": 370, "20ml": 700, "30ml": 1010 }
  },
  {
    id: "mawj-appletini",
    name: "Mawj Appletini",
    house: "Paris Corner",
    inspiredBy: "Kilian Apple Brandy on the Rocks",
    notes: { top: "Cardamom, Bergamot", heart: "Apple, Brandy, Vanilla, Rum, Pineapple, Moss", base: "Cedar, Ambroxan" },
    color: "#7BA05B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98582.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Mawj-Appletini-98582.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "mawj-moscow-mule",
    name: "Mawj Moscow Mule",
    house: "Paris Corner",
    inspiredBy: "Kilian Blue Moon Ginger Dash",
    notes: { top: "Ginger, Lemon, Bergamot", heart: "Mint, Cypress", base: "Moss" },
    color: "#A9C23F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.98580.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Mawj-Moscow-Mule-98580.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "rifaaqat",
    name: "Rifaaqat",
    house: "Paris Corner",
    inspiredBy: "YSL Babycat",
    notes: { top: "Black Pepper, Elemi, Pink Pepper", heart: "Olibanum, Saffron", base: "Vanilla, Cedarwood" },
    color: "#9C6B3F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.99060.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/PARIS-CORNER/Rifaaqat-99060.html",
    prices: { "5ml": 165, "10ml": 270, "20ml": 500, "30ml": 710 }
  },
  {
    id: "fattan",
    name: "Fattan",
    house: "Rasasi",
    inspiredBy: "Hermès Terre d'Hermès",
    notes: { top: "Grapefruit, Bergamot, Pink Pepper", heart: "Vetiver, Cedar, Patchouli, Lily-of-the-Valley", base: "Oakmoss, Benzoin, Amber" },
    color: "#556B5E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.53484.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Fattan-53484.html",
    prices: { "5ml": 210, "10ml": 360, "20ml": 680, "30ml": 980 }
  },
  {
    id: "hawas-fire",
    name: "Hawas Fire",
    house: "Rasasi",
    inspiredBy: "Gissah Imperial Valley",
    notes: { top: "Clary Sage", heart: "Egyptian Jasmine, Marine Notes", base: "Ambergris, Amber, Mineral Notes" },
    color: "#B23A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.101665.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Fire-101665.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  },
  {
    id: "hawas-ice",
    name: "Hawas Ice",
    house: "Rasasi",
    notes: { top: "Apple, Italian Lemon, Sicilian Bergamot, Star Anise", heart: "Plum, Orange Blossom, Cardamom", base: "Musk, Amber, Driftwood, Moss" },
    color: "#5DA3C7",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.89050.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Ice-89050.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "hawas-kobra",
    name: "Hawas Kobra",
    house: "Rasasi",
    inspiredBy: "Louis Vuitton Imagination",
    notes: { top: "Ginger, Bergamot, Tangerine", heart: "Cinnamon, Neroli, Green Tea", base: "Musk, Woodsy Notes, Amber" },
    color: "#3E4A3A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.112706.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Kobra-112706.html",
    prices: { "5ml": 185, "10ml": 310, "20ml": 580, "30ml": 830 }
  },
  {
    id: "hawas-malibu",
    name: "Hawas Malibu",
    house: "Rasasi",
    notes: { top: "Pineapple, Orange, Grapefruit", heart: "Orris, Amber, Lavender", base: "Tonka Bean, Musk, Patchouli, Cashmeran" },
    color: "#E0A85B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.112707.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Malibu-112707.html",
    prices: { "5ml": 190, "10ml": 320, "20ml": 600, "30ml": 860 }
  },
  {
    id: "aquatica",
    hidden: true,
    name: "Aquatica",
    inspiredBy: "Creed Virgin Island Water",
    house: "Rayhaan",
    notes: { top: "Lime, Coconut Milk, Bergamot, Mandarin", heart: "Sugar Cane, Jasmine, Hibiscus, Gardenia", base: "Musk, Rum, Tonka Bean, Patchouli" },
    color: "#2FA6A0",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.120605.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Aquatica-120605.html",
    prices: { "5ml": 165, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "nocturno-elixir",
    hidden: true,
    name: "Nocturno Elixir",
    inspiredBy: "Bleu de Chanel L'Exclusif",
    house: "Rayhaan",
    notes: { top: "Lemon Zest, Bergamot, Mint, Artemisia", heart: "Lavender, Geranium, Pineapple", base: "Sandalwood" },
    color: "#1D3A5F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.132522.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Nocturno-Elixir-132522.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "obsidian",
    name: "Obsidian",
    inspiredBy: "Dior Homme Parfum",
    house: "Rayhaan",
    notes: { top: "Iris,Citrus", heart: "Leather", base: "Sandalwood,Ambrette,Cedar,Oud" },
    color: "#1D3A5F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.121721.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Obsidian-121721.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "terra",
    newSince: "2026-10-04",
    name: "Terra",
    inspiredBy: "Amouage Outlands",
    house: "Rayhaan",
    notes: { top: "Frankincense, Cardamom, Elemi, Bergamot", heart: "Patchouli, Saffron, Orange Blossom, Rose", base: "Vanilla, Benzoin, Amber, Oud" },
    color: "#8A5A2B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.118549.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Terra-118549.html",
    prices: { "5ml": 170, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "momento",
    newSince: "2026-10-01",
    name: "Momento",
    inspiredBy: "Montale Arabians Tonka",
    house: "Riffs",
    notes: { top: "Sugar,Saffron,Mandarin", heart: "Tonka Bean,Damask Rose,Agarwood", base: "Caramel,Amberwood,Cedar" },
    color: "#1D3A5F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.103346.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Riiffs-Perfumes/Momento-103346.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920}
  },
  {
    id: "fareed",
    hidden: true,
    name: "Fareed",
    house: "Riffs",
    notes: { top: "Cardamom, Pepper", heart: "Lavender, Bergamot, Geranium", base: "Tonka, Cedarwood, Vetiver" },
    color: "#6E7F52",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.127888.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Riiffs-Perfumes/Fareed-127888.html",
    prices: { "5ml": 165, "10ml": 280, "20ml": 520, "30ml": 740 }
  },
  {
    id: "freeze",
    hidden: true,
    name: "Freeze",
    house: "Riffs",
    notes: { top: "Spearmint, Lemon Zest, Calabrian Bergamot, Grapefruit, Snow", heart: "Ice, Ginger, Tea, Sage", base: "Ambermax, Peony, Cedar" },
    color: "#A9D6E5",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.118093.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Riiffs-Perfumes/Freeze-118093.html",
    prices: { "5ml": 200, "10ml": 340, "20ml": 640, "30ml": 920 }
  },
  {
    id: "reef-33",
    name: "33",
    inspiredBy: "Gissah Imperial Valley",
    house: "Reef",
    notes: { top: "Indian Saffron", heart: "Rosemary", base: "Agarwood (Oud)" },
    color: "#7C1F1F",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.89358.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Reef-Perfumes/Reef-33-89358.html",
    prices: { "5ml": 210, "10ml": 350, "20ml": 660, "30ml": 950 }
  },
  {
    id: "incense-01",
    name: "Incense 01",
    house: "Swiss Arabian",
    notes: { top: "Frankincense, Rum, Juniper, Bergamot", heart: "Fig, Hazelnut, Roasted Nuts, Almond, Lily of the Valley", base: "Frankincense, Vanilla, Sandalwood, Dark Chocolate, Cedarwood, Moss" },
    color: "#4A342A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.102415.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Swiss-Arabian/Incense-01-102415.html",
    prices: { "5ml": 480, "10ml": 900, "20ml": 1760, "30ml": 2600 }
  },
  {
    id: "soul-of-bali",
    name: "Soul of Bali",
    house: "Swiss Arabian",
    notes: { top: "Rhubarb, Bergamot, Ginger, Mango, Pink Pepper, Pineapple", heart: "Aquatic Notes, Saffron, Cardamom, Rosewood, Olibanum, Nutmeg", base: "Sandalwood, Ambergris, Musk, Cypriol" },
    color: "#2E8B7A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.107070.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Swiss-Arabian/Soul-of-Bali-107070.html",
    prices: { "5ml": 310, "10ml": 560, "20ml": 1080, "30ml": 1580 }
  },
  {
    id: "inekas-luna",
    name: "Inekas Luna",
    house: "Zimaya",
    inspiredBy: "Givenchy Gentleman Réserve Privée",
    notes: { top: "Bergamot, Orange", heart: "Iris, Chestnut, Orange Blossom", base: "Leather, Amber" },
    color: "#5B4A6E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.96984.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Zimaya/INEKAS-LUNA-96984.html",
    prices: { "5ml": 160, "10ml": 260, "20ml": 480, "30ml": 680 }
  },
  {
    id: "mazaaj-rhythm",
    name: "Mazaaj Rhythm",
    inspiredBy: "Louis Vuitton Symphonie",
    house: "Zimaya",
    notes: { top: "Grapefruit, Bergamot", heart: "Ginger, Green Apple", base: "Musk, Amber" },
    color: "#8CB369",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.117355.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Zimaya/Mazaaj-Rhythm-117355.html",
    prices: { "5ml": 160, "10ml": 260, "20ml": 480, "30ml": 680 }
  },
  {
    id: "bleu-de-chanel-edt",
    name: "Bleu De Chanel EDT",
    house: "Chanel",
    notes: { top: "Grapefruit, Lemon, Mint, Pink Pepper", heart: "Ginger, Nutmeg, Jasmine", base: "Incense, Vetiver, Cedar, Sandalwood, White Musk, Amber" },
    color: "#1B2A4A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.9099.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Chanel/Bleu-de-Chanel-9099.html",
    prices: { "3ml": 390, "5ml": 610, "10ml": 1170, "20ml": 2280, "30ml": 3410 }
  },
  {
    id: "the-one-parfum",
    name: "The One Parfum",
    house: "D&G",
    notes: { top: "Basil, Coriander, Grapefruit", heart: "Ginger, Tobacco Blossom, Cardamom", base: "Amber, Tobacco, Musk, Cedar" },
    color: "#4A3B2A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.31909.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Dolce-Gabbana/The-One-for-Men-Eau-de-Parfum-31909.html",
    prices: { "3ml": 300, "5ml": 460, "10ml": 860, "20ml": 1680, "30ml": 2480 }
  },
  {
    id: "gentleman-reserve-privee",
    newSince: "2026-09-27",
    name: "Gentleman Reserve Privee",
    house: "Givenchy",
    notes: { top: "Whisky Absolute, Bergamot", heart: "Iris, Chestnut, Benzoin", base: "Cedarwood, Vetiver" },
    color: "#6B4A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.71272.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Givenchy/Gentleman-Eau-de-Parfum-Reserve-Privee-71272.html",
    prices: { "3ml": 240, "5ml": 360, "10ml": 660, "20ml": 1280, "30ml": 1880 }
  },
  {
    id: "habit-rouge-edp",
    newSince: "2026-09-27",
    name: "Habit Rouge EDP",
    house: "Guerlain",
    notes: { top: "Bergamot, Lemon, Basil", heart: "Rose, Jasmine, Sandalwood, Patchouli", base: "Amber, Vanilla, Leather, Labdanum" },
    color: "#7C1B23",
    image: "images/habit-rouge-edp.jpg",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/Habit-Rouge-Eau-de-Parfum-25313.html",
    prices: { "3ml": 300, "5ml": 460, "10ml": 860, "20ml": 1680, "30ml": 2480 }
  },
  {
    id: "lhomme-ideal-edp",
    newSince: "2026-09-27",
    name: "L'Homme Ideal EDP",
    house: "Guerlain",
    notes: { top: "Bitter Almond, Lemon", heart: "Sambac Jasmine", base: "Tonka Bean, Vetiver" },
    color: "#6E5A3C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.37735.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/L-Homme-Ideal-Eau-de-Parfum-37735.html",
    prices: { "3ml": 290, "5ml": 440, "10ml": 820, "20ml": 1600, "30ml": 2440 }
  },
  {
    id: "vetiver-parfum",
    newSince: "2026-09-27",
    name: "Vetiver Parfum",
    house: "Guerlain",
    notes: { top: "Bergamot, Lemon, Neroli", heart: "Vetiver, Nutmeg, Tobacco", base: "Leather, Tonka Bean" },
    color: "#3E4A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.90801.2x.avif",
    gender: "Men",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/Vetiver-Parfum-90801.html",
    prices: { "3ml": 330, "5ml": 510, "10ml": 960, "20ml": 1880, "30ml": 2780 }
  },
  {
    id: "santal-royal",
    newSince: "2026-09-27",
    name: "Santal Royal",
    house: "Guerlain",
    notes: { top: "Rose", heart: "Sandalwood, Oud, Jasmine", base: "Leather" },
    color: "#4A3A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.96470.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Guerlain/Santal-Royal-96470.html",
    prices: { "3ml": 325, "5ml": 500, "10ml": 940, "20ml": 1840, "30ml": 2720 }
  },
  {
    id: "hugo-man-edt",
    newSince: "2026-09-27",
    name: "Hugo Man EDT",
    house: "Hugo",
    notes: { top: "Green Apple, Green Leaves", heart: "Geranium Leaf, Clary Sage", base: "Cedar, Oakmoss, Tobacco" },
    color: "#3E5A3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.570.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Hugo-Boss/Hugo-570.html",
    prices: { "3ml": 135, "5ml": 180, "10ml": 295, "20ml": 530, "30ml": 770 }
  },
  {
    id: "uomo-born-in-roma-intense",
    newSince: "2026-09-27",
    name: "Uomo Born In Roma Intense",
    house: "Valentino",
    notes: { top: "Vanilla", heart: "Lavender", base: "Vetiver" },
    color: "#2E2A3E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.78740.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Valentino/Valentino-Uomo-Born-In-Roma-Intense-78740.html",
    prices: { "3ml": 275, "5ml": 410, "10ml": 760, "20ml": 1480, "30ml": 2180 }
  },
  {
    id: "libre-edp",
    newSince: "2026-09-27",
    name: "Libre EDP",
    house: "YSL",
    notes: { top: "Mandarin Zest, Black Currant, Lavender", heart: "Lavender, Orange Blossom, Jasmine Sambac", base: "Musk, Cedarwood, Vanilla, Ambergris" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.56077.2x.avif",
    gender: "Women",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Yves-Saint-Laurent/Libre-56077.html",
    prices: { "3ml": 375, "5ml": 575, "10ml": 1090, "20ml": 2140, "30ml": 3170 }
  },
  {
    id: "aventus",
    newSince: "2026-09-27",
    name: "Aventus",
    house: "Creed",
    notes: { top: "Lemon, Pink Pepper, Apple, Italian bergamot,Blackcurrant", heart: "Pineapple, Patchouli, Moroccan Jasmine, Birch, Juniper Berries", base: "Oakmoss, Vanilla, Musk" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.9828.2x.avif",
    gender: "Men",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Creed/Aventus-9828.html",
    prices: { "3ml": 810, "5ml": 1310, "10ml": 2560, "20ml": 5080, "30ml": 7580 }
  },
  {
    id: "tam-dao",
    newSince: "2026-09-27",
    name: "Tam Dao EDP",
    house: "Diptyque",
    notes: { top: "Italian Cypress,Myrtyle,Rose", heart: "Sandalwood,Cedar", base: "Brazillian Rosewood,Spices,Amber,White Musk" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.49104.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Diptyque/Tam-Dao-Eau-de-Parfum-49104.html",
    prices: { "3ml": 780, "5ml": 1260, "10ml": 2460, "20ml": 4880, "30ml": 7280 }
  },
  {
    id: "ani",
    newSince: "2026-09-27",
    name: "Ani",
    house: "Nishane",
    notes: { top: "Ginger,Bergamot,Pink Pepper,Green Notes", heart: "Cardamom,Blackcurrant,Turkish Rose", base: "Vanilla,Benzoin,Sandalwood,Cedar,Patchouli, Ambergris,Musk" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.54785.2x.avif",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Nishane/Ani-54785.html",
    prices: { "3ml": 510, "5ml": 810, "10ml": 1560, "20ml": 3080, "30ml": 4580 }
  },
  {
    id: "vibrato",
    newSince: "2026-09-27",
    name: "Vibrato",
    house: "Sospiro",
    notes: { top: "Grapefruit,Bergamot,Jasmine,Magnolia", heart: "Ginger,Herbal Notes,Powdery Notes", base: "Musk, Cedar, Amber,Patchouli,Orris Root" },
    color: "#3E2E5C",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.75930.2x.avif",
    gender: "Unisex",
    season: ["Summer","Spring"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Sospiro-Perfumes/Vibrato-75930.html",
    prices: { "3ml": 600, "5ml": 980, "10ml": 1800, "20ml": 3480, "30ml": 5180 }
  },
  {
    id: "laverne-fearless",
    newSince: "2026-09-27",
    name: "Fearless",
    house: "Laverne",
    inspiredBy: "Bvlgari Tygar",
    notes: { top: "Mandarin, Bergamot", heart: "Jasmine, Sandalwood", base: "Amber, Musk" },
    color: "#B8895E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/375x500.114181.jpg",
    gender: "Unisex",
    season: ["All-Season"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Laverne/Fearless-114181.html",
    prices: { "5ml": 175, "10ml": 285, "20ml": 530, "30ml": 755 }
  },
  {
    id: "rayhaan-cedrus-blanc",
    newSince: "2026-09-27",
    name: "Cedrus Blanc",
    house: "Rayhaan",
    notes: { top: "Aldehydes, Bergamot", heart: "Orange Blossom, Orange", base: "White Musk, Vanilla, Cedarwood" },
    color: "#D8CFC2",
    image: "https://fimgs.net/mdimg/perfume-thumbs/375x500.138575.jpg",
    gender: "Unisex",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rayhaan/Cedrus-Blanc-138575.html",
    prices: { "5ml": 180, "10ml": 300, "20ml": 560, "30ml": 800 }
  },
  {
    id: "dior-homme-parfum",
    newSince: "2026-09-29",
    name: "Homme Parfum",
    house: "Dior",
    notes: { top: "Iris", heart: "Amber", base: "Patchouli, Vetiver" },
    color: "#D8CFC2",
    image: "https://fimgs.net/mdimg/perfume-thumbs/375x500.101016.jpg",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Dior/Dior-Homme-Parfum-2025-101016.html",
    prices: { "3ml": 540, "5ml": 860, "10ml": 1660, "20ml": 3280, "30ml": 4880 }
  },
  {
    id: "amouage-purpose-50",
    newSince: "2026-09-27",
    name: "Purpose 50",
    house: "Amouage",
    notes: { top: "Frankincense, Bergamot, Pink Pepper, Pimento Berry", heart: "Rose, Sand Vetiver, Sandalwood, Papyrus", base: "Saffron, Suede, Mystikal, Akigalawood, Vanilla" },
    color: "#6B4A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/375x500.100897.jpg",
    gender: "Unisex",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Amouage/Purpose-50-100897.html",
    prices: { "3ml": 1450, "5ml": 2350, "10ml": 4560, "20ml": 9080, "30ml": 13580 }
  },
  {
    id: "hawas-verde",
    newSince: "2026-10-05",
    name: "Hawas Verde",
    house: "Rasasi",
    inspiredBy: "Xerjoff Torino 21",
    notes: { top: "Lime, Green Apple, Rosemary", base: "Patchouli, Amber" },
    color: "#5C8A3A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.117625.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Verde-117625.html",
    prices: { "5ml": 235, "10ml": 410, "20ml": 780, "30ml": 1130 }
  },
  {
    id: "encre-noire-edt",
    newSince: "2026-10-05",
    name: "Encre Noire EDT",
    house: "Lalique",
    notes: { top: "Cypress", heart: "Vetiver", base: "Cashmere Wood, Musk" },
    color: "#1F1F24",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.1834.2x.avif",
    gender: "Men",
    season: ["Autumn","Winter"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Lalique/Encre-Noire-1834.html",
    prices: { "5ml": 190, "10ml": 320, "20ml": 600, "30ml": 860 }
  },
  {
    id: "light-blue-eau-intense",
    newSince: "2026-10-05",
    name: "Light Blue Eau Intense Pour Homme",
    house: "D&G",
    notes: { top: "Grapefruit, Mandarin Orange", heart: "Sea Water, Juniper", base: "Musk, Amberwood" },
    color: "#4FA3D1",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.44035.2x.avif",
    gender: "Men",
    season: ["Spring","Summer"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Dolce-Gabbana/Light-Blue-Eau-Intense-Pour-Homme-44035.html",
    prices: { "3ml": 330, "5ml": 510, "10ml": 960, "20ml": 1880, "30ml": 2780 }
  },
  {
    id: "narciso-for-him-edt",
    newSince: "2026-10-05",
    name: "Narciso Rodriguez For Him EDT",
    house: "Narciso Rodriguez",
    notes: { all: "Violet Leaf, Musk, Patchouli, Amber" },
    color: "#3A3F4A",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.1063.2x.avif",
    gender: "Men",
    season: ["Spring","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-for-Him-1063.html",
    prices: { "3ml": 360, "5ml": 560, "10ml": 1060, "20ml": 2080, "30ml": 3080 }
  },
  {
    id: "narciso-for-him-edp",
    newSince: "2026-10-05",
    name: "Narciso Rodriguez For Him EDP Intense",
    house: "Narciso Rodriguez",
    notes: { all: "Musk, Iris, Pink Pepper" },
    color: "#2A2D36",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.14741.2x.avif",
    gender: "Men",
    season: ["Autumn","Winter"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Narciso-Rodriguez/Narciso-Rodriguez-For-Him-Eau-de-Parfum-Intense-14741.html",
    prices: { "3ml": 390, "5ml": 610, "10ml": 1160, "20ml": 2280, "30ml": 3380 }
  },
  {
    id: "hawas-venom",
    newSince: "2026-10-05",
    name: "Hawas Venom",
    house: "Rasasi",
    notes: { top: "Incense, Labdanum", heart: "Leather", base: "Incense, Patchouli, Vanilla" },
    color: "#2B1B1B",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.138569.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Hawas-Venom-138569.html",
    prices: { "5ml": 245, "10ml": 430, "20ml": 800, "30ml": 1160 }
  },
  {
    id: "shuhrah",
    newSince: "2026-10-05",
    name: "Shuhrah Pour Homme",
    house: "Rasasi",
    notes: { top: "Tomato Leaf, Rose, Freesia", heart: "Rose, Sandalwood, Cedar, Jasmine", base: "Leather, Agarwood (Oud), Musk, Oakmoss, Amber" },
    color: "#6B4A2E",
    image: "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500.53578.2x.avif",
    gender: "Men",
    season: ["Winter","Autumn"],
    fragranticaUrl: "https://www.fragrantica.com/perfume/Rasasi/Shuhrah-Pour-Homme-53578.html",
    prices: { "5ml": 220, "10ml": 380, "20ml": 720, "30ml": 1040 }
  }

];

/* Add  hidden: true  to any fragrance above to take it off the site
   without deleting its data. Remove that line to bring it back. */
const FRAGRANCES = LE_ALL_FRAGRANCES.filter(f => !f.hidden);

/* ============================================================
   "New" badge — auto-expiring
   To mark a fragrance new, just add newSince: "YYYY-MM-DD" (see
   the comment above FRAGRANCES) with today's date. It counts as
   new for LE_NEW_DAYS days from that date, then stops on its own
   — nothing to remove later. f.isNew is a live computed getter,
   so any existing code that reads f.isNew keeps working as-is.
   ============================================================ */
const LE_NEW_DAYS = 10;

function leComputeIsNew(newSince){
  if(!newSince) return false;
  const since = new Date(newSince + "T00:00:00");
  if(isNaN(since)) return false;
  const ageDays = (Date.now() - since.getTime()) / (1000 * 60 * 60 * 24);
  return ageDays >= 0 && ageDays < LE_NEW_DAYS;
}

FRAGRANCES.forEach(f => {
  if(f.newSince){
    Object.defineProperty(f, "isNew", {
      get(){ return leComputeIsNew(f.newSince); },
      enumerable: true,
      configurable: true
    });
  }
});

function leFragranceById(id){
  return FRAGRANCES.find(f => f.id === id);
}

/* ============================================================
   Brand category — groups each house into a broader family so
   the catalogue can be browsed by Middle Eastern / Designer /
   Niche in addition to individual brand tabs. Add new houses
   here as they're added to FRAGRANCES; a house left unmapped
   just won't appear under any category (still shows under "All").
   ============================================================ */
const HOUSE_CATEGORY = {
  "Afnan": "Middle Eastern",
  "Ahmed Al Maghribi": "Middle Eastern",
  "Al Haramain": "Middle Eastern",
  "Arabiyat Prestige": "Middle Eastern",
  "Armaf": "Middle Eastern",
  "Aromatix": "Middle Eastern",
  "Khadlaj": "Middle Eastern",
  "French Avenue": "Middle Eastern",
  "Lattafa": "Middle Eastern",
  "Maison Al Hambra": "Middle Eastern",
  "Nusuk": "Middle Eastern",
  "Rasasi": "Middle Eastern",
  "Rayhaan": "Middle Eastern",
  "Laverne": "Middle Eastern",
  "Scentedelic": "Indian House",
  "Zimaya": "Middle Eastern",
  "Ajmal": "Middle Eastern",
  "Ard Al Zafran": "Middle Eastern",
  "IBRAQ": "Middle Eastern",
  "Paris Corner": "Middle Eastern",
  "Reef": "Middle Eastern",
  "Riffs": "Middle Eastern",
  "Swiss Arabian": "Middle Eastern",

  "Giorgio Armani": "Designer",
  "Emporio Armani": "Designer",
  "Versace": "Designer",
  "Ralph Lauren": "Designer",
  "Narciso Rodriguez": "Designer",
  "Azzaro": "Designer",
  "Issey Miyake": "Designer",
  "Jean Paul Gaultier": "Designer",
  "Mancera": "Designer",
  "Prada": "Designer",
  "Viktor & Rolf": "Designer",
  "YSL": "Designer",
  "Chanel": "Designer",
  "D&G": "Designer",
  "Lalique": "Designer",
  "Givenchy": "Designer",
  "Guerlain": "Designer",
  "Hugo": "Designer",
  "Montale": "Designer",
  "Valentino": "Designer",
  "Dior":"Designer",

  "Creed": "Niche",
  "Diptyque": "Niche",
  "Nishane": "Niche",
  "Sospiro": "Niche",
  "Amouage": "Niche",
};

function leHouseCategory(house){
  return HOUSE_CATEGORY[house];
}

/* ============================================================
   Config
   ============================================================ */
const LE_WISHLIST_KEY = "le_wishlist_v1";
const LE_RECENT_KEY   = "le_recent_v1";
const LE_CART_VERSION_KEY = "le_cart_version";
const LE_MAX_QTY       = 10;   // soft per-line stock cap

/* Partial bottles: one-off bottles with some perfume left, sold whole. They sit in
   f.prices under a key made of the ml left plus "-P" (e.g. "80ml-P"), so the cart,
   checkout and the server price check treat them like any other priced size.
   Keep leIsPartial in step with api/_pricing.js. */
function leIsPartial(size){ return /-P$/.test(String(size || "")); }
/* A partial can also be a tester (flag from the sheet's "Tester" column). */
function leIsTesterPartial(id, size){
  if(!id || !leIsPartial(size)) return false;
  const f = leFragranceById(id);
  return !!(f && f.partials && f.partials[size] && f.partials[size].tester);
}
/* Full bottles, testers and vials (from the Enigma stock sheet) sit in f.prices under the size
   plus a letter: "100ml-B" = new bottle, "100ml-T" = tester, "1.5ml-V" = vial. Everything that
   reads f.prices (cart, checkout, the server price check) treats them like any other size.
   Keep leIsBottle in step with api/_pricing.js. */
const EP_MAX_BOTTLE_QTY = 2;     // most bottles of one kind a customer can add (change if you hold more stock)
/* Card EMI: Razorpay shows EMI for eligible credit cards on orders of this amount and above. */
const EP_EMI_MIN = 3000;
function epEmiLine(total){
  if(!(total > 0)) return "";
  return total >= EP_EMI_MIN ? "💳 EMI available at checkout on eligible credit cards."
    : "💳 Add " + leFormatPrice(EP_EMI_MIN - total) + " more to unlock card EMI at checkout.";
}
function epRenderEmiNote(elId){
  const el = document.getElementById(elId || "emiNote"); if(!el) return;
  const total = leCartLines().reduce((n, l) => n + (l.lineTotal || 0), 0);
  el.textContent = epEmiLine(total);
}
function leIsBottle(size){ return /-[BTV]$/.test(String(size || "")); }
function leSizeKind(size){
  const m = /-([PBTV])$/.exec(String(size || ""));
  return m ? { P: "partial", B: "bottle", T: "tester", V: "vial" }[m[1]] : "decant";
}
/* Order inside a size list: decants, partials, vials, then testers, then new bottles. */
const EP_KIND_RANK = { decant: 0, partial: 1, vial: 2, tester: 3, bottle: 4 };
function leSizeRank(size){ return EP_KIND_RANK[leSizeKind(size)]; }
function leSizeLabel(size, id){
  const kind = leSizeKind(size);
  if(kind === "bottle") return parseFloat(size) + "ml bottle";
  if(kind === "tester") return parseFloat(size) + "ml tester";
  if(kind === "vial") return parseFloat(size) + "ml vial";
  if(kind !== "partial") return size;
  return (leIsTesterPartial(id, size) ? "Tester partial " : "Partial ") + parseInt(size, 10) + "ml";
}
function leMaxQtyFor(size){ return leIsPartial(size) ? 1 : leIsBottle(size) ? EP_MAX_BOTTLE_QTY : LE_MAX_QTY; }
/* Details of a bottle option (box, condition, MRP) for the size picker. */
function leBottleInfo(id, size){
  const f = leFragranceById(id);
  return (f && f.bottles && f.bottles[size]) || null;
}
function leIsHeld(id, size){
  const f = leFragranceById(id);
  return !!(f && f.heldSizes && f.heldSizes.includes(size));
}
function leCartHasPartial(){ return leGetCart().some(i => leIsPartial(i.size) || leIsBottle(i.size)); }   // bottles ship free like partials
const LE_RECENT_LIMIT  = 8;

/* ============================================================
   Currency formatting (₹, no decimals)
   ============================================================ */
const leCurrencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
function leFormatPrice(amount){
  return leCurrencyFormatter.format(amount);
}

function leGetCart(){
  try{
    const raw = localStorage.getItem(LE_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function leSetCart(cart){
  try{
    localStorage.setItem(LE_CART_KEY, JSON.stringify(cart));
  }catch(e){ /* storage unavailable — cart just won't persist */ }
  leUpdateCartBadges();
}

/* Perfumes marked "Coming soon" in the sheet can't be ordered yet. They reuse the sold-out
   blocking (cart, checkout) but are labelled Coming soon, with an optional arrival note. */
function leIsComingSoon(id){ const f = leFragranceById(id); return !!(f && f.comingSoon); }
function leUnavailableLabel(id, size, short){
  if(leIsComingSoon(id)) return short ? "Soon" : "Coming soon";
  return leIsHeld(id, size) ? "Reserved" : "Sold out";
}
function leComingLabel(f){ return f && f.arrival ? "Arriving on " + f.arrival : "Coming soon"; }
function leArrivalText(f){ return f && f.comingSoon ? (f.arrival ? "Arriving " + f.arrival : "Arriving soon") : ""; }
function leIsSoldOut(id, size){
  const f = leFragranceById(id);
  if(!f) return false;
  if(f.soldOut) return true;
  return !!(size && ((f.soldSizes && f.soldSizes.includes(size)) || (f.heldSizes && f.heldSizes.includes(size))));
}

function leAddToCart(id, size, qty){
  if(leIsSoldOut(id, size)) return;
  qty = qty || 1;
  const cart = leGetCart();
  const existing = cart.find(i => i.id === id && i.size === size);
  if(existing){
    existing.qty = Math.min(existing.qty + qty, leMaxQtyFor(size));
  }else{
    cart.push({ id, size, qty: Math.min(qty, leMaxQtyFor(size)) });
  }
  leSetCart(cart);
}

function leUpdateQty(id, size, qty){
  const cart = leGetCart();
  const item = cart.find(i => i.id === id && i.size === size);
  if(!item) return;
  if(qty <= 0){
    leSetCart(cart.filter(i => i !== item));
    return;
  }
  item.qty = Math.min(qty, leMaxQtyFor(size));
  leSetCart(cart);
}

function leUpdateSize(id, oldSize, newSize){
  if(leSizeKind(oldSize) !== leSizeKind(newSize)) return;   // a partial, bottle, tester or vial can't be swapped for another kind
  const cart = leGetCart();
  const item = cart.find(i => i.id === id && i.size === oldSize);
  if(!item) return;
  const dup = cart.find(i => i.id === id && i.size === newSize && i !== item);
  if(dup){
    dup.qty += item.qty;
    leSetCart(cart.filter(i => i !== item));
  }else{
    item.size = newSize;
    leSetCart(cart);
  }
}

function leRemoveFromCart(id, size){
  const cart = leGetCart().filter(i => !(i.id === id && i.size === size));
  leSetCart(cart);
}

function leClearCart(){
  leSetCart([]);
}

function leCartCount(){
  return leGetCart().reduce((n, i) => n + i.qty, 0);
}

function leCartLines(){
  return leGetCart()
    .map(i => {
      const f = leFragranceById(i.id);
      if(!f) return null;
      return { ...i, fragrance: f, unitPrice: f.prices[i.size], lineTotal: f.prices[i.size] * i.qty };
    })
    .filter(Boolean)
    /* Always list the cart A–Z: brand first, then perfume name, then smallest size first. */
    .sort((a, b) =>
      a.fragrance.house.localeCompare(b.fragrance.house) ||
      a.fragrance.name.localeCompare(b.fragrance.name) ||
      (leSizeRank(a.size) - leSizeRank(b.size)) ||
      parseFloat(a.size) - parseFloat(b.size));
}

/* ============================================================
   Shared quantity control
   ============================================================ */
function leCartQtyFor(id, size){
  const item = leGetCart().find(i => i.id === id && i.size === size);
  return item ? item.qty : 0;
}

const LE_QTY_THEMES = {
  dark: {
    addBg: "#A64A66", addBorder: "#A64A66", addColor: "#211A33",
    stepBorder: "#8B1E3F", stepColor: "#211A33", countColor: "#211A33",
    removeColor: "#5B5470", removeHover: "#B23B2E"
  },
  light: {
    addBg: "#211A33", addBorder: "#211A33", addColor: "#fff",
    stepBorder: "#5B5470", stepColor: "#211A33", countColor: "#211A33",
    removeColor: "#5B5470", removeHover: "#c00"
  }
};

function leRenderQtyControl(id, size, theme){
  if(leIsComingSoon(id)) return "";   // coming soon: one clear message instead of a button on every size
  const t = LE_QTY_THEMES[theme] || LE_QTY_THEMES.dark;
  const qty = leCartQtyFor(id, size);
  if(leIsSoldOut(id, size)){
    return `<button class="le-qty-soldout" disabled style="background:transparent;border:1px solid ${t.stepBorder};color:${t.removeColor};padding:6px 14px;font-size:0.72rem;font-weight:600;border-radius:4px;cursor:not-allowed;white-space:nowrap;opacity:.8;">${leUnavailableLabel(id, size)}</button>`;
  }
  if(qty === 0){
    return `<button class="le-qty-add" data-id="${id}" data-size="${size}" style="background:${t.addBg};border:1px solid ${t.addBorder};color:${t.addColor};padding:6px 14px;font-size:0.72rem;font-weight:600;border-radius:4px;cursor:pointer;white-space:nowrap;">Add to cart</button>`;
  }
  if(leIsPartial(size)){
    /* One bottle only: no +/- , just a tick and a remove button. */
    return `
    <div class="le-qty-stepper" style="display:flex;align-items:center;gap:8px;">
      <span class="le-qty-count" style="color:${t.countColor};font-size:0.8rem;font-weight:600;">✓ In cart</span>
      <button class="le-qty-remove" data-id="${id}" data-size="${size}" aria-label="Remove from cart" style="border:none;background:none;color:${t.removeColor};cursor:pointer;font-size:0.9rem;padding:0 0 0 2px;">🗑</button>
    </div>`;
  }
  return `
    <div class="le-qty-stepper" style="display:flex;align-items:center;gap:8px;">
      <button class="le-qty-btn le-qty-minus" data-id="${id}" data-size="${size}" style="width:22px;height:22px;border:1px solid ${t.stepBorder};background:transparent;color:${t.stepColor};border-radius:4px;cursor:pointer;line-height:1;">−</button>
      <span class="le-qty-count" style="min-width:14px;text-align:center;color:${t.countColor};font-size:0.85rem;">${qty}</span>
      <button class="le-qty-btn le-qty-plus" data-id="${id}" data-size="${size}" style="width:22px;height:22px;border:1px solid ${t.stepBorder};background:transparent;color:${t.stepColor};border-radius:4px;cursor:pointer;line-height:1;">+</button>
      <button class="le-qty-remove" data-id="${id}" data-size="${size}" aria-label="Remove from cart" style="border:none;background:none;color:${t.removeColor};cursor:pointer;font-size:0.9rem;padding:0 0 0 2px;">🗑</button>
    </div>`;
}

function leWireQtyControl(container, id, size, theme, onChange){
  function rerender(){
    container.innerHTML = leRenderQtyControl(id, size, theme);
    wire();
  }
  function wire(){
    const addBtn = container.querySelector(".le-qty-add");
    if(addBtn) addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      leAddToCart(id, size, 1);
      rerender();
      if(onChange) onChange();
    });
    const minus = container.querySelector(".le-qty-minus");
    if(minus) minus.addEventListener("click", (e) => {
      e.stopPropagation();
      leUpdateQty(id, size, leCartQtyFor(id, size) - 1);
      rerender();
      if(onChange) onChange();
    });
    const plus = container.querySelector(".le-qty-plus");
    if(plus) plus.addEventListener("click", (e) => {
      e.stopPropagation();
      leUpdateQty(id, size, leCartQtyFor(id, size) + 1);
      rerender();
      if(onChange) onChange();
    });
    const remove = container.querySelector(".le-qty-remove");
    if(remove) remove.addEventListener("click", (e) => {
      e.stopPropagation();
      leRemoveFromCart(id, size);
      rerender();
      if(onChange) onChange();
    });
  }
  rerender();
}

function leUpdateCartBadges(){
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = leCartCount();
  });
  if(typeof window !== "undefined" && typeof window.leOnCartChanged === "function"){
    try{ window.leOnCartChanged(); }catch(e){}
  }
}

/* ============================================================
   Cart validation
   ============================================================ */
function leGetInvalidCartItems(){
  return leGetCart().filter(i => !leFragranceById(i.id) || leIsSoldOut(i.id, i.size));
}

function leValidateCart(){
  const invalid = leGetInvalidCartItems();
  if(invalid.length){
    const cart = leGetCart().filter(i => leFragranceById(i.id) && !leIsSoldOut(i.id, i.size));
    leSetCart(cart);
  }
  return invalid;
}

/* ============================================================
   Cart versioning / migration
   ============================================================ */
function leMigrateCart(){
  const seenVersion = localStorage.getItem(LE_CART_VERSION_KEY);
  const currentVersion = LE_CART_KEY;
  if(seenVersion === currentVersion) return;
  localStorage.setItem(LE_CART_VERSION_KEY, currentVersion);
}

/* ============================================================
   Wishlist
   ============================================================ */
function leGetWishlist(){
  try{
    const raw = localStorage.getItem(LE_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    return [];
  }
}

function leSetWishlist(list){
  try{
    localStorage.setItem(LE_WISHLIST_KEY, JSON.stringify(list));
  }catch(e){ /* storage unavailable */ }
  leUpdateWishlistBadges();
}

function leIsWishlisted(id){
  return leGetWishlist().includes(id);
}

function leToggleWishlist(id){
  const list = leGetWishlist();
  const idx = list.indexOf(id);
  if(idx === -1){
    list.push(id);
    leSetWishlist(list);
    leShowToast(`Added ${leFragranceById(id)?.name || "item"} to wishlist`);
    return true;
  }else{
    list.splice(idx, 1);
    leSetWishlist(list);
    leShowToast(`Removed ${leFragranceById(id)?.name || "item"} from wishlist`);
    return false;
  }
}

function leWishlistCount(){
  return leGetWishlist().length;
}

function leWishlistItems(){
  return leGetWishlist().map(leFragranceById).filter(Boolean);
}

function leUpdateWishlistBadges(){
  document.querySelectorAll("[data-wishlist-count]").forEach(el => {
    el.textContent = leWishlistCount();
  });
}

/* ============================================================
   Recently viewed
   ============================================================ */
function leTrackRecentlyViewed(id){
  if(!leFragranceById(id)) return;
  let list = leGetRecentlyViewed(Infinity).map(f => f.id);
  list = list.filter(x => x !== id);
  list.unshift(id);
  list = list.slice(0, LE_RECENT_LIMIT);
  try{
    localStorage.setItem(LE_RECENT_KEY, JSON.stringify(list));
  }catch(e){ /* storage unavailable */ }
}

function leGetRecentlyViewed(limit){
  limit = limit === undefined ? LE_RECENT_LIMIT : limit;
  try{
    const raw = localStorage.getItem(LE_RECENT_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return ids.map(leFragranceById).filter(Boolean).slice(0, limit);
  }catch(e){
    return [];
  }
}

/* ============================================================
   Related products
   ============================================================ */
function leGetRelatedProducts(id, limit){
  limit = limit || 4;
  const base = leFragranceById(id);
  if(!base) return [];

  const sameHouse = FRAGRANCES.filter(f =>
    f.id !== id && f.house === base.house
  );
  const sameSeason = FRAGRANCES.filter(f =>
    f.id !== id &&
    f.house !== base.house &&
    f.season.some(s => base.season.includes(s))
  );

  const combined = [...sameHouse, ...sameSeason];
  const seen = new Set();
  const result = [];
  for(const f of combined){
    if(!seen.has(f.id)){
      seen.add(f.id);
      result.push(f);
    }
    if(result.length >= limit) break;
  }
  return result;
}

/* ============================================================
   Toast notifications
   ============================================================ */
function leEnsureToastContainer(){
  let el = document.getElementById("le-toast-container");
  if(!el){
    el = document.createElement("div");
    el.id = "le-toast-container";
    el.setAttribute("aria-live", "polite");
    Object.assign(el.style, {
      position: "fixed", bottom: "20px", right: "20px", zIndex: "9999",
      display: "flex", flexDirection: "column", gap: "8px", pointerEvents: "none"
    });
    document.body.appendChild(el);
  }
  return el;
}

function leShowToast(message, durationMs){
  durationMs = durationMs || 2600;
  if(typeof document === "undefined") return;
  const container = leEnsureToastContainer();
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    background: "#211A33", color: "#F8F6FB", padding: "10px 16px",
    borderRadius: "6px", fontSize: "14px", fontWeight: "500",
    boxShadow: "0 4px 14px rgba(33,26,51,0.28)", border: "1px solid #8B1E3F",
    opacity: "0", transform: "translateY(8px)", transition: "opacity 0.2s ease, transform 0.2s ease",
    pointerEvents: "auto", maxWidth: "280px"
  });
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 200);
  }, durationMs);
}

/* ============================================================
   Mini-cart / cart drawer
   ============================================================ */
function leEnsureCartDrawer(){
  let drawer = document.getElementById("le-cart-drawer");
  if(drawer) return drawer;

  const overlay = document.createElement("div");
  overlay.id = "le-cart-drawer-overlay";
  Object.assign(overlay.style, {
    position: "fixed", inset: "0", background: "rgba(33,26,51,0.45)",
    display: "none", zIndex: "9997"
  });
  overlay.addEventListener("click", leCloseCartDrawer);
  document.body.appendChild(overlay);

  drawer = document.createElement("div");
  drawer.id = "le-cart-drawer";
  Object.assign(drawer.style, {
    position: "fixed", top: "0", right: "0", height: "100%",
    width: "min(380px, 92vw)", background: "#fff", color: "#211A33",
    boxShadow: "-6px 0 24px rgba(33,26,51,0.2)", zIndex: "9998",
    transform: "translateX(100%)", transition: "transform 0.25s ease",
    display: "flex", flexDirection: "column", fontFamily: "inherit"
  });
  drawer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;border-bottom:1px solid #CDC6DA;">
      <strong>Your Cart</strong>
      <button id="le-cart-drawer-close" style="border:none;background:none;font-size:20px;cursor:pointer;">&times;</button>
    </div>
    <div id="le-cart-drawer-lines" style="flex:1;overflow-y:auto;padding:12px 16px;"></div>
    <div id="le-cart-drawer-footer" style="padding:16px;border-top:1px solid #CDC6DA;"></div>
  `;
  document.body.appendChild(drawer);
  drawer.querySelector("#le-cart-drawer-close").addEventListener("click", leCloseCartDrawer);
  return drawer;
}

function leRenderCartDrawer(){
  const drawer = leEnsureCartDrawer();
  const linesEl = drawer.querySelector("#le-cart-drawer-lines");
  const footerEl = drawer.querySelector("#le-cart-drawer-footer");
  const lines = leCartLines();
  const invalid = leGetInvalidCartItems();

  if(!lines.length){
    linesEl.innerHTML = `<p style="color:#5B5470;text-align:center;margin-top:40px;">Your cart is empty.</p>`;
    footerEl.innerHTML = "";
    return;
  }

  linesEl.innerHTML = lines.map(line => `
    <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #F1E4E0;">
      ${line.fragrance.image
        ? `<img src="${line.fragrance.image}" alt="${line.fragrance.name}" style="width:56px;height:80px;object-fit:contain;border-radius:6px;flex-shrink:0;">`
        : `<div style="width:56px;height:56px;border-radius:6px;background:${line.fragrance.color};flex-shrink:0;"></div>`}
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:14px;">${line.fragrance.name}</div>
        <div style="font-size:12px;color:#5B5470;">${leSizeLabel(line.size, line.id)} · ${leFormatPrice(line.unitPrice)}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
          ${leIsPartial(line.size) ? `<span style="font-size:12px;color:#5B5470;">One bottle</span>` : `<button data-le-qty-dec data-id="${line.id}" data-size="${line.size}" style="width:28px;height:28px;border:1px solid #5B5470;background:transparent;color:#211A33;border-radius:4px;cursor:pointer;line-height:1;">−</button>
          <span style="min-width:16px;text-align:center;">${line.qty}</span>
          <button data-le-qty-inc data-id="${line.id}" data-size="${line.size}" style="width:28px;height:28px;border:1px solid #5B5470;background:transparent;color:#211A33;border-radius:4px;cursor:pointer;line-height:1;">+</button>`}
          <button data-le-remove data-id="${line.id}" data-size="${line.size}" style="margin-left:auto;border:none;background:none;color:#c00;cursor:pointer;font-size:12px;padding:6px 0;">Remove</button>
        </div>
      </div>
      <div style="font-size:13px;font-weight:600;white-space:nowrap;">${leFormatPrice(line.lineTotal)}</div>
    </div>
  `).join("") + (invalid.length ? `<p style="color:#c00;font-size:12px;margin-top:10px;">${invalid.length} item(s) in your cart are no longer available and were removed.</p>` : "");

  const total = lines.reduce((n, l) => n + l.lineTotal, 0);
  footerEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;font-weight:600;margin-bottom:12px;">
      <span>Subtotal</span><span>${leFormatPrice(total)}</span>
    </div>
    <a href="checkout.html" style="display:block;text-align:center;background:#211A33;color:#fff;padding:12px;border-radius:6px;text-decoration:none;">Checkout</a>
  `;

  linesEl.querySelectorAll("[data-le-qty-inc]").forEach(btn =>
    btn.addEventListener("click", () => {
      const { id, size } = btn.dataset;
      const item = leGetCart().find(i => i.id === id && i.size === size);
      leUpdateQty(id, size, (item?.qty || 0) + 1);
      leRenderCartDrawer();
    })
  );
  linesEl.querySelectorAll("[data-le-qty-dec]").forEach(btn =>
    btn.addEventListener("click", () => {
      const { id, size } = btn.dataset;
      const item = leGetCart().find(i => i.id === id && i.size === size);
      leUpdateQty(id, size, (item?.qty || 0) - 1);
      leRenderCartDrawer();
    })
  );
  linesEl.querySelectorAll("[data-le-remove]").forEach(btn =>
    btn.addEventListener("click", () => {
      const { id, size } = btn.dataset;
      leRemoveFromCart(id, size);
      leRenderCartDrawer();
    })
  );
}

function leOpenCartDrawer(){
  leValidateCart();
  leRenderCartDrawer();
  const drawer = leEnsureCartDrawer();
  const overlay = document.getElementById("le-cart-drawer-overlay");
  overlay.style.display = "block";
  requestAnimationFrame(() => { drawer.style.transform = "translateX(0)"; });
}

function leCloseCartDrawer(){
  const drawer = document.getElementById("le-cart-drawer");
  const overlay = document.getElementById("le-cart-drawer-overlay");
  if(drawer) drawer.style.transform = "translateX(100%)";
  if(overlay) overlay.style.display = "none";
}

function leToggleCartDrawer(){
  const drawer = document.getElementById("le-cart-drawer");
  const isOpen = drawer && drawer.style.transform === "translateX(0px)";
  isOpen ? leCloseCartDrawer() : leOpenCartDrawer();
}

/* ============================================================
   Product detail modal — Fixed alignment discrepancies
   ============================================================ */
function leEnsureProductModal(){
  let modal = document.getElementById("le-product-modal");
  if(modal) return modal;

  const overlay = document.createElement("div");
  overlay.id = "le-product-modal-overlay";
  Object.assign(overlay.style, {
    position: "fixed", inset: "0", background: "rgba(33,26,51,0.55)",
    display: "none", zIndex: "9995", alignItems: "center", justifyContent: "center", padding: "20px"
  });
  overlay.addEventListener("click", e => { if(e.target === overlay) leCloseProductModal(); });

  modal = document.createElement("div");
  modal.id = "le-product-modal";
  Object.assign(modal.style, {
    background: "#fff", color: "#211A33", borderRadius: "10px", maxWidth: "640px", width: "100%",
    maxHeight: "88vh", overflowY: "auto", padding: "24px", position: "relative"
  });
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return modal;
}

function leNoteRow(label, notes){
  if(!notes) return "";
  return `
    <div style="margin-bottom:10px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#5B5470;margin-bottom:3px;">${label}</div>
      <div style="font-size:14px;">${notes}</div>
    </div>
  `;
}

function leOpenProductModal(id){
  const f = leFragranceById(id);
  if(!f) return;
  leTrackRecentlyViewed(id);

  const modal = leEnsureProductModal();
  const overlay = document.getElementById("le-product-modal-overlay");
  const sizeKeys = Object.keys(f.prices);
  const related = leGetRelatedProducts(id, 4);
  const wishlisted = leIsWishlisted(id);

  modal.innerHTML = `
    <button id="le-modal-close" style="position:absolute;top:14px;right:14px;border:none;background:none;font-size:22px;cursor:pointer;">&times;</button>
    <div style="display:flex;gap:20px;flex-wrap:wrap;">
      ${f.image
        ? `<img src="${f.image}" alt="${f.name}" style="width:160px;height:195px;object-fit:contain;border-radius:10px;border:1px solid rgba(33,26,51,0.15);flex-shrink:0;">`
        : `<div style="width:160px;height:160px;border-radius:10px;background:${f.color};border:1px solid rgba(33,26,51,0.15);flex-shrink:0;"></div>`}
      <div style="flex:1;min-width:200px;">
        <div style="font-size:12px;color:#5B5470;">${f.house}</div>
        <h2 style="margin:2px 0 4px;">${f.name}${f.soldOut ? ` <span style="display:inline-block;vertical-align:middle;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;background:${f.comingSoon ? "#8A6D3B" : "#8B1E3F"};color:#fff;padding:3px 9px;border-radius:100px;">${f.comingSoon ? "Coming soon" : "Sold out"}</span>` : ""}</h2>
        
        <!-- Fixed alignment gap discrepancy layout line -->
        <div style="font-size:12px;color:#8B1E3F;margin-bottom:6px;visibility:${f.inspiredBy ? 'visible' : 'hidden'};height:18px;line-height:18px;">
          ${f.inspiredBy ? `≈ ${f.inspiredBy}` : '&nbsp;'}
        </div>

        <div style="font-size:12px;color:#5B5470;margin-bottom:10px;">${f.gender} · ${f.season.join(", ")}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="le-modal-wishlist" style="border:1px solid #5B5470;background:${wishlisted ? "#CDC6DA" : "#fff"};padding:8px 12px;border-radius:6px;cursor:pointer;">
            ${wishlisted ? "♥ In wishlist" : "♡ Add to wishlist"}
          </button>
          ${f.fragranticaUrl ? `<a href="${f.fragranticaUrl}" target="_blank" rel="noopener" style="border:1px solid #5B5470;padding:8px 12px;border-radius:6px;font-size:13px;text-decoration:none;color:#211A33;">Fragrantica ↗</a>` : ""}
        </div>
      </div>
    </div>

    <div style="margin-top:20px;padding:16px;background:#F8F6FB;border-radius:8px;">
      <div style="font-weight:600;font-size:13px;margin-bottom:12px;">Note Pyramid</div>
      ${f.notes.all
        ? leNoteRow("Notes", f.notes.all)
        : leNoteRow("Top", f.notes.top) + leNoteRow("Heart", f.notes.heart) + leNoteRow("Base", f.notes.base)}
    </div>

    <div style="margin-top:20px;">
      ${f.comingSoon ? `<div style="padding:14px 16px;border:1px solid #CDC6DA;border-radius:8px;font-size:14px;color:#211A33;background:#F8F6FB;"><b>${leComingLabel(f)}</b><div style="font-size:12px;color:#5B5470;margin-top:4px;">Sizes and prices will be shown on arrival.</div></div>` : `<div style="font-weight:600;font-size:13px;margin-bottom:8px;">Sizes &amp; prices</div>
      <div style="border:1px solid #CDC6DA;border-radius:8px;overflow:hidden;">
        ${sizeKeys.map((sz, i) => `
          <div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding:12px 16px;${i > 0 ? "border-top:1px solid #CDC6DA;" : ""}font-size:14px;color:#211A33;">
            <span style="display:flex;gap:10px;align-items:center;">
              <span>${leSizeLabel(sz, f.id)}</span>
              <span style="font-weight:600;${leIsSoldOut(f.id, sz) && !f.comingSoon ? "text-decoration:line-through;opacity:.55;" : ""}">${leFormatPrice(f.prices[sz])}</span>
              ${leIsPartial(sz) ? `<span style="font-size:11px;color:#5B5470;">${f.partials && f.partials[sz] && f.partials[sz].tester ? `<span style="font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:1px solid #5B5470;border-radius:4px;padding:1px 5px;">Tester</span> ` : ""}one bottle · packaging &amp; shipping included${f.partials && f.partials[sz] && f.partials[sz].box ? " · with box" : ""}</span>` : ""}
            </span>
            <span class="le-modal-qty-slot" data-size="${sz}"></span>
          </div>
        `).join("")}
      </div>`}
    </div>

    ${related.length ? `
      <div style="margin-top:24px;">
        <div style="font-weight:600;font-size:13px;margin-bottom:10px;">You may also like</div>
        <div style="display:flex;gap:10px;overflow-x:auto;">
          ${related.map(r => `
            <div data-le-related="${r.id}" style="cursor:pointer;flex-shrink:0;width:110px;text-align:center;">
              ${r.image
                ? `<img src="${r.image}" alt="${r.name}" style="width:110px;height:135px;object-fit:contain;border-radius:8px;">`
                : `<div style="width:110px;height:110px;border-radius:8px;background:${r.color};"></div>`}
              <div style="font-size:11px;margin-top:6px;">${r.name}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  `;

  modal.querySelectorAll(".le-modal-qty-slot").forEach(slot => {
    leWireQtyControl(slot, f.id, slot.dataset.size, "light");
  });

  modal.querySelector("#le-modal-close").addEventListener("click", leCloseProductModal);
  modal.querySelector("#le-modal-wishlist").addEventListener("click", () => {
    leToggleWishlist(f.id);
    leOpenProductModal(f.id);
  });
  modal.querySelectorAll("[data-le-related]").forEach(el =>
    el.addEventListener("click", () => leOpenProductModal(el.dataset.leRelated))
  );

  overlay.style.display = "flex";
}

function leCloseProductModal(){
  const overlay = document.getElementById("le-product-modal-overlay");
  if(overlay) overlay.style.display = "none";
}

/* ============================================================
   Checkout guard
   ============================================================ */
function leCheckoutGuard(redirectUrl){
  redirectUrl = redirectUrl || "cart.html";
  leValidateCart();
  if(leCartCount() === 0){
    leShowToast("Your cart is empty — add something first.");
    window.location.href = redirectUrl;
    return false;
  }
  return true;
}

/* ============================================================
   Order number — EP-00001, EP-00002, ...
   Backed by a Google Apps Script Web App that atomically
   increments a counter cell in the shop's Google Sheet, so the
   number is unique across every customer/device, not just this
   browser. Paste your deployed Web App URL below.

   Call leGetNextOrderNumber() when an order is placed (e.g. on
   the checkout page's "Place order" handler):

     const orderNumber = await leGetNextOrderNumber();
     if(orderNumber){
       // show it / store it with the order
     } else {
       // request failed — fall back to leFallbackOrderNumber()
     }
   ============================================================ */
/* EP order counter (Apps Script web app that returns { orderNumber: "EP-00001" }). Leave "" until it is deployed: orders then get a temporary EP-LOCAL number. */
const LE_ORDER_COUNTER_URL = "";

async function leGetNextOrderNumber(){
  if(!LE_ORDER_COUNTER_URL) return null;
  try {
    const res = await fetch(LE_ORDER_COUNTER_URL, { method: "POST" });
    if(!res.ok) throw new Error("Bad response: " + res.status);
    const data = await res.json();
    return data.orderNumber || null;
  } catch(err){
    console.error("leGetNextOrderNumber failed:", err);
    return null;
  }
}

/* Local-only fallback if the network call fails — not globally
   unique, so only use it as a last resort so checkout doesn't
   block a customer entirely. */
function leFallbackOrderNumber(){
  const key = "le_local_order_seq";
  const n = (parseInt(localStorage.getItem(key), 10) || 0) + 1;
  localStorage.setItem(key, n);
  return "EP-LOCAL-" + String(n).padStart(5, "0");
}

/* ============================================================
   Cross-tab sync
   ============================================================ */
window.addEventListener("storage", (e) => {
  if(e.key === LE_CART_KEY){
    leUpdateCartBadges();
    if(document.getElementById("le-cart-drawer")) leRenderCartDrawer();
  }
  if(e.key === LE_WISHLIST_KEY){
    leUpdateWishlistBadges();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  leMigrateCart();
  leValidateCart();
  leUpdateCartBadges();
  leUpdateWishlistBadges();
});

/* ============================================================
   Google Sheet sync — prices
   Reads the "Decants" tab of the Liquid Emotions Decant List and
   applies it on top of the prices in this file. If the sheet
   can't be reached, the prices in this file are used, so the
   site never breaks. The sheet must be shared as "Anyone with
   the link can view" (or published to the web).
   Perfumes are matched by name (and brand); rows that can't be
   matched are skipped and listed in the browser console.
   ============================================================ */
const LE_SHEET_ENABLED = true;
const LE_SHEET_ID = "1LKLSVdk2K_eEfx6oOOEjDo-51tluUoYThG4gqG4LQ34";
const LE_SHEET_TAB = "Decants";
/* headers=0 stops Google from treating the top rows as column titles, which
   would otherwise swallow the first section's "Brand / Perfume / 5ml…" row. */
const LE_SHEET_URL = "https://docs.google.com/spreadsheets/d/" + LE_SHEET_ID +
  "/gviz/tq?tqx=out:csv&headers=0&sheet=" + encodeURIComponent(LE_SHEET_TAB);
/* Second route, tried only if the first one fails. */
const LE_SHEET_URL_ALT = "https://docs.google.com/spreadsheets/d/" + LE_SHEET_ID +
  "/export?format=csv&gid=0";
const LE_SHEET_CACHE_KEY = "le_sheet_v1";
const LE_SHEET_MIN_ROWS = 20;   // ignore the sheet if it parses to fewer rows than this

function leParseCsv(text){
  const rows = [];
  let row = [], cell = "", inQ = false;
  for(let i = 0; i < text.length; i++){
    const c = text[i];
    if(inQ){
      if(c === '"'){
        if(text[i + 1] === '"'){ cell += '"'; i++; } else inQ = false;
      }else cell += c;
    }else if(c === '"') inQ = true;
    else if(c === ","){ row.push(cell); cell = ""; }
    else if(c === "\n"){ row.push(cell); rows.push(row); row = []; cell = ""; }
    else if(c !== "\r") cell += c;
  }
  if(cell !== "" || row.length){ row.push(cell); rows.push(row); }
  return rows;
}

function leParseSheetRows(csvRows){
  const out = [];
  let sizes = null, section = "";
  csvRows.forEach(r => {
    const a = (r[0] || "").trim(), b = (r[1] || "").trim();
    const c2 = (r[2] || "").trim();
    if(!a && !b && c2 && !/^\d/.test(c2) && !/ml$/i.test(c2)) section = c2;
    if(b.toLowerCase() === "perfume"){
      sizes = [];
      for(let c = 2; c < r.length; c++){
        const m = /^(\d+)\s*ml$/i.exec((r[c] || "").trim());
        if(m) sizes.push({ col: c, size: m[1] + "ml" });
        else break;
      }
      return;
    }
    if(!sizes || !sizes.length || !a || !b) return;
    const prices = {};
    const soldSizes = [];
    const isSold = (t) => /^sold\s*-?\s*out$/i.test(String(t || "").trim());
    /* "Coming soon" (optionally followed by when, e.g. "Coming soon 25 Oct") in any cell after the
       perfume name marks it as upcoming. "Arriving 25 Oct" and "Upcoming" work too. */
    const soonRe = /^(coming\s*soon|arriving|upcoming)\b[\s:–—-]*(.*)$/i;
    let comingSoon = false, arrival = "";
    for(let c = 2; c < r.length; c++){
      const m = soonRe.exec((r[c] || "").trim());
      if(m){ comingSoon = true; if(m[2] && !arrival) arrival = m[2].trim(); }
    }
    sizes.forEach(({ col, size }) => {
      const raw = (r[col] || "").trim();
      if(isSold(raw)){ soldSizes.push(size); return; }
      if(soonRe.test(raw)) return;   // "Coming soon" typed in a size cell: no price for that size yet
      const n = parseFloat(raw.replace(/[₹,\s]/g, ""));
      if(isFinite(n) && n > 0) prices[size] = n;
    });
    /* "Sold out" written in any other cell of the row (e.g. a column after the last size)
       marks the whole perfume as sold out. */
    const sizeCols = sizes.map(x => x.col);
    let soldAll = false;
    for(let c = 2; c < r.length; c++){
      if(!sizeCols.includes(c) && isSold(r[c])) soldAll = true;
    }
    if(!Object.keys(prices).length && soldSizes.length) soldAll = true;
    if(!Object.keys(prices).length && !soldSizes.length && !soldAll && !comingSoon) return;
    out.push({ brand: a, name: b, prices, section, soldSizes, soldAll, comingSoon, arrival });
  });
  return { rows: out };
}

function leNorm(t){ return String(t || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, ""); }

/* Sheet names that differ from the site's names. Format:
   "Brand — Perfume (as written in the sheet)": "id of the fragrance above". */
const LE_SHEET_ALIASES = {
  "ajmal — evoke gold men": "evoke-gold",
  "jpg — le male elixir": "le-male-elixir",
  "maison alhambra — tuscano leather": "toscano-leather",
  "rasasi — hawas": "hawas",
  "victor rolf — spicebomb extreme": "spicebomb-extreme",
  "lalique — encre noir edt": "encre-noire-edt",
  "d&g — light blue eau intense": "light-blue-eau-intense",
  "narciso rodriguez — for him edp": "narciso-for-him-edp",
  "rasasi — shuhrah": "shuhrah",
  "dyptique — tam dao": "tam-dao",
  "dyptique — tam dao edp": "tam-dao",
  "diptyque — tam dao": "tam-dao",
  "diptyque — tam dao edp": "tam-dao"
};

function leSheetMatches(f, row){
  const alias = LE_SHEET_ALIASES[(row.brand + " — " + row.name).toLowerCase()];
  if(alias) return f.id === alias;
  const nf = leNorm(f.name), nr = leNorm(row.name);
  const nb = leNorm(row.brand), nh = leNorm(f.house);
  const brandOk = nb === nh || nb.includes(nh) || nh.includes(nb) || nb.slice(0, 5) === nh.slice(0, 5);
  if(!brandOk) return false;
  return nf === nr || nf === nb + nr || nf === nh + nr;
}

/* ============================================================
   New perfumes straight from the sheet
   Add a row in the "NewPerfumes" tab (details) and a row in the
   "Decants" tab (prices) — the site creates the perfume by itself.
   The bottle photo is worked out from the Fragrantica link.
   ============================================================ */
const LE_CATALOGUE_TAB = "NewPerfumes";
/* headers=1: this tab's first row is a real header row. Telling Google so keeps the
   date column typed as dates — with headers=0 Google drops the date cell, because
   one text cell ("Date added") and one date cell look like a tie. */
const LE_CATALOGUE_URL = "https://docs.google.com/spreadsheets/d/" + LE_SHEET_ID +
  "/gviz/tq?tqx=out:csv&headers=1&sheet=" + encodeURIComponent(LE_CATALOGUE_TAB);
const LE_NEW_COLORS = ["#4A8067", "#8B1E3F", "#1F2A44", "#6B4E71", "#8A6D3B", "#3F5F7A", "#7A3B3B", "#2E2E2E", "#5B6B3A", "#A06A4B"];

function leParseCatalogueRows(csvRows){
  let cols = null;
  const out = [];
  csvRows.forEach(r => {
    const cells = r.map(c => (c || "").trim());
    if(!cols){
      const low = cells.map(c => c.toLowerCase());
      const bi = low.findIndex(c => c === "brand");
      const pi = low.findIndex(c => c === "perfume" || c === "perfume name");
      const fi = low.findIndex(c => c.includes("fragrantica"));
      if(bi > -1 && pi > -1 && fi > -1){
        const find = (...keys) => low.findIndex(c => keys.some(k => c.includes(k)));
        cols = { brand: bi, name: pi, link: fi, top: find("top"), heart: find("heart", "middle"),
                 base: find("base"), inspired: find("inspired", "smells"), gender: find("gender"),
                 season: find("season"), added: find("added", "date"), image: find("image", "photo") };
      }
      return;
    }
    const brand = cells[cols.brand], name = cells[cols.name];
    if(!brand || !name) return;
    const g = k => cols[k] > -1 ? (cells[cols[k]] || "") : "";
    out.push({ brand, name, link: g("link"), top: g("top"), heart: g("heart"), base: g("base"),
               inspired: g("inspired"), gender: g("gender"), season: g("season"), added: g("added"), image: g("image") });
  });
  return cols ? out : null;   // null = tab missing or not in the expected format
}

/* Arrival date written after "Coming soon" in the sheet, e.g. "25 Oct", "25 Oct 2026",
   "25/10", "25-10-2026", "Oct 25", "2026-10-25" -> "YYYY-MM-DD" ("" if no date is recognised). */
function leTodayISO(){
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function leParseArrivalDate(t){
  t = String(t || "").trim();
  if(!t) return "";
  const full = leParseAddedDate(t);
  if(full) return full;
  const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const iso = (y, mo, d) => y + "-" + String(mo).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  let m, mo, d, y = null;
  if((m = /^(\d{1,2})(?:st|nd|rd|th)?[\s-]+([A-Za-z]{3})[a-z]*\b/.exec(t))){ d = +m[1]; mo = MONTHS.indexOf(m[2].toLowerCase()) + 1; }          // 25 Oct
  else if((m = /^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?\b/.exec(t))){ mo = MONTHS.indexOf(m[1].toLowerCase()) + 1; d = +m[2]; }   // Oct 25
  else if((m = /^(\d{1,2})[\/.-](\d{1,2})(?:[\/.-](\d{2,4}))?\b/.exec(t))){                                                                    // 25/10 or 25-10-2026 (day first)
    d = +m[1]; mo = +m[2]; if(m[3]) y = +m[3] < 100 ? 2000 + +m[3] : +m[3];
  }
  if(!(mo >= 1 && mo <= 12 && d >= 1 && d <= 31)) return "";
  if(y === null){
    const now = new Date();
    y = now.getFullYear();
    const cand = new Date(y, mo - 1, d);
    if(cand.getTime() < now.getTime() - 60 * 86400000) y += 1;   // no year given and long past: it means next year
  }
  return iso(y, mo, d);
}

function leSlug(t){ return String(t || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

function leParseAddedDate(t){
  t = String(t || "").trim();
  if(!t) return "";
  const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const iso = (y, mo, d) => y + "-" + String(mo).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  const ok = (mo, d) => mo >= 1 && mo <= 12 && d >= 1 && d <= 31;
  let m;
  if((m = /^Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/.exec(t))){            // Date(2026,9,7) — months start at 0
    return ok(+m[2] + 1, +m[3]) ? iso(+m[1], +m[2] + 1, +m[3]) : "";
  }
  if((m = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/.exec(t))){                 // 2026-10-07
    return ok(+m[2], +m[3]) ? iso(+m[1], +m[2], +m[3]) : "";
  }
  if((m = /^(\d{1,2})[\s-]+([A-Za-z]{3})[a-z]*[\s,.-]+(\d{4})/.exec(t))){      // 7 Oct 2026, 7-Oct-2026
    const mo = MONTHS.indexOf(m[2].toLowerCase()) + 1;
    return ok(mo, +m[1]) ? iso(+m[3], mo, +m[1]) : "";
  }
  if((m = /^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/.exec(t))){         // Oct 7, 2026
    const mo = MONTHS.indexOf(m[1].toLowerCase()) + 1;
    return ok(mo, +m[2]) ? iso(+m[3], mo, +m[2]) : "";
  }
  if((m = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})/.exec(t))){                  // 7/10/2026 — day-first or month-first?
    const a = +m[1], b = +m[2], y = +m[3];
    const cands = [];
    if(ok(b, a)) cands.push([y, b, a]);      // day / month
    if(a !== b && ok(a, b)) cands.push([y, a, b]);   // month / day
    if(cands.length === 1) return iso(...cands[0]);
    if(!cands.length) return "";
    /* Both readings are possible (7/10 = 7 Oct or 10 Jul). A "date added" is
       never in the future, so take the reading closest to today. */
    const now = Date.now();
    const scored = cands.map(c => ({ c, age: (now - new Date(iso(...c) + "T00:00:00").getTime()) / 86400000 }))
                        .filter(x => x.age >= -1);
    if(!scored.length) return "";
    scored.sort((x, y2) => x.age - y2.age);
    return iso(...scored[0].c);
  }
  return "";
}

/* Everything about a perfume that comes from its NewPerfumes row. */
function leCatalogueDetails(entry){
  const fz = /-(\d+)\.html/.exec(entry.link || "");
  const gl = (entry.gender || "").toLowerCase();
  return {
    notes: { top: entry.top, heart: entry.heart, base: entry.base },
    gender: /^(women|female|ladies|her)/.test(gl) ? "Women" : /^(men|male|him|gents)/.test(gl) ? "Men" : "Unisex",
    season: entry.season
      ? [...new Set(entry.season.split(/[,/]/).map(x => x.trim()).filter(Boolean).map(x =>
          /^all[\s-]*seasons?$/i.test(x) ? "All-Season" : x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()))]
      : ["All-Season"],
    inspiredBy: entry.inspired || undefined,
    image: entry.image || (fz ? "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500." + fz[1] + ".2x.avif" : undefined),
    fragranticaUrl: entry.link || undefined,
    newSince: leParseAddedDate(entry.added) || undefined
  };
}

function leFillFromCatalogue(f, entry){
  const d = leCatalogueDetails(entry);
  f.notes = d.notes; f.gender = d.gender; f.season = d.season;
  ["inspiredBy", "image", "fragranticaUrl", "newSince"].forEach(k => {
    if(d[k] === undefined) delete f[k]; else f[k] = d[k];
  });
  if(!Object.getOwnPropertyDescriptor(f, "isNew")){
    Object.defineProperty(f, "isNew", { get(){ return leComputeIsNew(f.newSince); }, enumerable: true, configurable: true });
  }
}

function leCreateFromCatalogue(row, catalogue){
  if(!catalogue) return null;
  const entry = catalogue.find(c => leSheetMatches({ name: c.name, house: c.brand, id: "" }, row));
  if(!entry) return null;
  const cleanName = entry.name.trim();
  let id = leSlug(cleanName);
  if(LE_ALL_FRAGRANCES.some(x => x.id === id)) id = leSlug(entry.brand + " " + cleanName);
  if(LE_ALL_FRAGRANCES.some(x => x.id === id)) return null;
  let hash = 0; for(const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const f = {
    id, name: cleanName, house: entry.brand.trim(),
    color: LE_NEW_COLORS[hash % LE_NEW_COLORS.length],
    prices: {}, fromSheet: true
  };
  leFillFromCatalogue(f, entry);
  if(!HOUSE_CATEGORY[f.house] && row.section) HOUSE_CATEGORY[f.house] = row.section;
  LE_ALL_FRAGRANCES.push(f);
  FRAGRANCES.push(f);
  return f;
}

/* ============================================================
   Partial bottles from the sheet
   A "Partials" tab with the headers: Brand, Perfume, Bottle size (ml),
   ML left, SP (full-bottle price, optional), Price, Box, Tester, Status.
   Tester: type yes in that column to mark the partial as a tester.
   Price shown = the Price column; if that is empty it is worked out as
   ((SP - 100) / bottle size) * ml left + 125.
   Status: empty = on sale, "Hold" = Reserved, "Sold out" = sold.
   ============================================================ */
const LE_PARTIALS_TAB = "Partials";
const LE_PARTIALS_URL = "https://docs.google.com/spreadsheets/d/" + LE_SHEET_ID +
  "/gviz/tq?tqx=out:csv&headers=1&sheet=" + encodeURIComponent(LE_PARTIALS_TAB);

function leParsePartialRows(csvRows){
  let cols = null;
  const out = [];
  const num = t => { const n = parseFloat(String(t || "").replace(/[₹,\s]/g, "")); return isFinite(n) ? n : 0; };
  csvRows.forEach(r => {
    const cells = r.map(c => (c || "").trim());
    if(!cols){
      const low = cells.map(c => c.toLowerCase());
      const bi = low.findIndex(c => c === "brand");
      const pi = low.findIndex(c => c === "perfume" || c === "perfume name");
      const find = (...keys) => low.findIndex(c => keys.some(k => c.includes(k)));
      if(bi > -1 && pi > -1){
        cols = { brand: bi, name: pi,
                 size: find("bottle size", "original size"),
                 left: find("left", "remaining"),
                 sp: low.findIndex(c => c === "sp" || /^sp\b/.test(c) || c.includes("selling price") || c.includes("full-bottle") || c.includes("full bottle")),
                 final: low.findIndex(c => c.includes("final") || c === "price"), box: find("box"), tester: find("tester"), status: find("status") };
      }
      return;
    }
    if(cols.left < 0) return;                       // not a Partials tab
    const brand = cells[cols.brand], name = cells[cols.name];
    if(!brand || !name) return;
    const g = k => cols[k] > -1 ? (cells[cols[k]] || "") : "";
    const left = Math.round(num(g("left")));
    if(!(left > 0)) return;
    const size = num(g("size")), sp = num(g("sp"));
    let price = Math.round(num(g("final")));
    if(!(price > 0) && sp > 0 && size > 0) price = Math.round(((sp - 100) / size) * left + 125);
    if(!(price > 0)) return;
    const st = g("status").toLowerCase();
    out.push({ brand, name, ml: left, price, key: left + "ml-P",
               box: /^(y|yes|true|✓)/i.test(g("box")),
               tester: /^(y|yes|true|✓|tester)/i.test(g("tester")),
               status: /sold/.test(st) ? "sold" : /hold|reserv/.test(st) ? "hold" : "" });
  });
  return cols ? out : null;   // null = tab missing or not in the expected format
}

function leFetchPartials(){
  const fallback = () => {
    try{ const c = JSON.parse(localStorage.getItem(LE_SHEET_CACHE_KEY) || "null"); return c && c.partials ? c.partials : null; }catch(e){ return null; }
  };
  return fetch(LE_PARTIALS_URL, { cache: "no-store" })
    .then(r => { if(!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then(t => leParsePartialRows(leParseCsv(t)) || fallback())
    .catch(() => fallback());
}

function leApplySheetData(data){
  const unmatched = [];
  const present = new Set();
  const ORDER = ["3ml", "5ml", "10ml", "20ml", "30ml"];
  data.rows.forEach(row => {
    let f = LE_ALL_FRAGRANCES.find(x => leSheetMatches(x, row));
    if(!f) f = leCreateFromCatalogue(row, data.catalogue);
    else if(f.fromSheet && data.catalogue){
      /* Created earlier (e.g. from the copy saved on this phone): refresh its details. */
      const entry = data.catalogue.find(c => leSheetMatches({ name: c.name, house: c.brand, id: "" }, row));
      if(entry) leFillFromCatalogue(f, entry);
    }
    if(!f){ unmatched.push(row.brand + " — " + row.name); return; }
    present.add(f.id);
    const merged = Object.assign({}, f.prices);
    Object.keys(merged).forEach(sz => { if(leIsPartial(sz) || leIsBottle(sz)) delete merged[sz]; });   // partials and bottles are re-read from the sheets each time
    Object.keys(row.prices).forEach(sz => { if(ORDER.includes(sz)) merged[sz] = row.prices[sz]; });
    /* Sold out: the size stays visible (with its last known price) but can't be ordered. */
    /* Coming soon: blocked until the arrival date. From that date on it goes on sale by itself and
       counts as New for LE_NEW_DAYS days, so nothing needs editing in the sheet. With no
       recognisable date it stays "Coming soon" until the marker is deleted. */
    const arrISO = row.comingSoon ? leParseArrivalDate(row.arrival) : "";
    const soon = !!row.comingSoon && !(arrISO && leTodayISO() >= arrISO);
    f.soldSizes = ((row.soldAll || soon) ? Object.keys(merged) : (row.soldSizes || []).filter(sz => merged[sz] !== undefined));
    f.heldSizes = [];
    f.comingSoon = soon;
    f.arrival = row.arrival || "";
    if(arrISO){
      f.newSince = arrISO;
      if(!Object.getOwnPropertyDescriptor(f, "isNew")){
        Object.defineProperty(f, "isNew", { get(){ return leComputeIsNew(f.newSince); }, enumerable: true, configurable: true });
      }
    }
    f.partials = {};
    /* Partial bottles for this perfume, from the "Partials" tab. Their own Status decides
       whether they can be bought, independent of the decant sizes. */
    (data.partials || []).filter(p => leSheetMatches(f, p)).forEach(p => {
      merged[p.key] = p.price;
      f.partials[p.key] = { ml: p.ml, box: p.box, tester: !!p.tester };
      if(p.status === "sold") f.soldSizes.push(p.key);
      else if(p.status === "hold") f.heldSizes.push(p.key);
    });
    const mergedKeys = Object.keys(merged);
    f.soldOut = mergedKeys.length > 0
      ? mergedKeys.every(sz => f.soldSizes.includes(sz) || f.heldSizes.includes(sz))
      : !!row.soldAll;
    if(f.comingSoon) f.soldOut = true;
    const sorted = {};
    mergedKeys.sort((x, y) => (leSizeRank(x) - leSizeRank(y)) || (parseFloat(x) - parseFloat(y))).forEach(sz => { sorted[sz] = merged[sz]; });
    f.prices = sorted;
  });
  const bottleResult = epApplyBottles(data.bottles, present);
  if(unmatched.length && typeof console !== "undefined"){
    console.info("[Liquid Emotions] Sheet rows not matched to a perfume on the site:", unmatched);
  }

  /* The sheet decides what is on sale: a perfume with no row in "Decants" is taken
     off the site, and comes back when its row is added again. Safety net: if the
     sheet looks incomplete (fewer than 60% of the site's perfumes found in it),
     nothing is hidden, so a bad read can never blank the shop. */
  const known = LE_ALL_FRAGRANCES.filter(f => !f.hidden);
  const keep = known.filter(f => present.has(f.id));
  const trusted = data.rows.length >= LE_SHEET_MIN_ROWS && keep.length >= known.length * 0.6;
  const shown = trusted ? keep : known;
  FRAGRANCES.length = 0;
  shown.forEach(f => FRAGRANCES.push(f));
  return { removed: trusted ? known.filter(f => !present.has(f.id)).map(f => f.name) : [], skipped: !trusted, unmatched, bottles: bottleResult };
}


/* ============================================================
   Full bottles, testers and vials (the Enigma stock sheet)
   One Google Sheet (published as CSV) lists every bottle: Type (BNIB / Tester / Vial), Brand, Name,
   Size, Price, MRP, In stock, Date added, For, Season, Box, Condition, Fragrantica, Top notes,
   Heart notes, Base notes, Photos, Id. Rows are joined to a decant perfume when EP_LINKS names it
   (Enigma id -> decant id) or the brand and name are exactly the same; otherwise the perfume
   gets its own card with only bottle options. A row with no price stays hidden.
   ============================================================ */
const EP_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPdgz9IT8mFiKoaq6wBxf4jw99uhBXNuAaqBPOrRrpRHz1Fh6qYBLcJZzFm4n2H1sJAM5cg8Wq2UNK/pub?output=csv";
const EP_LINKS = {
  "afnan-9pm": "9pm",
  "afnan-9pm-rebel": "9-pm-rebel",
  "afnan-rare-reef": "rare-reef",
  "afnan-supremacy-not-only-intense": "supremacy-not-only-intense",
  "afnan-supremacy-collectors-edition": "supremacy-collectors-edition",
  "afnan-turathi-blue": "turathi-blue",
  "arabiyat-prestige-hamdan-the-sheikh": "hamdan-the-sheikh",
  "arabiyat-prestige-al-noor": "al-noor",
  "armaf-club-de-nuit-intense-man-pure-parfum": "club-de-nuit-intense-man-pp",
  "french-avenue-liquid-brun": "liquid-brun",
  "french-avenue-liquid-brun-limited-edition": "liquid-brun-limited-edition",
  "french-avenue-spectre-ghost": "spectre-ghost",
  "paris-corner-mawj-moscow-mule": "mawj-moscow-mule",
  "rasasi-hawas-for-him": "hawas",
  "rasasi-hawas-ice": "hawas-ice",
  "rasasi-hawas-elixir": "hawas-elixir",
  "rasasi-hawas-fire": "hawas-fire",
  "rasasi-hawas-verde": "hawas-verde",
  "rasasi-hawas-venom": "hawas-venom",
  "rasasi-fattan": "fattan",
  "rasasi-shuhrah": "shuhrah",
  "rayhaan-lion": "lion",
  "rayhaan-cedrus-blanc": "rayhaan-cedrus-blanc",
  "riiffs-momento": "momento",
  "maison-alhambra-jean-lowe-immortel": "jean-lowe-immortel",
  "swiss-arabian-incense-01": "incense-01",
  "lattafa-asad-elixir": "asad-elixir",
  "hugo-boss-hugo": "hugo-man-edt",
  "guerlain-lhomme-ideal-eau-de-parfum": "lhomme-ideal-edp",
  "guerlain-habit-rouge-eau-de-parfum-tester": "habit-rouge-edp",
  "givenchy-gentleman-reserve-privee-tester": "gentleman-reserve-privee",
  "narciso-rodriguez-for-him-bleu-noir-parfum-tester": "bleu-noir",
  "narciso-rodriguez-for-him-eau-de-toilette-tester": "narciso-for-him-edt",
  "narciso-rodriguez-for-him-eau-de-parfum-tester": "narciso-for-him-edp",
  "dolce-gabbana-light-blue-eau-intense-pour-homme-tester": "light-blue-eau-intense",
  "montale-arabians-tonka-tester": "arabians-tonka",
  "lalique-encre-noire": "encre-noire-edt",
  "diptyque-tam-dao-edp": "tam-dao",
  "giorgio-armani-emporio-armani-stronger-with-you-intensely": "stronger-with-you-intensely",
  "creed-aventus-vial": "aventus"
};
const EP_HOUSE_CATEGORY = {
  "Nishane": "Niche", "Creed": "Niche", "Montale": "Niche", "Diptyque": "Niche",
  "Dunhill": "Designer", "Giorgio Armani": "Designer", "Issey Miyake": "Designer", "Givenchy": "Designer",
  "Carolina Herrera": "Designer", "Paco Rabanne": "Designer", "Ralph Lauren": "Designer", "Narciso Rodriguez": "Designer",
  "Lalique": "Designer", "Rochas": "Designer", "Hugo Boss": "Designer", "Guerlain": "Designer", "Azzaro": "Designer",
  "Dolce & Gabbana": "Designer", "Bvlgari": "Designer", "Mancera": "Designer",
  "Swiss Arabian": "Middle Eastern", "Al Wataniah": "Middle Eastern", "Nusuk": "Middle Eastern", "Rue Broca": "Middle Eastern",
  "Mykonos": "Middle Eastern", "Riiffs": "Middle Eastern", "Paris Corner": "Middle Eastern", "French Avenue": "Middle Eastern",
  "Rayhaan": "Middle Eastern", "Rasasi": "Middle Eastern", "Armaf": "Middle Eastern", "Afnan": "Middle Eastern",
  "Ajmal": "Middle Eastern", "Maison Alhambra": "Middle Eastern", "Ahmed Al Maghribi": "Middle Eastern",
  "Arabiyat Prestige": "Middle Eastern", "Lattafa": "Middle Eastern"
};
Object.keys(EP_HOUSE_CATEGORY).forEach(h => { if(!HOUSE_CATEGORY[h]) HOUSE_CATEGORY[h] = EP_HOUSE_CATEGORY[h]; });

/* If accents were scrambled when a CSV was imported (IdÃ©al instead of Idéal), put them back. */
const EP_CP1252 = {0x20AC:0x80,0x201A:0x82,0x0192:0x83,0x201E:0x84,0x2026:0x85,0x2020:0x86,0x2021:0x87,0x02C6:0x88,0x2030:0x89,0x0160:0x8A,0x2039:0x8B,0x0152:0x8C,0x017D:0x8E,0x2018:0x91,0x2019:0x92,0x201C:0x93,0x201D:0x94,0x2022:0x95,0x2013:0x96,0x2014:0x97,0x02DC:0x98,0x2122:0x99,0x0161:0x9A,0x203A:0x9B,0x0153:0x9C,0x017E:0x9E,0x0178:0x9F};
function epFixText(s){
  s = s.replace(/Ã(?=lectrique)/g, "\u00C9");
  if(!/[\u00C2-\u00F4]/.test(s)) return s;
  try{
    const bytes = [];
    for(const ch of s){ const c = ch.codePointAt(0); if(c < 256) bytes.push(c); else if(EP_CP1252[c]) bytes.push(EP_CP1252[c]); else return s; }
    return new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
  }catch(e){ return s; }
}

function epParseBottleRows(csvRows){
  const norm = x => String(x || "").trim().toLowerCase().replace(/\s+/g, " ");
  const hi = csvRows.findIndex(r => r.some(c => norm(c) === "brand") && r.some(c => norm(c) === "name"));
  if(hi < 0) return [];
  const C = {};
  csvRows[hi].forEach((h, i) => { const k = norm(h); if(k && C[k] === undefined) C[k] = i; });
  const get = (r, k) => (C[k] !== undefined && r[C[k]] != null) ? epFixText(String(r[C[k]]).trim().replace(/^'+/, "").trim()) : "";
  const out = [];
  csvRows.slice(hi + 1).forEach(r => {
    const house = get(r, "brand"), name = get(r, "name");
    const price = parseInt(get(r, "price").replace(/[^0-9]/g, ""), 10);
    if(!house || !name || !(price > 0)) return;
    const t = norm(get(r, "type"));
    const type = /^test/.test(t) ? "tester" : /^vial|^sample/.test(t) ? "vial" : "bnib";
    const ml = parseFloat(get(r, "size").replace(",", ".")) || (type === "vial" ? 1.5 : 100);
    const mrp = parseInt(get(r, "mrp").replace(/[^0-9]/g, ""), 10) || 0;
    const stock = norm(get(r, "in stock"));
    const box = norm(get(r, "box"));
    const notes = k => get(r, k);
    out.push({
      id: get(r, "id") || leSlug(house + " " + name) + (type === "tester" ? "-tester" : type === "vial" ? "-vial" : ""),
      house, name, type, ml, price, mrp: mrp > price ? mrp : 0,
      inStock: !(/^(no|n|0|false|sold)/.test(stock)),
      added: get(r, "date added"), gender: get(r, "for"), season: get(r, "season"),
      box: box ? !/^(no|n|0|false)/.test(box) : undefined, condition: get(r, "condition"),
      link: get(r, "fragrantica"),
      top: notes("top notes"), heart: notes("heart notes"), base: notes("base notes")
    });
  });
  return out;
}

function epApplyBottles(rows, present){
  rows = rows || [];
  /* start clean: bottle options are rebuilt from the sheet every time */
  LE_ALL_FRAGRANCES.forEach(f => {
    Object.keys(f.prices || {}).forEach(k => { if(leIsBottle(k)) delete f.prices[k]; });
    f.soldSizes = (f.soldSizes || []).filter(k => !leIsBottle(k));
    f.bottles = {};
  });
  const key = (h, n) => leSlug(h) + "|" + leSlug(n);
  const groups = new Map();
  rows.forEach(r => { const k = key(r.house, r.name); if(!groups.has(k)) groups.set(k, []); groups.get(k).push(r); });
  const touched = new Set(), created = [], linked = [];
  groups.forEach((list, gk) => {
    const first = list[0];
    let f = null;
    const linkRow = list.find(r => EP_LINKS[r.id]);
    if(linkRow) f = LE_ALL_FRAGRANCES.find(x => x.id === EP_LINKS[linkRow.id] && !x.hidden) || null;
    if(!f) f = LE_ALL_FRAGRANCES.find(x => !x.hidden && key(x.house, x.name) === gk) || null;
    if(!f) f = LE_ALL_FRAGRANCES.find(x => x.epGroup === gk) || null;
    if(f && !f.epGroup && !f.fromSheet) linked.push(f.name);
    if(!f){
      const lh = LE_ALL_FRAGRANCES.find(x => leSlug(x.house) === leSlug(first.house));
      const house = lh ? lh.house : first.house;
      let id = leSlug(house + " " + first.name), n = 2;
      while(LE_ALL_FRAGRANCES.some(x => x.id === id)) id = leSlug(house + " " + first.name) + "-" + (n++);
      let hash = 0; for(const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
      const withLink = list.find(r => r.link) || first;
      const fz = /-(\d+)\.html/.exec(withLink.link || "");
      const gl = (withLink.gender || list.map(r => r.gender).find(Boolean) || "").toLowerCase();
      const dates = list.map(r => leParseAddedDate(r.added)).filter(Boolean).sort();
      f = {
        id, name: first.name, house, color: LE_NEW_COLORS[hash % LE_NEW_COLORS.length],
        prices: {}, fromSheet: true, epGroup: gk, bottleOnly: true,
        notes: { top: withLink.top, heart: withLink.heart, base: withLink.base },
        gender: /^(women|female|ladies|her)/.test(gl) ? "Women" : /^(men|male|him|gents)/.test(gl) ? "Men" : "Unisex",
        season: withLink.season ? withLink.season.split(/[,/]/).map(x => x.trim()).filter(Boolean) : ["All-Season"]
      };
      if(withLink.link){ f.fragranticaUrl = withLink.link; if(fz) f.image = "https://fimgs.net/mdimg/perfume-thumbs/dark-375x500." + fz[1] + ".2x.avif"; }
      if(dates.length){
        f.newSince = dates[0];
        Object.defineProperty(f, "isNew", { get(){ return leComputeIsNew(f.newSince); }, enumerable: true, configurable: true });
      }
      LE_ALL_FRAGRANCES.push(f);
      created.push(f.name);
    }
    f.bottles = f.bottles || {};
    list.forEach(r => {
      const k = r.ml + "ml-" + (r.type === "tester" ? "T" : r.type === "vial" ? "V" : "B");
      f.prices[k] = r.price;
      f.bottles[k] = { kind: r.type, ml: r.ml, mrp: r.mrp || 0, box: r.box, condition: r.condition || "" };
      if(!r.inStock) (f.soldSizes = f.soldSizes || []).push(k);
    });
    touched.add(f);
    present.add(f.id);
  });
  touched.forEach(f => {
    const sorted = {};
    Object.keys(f.prices).sort((x, y) => (leSizeRank(x) - leSizeRank(y)) || (parseFloat(x) - parseFloat(y))).forEach(k => { sorted[k] = f.prices[k]; });
    f.prices = sorted;
    const keys = Object.keys(f.prices);
    f.heldSizes = f.heldSizes || [];
    f.soldOut = !!f.comingSoon || (keys.length > 0 && keys.every(k => (f.soldSizes || []).includes(k) || f.heldSizes.includes(k)));
  });
  return { created, linked, groups: groups.size };
}

function leFetchBottles(){
  const fallback = () => {
    try{ const c = JSON.parse(localStorage.getItem(LE_SHEET_CACHE_KEY) || "null"); return c && c.bottles ? c.bottles : []; }catch(e){ return []; }
  };
  return fetch(EP_SHEET_URL, { cache: "no-store" })
    .then(r => { if(!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then(t => epParseBottleRows(leParseCsv(t)))
    .catch(() => fallback());
}

function leSheetSnapshot(){
  const o = {};
  LE_ALL_FRAGRANCES.forEach(f => { o[f.id] = JSON.stringify(f.prices) + JSON.stringify(f.soldSizes || []) + JSON.stringify(f.heldSizes || []) + JSON.stringify(f.partials || {}) + (f.comingSoon ? "|soon:" + (f.arrival || "") : "") + (FRAGRANCES.includes(f) ? "|shown" : "|hidden"); });
  return o;
}

function leSheetReport(status){
  window.LE_SHEET_STATUS = status;
  if(typeof console !== "undefined"){
    (status.ok ? console.info : console.warn)("[Liquid Emotions] sheet sync:", status);
  }
  /* Add ?debugprices to any page address to see this on screen. */
  try{
    if(!/[?&]debugprices/.test(location.search)) return;
    let box = document.getElementById("leSheetDebug");
    if(!box){
      box = document.createElement("div");
      box.id = "leSheetDebug";
      box.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;padding:8px 12px;font:12px/1.4 monospace;color:#fff;white-space:pre-wrap;";
      document.body.appendChild(box);
    }
    box.style.background = status.ok ? "#2e7d32" : "#b3261e";
    box.textContent = status.ok
      ? "Sheet OK — " + status.rows + " price rows, new-perfume rows: " + status.catalogue + ", " + status.changed.length + " change(s)" +
        (status.changed.length ? ": " + status.changed.join(", ") : "") + "\nvia " + status.source +
        (status.dates && status.dates.length ? "\nDates read: " + status.dates.join("; ") : "\nDates read: (no new-perfume rows)") +
        (status.errors && status.errors.length ? "\nFirst route failed: " + status.errors.join(" | ") : "") +
        (status.hidingSkipped ? "\nWARNING: sheet looks incomplete, nothing was removed from the site" : "") +
        (status.notInSheet && status.notInSheet.length ? "\nOff the site (no row in sheet): " + status.notInSheet.join(", ") : "")
      : "Sheet NOT applied — " + status.error;
  }catch(e){}
}

/* Details of new perfumes. Missing tab / blocked request → null, and the
   last copy saved on this phone (if any) is used instead. */
function leFetchCatalogue(){
  const fallback = () => {
    try{ const c = JSON.parse(localStorage.getItem(LE_SHEET_CACHE_KEY) || "null"); return c && c.catalogue ? c.catalogue : null; }catch(e){ return null; }
  };
  return fetch(LE_CATALOGUE_URL, { cache: "no-store" })
    .then(r => { if(!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then(t => leParseCatalogueRows(leParseCsv(t)))
    .catch(() => fallback());
}

function leSyncSheet(){
  if(!LE_SHEET_ENABLED || typeof fetch !== "function") return;
  const sources = [["gviz", LE_SHEET_URL], ["export", LE_SHEET_URL_ALT]];
  const errors = [];
  const attempt = (i) => {
    if(i >= sources.length){
      leSheetReport({ ok: false, error: errors.join(" | ") });
      return;
    }
    const [label, url] = sources[i];
    fetch(url, { cache: "no-store" })
      .then(r => { if(!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
      .then(text => {
        const data = leParseSheetRows(leParseCsv(text));
        if(data.rows.length < LE_SHEET_MIN_ROWS) throw new Error("only " + data.rows.length + " usable rows (header row not found?)");
        return Promise.all([leFetchCatalogue(), leFetchPartials(), leFetchBottles()]).then(([catalogue, partials, bottles]) => {
          data.catalogue = catalogue;
          data.partials = partials || [];
          data.bottles = bottles || [];
          const before = leSheetSnapshot();
          const result = leApplySheetData(data);
          const after = leSheetSnapshot();
          const changed = LE_ALL_FRAGRANCES.filter(f => before[f.id] !== after[f.id]).map(f => {
            if(before[f.id] === undefined) return "NEW: " + f.name;
            const b = before[f.id].split("|"), a = after[f.id].split("|");
            if(b[1] !== a[1]) return (a[1] === "hidden" ? "REMOVED: " : "BACK: ") + f.name;
            return f.name;
          });
          try{ localStorage.setItem(LE_SHEET_CACHE_KEY, JSON.stringify(data)); }catch(e){}
          if(changed.length) window.dispatchEvent(new Event("le-data-updated"));
          const dates = (catalogue || []).map(c => c.name + ": \"" + (c.added || "") + "\" → " + (leParseAddedDate(c.added) || (c.added ? "unreadable" : "empty")));
          leSheetReport({ ok: true, source: label, rows: data.rows.length, catalogue: catalogue ? catalogue.length : "none", changed: changed, dates: dates, errors: errors.slice(), notInSheet: result.removed, hidingSkipped: result.skipped });
        });
      })
      .catch(err => { errors.push(label + ": " + (err && err.message || err)); attempt(i + 1); });
  };
  attempt(0);
}

(function leInitSheet(){
  if(!LE_SHEET_ENABLED) return;
  try{
    const cached = JSON.parse(localStorage.getItem(LE_SHEET_CACHE_KEY) || "null");
    if(cached && Array.isArray(cached.rows) && cached.rows.length >= LE_SHEET_MIN_ROWS) leApplySheetData(cached);
  }catch(e){}
  leSyncSheet();
})();
