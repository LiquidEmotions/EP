/* POST /api/create-order
   body: { items:[{id,size,qty}], zone:"ncr"|"india", method:"card"|"other", expectedTotal:<rupees>, customer:{...} }
   The amount is worked out here from the cart. The browser never sends a price. */

const { priceOrder } = require("./_pricing");

/* Razorpay notes: max 256 characters per value, 15 notes per order. */
const clip = (v, n) => String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, n || 250);

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if(req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if(!keyId || !keySecret) return res.status(500).json({ error: "Payments are not set up yet." });

  try{
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const method = body.method === "card" ? "card" : "other";
    const price = await priceOrder(body.items, body.zone, method);

    /* The page showed a total; if the real one differs (prices changed), stop and tell the page. */
    if(Number(body.expectedTotal) !== price.total){
      return res.status(409).json({ error: "price_changed", total: price.total });
    }

    /* Customer details are saved on the Razorpay order, so every paid order shows
       who to ship to in your Razorpay dashboard (Payments → click the payment → Notes). */
    const c = body.customer || {};
    const customerNotes = {
      customer: clip(c.name, 120),
      phone: clip(c.phone, 40),
      email: clip(c.email, 120),
      address: clip(c.addr, 250),
      city_state_pin: clip(`${clip(c.city, 80)}, ${clip(c.state, 80)} ${clip(c.pin, 12)}, ${clip(c.country, 40)}`)
    };

    const summary = price.lines.map(l => `${l.id} ${l.size} x${l.qty}`).join(", ").slice(0, 250);
    const rz = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64")
      },
      body: JSON.stringify({
        amount: price.total * 100,          // paise
        currency: "INR",
        receipt: "le_" + Date.now(),
        notes: {
          method,
          zone: String(body.zone),
          base_paise: String(price.base * 100),
          fee_paise: String(price.fee * 100),
          items: summary,
          ...customerNotes
        }
      })
    });
    const order = await rz.json();
    if(!rz.ok) return res.status(502).json({ error: (order.error && order.error.description) || "Razorpay refused the order." });

    return res.status(200).json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      totals: { subtotal: price.subtotal, shipping: price.shipping, fee: price.fee, total: price.total }
    });
  }catch(err){
    const status = err.code === "stale_cart" ? 409 : 400;
    return res.status(status).json({ error: err.code || "bad_request", message: err.message });
  }
};
