# Agent (experimental)

This project includes a small **client-side agent prototype** for demo purposes. The agent is **disabled by default** and runs in dry-run mode.

How to try it locally:

1. Start the app: `REACT_APP_AGENT_ENABLED=true npm start`
2. Start the API proxy (optional): `cd api && npm install && npm start` (see `.env.example`)
3. Open [http://localhost:3000](http://localhost:3000)
4. On the checklist page, use the **Agent Dashboard** to start the agent, select `search_flights`, fill origin/destination/date, and click **Search flights**.
5. When mock itineraries appear in Logs, click **Reserve option** on an itinerary and **Approve** the queued reserve task. Next, approve `confirm_booking` to simulate booking.

Safety notes:

- The prototype uses a **mock LLM** and mock actions by default; it will not perform destructive actions without local approval.
- Real LLM calls (Grok) can be proxied through the local API server — see env vars below.
- Do **not** commit API keys or secrets to the repo.

Env variables (development only):

- `REACT_APP_AGENT_ENABLED=true` — enable the agent UI features (disabled by default)
- `REACT_APP_AGENT_PROVIDER=grok` — default provider (optional)
- `REACT_APP_AGENT_ALLOW_REAL=true` — **required** to allow real LLM calls from the browser (use with extreme caution)
- `REACT_APP_GROK_API_KEY=...` — your Grok API key (only used if `REACT_APP_AGENT_ALLOW_REAL=true`)
- `REACT_APP_GROK_API_URL` — optional custom Grok endpoint (default: `https://api.grok.ai/v1/generate`)
- `REACT_APP_AGENT_USE_PROXY=true` — route LLM calls to a local proxy server (recommended)
- `REACT_APP_LLM_PROXY_URL=http://localhost:4010` — URL for the proxy server

Server proxy `.env` example is provided at `api/.env.example`.