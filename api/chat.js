// Vercel Serverless Function (Node.js)
// Set OPENAI_API_KEY in Vercel project env vars.
// Uses OpenAI Responses API: https://platform.openai.com/docs/api-reference/responses
module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      return res.end('Method Not Allowed');
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

    const input = [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ];

    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
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
