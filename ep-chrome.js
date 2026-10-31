/* ep-chrome.js — the Enigma header (hamburger menu on every screen size), scrolling text and footer, shared by every page.
   Needs store.js first. Add <div id="epHeader"></div> and <div id="epFooter"></div> to a page. */
(function(){
"use strict";
const ACTIVE = document.body.dataset.page || "";
const SLIM = document.body.dataset.chrome === "slim";    // checkout: no scrolling text
/* Lines that scroll across the top. "{bottles}" becomes the full-bottle sizes you have in stock. */
const TICKER = ["Decants from 3ml", "{bottles}", "Decanted by syringe, sealed by hand", "Authentic, from genuine bottles", "Free shipping on every bottle"];
const NAV = [["home.html", "Home", "home"], ["shop.html", "Shop", "shop"], ["decants.html", "Decants", "decants"], ["bottles.html", "Full Bottles", "bottles"], ["brands.html", "Brands", "brands"], ["about.html", "About", "about"]];
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
function tickerHtml(){
  const sizes = bottleSizes();
  const items = TICKER.map(t => t === "{bottles}" ? (sizes.length ? "Full bottles in " + sizes.map(x => x + "ml").join(" · ") : "") : t).filter(Boolean);
  const one = items.map(t => `<span>${esc(t)}</span>`).join("");
  return one + one;
}
const mainLinks = NAV.filter(n => n[2] !== "home").map(n => `<a href="${n[0]}"${n[2] === ACTIVE ? ' class="active"' : ""}>${n[1]}</a>`).join("");
const drawerLinks = NAV.map(n => `<a href="${n[0]}"${n[2] === ACTIVE ? ' class="active"' : ""}>${n[1]}</a>`).join("")
  + `<a href="wishlist.html">Wishlist</a><a href="cart.html">Cart</a><a href="https://wa.me/917982410620" target="_blank" rel="noopener">WhatsApp us</a>`;

const header = `<div class="epc">${SLIM ? "" : `<div class="epc-ticker" aria-label="Store notes"><div class="epc-ticker-track" id="epcTrack">${tickerHtml()}</div></div>`}
<div class="epc-header" role="banner"><div class="epc-nav">
  <div class="epc-left">
    <button class="epc-ham" id="epcHam" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="epcDrawer"><span></span><span></span><span></span></button>
    <a class="epc-wordmark" href="home.html"><span>Enigma</span><span>Perfumes</span></a>
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
</aside></div>`;
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
/* keep the full-bottle sizes in the scrolling text up to date when the sheet loads */
const refreshTicker = () => { const t = document.getElementById("epcTrack"); if(t) t.innerHTML = tickerHtml(); };
window.addEventListener("le-data-updated", refreshTicker);
if(typeof leUpdateCartBadges === "function"){ leUpdateCartBadges(); leUpdateWishlistBadges(); }
})();
