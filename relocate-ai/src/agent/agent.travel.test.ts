import { agent } from './agent';

jest.setTimeout(20000);

describe('Agent travel flow (mock)', () => {
  beforeEach(() => {
    // reset state on the singleton and localStorage
    agent.stop();
    agent.state = { running: false, queue: [], logs: [], provider: 'mock' } as any;
    localStorage.setItem('relocate_ai_agent_state_v1', JSON.stringify(agent.state));
  });

  test('search -> reserve -> approve -> confirm booking (dry-run)', async () => {
    // queue a search_flights task
    const payload = JSON.stringify({ origin: 'NYC', destination: 'DXB', departDate: '2026-02-01' });
    const t1 = agent.queueTask('search_flights' as any, payload, true);

    agent.start();

    // wait until logs show MOCK_ITINERARIES (may be embedded in task result)
    await waitForLog(m => m.message.includes('MOCK_ITINERARIES'));

    // simulate choosing an option and creating reserve task
    const option = { optionId: 'opt-1' };
    const t2 = agent.queueTask('reserve_option' as any, JSON.stringify(option), true);

    // approve reserve
    agent.approveTask(t2.id);

    await waitForLog(m => m.message.includes('DRY-RUN: would reserve option'));

    // create confirm_booking and approve
    const t3 = agent.queueTask('confirm_booking' as any, JSON.stringify({ reservationId: 'res-123' }), true);
    agent.approveTask(t3.id);

    await waitForLog(m => m.message.includes('DRY-RUN: would confirm & charge'));

    agent.stop();

    expect(true).toBe(true);
  });
});

function waitForLog(predicate: (l: any) => boolean, timeout = 10000) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    const i = setInterval(() => {
      const raw = localStorage.getItem('relocate_ai_agent_state_v1') || '{}';
      try {
        const st = JSON.parse(raw);
        const logs = st.logs || [];
        if (logs.some(predicate)) {
          clearInterval(i);
          resolve();
          return;
        }
      } catch (e) {}
      if (Date.now() - start > timeout) { clearInterval(i); reject(new Error('timeout waiting for log')); }
    }, 200);
  });
}
