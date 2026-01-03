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
    const payload = { origin: ctx.origin || 'unspecified', destination: ctx.destination || 'unspecified', departDate: defaultDepart, passengers: 1 };
    return { action: 'search_flights' as const, label: `book a flight`, payload };
  }

  if (text.includes('visa') && text.includes('appointment')) {
    return { action: 'schedule_visa_appointment' as const, label: `schedule visa appointment`, payload: { note: item.title } };
  }

  return null;
}

const AgentInline: React.FC<Props> = ({ item, userContext }) => {
  const suggestion = useMemo(() => detectSuggestion(item, userContext), [item, userContext]);
  const [status, setStatus] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const initialDepart = (suggestion && typeof suggestion.payload === 'object' && 'departDate' in suggestion.payload) ? (suggestion.payload as any).departDate : '';
  const initialPassengers = (suggestion && typeof suggestion.payload === 'object' && 'passengers' in suggestion.payload) ? (suggestion.payload as any).passengers : 1;
  const [departDate, setDepartDate] = useState<string>(initialDepart || '');
  const [returnDate, setReturnDate] = useState<string>('');
  const [seatClass, setSeatClass] = useState<string>('Economy');
  const [passengers, setPassengers] = useState<number>(initialPassengers || 1);
  const [ticket, setTicket] = useState<any | null>(null);

  if (!suggestion) return null;

  const startFlow = () => {
    setShowForm(true);
  };

  const runBookingFlow = async () => {
    if (running) return;
    setRunning(true);
    setStatus('Asking agent for options...');
    try {
      const suggestionPayload: any = (suggestion && typeof suggestion.payload === 'object') ? suggestion.payload : {};
      const payload = { origin: userContext.origin || suggestionPayload.origin || 'unspecified', destination: userContext.destination || suggestionPayload.destination || 'unspecified', departDate, returnDate, passengers, seatClass };
      // search
      await new Promise(r => setTimeout(r, 800)); // small pause
      const searchRaw = await agent.runNow('search_flights', JSON.stringify(payload), false);
      let parsed: any = {};
      if (typeof searchRaw === 'string' && searchRaw.startsWith('MOCK_ITINERARIES:')) {
        parsed = JSON.parse(searchRaw.replace('MOCK_ITINERARIES:', ''));
      }
      const chosen = parsed.options ? parsed.options[0] : { id: 'opt-1', price: '$XXX', carrier: 'MockAir' };
      setStatus('Reserving option...');
      await new Promise(r => setTimeout(r, 900));
      const reserveRaw = await agent.runNow('reserve_option', JSON.stringify(chosen), false);
      setStatus('Confirming booking...');
      await new Promise(r => setTimeout(r, 1000));
      const confirmRaw = await agent.runNow('confirm_booking', reserveRaw, false);

      // build pseudo ticket
      const bookingInfo = typeof confirmRaw === 'string' && confirmRaw.startsWith('BOOKING_CONFIRMED:') ? JSON.parse(confirmRaw.replace('BOOKING_CONFIRMED:', '')) : { bookingId: `bk-${Math.random().toString(36).slice(2,8)}` };
      const ticketObj = {
        bookingId: bookingInfo.bookingId || bookingInfo.booking_id || 'bk-1234',
        origin: payload.origin,
        destination: payload.destination,
        departDate: payload.departDate,
        returnDate: payload.returnDate || null,
        carrier: chosen.carrier || 'MockAir',
        price: chosen.price || '$499',
        seat: '12A'
      };
      setTicket(ticketObj);
      setStatus('Booking complete');
    } catch (e: any) {
      setStatus(`Agent failed: ${String(e)}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#f8fbff' }}>
      {!ticket ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14 }}><strong>Agent:</strong> {`Should an agent ${suggestion.label}?`}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!showForm ? (
              <button onClick={startFlow} style={{ padding: '8px 12px', background: '#0369a1', color: 'white', borderRadius: 6, border: 'none' }}>Yes, do it</button>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={departDate} onChange={e => setDepartDate(e.target.value)} style={{ padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                <input type="number" value={passengers} min={1} onChange={e => setPassengers(Number(e.target.value))} style={{ width: 80, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }} />
                <button onClick={runBookingFlow} disabled={running} style={{ padding: '8px 12px', background: '#059669', color: 'white', borderRadius: 6, border: 'none' }}>{running ? 'Processing…' : 'Confirm'}</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h4 style={{ margin: 0 }}>Flight booked — confirmation</h4>
          <div style={{ marginTop: 8, fontSize: 13 }}>
            <div><strong>Booking ID:</strong> {ticket.bookingId}</div>
            <div><strong>Route:</strong> {ticket.origin} → {ticket.destination}</div>
            <div><strong>Date:</strong> {ticket.departDate}</div>
            <div><strong>Carrier:</strong> {ticket.carrier}</div>
            <div><strong>Price:</strong> {ticket.price}</div>
            <div><strong>Seat:</strong> {ticket.seat}</div>
          </div>
        </div>
      )}

      {status && <div style={{ marginTop: 10, color: '#0b6', fontSize: 13 }}>{status}</div>}
    </div>
  );
};

export default AgentInline;
