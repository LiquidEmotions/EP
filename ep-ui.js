/* ep-ui.js — header, footer, scrolling text, cards, size picker and banners for the merged site.
   Needs store.js (the engine) loaded first. Pages set <body data-page="..." data-mode="all|decants|bottles">. */
(function(){
"use strict";
const MODE = document.body.dataset.mode || "all";
const PAGE = document.body.dataset.page || "";
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (s, r) => (r || document).querySelector(s);

/* ---- sizes, prices, cards ---- */
const KIND_ORDER = ["decant", "partial", "vial", "tester", "bottle"];
const KIND_TITLE = { decant: "Decants", partial: "Partial bottles", vial: "Vials", tester: "Testers", bottle: "New sealed bottles (BNIB)" };
function sizesOf(f, mode){
  mode = mode || MODE;
  return Object.keys(f.prices || {}).filter(sz => {
    const k = leSizeKind(sz);
    if(mode === "decants") return k === "decant" || k === "partial";
    if(mode === "bottles") return k === "bottle" || k === "tester" || k === "vial";
    return true;
  });
}
function visible(f, mode){ return !f.hidden && sizesOf(f, mode).length > 0; }
function fromPrice(f, mode){
  const sizes = sizesOf(f, mode);
  const open = sizes.filter(sz => !leIsSoldOut(f.id, sz));
  const use = open.length ? open : sizes;
  const prices = use.map(sz => f.prices[sz]);
  return { min: Math.min.apply(null, prices), many: new Set(prices).size > 1 || use.length > 1, soldOut: open.length === 0 };
}
function tagsHtml(f, mode){
  const kinds = new Set(sizesOf(f, mode).map(leSizeKind));
  const t = [];
  if(kinds.has("decant")) t.push('<span class="tag t-decant">Decants</span>');
  if(kinds.has("partial")) t.push('<span class="tag t-decant">Partial</span>');
  /* The sealed bottle is judged from ALL of the perfume's sizes, not just the ones this page lists
     (the decants page only lists decants, so it would otherwise never see the bottle). */
  const allSizes = Object.keys(f.prices || {});
  const bottleOpen = allSizes.some(sz => leSizeKind(sz) === "bottle" && !leIsSoldOut(f.id, sz));
  if(bottleOpen) t.push('<span class="tag t-bottle">Bottle</span>');
  if(kinds.has("tester")) t.push('<span class="tag t-tester">Tester</span>');
  if(kinds.has("vial")) t.push('<span class="tag t-vial">Vial</span>');
  if(MODE !== "bottles" && (kinds.has("decant") || kinds.has("partial")) && !bottleOpen) t.push('<span class="tag t-sold">Bottle sold out</span>');
  return t.join("");
}
function initials(f){ return esc((f.house || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase()); }
function media(f){
  const img = f.image ? `<img src="${esc(f.image)}" alt="${esc(f.house + " " + f.name)}" loading="lazy" onerror="this.remove()">` : "";
  return `<span class="mono-tile" style="background:${esc(f.color || "#5B5470")}">${initials(f)}</span>${img}`;
}
function cardHtml(f, mode){
  const p = fromPrice(f, mode), wished = leIsWishlisted(f.id), full = f.house + " " + f.name;
  const soon = f.comingSoon && !(MODE === "bottles");
  const priceTxt = soon ? "" : (p.many ? "from " : "") + leFormatPrice(p.min);
  const btn = soon ? `<button class="btn btn-ghost btn-block" type="button" data-action="pick">${esc(leComingLabel(f))}</button>`
    : p.soldOut ? `<button class="btn btn-ghost btn-block" type="button" data-action="pick">Sold out · view sizes</button>`
    : `<button class="btn btn-block" type="button" data-action="pick">Choose size</button>`;
  return `<article class="card${p.soldOut ? " soldout" : ""}" data-id="${esc(f.id)}">
  <button class="wish-btn${wished ? " on" : ""}" type="button" data-action="wish" aria-pressed="${wished}" aria-label="Wishlist: ${esc(full)}">${wished ? "♥" : "♡"}</button>
  <button class="card-media" type="button" data-action="pick" aria-label="Sizes for ${esc(full)}">${media(f)}${p.soldOut && !soon ? '<span class="soldout-tag">Sold out</span>' : ""}</button>
  <div class="card-body">
    <div class="tags">${tagsHtml(f, mode)}</div>
    <div class="card-house">${esc(f.house)}${f.isNew ? ' <span class="new-tag">New</span>' : ""}</div>
    <h3 class="card-name"><button type="button" data-action="pick">${esc(f.name)}</button></h3>
    <div class="card-line"><span class="price-wrap"><span class="price num">${esc(priceTxt)}</span></span></div>
    ${btn}
  </div></article>`;
}

/* ---- pincode delivery check + shareable links ---- */
const PIN_KEY = "ep_pin";
const DELIVERY = { dispatch: [1, 2], delivery: [4, 7] };          // same promise as the About page: about 4 to 7 days
const SHIP = { ncr: 55, india: 75 };                                // decant shipping; matches checkout
const NCR_PREFIXES = ["110", "121", "122", "201"];                  // Delhi, Faridabad, Gurgaon, Noida/Ghaziabad
const validPin = p => /^[1-9]\d{5}$/.test(String(p || ""));
const getPin = () => { try{ return localStorage.getItem(PIN_KEY) || ""; }catch(e){ return ""; } };
const savePin = p => { try{ localStorage.setItem(PIN_KEY, p); }catch(e){} };
const dayText = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }); };
function pinResult(f, pin){
  if(!pin) return "";
  if(!validPin(pin)) return `<span class="pk-pin-bad">Enter a valid 6-digit pincode.</span>`;
  const ncr = NCR_PREFIXES.includes(pin.slice(0, 3));
  const sizes = Object.keys(f.prices || {}).filter(sz => !leIsSoldOut(f.id, sz));
  const freeShip = sizes.some(sz => leSizeKind(sz) !== "decant");
  const ship = freeShip ? "Shipping is free if your cart has a bottle, tester, vial or partial; decants alone are " + leFormatPrice(ncr ? SHIP.ncr : SHIP.india) + " (free on 4 or more items)."
    : "Shipping: " + leFormatPrice(ncr ? SHIP.ncr : SHIP.india) + " (free on 4 or more items).";
  return `<b>Delivers to ${esc(pin)}${ncr ? " (Delhi NCR)" : ""}</b><br>Arrives in about ${DELIVERY.delivery[0]} to ${DELIVERY.delivery[1]} days, around ${dayText(DELIVERY.delivery[0])} to ${dayText(DELIVERY.delivery[1])}.<br>${ship}`;
}
function perfumeUrl(id){ const u = new URL("shop.html", location.href); u.search = "?p=" + encodeURIComponent(id); u.hash = ""; return u.href; }
function setUrlId(id){
  try{ const u = new URL(location.href); if(id) u.searchParams.set("p", id); else u.searchParams.delete("p"); history.replaceState(null, "", u.pathname + u.search + u.hash); }catch(e){}
}

