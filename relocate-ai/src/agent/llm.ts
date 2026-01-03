// Lightweight LLM client wrapper for the agent prototype.
// - Supports `mock` provider
// - Supports `grok` provider if explicitly allowed via env (REACT_APP_AGENT_ALLOW_REAL=true)

export type Provider = 'mock' | 'groq';

export async function callLLM(prompt: string, provider: Provider = 'mock'): Promise<string> {
  // Optionally route through a server-side proxy when configured (safer for keys)
  const useProxy = process.env.REACT_APP_AGENT_USE_PROXY === 'true';
  const proxyUrl = process.env.REACT_APP_LLM_PROXY_URL;
  if (useProxy && proxyUrl) {
    try {
      console.log(`[LLM Client] Calling proxy at ${proxyUrl} with provider '${provider}'`);
      const resp = await fetch(`${proxyUrl.replace(/\/$/, '')}/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, provider })
      });
      if (resp.ok) {
        const json = await resp.json();
        console.log(`[LLM Client] Proxy returned output:`, json.output?.slice(0, 100));
        return json.output || JSON.stringify(json);
      }
      console.warn(`[LLM Client] Proxy returned non-ok status ${resp.status}, falling back to local provider`);
    } catch (e) {
      console.error(`[LLM Client] Proxy call failed for ${proxyUrl}:`, e);
      console.warn(`[LLM Client] Falling back to local provider due to proxy error`);
    }
  } else {
    console.log(`[LLM Client] Proxy disabled. useProxy=${useProxy}, proxyUrl=${proxyUrl}`);
  }

  if (provider === 'mock') {
    // deterministic small mock
    await new Promise(r => setTimeout(r, 300));
    return `MOCK_LLM: brief summary of '${prompt.slice(0, 120)}'`;
  }

  // Provider is 'grok'
  const allowReal = process.env.REACT_APP_AGENT_ALLOW_REAL === 'true';
  const key = process.env.REACT_APP_GROQ_API_KEY;
  const url = process.env.REACT_APP_GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

  if (!allowReal || !key) {
    // Always fallback to mock if real calls aren't explicitly allowed
    console.warn('Real LLM calls are not allowed — falling back to mock. Set REACT_APP_AGENT_ALLOW_REAL=true and provide REACT_APP_GROQ_API_KEY to enable.');
    await new Promise(r => setTimeout(r, 300));
    return `MOCK_LLM (fallback): brief summary of '${prompt.slice(0, 120)}'`;
  }

  try {
    const body = {
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.2,
    } as any;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`LLM error ${resp.status}: ${t}`);
    }

    const json = await resp.json();

    // Try a few common response shapes
    if (json.output) return String(json.output);
    if (json.choices && json.choices[0]) return String(json.choices[0].text || json.choices[0].message?.content || json.choices[0]);
    if (json.data && json.data[0]) return String(json.data[0]);

    return JSON.stringify(json);
  } catch (e: any) {
    console.error('LLM call failed:', e);
    throw e;
  }
}
