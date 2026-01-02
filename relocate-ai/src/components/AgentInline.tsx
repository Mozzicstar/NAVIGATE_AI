import React, { useMemo, useState } from 'react';
import type { ChecklistItem, UserContext } from '../types';
import { agent } from '../agent/agent';

type Props = {
  item: ChecklistItem;
  userContext: UserContext;
};

function detectSuggestion(item: ChecklistItem, ctx: UserContext) {
  const text = `${item.title} ${item.detail}`.toLowerCase();
  const defaultDepart = ctx.departureDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0,10);

  if (text.includes('flight') || text.includes('ticket') || text.includes('fly') || text.includes('air') || item.title.toLowerCase().includes('book')) {
    const payload = { origin: ctx.origin || 'unspecified', destination: ctx.destination || 'unspecified', departDate: defaultDepart };
    return { action: 'search_flights' as const, label: `Book flight ${payload.origin} → ${payload.destination} on ${payload.departDate}`, payload };
  }

  if (text.includes('visa') && text.includes('appointment')) {
    return { action: 'schedule_visa_appointment' as const, label: `Schedule visa appointment`, payload: { note: item.title } };
  }

  return null;
}

const AgentInline: React.FC<Props> = ({ item, userContext }) => {
  const suggestion = useMemo(() => detectSuggestion(item, userContext), [item, userContext]);
  const [status, setStatus] = useState<string>('');
  const [running, setRunning] = useState(false);

  if (!suggestion) return null;

  const onYes = () => {
    if (running) return;
    setRunning(true);
    const payload = JSON.stringify(suggestion.payload);
    agent.queueTask(suggestion.action as any, payload, true);
    agent.log({ level: 'info', message: `Agent quick action queued: ${suggestion.label}` });
    setStatus('Queued (dry-run). Approve in Agent Queue to execute.');
    setTimeout(() => setRunning(false), 500);
  };

  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#f8fbff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 14 }}><strong>Agent:</strong> {`Should an agent ${suggestion.label.toLowerCase()}?`}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={onYes} disabled={running} style={{ padding: '8px 12px', background: '#0369a1', color: 'white', borderRadius: 6, border: 'none' }}>{running ? 'Queued…' : 'Yes, do it'}</button>
      </div>
      {status && <div style={{ marginLeft: 12, color: '#0b6', fontSize: 13 }}>{status}</div>}
    </div>
  );
};

export default AgentInline;