/* ---- size picker ---- */
let pk = null, pkId = null, pkMode = MODE;
function ensurePicker(){
  if(pk) return;
  const ov = document.createElement("div"); ov.className = "pk-overlay"; ov.id = "pkOverlay";
  pk = document.createElement("div"); pk.className = "pk"; pk.id = "pk"; pk.setAttribute("role", "dialog"); pk.setAttribute("aria-modal", "true");
  document.body.appendChild(ov); document.body.appendChild(pk);
  ov.addEventListener("click", closePicker);
  pk.addEventListener("click", onPickerClick);
  pk.addEventListener("keydown", e => { if(e.key === "Enter" && e.target.id === "pkPin"){ e.preventDefault(); const b = $('[data-act="pin"]', pk); if(b) b.click(); } });
  document.addEventListener("keydown", e => { if(e.key === "Escape") closePicker(); });
}
function rowNote(f, sz){
  const kind = leSizeKind(sz);
  if(kind === "decant") return "";
  if(kind === "partial"){ const p = f.partials && f.partials[sz]; return p ? (p.tester ? "Tester partial" : "Partial") + (p.ml ? " · " + p.ml + "ml left" : "") + (p.box ? " · with box" : "") : ""; }
  const b = leBottleInfo(f.id, sz) || {};
  const bits = [];
  if(kind === "bottle") bits.push("Brand new, sealed");
  if(kind === "tester") bits.push(b.box === false ? "Without box" : "Plain tester box");
  if(kind === "vial") bits.push("Official vial");
  if(b.condition && !(kind === "tester" && /^plain tester box\.?$/i.test(b.condition))) bits.push(b.condition.replace(/\.$/, ""));
  return bits.join(" · ");
}
function renderPicker(){
  const f = leFragranceById(pkId); if(!f) return;
  const sizes = sizesOf(f, pkMode);
  const groups = KIND_ORDER.map(k => [k, sizes.filter(sz => leSizeKind(sz) === k)]).filter(g => g[1].length);
  const hasDecant = sizes.some(sz => leSizeKind(sz) === "decant" || leSizeKind(sz) === "partial");
  const noBottle = pkMode !== "bottles" && hasDecant && !sizes.some(sz => leSizeKind(sz) === "bottle");
  const soldBottleGroup = noBottle ? `<div class="pk-group"><h4>New sealed bottle</h4><div class="pk-row"><div><span class="pk-size">Full bottle</span><span class="pk-note">Brand new, sealed</span></div><div class="pk-price"></div><span class="pk-sold">Sold out</span></div></div>` : "";
  const rows = groups.map(([k, list]) => `<div class="pk-group"><h4>${KIND_TITLE[k]}</h4>${list.map(sz => {
    const sold = leIsSoldOut(f.id, sz) || (f.comingSoon && leSizeKind(sz) === "decant");
    const q = leCartQtyFor(f.id, sz), cap = leMaxQtyFor(sz);
    const b = leBottleInfo(f.id, sz), price = f.prices[sz];
    const mrp = b && b.mrp > price ? `<s>${leFormatPrice(b.mrp)}</s>` : "";
    const act = sold ? `<span class="pk-sold">${esc(f.comingSoon ? leComingLabel(f) : leUnavailableLabel(f.id, sz))}</span>`
      : q > 0 ? `<span class="pk-step"><button type="button" data-act="dec" data-size="${esc(sz)}" aria-label="Less">−</button><span>${q}</span><button type="button" data-act="inc" data-size="${esc(sz)}" aria-label="More"${q >= cap ? " disabled" : ""}>+</button></span>`
      : `<button class="pk-add" type="button" data-act="add" data-size="${esc(sz)}">Add</button>`;
    const note = rowNote(f, sz);
    return `<div class="pk-row"><div><span class="pk-size">${esc(leSizeLabel(sz, f.id))}</span>${note ? `<span class="pk-note">${esc(note)}</span>` : ""}${q >= cap && cap < 5 ? `<span class="pk-max">Max ${cap} per order</span>` : ""}</div><div class="pk-price num">${leFormatPrice(price)}${mrp}</div>${act}</div>`;
  }).join("")}</div>`).join("") + soldBottleGroup;
  const top = Math.max.apply(null, sizes.map(sz => f.prices[sz]));
  const emi = top >= EP_EMI_MIN ? `<div class="pk-info">💳 EMI available at checkout on eligible credit cards (orders ₹3,000 and above).</div>` : "";
  const n = f.notes ? ["top", "heart", "base"].filter(k => f.notes[k]).map(k => `<b>${k[0].toUpperCase() + k.slice(1)}:</b> ${esc(Array.isArray(f.notes[k]) ? f.notes[k].join(", ") : f.notes[k])}`).join(" · ") : "";
  const pin = getPin();
  const pinBox = `<div class="pk-pin"><label for="pkPin">Check delivery to your pincode</label><div class="pk-pin-row"><input id="pkPin" type="text" inputmode="numeric" maxlength="6" autocomplete="postal-code" placeholder="e.g. 110001" value="${esc(pin)}"><button type="button" data-act="pin">Check</button></div><div class="pk-pin-out" aria-live="polite">${pin ? pinResult(f, pin) : ""}</div></div>`;
  const share = `<div class="pk-share"><button type="button" data-act="wa-share">Share on WhatsApp</button><button type="button" data-act="copy-link">Copy link</button></div>`;
  const info = emi + (n ? `<div class="pk-info">${n}</div>` : "") + (f.fragranticaUrl ? `<div class="pk-info"><a href="${esc(f.fragranticaUrl)}" target="_blank" rel="noopener">See on Fragrantica ↗</a></div>` : "");
  pk.innerHTML = `<div class="pk-head">${f.image ? `<img src="${esc(f.image)}" alt="" onerror="this.remove()">` : ""}<div class="pk-title"><small>${esc(f.house)}</small><h3>${esc(f.name)}</h3></div><button class="pk-x" type="button" data-act="close" aria-label="Close">×</button></div>
  <div class="pk-body">${rows}${info}${pinBox}${share}</div>
  <div class="pk-foot"><a class="btn btn-ghost" href="cart.html">View cart (<span data-cart-count>${leCartCount()}</span>)</a><a class="btn" href="checkout.html">Checkout</a></div>`;
}
function openPicker(id, mode){
  ensurePicker(); pkId = id; pkMode = "all";   // the picker always shows every size: decants, vials, testers and the sealed bottle
  renderPicker();
  $("#pkOverlay").classList.add("open"); pk.classList.add("open");
  document.body.style.overflow = "hidden";
  try{ leTrackRecentlyViewed(id); }catch(e){}
  setUrlId(id);
}
function closePicker(){
  if(!pk) return;
  pk.classList.remove("open"); $("#pkOverlay").classList.remove("open"); document.body.style.overflow = "";
  setUrlId(null);
}
function onPickerClick(e){
  const b = e.target.closest("[data-act]"); if(!b) return;
  const act = b.dataset.act, sz = b.dataset.size;
  if(act === "close") return closePicker();
  if(act === "pin"){ const v = ($("#pkPin", pk).value || "").replace(/\s+/g, ""); if(validPin(v)) savePin(v); const f0 = leFragranceById(pkId); $(".pk-pin-out", pk).innerHTML = pinResult(f0, v) || `<span class="pk-pin-bad">Enter a valid 6-digit pincode.</span>`; return; }
  if(act === "wa-share"){ const f0 = leFragranceById(pkId); window.open("https://wa.me/?text=" + encodeURIComponent(f0.house + " " + f0.name + " at Enigma Perfumes\n" + perfumeUrl(pkId)), "_blank", "noopener"); return; }
  if(act === "copy-link"){
    const url = perfumeUrl(pkId), done = () => { b.textContent = "Link copied"; setTimeout(() => { b.textContent = "Copy link"; }, 1800); };
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, () => window.prompt("Copy this link", url));
    else window.prompt("Copy this link", url);
    return;
  }
  if(act === "add") leAddToCart(pkId, sz);
  if(act === "inc") leAddToCart(pkId, sz);
  if(act === "dec") leUpdateQty(pkId, sz, leCartQtyFor(pkId, sz) - 1);
  renderPicker(); leUpdateCartBadges();
}

