export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: 'Missing profile' });
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `You are naming a Culture ship for a person based on their personality profile from a Culture novel quiz.

Their top personality dimensions (ranked):
${profile}

Culture ship names are abstract, philosophical, or ironic phrases — often wry, self-aware, or quietly menacing. They reflect the ship's (or owner's) character. Examples: "Quietly Considers All Options", "Partial Recall of Interesting Times", "Honest Mistake", "Enthusiastic Application of Force", "Conflicted About Almost Everything", "Regarded the Ceiling Momentarily".

Choose an appropriate ship class based on the profile:
- GSV (General Systems Vehicle): vast, civilisation-scale minds; Legacy or transcendence-dominant profiles
- GCU (General Contact Unit): curious, outward-facing, contact-oriented; Wonder or Growth dominant
- ROU (Rapid Offensive Unit): fast, decisive, morally unambiguous; Justice or Pragmatism dominant
- LOU (Limited Offensive Unit): similar to ROU but more restrained; Ethics-heavy profiles
- MSV (Medium Systems Vehicle): balanced, thoughtful; no single dominant cluster
- VFP (Very Fast Picket): precise, influential, operating at the margins; Influence or Identity dominant

Respond ONLY with valid JSON, no markdown, no explanation:
{"name": "Ship Name Here", "shipClass": "GCU"}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 128,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? '';

    let parsed;
    try {
      parsed = JSON.parse(text.trim());
    } catch {
      console.error('Failed to parse model response:', text);
      return res.status(502).json({ error: 'Invalid model response' });
    }

    if (!parsed.name || !parsed.shipClass) {
      return res.status(502).json({ error: 'Incomplete model response' });
    }

    return res.status(200).json({ name: parsed.name, shipClass: parsed.shipClass });
  } catch (err) {
    console.error('generate-ship-name error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
