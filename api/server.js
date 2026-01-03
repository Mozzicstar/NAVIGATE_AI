const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

// Simulate a realistic GROQ response for demo purposes
function simulateGroqResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  if (lowerPrompt.includes('visa') && lowerPrompt.includes('lagos') && lowerPrompt.includes('usa')) {
    return `To get a visa from Lagos, Nigeria to the USA, follow these steps:

1. **Determine Visa Type**: Most common is the B-1/B-2 (business/tourist) or F-1 (student). Check the US Embassy website for your purpose.

2. **Apply Online**: Use the DS-160 form on the US Department of State website. Pay the fee (~$160-265 USD).

3. **Schedule Interview**: Book an appointment at the US Consulate in Lagos. Bring your passport, DS-160 confirmation, and supporting documents.

4. **Prepare Documents**: Include birth certificate, financial statements, invitation letters, etc.

5. **Attend Interview**: Be honest and prepared. Processing takes 1-3 months.

For detailed requirements, visit https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html.`;
  } else if (lowerPrompt.includes('flight') || lowerPrompt.includes('book')) {
    return `Based on your query, here are simulated flight options from Lagos (LOS) to New York (JFK):

- **Option 1**: Delta Airlines, 1 stop in Atlanta, Duration: 14h 30m, Price: $850, Depart: 2026-01-15 22:00.
- **Option 2**: Emirates, 1 stop in Dubai, Duration: 16h 45m, Price: $920, Depart: 2026-01-16 18:30.

To book, select an option and provide passenger details.`;
  } else {
    return `Assistant: I'm here to help with your relocation from Lagos to the USA. Your question was: "${prompt.slice(0,100)}...". 

Please provide more details about your visa, travel, or housing needs for tailored advice.`;
  }
}

app.post('/llm', async (req, res) => {
  const { prompt, provider } = req.body;
  console.log(`[Proxy] Received request for provider: ${provider}`);
  if (provider === 'groq' && GROQ_API_KEY) {
    try {
      const resp = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 512,
          temperature: 0.2
        })
      });
      const json = await resp.json();
      const output = json.choices?.[0]?.message?.content || json.output || JSON.stringify(json);
      return res.json({ output });
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  // fallback mock — richer simulated GROQ response for demo
  if (provider === 'groq') {
    const simulatedResponse = simulateGroqResponse(prompt);
    return res.json({ output: simulatedResponse });
  }

  // generic mock
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
app.listen(PORT, '0.0.0.0', () => console.log(`API proxy running on ${PORT}`));
