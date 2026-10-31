/* ep-chrome.js — puts the Enigma header, scrolling text and footer on pages that keep their own layout.
   Needs store.js first. Uses #hamburgerBtn / #mobileMenu so each page's own menu code keeps working. */
(function(){
"use strict";
const ACTIVE = document.body.dataset.page || "";
const TICKER = ["Decants from 3ml", "Decanted by syringe, sealed by hand", "Authentic, from genuine bottles", "Sealed BNIB bottles, testers and vials", "Free shipping on every bottle"];
const NAV = [["shop.html", "Shop", "shop"], ["decants.html", "Decants", "decants"], ["bottles.html", "Full Bottles", "bottles"], ["brands.html", "Brands", "brands"], ["about.html", "About", "about"]];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const links = NAV.map(n => `<a href="${n[0]}"${n[2] === ACTIVE ? ' class="active"' : ""}>${n[1]}</a>`).join("");
const track = TICKER.map(t => `<span>${esc(t)}</span>`).join("");
const full = document.body.dataset.chrome !== "slim";
const header = `<div class="epc"><div class="epc-ticker" aria-label="Store notes"><div class="epc-ticker-track">${track}${track}</div></div>
<div class="epc-header" role="banner"><div class="epc-nav">
  <a class="epc-wordmark" href="index.html"><span>Enigma</span><span>Perfumes</span></a>
  <nav class="epc-links" aria-label="Main">${links}</nav>
  <div class="epc-right">
    <a class="epc-pill" href="wishlist.html" aria-label="Wishlist"><span>♡<span class="epc-pill-label"> Wishlist</span></span><span class="epc-count" data-wishlist-count>0</span></a>
    <a class="epc-pill" href="cart.html" aria-label="Cart"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6.5h12l-1 10H5l-1-10Z"/><path d="M7 6.5V5a3 3 0 0 1 6 0v1.5"/></svg><span class="epc-pill-label">Cart</span><span class="epc-count" data-cart-count>0</span></a>
    <button class="epc-ham" id="hamburgerBtn" type="button" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div></div>
  <nav class="epc-menu" id="mobileMenu" aria-label="Mobile">${links}<a href="wishlist.html">Wishlist</a><a href="cart.html">Cart</a></nav>
</div></div>`;
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
if(typeof leUpdateCartBadges === "function"){ leUpdateCartBadges(); leUpdateWishlistBadges(); }
})();
