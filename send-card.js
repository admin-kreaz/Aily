// Vercel serverless function: sends the Aily result card to the participant's email via Resend.
// Env vars: RESEND_API_KEY, FROM_EMAIL (e.g. "Aily Quiz <quiz@yourdomain.com>"), optional ALLOWED_ORIGIN.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const b = req.body || {};
  const prefix = "data:image/jpeg;base64,";
  if (!EMAIL_RE.test(String(b.email || "")) || String(b.email).length > 254) return res.status(400).json({ error: "Invalid email" });
  if (typeof b.card !== "string" || !b.card.startsWith(prefix) || b.card.length > 3000000) return res.status(400).json({ error: "Invalid card" });
  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) return res.status(500).json({ error: "Email not configured" });

  const name = String(b.name || "").slice(0, 40);
  const character = String(b.character || "").slice(0, 60);
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1a1a2e">
    <h2 style="margin:0 0 8px">Hai ${esc(name)}! \u2728</h2>
    <p>Karakter Aily kamu adalah <b>${esc(character)}</b>.</p>
    <p>Aily Story Genre: <b>${esc(b.genre)}</b><br>Your Soulmate: <b>${esc(b.soulmate)}</b> (match ${esc(b.match)}%)</p>
    <p>Kartu hasil quiz kamu ada di lampiran email ini. Selamat dibagikan!</p>
    <p style="color:#888;font-size:12px">Dikirim oleh Aily Character Quiz</p></div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: [b.email],
        subject: `${name}, ini karakter Aily kamu: ${character}`,
        html,
        attachments: [{ filename: "aily-character-card.jpg", content: b.card.slice(prefix.length) }],
      }),
    });
    if (!r.ok) return res.status(502).json({ error: "Email provider error" });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ error: "Send failed" });
  }
};