/* one click handler for any container of cards */
function wireCards(container, getMode){
  container.addEventListener("click", e => {
    const b = e.target.closest("[data-action]"); if(!b) return;
    const card = b.closest(".card"); if(!card) return;
    const id = card.dataset.id;
    if(b.dataset.action === "pick") openPicker(id, getMode ? getMode() : MODE);
    if(b.dataset.action === "wish"){
      leToggleWishlist(id);
      const on = leIsWishlisted(id);
      b.classList.toggle("on", on); b.textContent = on ? "♥" : "♡"; b.setAttribute("aria-pressed", on);
      leUpdateWishlistBadges();
    }
  });
}

/* ---- random decant banners ---- */
function pickRandom(n){
  const pool = FRAGRANCES.filter(f => !f.hidden && f.image && !f.comingSoon && sizesOf(f, "decants").some(sz => leSizeKind(sz) === "decant" && !leIsSoldOut(f.id, sz)));
  let last = []; try{ last = JSON.parse(sessionStorage.getItem("ep_last_banners") || "[]"); }catch(e){}
  let fresh = pool.filter(f => !last.includes(f.id));
  if(fresh.length < n) fresh = pool;
  for(let i = fresh.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [fresh[i], fresh[j]] = [fresh[j], fresh[i]]; }
  const out = fresh.slice(0, n);
  try{ sessionStorage.setItem("ep_last_banners", JSON.stringify(out.map(f => f.id))); }catch(e){}
  return out;
}
function mountBanners(el, n){
  const list = pickRandom(n || 6);
  if(!list.length){ el.hidden = true; return; }
  el.innerHTML = `<div class="rb-track" id="rbTrack">${list.map(f => {
    const dec = sizesOf(f, "decants").filter(sz => leSizeKind(sz) === "decant").map(sz => f.prices[sz]);
    const nt = f.notes && f.notes.top ? (Array.isArray(f.notes.top) ? f.notes.top.join(", ") : f.notes.top) : "";
    return `<div class="rb-slide" data-id="${esc(f.id)}" style="--rb-color:${esc(f.color || "#2a2140")}">
      <div class="rb-copy"><span class="rb-eyebrow">Decants from ${leFormatPrice(Math.min.apply(null, dec))}</span><h2>${esc(f.name)}</h2><p>${esc(f.house)}${nt ? " · " + esc(nt) : ""}</p><button class="rb-cta" type="button" data-pick="${esc(f.id)}">Choose size</button></div>
      <div class="rb-img"><img src="${esc(f.image)}" alt="${esc(f.house + " " + f.name)}" onerror="this.remove()"></div></div>`;
  }).join("")}</div><div class="rb-dots">${list.map((f, i) => `<button class="rb-dot${i ? "" : " on"}" type="button" data-i="${i}" aria-label="Banner ${i + 1}"></button>`).join("")}</div>`;
  const track = $("#rbTrack", el), dots = el.querySelectorAll(".rb-dot");
  let i = 0, timer = null;
  const go = k => { i = (k + list.length) % list.length; track.scrollTo({ left: track.clientWidth * i, behavior: "smooth" }); };
  const start = () => { stop(); timer = setInterval(() => go(i + 1), 4500); };
  const stop = () => { if(timer) clearInterval(timer); timer = null; };
  track.addEventListener("scroll", () => {
    const k = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    if(k !== i || !dots[k].classList.contains("on")){ i = k; dots.forEach((d, x) => d.classList.toggle("on", x === k)); }
  }, { passive: true });
  el.addEventListener("click", e => {
    const d = e.target.closest(".rb-dot"); if(d){ go(+d.dataset.i); start(); return; }
    const s = e.target.closest(".rb-slide"); if(s) openPicker(s.dataset.id, "decants");
  });
  ["pointerdown", "touchstart", "mouseenter"].forEach(ev => el.addEventListener(ev, stop, { passive: true }));
  ["mouseleave", "touchend"].forEach(ev => el.addEventListener(ev, start, { passive: true }));
  if(!window.matchMedia || !matchMedia("(prefers-reduced-motion: reduce)").matches) start();
}

