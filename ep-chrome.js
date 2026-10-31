/* ep-chrome.js — the Enigma header (hamburger menu on every screen size), scrolling text and footer, shared by every page.
   Needs store.js first. Add <div id="epHeader"></div> and <div id="epFooter"></div> to a page. */
(function(){
"use strict";
const ACTIVE = document.body.dataset.page || "";
const SLIM = document.body.dataset.chrome === "slim";    // checkout: no scrolling text
/* Mini cart: slides in from the right. Not on the cart or checkout pages, where it would only repeat them. */
const MINI = !SLIM && ACTIVE !== "cart" && typeof leCartLines === "function";
const AUTO_OPEN = true;   // slide the mini cart open whenever something is added; set false to open it only from the cart button
const NAV = [["index.html", "Home", "home"], ["shop.html", "Shop", "shop"], ["decants.html", "Decants", "decants"], ["bottles.html", "Full Bottles", "bottles"], ["brands.html", "Brands", "brands"], ["about.html", "About", "about"]];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function bottleSizes(){
  const set = new Set();
  try{
    FRAGRANCES.forEach(f => {
      if(f.hidden) return;
      Object.keys(f.prices || {}).forEach(k => { if(leSizeKind(k) === "bottle" && !leIsSoldOut(f.id, k)) set.add(parseFloat(k)); });
    });
  }catch(e){}
  return [...set].sort((a, b) => a - b);
}
/* Scrolling text: a different mix on every page load. Lines that use your catalogue (counts, prices, sizes, new arrivals)
   are only used when the data supports them. Add or reword lines in POOL; each is a function that returns a string or "". */
const SEED = Math.random();
function seeded(seed){ let a = Math.floor(seed * 4294967296) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function catalogue(){
  const out = { decants: 0, minDecant: 0, minMl: 0, bottles: 0, testers: 0, vials: 0, fresh: [] };
  try{
    FRAGRANCES.forEach(f => {
      if(f.hidden) return;
      const keys = Object.keys(f.prices || {}).filter(k => !leIsSoldOut(f.id, k));
      const kinds = new Set(keys.map(leSizeKind));
      if(kinds.has("decant") || kinds.has("partial")){
        out.decants++;
        keys.filter(k => ["decant", "partial"].includes(leSizeKind(k))).forEach(k => {
          const pr = f.prices[k], ml = parseFloat(k);
          if(!out.minDecant || pr < out.minDecant) out.minDecant = pr;
          if(ml > 0 && (!out.minMl || ml < out.minMl)) out.minMl = ml;
        });
      }
      if(kinds.has("bottle")) out.bottles++;
      if(kinds.has("tester")) out.testers++;
      if(kinds.has("vial")) out.vials++;
      if(f.isNew) out.fresh.push(f.name);
    });
  }catch(e){}
  return out;
}
const POOL = [
  c => c.decants > 4 ? `${c.decants} perfumes to try before you buy` : "",
  c => c.minDecant ? `Your next favourite scent starts at ${leFormatPrice(c.minDecant)}` : "",
  c => c.minMl ? `Sample first, commit later: decants from ${c.minMl}ml` : "",
  c => { const z = bottleSizes(); return z.length ? "Sealed bottles in " + z.map(x => x + "ml").join(" · ") + ", brand new" : ""; },
  c => c.bottles > 2 ? `${c.bottles} sealed bottles, free shipping on every one` : "",
  c => c.fresh.length ? "Just in: " + c.fresh.slice(0, 2).join(" & ") : "",
  c => c.testers > 0 ? "Tester bottles: same scent, plain box, friendlier price" : "",
  c => c.vials > 0 ? "Official vials to try a scent before you own it" : "",
  () => "Don't buy blind. Smell it first.",
  c => c.minMl ? `Find your signature scent, ${c.minMl}ml at a time` : "",
  () => "Decanted by syringe, sealed by hand",
  () => "Authentic, from genuine bottles",
  () => "Free shipping on every bottle",
  () => "Big perfume energy, small price tag",
  () => "Make your wardrobe of scents, one decant at a time",
  () => "Love it? Go for the full bottle. Not sure? Start small."
];
function tickerHtml(){
  const rnd = seeded(SEED), c = catalogue();
  const lines = POOL.map(fn => { try{ return fn(c); }catch(e){ return ""; } }).filter(Boolean);
  for(let i = lines.length - 1; i > 0; i--){ const j = Math.floor(rnd() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; }
  const one = lines.slice(0, 6).map(t => `<span>${esc(t)}</span>`).join("");
  return one + one;
}
const mainLinks = NAV.filter(n => n[2] !== "home").map(n => `<a href="${n[0]}"${n[2] === ACTIVE ? ' class="active"' : ""}>${n[1]}</a>`).join("");
const drawerLinks = NAV.map(n => `<a href="${n[0]}"${n[2] === ACTIVE ? ' class="active"' : ""}>${n[1]}</a>`).join("")
  + `<a href="wishlist.html">Wishlist</a><a href="cart.html">Cart</a><a href="https://wa.me/917982410620" target="_blank" rel="noopener">WhatsApp us</a>`;

const header = `<div class="epc">${SLIM ? "" : `<div class="epc-ticker" aria-label="Store notes"><div class="epc-ticker-track" id="epcTrack">${tickerHtml()}</div></div>`}
<div class="epc-header" role="banner"><div class="epc-nav">
  <div class="epc-left">
    <button class="epc-ham" id="epcHam" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="epcDrawer"><span></span><span></span><span></span></button>
    <a class="epc-wordmark" href="index.html"><span>Enigma</span><span>Perfumes</span></a>
  </div>
  <nav class="epc-links" aria-label="Main">${mainLinks}</nav>
  <div class="epc-right">
    <a class="epc-pill" href="wishlist.html" aria-label="Wishlist"><span>♡<span class="epc-pill-label"> Wishlist</span></span><span class="epc-count" data-wishlist-count>0</span></a>
    <a class="epc-pill" href="cart.html" aria-label="Cart"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6.5h12l-1 10H5l-1-10Z"/><path d="M7 6.5V5a3 3 0 0 1 6 0v1.5"/></svg><span class="epc-pill-label">Cart</span><span class="epc-count" data-cart-count>0</span></a>
  </div></div></div>
<div class="epc-overlay" id="epcOverlay"></div>
<aside class="epc-drawer" id="epcDrawer" aria-hidden="true" aria-label="Menu">
  <button class="epc-close" id="epcClose" type="button" aria-label="Close menu">×</button>
  <nav class="epc-drawer-links">${drawerLinks}</nav>
</aside>
${MINI ? `<div class="epc-overlay epm-overlay" id="epmOverlay"></div>
<aside class="epm" id="epm" aria-hidden="true" aria-label="Your cart">
  <div class="epm-head"><strong>Your cart <span id="epmN"></span></strong><button class="epm-x" id="epmClose" type="button" aria-label="Close cart">×</button></div>
  <div class="epm-body" id="epmBody"></div>
  <div class="epm-foot" id="epmFoot"></div>
</aside>` : ""}</div>`;
const footer = `<div class="epc"><div class="epc-footer"><div class="epc-wrap"><div class="epc-cols">
  <div class="epc-col"><h4>Enigma Perfumes</h4><p>Decants, sealed bottles, testers and vials.</p></div>
  <div class="epc-col"><h4>Links</h4><ul>${NAV.map(n => `<li><a href="${n[0]}">${n[1]}</a></li>`).join("")}<li><a href="wishlist.html">Wishlist</a></li><li><a href="cart.html">Cart</a></li></ul></div>
  <div class="epc-col"><h4>Contact us</h4>
    <div class="epc-line">📞 <a href="tel:+917982410620">+91 79824 10620</a></div>
    <div class="epc-line">✉️ <a href="mailto:enigma6perfumes@gmail.com">enigma6perfumes@gmail.com</a></div>
    <div class="epc-line">💬 <a href="https://wa.me/917982410620" target="_blank" rel="noopener">WhatsApp us</a></div>
    <div class="epc-line">👥 <a href="https://chat.whatsapp.com/B5WdEerbCnMCQhUUtj97U0" target="_blank" rel="noopener">Join our WhatsApp community</a></div>
  </div></div></div></div></div>`;

const h = document.getElementById("epHeader"), f = document.getElementById("epFooter");
if(h) h.outerHTML = header;
if(f) f.outerHTML = footer;

const ham = document.getElementById("epcHam"), drawer = document.getElementById("epcDrawer"), ov = document.getElementById("epcOverlay");
function setMenu(open){
  if(!drawer) return;
  drawer.classList.toggle("open", open); ov.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", open ? "false" : "true"); ham.setAttribute("aria-expanded", open ? "true" : "false");
  document.body.style.overflow = open ? "hidden" : "";
}
if(ham){
  ham.addEventListener("click", () => setMenu(true));
  document.getElementById("epcClose").addEventListener("click", () => setMenu(false));
  ov.addEventListener("click", () => setMenu(false));
  drawer.addEventListener("click", e => { if(e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if(e.key === "Escape") setMenu(false); });
}
/* ---------- mini cart ---------- */
if(MINI && h){
  const mini = document.getElementById("epm"), mOv = document.getElementById("epmOverlay");
  const mBody = document.getElementById("epmBody"), mFoot = document.getElementById("epmFoot"), mN = document.getElementById("epmN");
  const money = n => (typeof leFormatPrice === "function" ? leFormatPrice(n) : "₹" + n);
  let lastCount = 0; try{ lastCount = leCartCount(); }catch(e){}
  const isOpen = () => mini.classList.contains("open");
  function miniRender(){
    let lines = []; try{ lines = leCartLines(); }catch(e){}
    mN.textContent = lines.length ? "(" + lines.reduce((n, l) => n + l.qty, 0) + ")" : "";
    if(!lines.length){
      mBody.innerHTML = `<div class="epm-empty"><p>Your cart is empty.</p><a href="shop.html">Browse the shop</a><a href="decants.html">Browse decants</a></div>`;
      mFoot.innerHTML = ""; return;
    }
    mBody.innerHTML = lines.map(l => {
      const f = l.fragrance;
      const img = f.image ? `<img src="${esc(f.image)}" alt="" loading="lazy">` : `<span class="epm-sw" style="background:${esc(f.color || "#CDC6DA")}"></span>`;
      const single = typeof leMaxQtyFor === "function" && leMaxQtyFor(l.size) <= 1;
      return `<div class="epm-line" data-id="${esc(l.id)}" data-size="${esc(l.size)}">
  <div class="epm-img">${img}</div>
  <div class="epm-info"><div class="epm-name">${esc(f.name)}</div><div class="epm-meta">${esc(f.house)} · ${esc(leSizeLabel(l.size, l.id))}</div>
    <div class="epm-qty">${single ? `<span class="epm-one">1 only</span>` : `<button type="button" data-act="dec" aria-label="Decrease quantity">−</button><span>${l.qty}</span><button type="button" data-act="inc" aria-label="Increase quantity">+</button>`}<button type="button" class="epm-rm" data-act="rm">Remove</button></div></div>
  <div class="epm-price">${money(l.lineTotal)}</div></div>`;
    }).join("");
    const total = lines.reduce((n, l) => n + l.lineTotal, 0);
    mFoot.innerHTML = `<div class="epm-sub"><span>Subtotal</span><strong>${money(total)}</strong></div>
<p class="epm-note">Shipping and payment are worked out at checkout.</p>
<a class="epm-btn epm-btn-main" href="checkout.html">Checkout</a><a class="epm-btn" href="cart.html">View full cart</a>`;
  }
  function miniOpen(){
    try{ leValidateCart(); }catch(e){}
    miniRender();
    mini.classList.add("open"); mOv.classList.add("open"); mini.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  }
  function miniClose(){
    mini.classList.remove("open"); mOv.classList.remove("open"); mini.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  }
  mBody.addEventListener("click", e => {
    const b = e.target.closest("[data-act]"); if(!b) return;
    const row = b.closest(".epm-line"), id = row.dataset.id, size = row.dataset.size;
    const cur = (leGetCart().find(i => i.id === id && i.size === size) || { qty: 0 }).qty;
    if(b.dataset.act === "inc") leUpdateQty(id, size, cur + 1);
    else if(b.dataset.act === "dec") leUpdateQty(id, size, cur - 1);
    else leRemoveFromCart(id, size);
    miniRender();
  });
  document.getElementById("epmClose").addEventListener("click", miniClose);
  mOv.addEventListener("click", miniClose);
  document.addEventListener("keydown", e => { if(e.key === "Escape" && isOpen()) miniClose(); });
  mFoot.addEventListener("click", e => { if(e.target.closest("a")) miniClose(); });
  /* the cart button opens the mini cart instead of leaving the page (a middle-click or ctrl-click still opens cart.html) */
  document.querySelectorAll('a.epc-pill[href="cart.html"]').forEach(a => a.addEventListener("click", e => {
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault(); setMenu(false); miniOpen();
  }));
  /* store.js calls this whenever the cart changes */
  const prev = window.leOnCartChanged;
  window.leOnCartChanged = function(){
    if(typeof prev === "function"){ try{ prev(); }catch(e){} }
    let n = lastCount; try{ n = leCartCount(); }catch(e){}
    const grew = n > lastCount; lastCount = n;
    if(isOpen()) miniRender();
    else if(AUTO_OPEN && grew && document.hasFocus()) miniOpen();
  };
  window.epOpenMiniCart = miniOpen;
}
/* keep the full-bottle sizes in the scrolling text up to date when the sheet loads */
const refreshTicker = () => { const t = document.getElementById("epcTrack"); if(t) t.innerHTML = tickerHtml(); };
window.addEventListener("le-data-updated", refreshTicker);
if(typeof leUpdateCartBadges === "function"){ leUpdateCartBadges(); leUpdateWishlistBadges(); }
})();
