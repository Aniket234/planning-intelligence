// Vercel Serverless Function (Node.js)
// Set OPENAI_API_KEY in Vercel project env vars.
// Uses OpenAI Responses API: https://platform.openai.com/docs/api-reference/responses
module.exports = async (req, res) => {
  try {
    // Basic CORS + preflight (safe even if same-origin)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    }

    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.json({ error: 'Method Not Allowed' });
    }

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      res.statusCode = 500;
      return res.json({ error: 'OPENAI_API_KEY not set' });
    }

    let body = '';
    await new Promise((resolve) => {
      req.on('data', (c) => (body += c));
      req.on('end', resolve);
    });

    const parsed = body ? JSON.parse(body) : {};
    const system = parsed.system || '';
    const messages = Array.isArray(parsed.messages) ? parsed.messages : [];
    const meta = parsed.meta || {};
    const context = parsed.context || {};

    // Provide grounded context to the model in a dedicated user message.
    // Keep it compact to avoid huge tokens.
    const ctxStr = JSON.stringify({ meta, context }, null, 2);
    const ctxMsg = {
      role: 'user',
      content: `CONTEXT_JSON (use as grounding; do not invent facts beyond this):\n${ctxStr.slice(0, 20000)}`
    };

    const input = [
      ...(system ? [{ role: 'system', content: system }] : []),
      ctxMsg,
      ...messages,
    ];

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        // You can switch models in Vercel env or by editing this string.
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input,
        temperature: 0.2,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      res.statusCode = r.status || 500;
      return res.json({ error: data });
    }

    // Extract a plain text response (best-effort)
    const text =
      (data.output_text) ||
      (data.output && data.output[0] && data.output[0].content && data.output[0].content[0] && data.output[0].content[0].text) ||
      '';

    return res.json({ output: text || 'No text output.' });
  } catch (e) {
    res.statusCode = 500;
    return res.json({ error: String(e) });
  }
};