/* ---- shop / decants / bottles page ---- */
const norm = t => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
/* ---- fragrance family + occasion ----
   Worked out from each perfume's listed notes (a guide, not a verdict). To correct one, add it to ep-tags.json:
   { "perfume-id": { "families": ["woody", "spicy"], "occasions": ["date", "winter"] } } */
const FAMILIES = [["woody", "Woody"], ["amber", "Amber"], ["citrus", "Citrus"], ["floral", "Floral"], ["fruity", "Fruity"], ["gourmand", "Gourmand"],
  ["fresh", "Fresh & aquatic"], ["aromatic", "Aromatic"], ["spicy", "Spicy"], ["oud", "Oud & incense"]];
const OCCASIONS = [["office", "Office & daily"], ["date", "Date night"], ["party", "Party & night out"], ["summer", "Summer days"], ["winter", "Winter"]];
const FAM_WORDS = {
  woody: /cedar|sandalwood|vetiver|patchouli|guaiac|cashmeran|papyrus|birch|oakmoss|woody|woodsy|drywood|akigalawood|\bwoods?\b/g,
  amber: /amber|ambroxan|ambergris|labdanum|benzoin|resin/g,
  citrus: /bergamot|lemon|grapefruit|mandarin|\blime\b|yuzu|tangerine|citrus|orange(?! blossom)|neroli|petitgrain/g,
  floral: /\brose|jasmine|lily|\biris|orange blossom|violet|peony|tuberose|freesia|ylang|magnolia|geranium|orchid|white flower|flower|gardenia|lotus|mimosa|heliotrope|osmanthus/g,
  fruity: /apple|pineapple|peach|plum|berry|berries|currant|mango|\bpear\b|\bfig\b|coconut|raspberry|cherry|melon|passion|lychee|apricot|dragon fruit|pomegranate|banana|fruit/g,
  gourmand: /vanilla|caramel|tonka|coffee|chocolate|honey|praline|toffee|cacao|cocoa|almond|\brum\b|brandy|cream|sugar|candy|marshmallow|milk|cookie/g,
  fresh: /aquatic|marine|\bsea\b|ozon|\bmint|\bsalt|cucumber|green tea|fresh|\bwater|\brain|aldehyd|calone|\bgreen\b/g,
  aromatic: /lavender|\bsage\b|rosemary|basil|artemisia|thyme|\bherb|tarragon|clary|aromatic|fougere/g,
  spicy: /black pepper|cardamom|cinnamon|saffron|nutmeg|ginger|clove|cumin|\bspice|pepper|coriander/g,
  oud: /\boud\b|agarwood|incense|frankincense|olibanum|myrrh|bakhoor|smok|leather|tobacco/g
};
const notesText = f => !f.notes ? "" : ["top", "heart", "base", "all"].map(k => { const v = f.notes[k]; return Array.isArray(v) ? v.join(", ") : (v || ""); }).join(", ");
let TAG_OVERRIDE = {}; const TAG_CACHE = new Map();
function occasionsFrom(fam){
  const h = k => fam.has(k), o = new Set();
  if((h("citrus") || h("fresh") || h("aromatic")) && !h("oud") && !h("gourmand")) o.add("office");
  if(h("gourmand") || h("amber") || h("spicy")) o.add("date");
  if(h("gourmand") || h("amber") || h("oud") || h("spicy")) o.add("party");
  if((h("citrus") || h("fresh") || h("fruity") || h("aromatic")) && !h("oud") && !h("gourmand")) o.add("summer");
  if(h("amber") || h("oud") || h("gourmand") || h("spicy") || h("woody")) o.add("winter");
  return o;
}
function tagsOf(f){
  if(TAG_CACHE.has(f.id)) return TAG_CACHE.get(f.id);
  const ov = TAG_OVERRIDE[f.id]; let out;
  if(ov && (ov.families || ov.occasions)){
    const fam = new Set(ov.families || []);
    out = { fam, occ: new Set(ov.occasions || [...occasionsFrom(fam)]) };
  } else {
    const text = notesText(f).toLowerCase().replace(/pink pepper/g, ""), scores = [];
    if(text) FAMILIES.forEach(([k]) => { const m = text.match(FAM_WORDS[k]); if(m) scores.push([k, m.length]); });
    scores.sort((a, b) => b[1] - a[1]);
    let pick = scores.filter(s => s[1] >= 2); if(!pick.length && scores.length) pick = [scores[0]];
    const fam = new Set(pick.slice(0, 4).map(s => s[0]));
    out = { fam, occ: occasionsFrom(fam) };
  }
  TAG_CACHE.set(f.id, out); return out;
}
fetch("ep-tags.json", { cache: "no-store" }).then(r => r.ok ? r.json() : {}).then(j => { delete j._about; TAG_OVERRIDE = j || {}; TAG_CACHE.clear(); window.dispatchEvent(new Event("ep-tags-loaded")); }).catch(() => {});

