import React, { useEffect, useState } from 'react';
import { agent } from '../agent/agent';
import type { AgentTask, AgentLog, AgentActionName } from '../types';

const actionOptions: AgentActionName[] = ['search', 'search_flights', 'book_accommodation', 'summarize', 'create-todo', 'noop'];

const AgentDashboard: React.FC = () => {
  const [state, setState] = useState(agent.getState());
  const [action, setAction] = useState<AgentActionName>('search');
  const [input, setInput] = useState('');
  const [dryRun, setDryRun] = useState(true);

  // travel form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [budget, setBudget] = useState('');

  // local override for developer convenience (won't persist to repo)
  const [enabledOverride, setEnabledOverride] = useState<boolean>(() => localStorage.getItem('REACT_APP_AGENT_ENABLED_OVERRIDE') === 'true');
  const enabledEnv = (process.env.REACT_APP_AGENT_ENABLED === 'true');
  const enabled = enabledEnv || enabledOverride;

  const [provider, setProvider] = useState<'mock'|'groq'>(state.provider || (process.env.REACT_APP_AGENT_PROVIDER === 'groq' ? 'groq' : 'mock'));
  const realAllowed = (process.env.REACT_APP_AGENT_ALLOW_REAL === 'true') && !!process.env.REACT_APP_GROQ_API_KEY;

  // small UI message for validations and feedback
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsub = agent.subscribe(() => setState(agent.getState()));
    return () => { unsub(); };
  }, []);

  // clear messages after a short time
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, marginTop: 12, background: '#fff' }}>
      <h3>Agent Dashboard (experimental)</h3>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <strong>Status:</strong>
          {state.running ? <span style={{ color: 'green' }}>running</span> : <span style={{ color: 'gray' }}>stopped</span>}
          <span style={{ color: '#666' }}>• Queue: {state.queue.length}</span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => {
            if (!enabled) { setMessage('Agent is disabled — enable it first (toggle below)'); return; }
            agent.start(); setMessage('Agent started');
          }} disabled={state.running} style={{ padding: '6px 10px' }}>Start Agent</button>
          <button onClick={() => { agent.stop(); setMessage('Agent stopped'); }} disabled={!state.running} style={{ padding: '6px 10px' }}>Stop Agent</button>
        </div>

        <label style={{ marginLeft: 8 }}>
          Dry-run
          <input type="checkbox" checked={dryRun} onChange={e => setDryRun(e.target.checked)} style={{ marginLeft: 6 }} />
        </label>

        <label style={{ marginLeft: 8 }}>
          Provider
          <select value={provider} onChange={e => { const p = e.target.value as any; setProvider(p); agent.setProvider(p); }} style={{ marginLeft: 6 }}>
            <option value="mock">mock</option>
            <option value="groq">groq</option>
          </select>
        </label>

        <label style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={enabledOverride} onChange={e => { const v = e.target.checked; setEnabledOverride(v); localStorage.setItem('REACT_APP_AGENT_ENABLED_OVERRIDE', v ? 'true' : ''); setMessage(v ? 'Agent enabled (dev override)' : 'Agent disabled (dev override)'); }} />
          <small>Enable agent (dev override)</small>
        </label>

      </div>

      {/* status / validation messages */}
      {message && <div style={{ marginTop: 8, padding: 8, background: '#fff8e1', border: '1px solid #f2dba6', borderRadius: 6 }}>{message}</div>}

      {!enabled && <div style={{ marginTop: 8, color: '#b33' }}>Agent is disabled. Use the <strong>Enable agent (dev override)</strong> toggle above or set <code>REACT_APP_AGENT_ENABLED=true</code> in your environment.</div>}
      {provider === 'groq' && !realAllowed && <div style={{ marginTop: 8, color: '#b33' }}>Groq provider selected but not enabled. Set <code>REACT_APP_AGENT_ALLOW_REAL=true</code> and <code>REACT_APP_GROQ_API_KEY</code> to allow real LLM calls (local dev only).</div>}

      <hr style={{ margin: '12px 0' }} />

      <div>
        <h4>Queue a task</h4>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={action} onChange={e => setAction(e.target.value as AgentActionName)}>
            {actionOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* travel form for search_flights */}
          {action === 'search_flights' ? (
            <>
              <input placeholder="Origin" value={origin} onChange={e => setOrigin(e.target.value)} />
              <input placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} />
              <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} />
              <input placeholder="Budget (optional)" value={budget} onChange={e => setBudget(e.target.value)} />
              <button onClick={() => {
                if (!origin || !destination || !departDate) { setMessage('Please fill origin, destination and date'); return; }
                const payload = JSON.stringify({ origin, destination, departDate, budget });
                agent.queueTask('search_flights', payload, dryRun);
                setOrigin(''); setDestination(''); setDepartDate(''); setBudget('');
                setMessage('Search queued — check Logs for itineraries');
              }}>Search flights</button>
            </>
          ) : (
            <>
              <input placeholder="task input" value={input} onChange={e => setInput(e.target.value)} />
              <button onClick={() => { if (!input.trim()) { setMessage('Provide a task input'); return; } agent.queueTask(action, input.trim(), dryRun); setInput(''); setMessage('Task queued'); }}>Queue</button>
            </>
          )}
        </div>
      </div>

      <hr style={{ margin: '12px 0' }} />

      <div>
        <h4>Queue</h4>
        <div style={{ maxHeight: 140, overflow: 'auto', border: '1px solid #eee', padding: 8 }}>
          {state.queue.length === 0 && <div style={{ color: '#666' }}>No queued tasks</div>}
          {state.queue.map((t: AgentTask) => (
            <div key={t.id} style={{ padding: 6, borderBottom: '1px solid #fafafa' }}>
              <div><strong>{t.action}</strong> — {t.input}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{t.createdAt} • {t.dryRun ? 'dry-run' : 'real'}</div>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => { agent.approveTask(t.id); setMessage('Task approved'); }} disabled={!!t.approved}>Approve</button>
                <button onClick={() => { /* quick approve & run */ agent.approveTask(t.id); setMessage('Task approved & will run'); }}>Approve & run</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr style={{ margin: '12px 0' }} />

      <div>
        <h4>Logs</h4>
        <div style={{ maxHeight: 240, overflow: 'auto', border: '1px solid #eee', padding: 8 }}>
          {state.logs.length === 0 && <div style={{ color: '#666' }}>No logs yet</div>}

          {/* Show parsed itineraries from MOCK_ITINERARIES logs */}
          {state.logs.filter(l => l.message.includes('MOCK_ITINERARIES')).map((l: AgentLog) => {
            try {
              const payload = JSON.parse(l.message.replace(/.*MOCK_ITINERARIES:/, ''));
              return (
                <div key={l.id} style={{ padding: 6, borderBottom: '1px solid #fafafa' }}>
                  <div style={{ fontSize: 12, color: '#333' }}><strong>Itineraries for</strong> — {JSON.stringify(payload.query)}</div>
                  {payload.options.map((opt: any) => (
                    <div key={opt.id} style={{ marginTop: 6, padding: 6, border: '1px solid #f1f1f1' }}>
                      <div><strong>{opt.carrier}</strong> • {opt.price} • {opt.totalTime} • {opt.details}</div>
                      <div style={{ marginTop: 6 }}>
                        <button onClick={() => { agent.queueTask('reserve_option', JSON.stringify({ optionId: opt.id, details: opt }), dryRun); setMessage('Reserve requested — approve in the Queue'); }}>Reserve option</button>
                        <button onClick={() => { agent.queueTask('create_reminder', `Follow up on ${opt.id}`, dryRun); setMessage('Reminder created'); }} style={{ marginLeft: 6 }}>Create reminder</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            } catch (e) {
              return null;
            }
          })}

          {state.logs.filter(l => !l.message.startsWith('MOCK_ITINERARIES')).map((l: AgentLog) => (
            <div key={l.id} style={{ padding: 6, borderBottom: '1px solid #fafafa' }}>
              <div style={{ fontSize: 12, color: '#333' }}><strong>{l.level}</strong> — {l.message}</div>
              <div style={{ fontSize: 11, color: '#999' }}>{l.timestamp} {l.taskId ? `• task ${l.taskId}` : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
