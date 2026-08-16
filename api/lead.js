// Vercel Serverless Function — приймає заявку з квіза й надсилає в Telegram.
// Розводить дві гілки:
//   type:'paid' — гаряча заявка (пройшла фільтр Q3), телефон АБО нік
//   type:'free' — холодний контакт із безкоштовної гілки (нижчий пріоритет у CRM)
//
// Ключі краще тримати в Environment Variables Vercel:
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

const DEFAULT_TOKEN = '8090010233:AAGucMxosOir1f7ttPIUODULMbO2DYoqTHU';
const DEFAULT_CHAT_ID = '-4934715371';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;
  const d = req.body || {};

  let text;
  if (d.type === 'free') {
    // ❄️ ХОЛОДНА заявка — безкоштовна гілка, нижчий пріоритет
    text =
      '❄️ ХОЛОДНИЙ ЛІД · безкоштовна гілка\n\n' +
      `✈️ Telegram: ${d.tg || '—'}\n\n` +
      `1️⃣ Етап: ${d.q1 || '—'}\n` +
      `2️⃣ Ніша: ${d.q2 || '—'}\n` +
      `3️⃣ Ціль/готовність: ${d.q3 || '—'}\n\n` +
      '➡️ Надіслати відеоурок. НЕ вести як гарячого.';
  } else {
    // 🔥 ГАРЯЧА заявка — пройшла фільтр Q3
    text =
      '🔥 ГАРЯЧА ЗАЯВКА з квіза TikTok\n\n' +
      `👤 Імʼя: ${d.name || '—'}\n` +
      `📱 Телефон: ${d.phone || '—'}\n` +
      `✈️ Telegram: ${d.tg || '—'}\n` +
      `🌍 Країна: ${d.country || '—'}\n\n` +
      `1️⃣ Етап у TikTok: ${d.q1 || '—'}\n` +
      `2️⃣ Ніша: ${d.q2 || '—'}\n` +
      `3️⃣ Ціль/готовність: ${d.q3 || '—'}`;
  }

  if (!token || !chatId) {
    return res.status(200).json({ ok: true, note: 'Telegram не налаштований' });
  }

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const json = await tg.json();
    return res.status(200).json({ ok: json.ok === true });
  } catch (err) {
    return res.status(200).json({ ok: false, error: String(err) });
  }
}