function initShop(){
  const grid = $("#grid"); if(!grid) return;
  const qs = new URLSearchParams(location.search);
  const state = { q: qs.get("q") || "", type: qs.get("type") || "All", cat: qs.get("cat") || "All", brand: qs.get("brand") || "All", fam: qs.get("family") || "All", occ: qs.get("occasion") || "All", sort: "new", stock: "All" };
  const TYPE_TABS = MODE === "decants" ? [] : MODE === "bottles"
    ? [["All", "All bottles"], ["bottle", "New (BNIB)"], ["tester", "Testers"], ["vial", "Vials"]]
    : [["All", "All"], ["decant", "Decants"], ["bottle", "Bottles"], ["tester", "Testers"], ["vial", "Vials"]];
  const kindsOf = f => new Set(sizesOf(f).map(k => { const x = leSizeKind(k); return x === "partial" ? "decant" : x; }));
  const base = () => FRAGRANCES.filter(f => visible(f));
  const matchType = f => state.type === "All" || kindsOf(f).has(state.type);
  const list = () => {
    const toks = norm(state.q).split(" ").filter(Boolean);
    let a = base().filter(f => matchType(f)
      && (state.cat === "All" || leHouseCategory(f.house) === state.cat)
      && (state.brand === "All" || f.house === state.brand)
      && (state.fam === "All" || tagsOf(f).fam.has(state.fam))
      && (state.occ === "All" || tagsOf(f).occ.has(state.occ))
      && toks.every(t => norm(f.house + " " + f.name + " " + notesText(f)).includes(t)));
    const price = f => fromPrice(f).min;
    const order = new Map(FRAGRANCES.map((f, i) => [f.id, i]));
    a.sort((x, y) => {
      if(state.sort === "plow") return price(x) - price(y);
      if(state.sort === "phigh") return price(y) - price(x);
      if(state.sort === "az") return (x.house + x.name).localeCompare(y.house + y.name);
      return (!!y.isNew - !!x.isNew) || (order.get(x.id) - order.get(y.id));
    });
    return a;
  };
  const render = () => {
    const all = base();
    const tabs = $("#shopTabs");
    if(tabs){
      tabs.innerHTML = TYPE_TABS.map(([k, label]) => {
        const n = k === "All" ? all.length : all.filter(f => kindsOf(f).has(k)).length;
        return n || k === state.type ? `<button type="button" role="tab" class="shop-tab${state.type === k ? " active" : ""}" data-type="${k}" aria-selected="${state.type === k}">${label}<small>${n}</small></button>` : "";
      }).join("");
    }
    const cats = ["All", "Middle Eastern", "Designer", "Niche"].filter(c => c === "All" || all.some(f => leHouseCategory(f.house) === c));
    $("#catRow").innerHTML = cats.map(c => `<button type="button" class="chip${state.cat === c ? " active" : ""}" data-cat="${c}">${c}</button>`).join("");
    const brands = [...new Set(all.filter(f => state.cat === "All" || leHouseCategory(f.house) === state.cat).map(f => f.house))].sort((a, b) => a.localeCompare(b));
    const bs = $("#brandSel"); bs.innerHTML = `<option value="All">All brands</option>` + brands.map(b => `<option${b === state.brand ? " selected" : ""}>${esc(b)}</option>`).join("");
    if(!$("#famSel")) bs.insertAdjacentHTML("afterend", `<select id="famSel" class="sort-select" aria-label="Fragrance family"></select><select id="occSel" class="sort-select" aria-label="Occasion"></select>`);
    const famCount = k => all.filter(f => tagsOf(f).fam.has(k)).length, occCount = k => all.filter(f => tagsOf(f).occ.has(k)).length;
    $("#famSel").innerHTML = `<option value="All">All families</option>` + FAMILIES.filter(([k]) => famCount(k) || k === state.fam).map(([k, l]) => `<option value="${k}"${k === state.fam ? " selected" : ""}>${l} (${famCount(k)})</option>`).join("");
    $("#occSel").innerHTML = `<option value="All">Any occasion</option>` + OCCASIONS.filter(([k]) => occCount(k) || k === state.occ).map(([k, l]) => `<option value="${k}"${k === state.occ ? " selected" : ""}>${l} (${occCount(k)})</option>`).join("");
    const items = list();
    $("#resultCount").innerHTML = items.length + (items.length === 1 ? " perfume" : " perfumes") + (state.fam !== "All" || state.occ !== "All" ? ' <small class="ep-filter-note">· matched from listed notes</small>' : "");
    grid.innerHTML = items.length ? items.map(f => cardHtml(f)).join("") : `<div class="empty" style="grid-column:1/-1">No perfumes match. <a href="#" id="clr">Clear filters</a></div>`;
  };
  /* After a filter is tapped, glide down to the results (just under the sticky header). Typing in the search box does not scroll. */
  const toResults = () => requestAnimationFrame(() => {
    const target = $("#resultCount") || grid;
    const hdr = document.querySelector(".epc-header");
    const off = (hdr ? hdr.getBoundingClientRect().height : 0) + 12;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - off);
    const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: calm ? "auto" : "smooth" });
  });
  const q = $("#q"); q.value = state.q;
  q.addEventListener("input", () => { state.q = q.value; render(); });
  $("#shopTabs") && $("#shopTabs").addEventListener("click", e => { const b = e.target.closest("[data-type]"); if(b){ state.type = b.dataset.type; render(); toResults(); } });
  $("#catRow").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if(b){ state.cat = b.dataset.cat; state.brand = "All"; render(); toResults(); } });
  $("#brandSel").addEventListener("change", e => { state.brand = e.target.value; render(); toResults(); });
  $("#sortSel").addEventListener("change", e => { state.sort = e.target.value; render(); toResults(); });
  document.addEventListener("change", e => { if(e.target.id === "famSel"){ state.fam = e.target.value; render(); toResults(); } else if(e.target.id === "occSel"){ state.occ = e.target.value; render(); toResults(); } });
  window.addEventListener("ep-tags-loaded", render);
  grid.addEventListener("click", e => { if(e.target.id === "clr"){ e.preventDefault(); state.q = ""; q.value = ""; state.type = "All"; state.cat = "All"; state.brand = "All"; state.fam = "All"; state.occ = "All"; render(); toResults(); } });
  wireCards(grid);
  window.addEventListener("le-data-updated", render);
  render();
  const ban = $("#banners"); if(ban && MODE === "decants") mountBanners(ban, 5);
}

