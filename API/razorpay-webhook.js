/* Razorpay webhook: when a card payment is captured, mark the order Paid in the Orders sheet.
   Env vars (Vercel): RAZORPAY_WEBHOOK_SECRET, ORDERS_API_URL, ORDERS_SECRET */
const crypto = require("crypto");

async function readRaw(req){
  const chunks = [];
  for await (const c of req) chunks.push(typeof c === "string" ? Buffer.from(c) : c);
  return Buffer.concat(chunks);
}

function sameSignature(a, b){
  const x = Buffer.from(String(a), "utf8");
  const y = Buffer.from(String(b), "utf8");
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

async function handler(req, res){
  if(req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const raw = await readRaw(req);
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if(!secret) return res.status(500).json({ error: "webhook secret not set" });

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if(!sameSignature(req.headers["x-razorpay-signature"] || "", expected)){
    return res.status(400).json({ error: "bad signature" });
  }

  let event;
  try{ event = JSON.parse(raw.toString("utf8")); }
  catch(e){ return res.status(400).json({ error: "bad json" }); }

  if(event.event !== "payment.captured") return res.status(200).json({ ignored: event.event });

  const p = event.payload && event.payload.payment && event.payload.payment.entity;
  if(!p || !p.order_id) return res.status(200).json({ ignored: "no order id" });

  try{
    const r = await fetch(process.env.ORDERS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "markPaid",
        secret: process.env.ORDERS_SECRET,
        razorpayOrderId: p.order_id,
        paymentId: p.id,
        amountPaise: p.amount,
        payMethod: p.method
      })
    });
    const out = await r.json().catch(() => ({}));
    if(!out.ok) throw new Error(out.error || "sheet did not accept the update");
    return res.status(200).json({ ok: true });
  }catch(err){
    /* Non-200 makes Razorpay retry the webhook later, so a short Sheets outage doesn't lose the update. */
    return res.status(500).json({ error: String(err.message || err) });
  }
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
