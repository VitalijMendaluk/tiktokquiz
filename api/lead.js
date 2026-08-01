// Vercel Serverless Function — приймає заявку з форми та надсилає її в Telegram.
//
// Токен і chat_id вже вписані нижче як значення за замовчуванням.
// Безпечніше тримати їх у Environment Variables Vercel
// (Settings → Environment Variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID),
// але якщо їх не задати — використаються значення нижче.

const DEFAULT_TOKEN = '8090010233:AAGucMxosOir1f7ttPIUODULMbO2DYoqTHU';
const DEFAULT_CHAT_ID = '-4934715371';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

  const d = req.body || {};
  const text =
    '🔥 Нова заявка з квіза TikTok\n\n' +
    `👤 Імʼя: ${d.name || '—'}\n` +
    `📱 Телефон: ${d.phone || '—'}\n` +
    `🌍 Країна: ${d.country || '—'}\n\n` +
    `1️⃣ Етап у TikTok: ${d.q1 || '—'}\n` +
    `2️⃣ Ціль: ${d.q2 || '—'}\n` +
    `3️⃣ Інвестиції: ${d.q3 || '—'}`;

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