/* ---- home page ---- */
function initHome(){
  if(PAGE !== "home") return;
  const hs = $("#homeSearch"), sug = $("#homeSug");
  if(hs && sug){
    hs.addEventListener("input", () => {
      const toks = norm(hs.value).split(" ").filter(Boolean);
      if(!toks.length){ sug.innerHTML = ""; sug.hidden = true; return; }
      const hits = FRAGRANCES.filter(f => visible(f, "all") && toks.every(t => norm(f.house + " " + f.name).includes(t))).slice(0, 6);
      sug.innerHTML = hits.map(f => `<a href="shop.html?q=${encodeURIComponent(f.house + " " + f.name)}"><b>${esc(f.name)}</b><small>${esc(f.house)}</small></a>`).join("") || `<span class="sug-none">No match. Press search to browse all.</span>`;
      sug.hidden = false;
    });
    document.addEventListener("click", e => { if(!e.target.closest(".home-search")) sug.hidden = true; });
  }
  const ban = $("#banners"); if(ban) mountBanners(ban, 6);
  const tiles = $("#typeTiles");
  const count = () => {
    const vis = FRAGRANCES.filter(f => !f.hidden);
    const n = k => vis.filter(f => Object.keys(f.prices).some(sz => leSizeKind(sz) === k || (k === "decant" && leSizeKind(sz) === "partial"))).length;
    tiles.innerHTML = [["decants.html", "Decants", n("decant") + " perfumes, from 3ml"], ["bottles.html?type=bottle", "Sealed bottles", n("bottle") + " brand new BNIB"],
      ["bottles.html?type=tester", "Testers", n("tester") + " perfumes"], ["bottles.html?type=vial", "Vials", n("vial") + " perfumes"]]
      .map(t => `<a class="type-tile" href="${t[0]}"><b>${t[1]}</b><small>${t[2]}</small></a>`).join("");
  };
  count();
  const grid = $("#newGrid");
  /* A different pick on every refresh: the new arrivals first (shuffled), topped up to 8 with other perfumes from the shop. */
  const seed = Math.random();
  const rng = (() => { let a = Math.floor(seed * 4294967296) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
  const shuffle = arr => { const x = arr.slice(); for(let i = x.length - 1; i > 0; i--){ const j = Math.floor(rng() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  const draw = () => {
    const all = FRAGRANCES.filter(f => visible(f));
    const fresh = shuffle(all.filter(f => f.isNew)).slice(0, 8);
    const rest = shuffle(all.filter(f => !fresh.includes(f) && !f.soldOut));
    const a = fresh.concat(rest).slice(0, 8);
    grid.innerHTML = a.map(f => cardHtml(f, "all")).join("");
  };
  draw(); wireCards(grid, () => "all");
  window.addEventListener("le-data-updated", () => { count(); draw(); });
}

/* ---- brands page ---- */
function initBrands(){
  const el = $("#brandList"); if(!el) return;
  const draw = () => {
    const by = {};
    FRAGRANCES.filter(f => visible(f)).forEach(f => { (by[f.house] = by[f.house] || []).push(f); });
    const cats = ["Middle Eastern", "Designer", "Niche"];
    const other = Object.keys(by).filter(h => !cats.includes(leHouseCategory(h)));
    el.innerHTML = cats.concat(other.length ? ["Other"] : []).map(c => {
      const hs = Object.keys(by).filter(h => c === "Other" ? !cats.includes(leHouseCategory(h)) : leHouseCategory(h) === c).sort((a, b) => a.localeCompare(b));
      return hs.length ? `<h2 style="margin:22px 0 10px">${c}</h2><div class="cat-row brand-list">${hs.map(h => `<a class="chip" href="shop.html?brand=${encodeURIComponent(h)}">${esc(h)} <small>${by[h].length}</small></a>`).join("")}</div>` : "";
    }).join("");
  };
  draw(); window.addEventListener("le-data-updated", draw);
}

/* A shared link (shop.html?p=<perfume id>) opens that perfume's size picker; waits for the sheet data if it has not arrived yet. */
let deepDone = false;
function openFromLink(){
  if(deepDone) return;
  const id = new URLSearchParams(location.search).get("p"); if(!id){ deepDone = true; return; }
  const f = leFragranceById(id);
  if(f && !f.hidden){ deepDone = true; openPicker(id, "all"); }
}

initShop(); initHome(); initBrands();
openFromLink(); window.addEventListener("le-data-updated", openFromLink);
window.EP = { openPicker, closePicker, cardHtml, wireCards };
})();
