const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = process.env.GROK_API_URL || 'https://api.grok.ai/v1/generate';

app.post('/llm', async (req, res) => {
  const { prompt, provider } = req.body;
  if (provider === 'grok' && GROK_API_KEY) {
    try {
      const resp = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_API_KEY}`
        },
        body: JSON.stringify({ prompt, max_tokens: 256, temperature: 0.2 })
      });
      const json = await resp.json();
      return res.json({ output: json.output || json.choices?.[0]?.text || JSON.stringify(json) });
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  // fallback mock
  return res.json({ output: `MOCK_PROXY_LLM: summary of '${(prompt||'').slice(0,120)}'` });
});

app.post('/bookings', (req, res) => {
  const id = `res-${Math.random().toString(36).slice(2,8)}`;
  res.json({ reservationId: id, status: 'held', details: req.body });
});

app.post('/payments', (req, res) => {
  const id = `pay-${Math.random().toString(36).slice(2,8)}`;
  res.json({ paymentId: id, status: 'charged', amount: req.body.amount });
});

const PORT = process.env.PORT || 4010;
app.listen(PORT, () => console.log(`API proxy running on ${PORT}`));
