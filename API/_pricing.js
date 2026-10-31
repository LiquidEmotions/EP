/* api/_pricing.js — works out what an order really costs, on the server.
   It runs your own store.js in a sandbox and applies the live Google Sheet
   on top of it, exactly like the website does, so the server and the site
   always agree on prices (and a customer can't change the amount). */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

/* Keep these in step with checkout.html */
const SHIPPING_ZONES = { ncr: 55, india: 75 };
const FREE_SHIP_QTY = 4;
const CARD_FEE_RATE = 0;          // Razorpay now charges its fee to the customer itself, so the order amount has no card fee
const isPartial = (size) => /-P$/.test(String(size || ""));   // keep in step with leIsPartial in store.js
const isBottle = (size) => /-[BTV]$/.test(String(size || ""));  // bottle / tester / vial, keep in step with leIsBottle in store.js
const CACHE_MS = 60 * 1000;       // re-read the sheet at most once a minute

let cache = { at: 0, prices: null, maxQty: 10, maxBottleQty: 2, unavailable: {} };

function readStoreJs(){
  const places = [path.join(process.cwd(), "store.js"), path.join(__dirname, "..", "store.js")];
  for(const p of places){
    try{ return fs.readFileSync(p, "utf8"); }catch(e){ /* try next */ }
  }
  throw new Error("store.js not found next to the api folder (check vercel.json includeFiles)");
}

function makeSandbox(){
  const noop = () => {};
  const sb = {
    console: { log: noop, info: noop, warn: noop, error: noop },
    localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
    location: { search: "", href: "" },
    document: {
      addEventListener: noop, getElementById: () => null, querySelector: () => null,
      querySelectorAll: () => [], createElement: () => ({ style: {} }), body: { appendChild: noop }
    },
    fetch: () => Promise.reject(new Error("disabled in sandbox")),
    Event: class { constructor(t){ this.type = t; } },
    navigator: {}, setTimeout, clearTimeout, URL
  };
  sb.window = sb;
  sb.addEventListener = noop;
  sb.dispatchEvent = noop;
  sb.requestAnimationFrame = noop;
  return vm.createContext(sb);
}

async function getText(url){
  const r = await fetch(url, { cache: "no-store" });
  if(!r.ok) throw new Error("HTTP " + r.status);
  return r.text();
}

async function loadPrices(){
  const ctx = makeSandbox();
  vm.runInContext(readStoreJs(), ctx, { filename: "store.js" });
  const run = (code) => vm.runInContext(code, ctx);

  const urls = run("({ a: LE_SHEET_URL, b: LE_SHEET_URL_ALT, c: LE_CATALOGUE_URL, p: LE_PARTIALS_URL, e: EP_SHEET_URL, min: LE_SHEET_MIN_ROWS })");
  let data = null;
  for(const url of [urls.a, urls.b]){
    try{
      ctx.__csv = await getText(url);
      const parsed = run("leParseSheetRows(leParseCsv(__csv))");
      if(parsed.rows.length >= urls.min){ data = parsed; break; }
    }catch(e){ /* try the next route */ }
  }
  if(!data) data = { rows: [], catalogue: null, partials: [] };   // decant sheet unreachable: still apply the bottle sheet on top of store.js
  {
    try{
      ctx.__csv = await getText(urls.c);
      data.catalogue = run("leParseCatalogueRows(leParseCsv(__csv))");
    }catch(e){ data.catalogue = null; }
    try{
      ctx.__csv = await getText(urls.p);
      data.partials = run("leParsePartialRows(leParseCsv(__csv))") || [];
    }catch(e){ data.partials = []; }
    try{
      ctx.__csv = await getText(urls.e);
      data.bottles = run("epParseBottleRows(leParseCsv(__csv))") || [];
    }catch(e){ data.bottles = []; }
    ctx.__data = data;
    run("leApplySheetData(__data)");
  }
  /* If the sheet can't be reached, the prices inside store.js are used,
     the same fallback the website uses. */

  const prices = run("Object.fromEntries(FRAGRANCES.map(f => [f.id, Object.assign({}, f.prices)]))");
  const maxQty = run("LE_MAX_QTY");
  const maxBottleQty = run("EP_MAX_BOTTLE_QTY");
  /* sold or reserved sizes (partials are one-offs, so these must not be bought) */
  const unavailable = run("Object.fromEntries(FRAGRANCES.map(f => [f.id, (f.soldSizes || []).concat(f.heldSizes || [])]))");
  return { prices, maxQty, maxBottleQty, unavailable };
}

async function getPrices(){
  if(cache.prices && Date.now() - cache.at < CACHE_MS) return cache;
  const { prices, maxQty, maxBottleQty, unavailable } = await loadPrices();
  cache = { at: Date.now(), prices, maxQty, maxBottleQty, unavailable };
  return cache;
}

/* items: [{ id, size, qty }]  ->  totals in whole rupees */
async function priceOrder(items, zone, method){
  if(!Array.isArray(items) || items.length === 0 || items.length > 60) throw new Error("Your cart is empty.");
  if(!(zone in SHIPPING_ZONES)) throw new Error("Unknown delivery area.");
  const { prices, maxQty, maxBottleQty, unavailable } = await getPrices();

  let subtotal = 0, count = 0, hasPartial = false;
  const lines = [];
  for(const it of items){
    const table = prices[it && it.id];
    const unit = table && table[it.size];
    const qty = Math.floor(Number(it && it.qty));
    const partial = isPartial(it && it.size);
    const bottle = isBottle(it && it.size);
    const soldOrHeld = ((unavailable && unavailable[it && it.id]) || []).includes(it && it.size);
    if(!unit || !(qty >= 1) || qty > (bottle ? maxBottleQty : maxQty) || (partial && qty !== 1) || ((partial || bottle) && soldOrHeld)){
      const err = new Error("An item in your cart is no longer available. Please review your cart.");
      err.code = "stale_cart";
      throw err;
    }
    subtotal += unit * qty;
    count += qty;
    if(partial || bottle) hasPartial = true;
    lines.push({ id: it.id, size: it.size, qty, unit });
  }

  /* a partial's price already includes packaging and shipping, and bottles ship free too, so any cart with either ships free */
  const shipping = (count >= FREE_SHIP_QTY || hasPartial) ? 0 : SHIPPING_ZONES[zone];
  const base = subtotal + shipping;
  const fee = method === "card" ? Math.round(base * CARD_FEE_RATE) : 0;
  return { lines, count, subtotal, shipping, base, fee, total: base + fee };
}

module.exports = { priceOrder, SHIPPING_ZONES, FREE_SHIP_QTY, CARD_FEE_RATE };
