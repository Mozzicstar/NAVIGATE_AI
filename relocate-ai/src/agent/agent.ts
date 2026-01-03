/* Simple experimental client-side agent prototype.
 * - Dry-run and mock-first
 * - Logs persisted to localStorage for demo
 */
import { callLLM } from './llm';
import type { AgentTask, AgentLog, AgentState, AgentActionName } from '../types';
// lightweight id generator for prototype (no external dep)
const uuidv4 = () => Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);

const STORAGE_KEY = 'relocate_ai_agent_state_v1';

function nowIso() { return new Date().toISOString(); }

function loadState(): AgentState {
  const defaultProvider = process.env.REACT_APP_AGENT_PROVIDER === 'groq' ? 'groq' : 'mock';
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { running: false, queue: [], logs: [], provider: defaultProvider };
    const state = JSON.parse(raw) as AgentState;
    // If env explicitly says groq, and we are on mock, upgrade it
    if (process.env.REACT_APP_AGENT_PROVIDER === 'groq' && state.provider === 'mock') {
      state.provider = 'groq';
    }
    return state;
  } catch (e) {
    return { running: false, queue: [], logs: [], provider: defaultProvider };
  }
}

function saveState(state: AgentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export class Agent {
  state: AgentState;
  pollingInterval = 2000; // conservative
  private intervalHandle: number | null = null;
  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.state = loadState();
  }

  setProvider(p: 'mock'|'groq') {
    this.state.provider = p;
    this.log({ level: 'info', message: `Provider set to ${p}` });
    saveState(this.state);
    this.notify();
  }

  start() {
    if (this.state.running) return;
    this.log({ level: 'info', message: 'Agent started' });
    this.state.running = true;
    this.state.lastRunAt = nowIso();
    saveState(this.state);
    this.intervalHandle = window.setInterval(() => this.tick(), this.pollingInterval);
    this.notify();
  }

  stop() {
    if (!this.state.running) return;
    this.log({ level: 'info', message: 'Agent stopped' });
    this.state.running = false;
    if (this.intervalHandle) clearInterval(this.intervalHandle);
    this.intervalHandle = null;
    saveState(this.state);
    this.notify();
  }

  queueTask(action: AgentActionName, input: string, dryRun = true) {
    const task = { id: uuidv4(), action, input, createdAt: nowIso(), approved: false, dryRun };
    this.state.queue.push(task);
    this.log({ level: 'info', message: `Queued task ${task.id} (${action})`, taskId: task.id });
    saveState(this.state);
    this.notify();
    return task;
  }

  // execute a task immediately (bypass queue). useful for inline quick actions.
  async runNow(action: AgentActionName, input: string, dryRun = false) {
    const tempId = uuidv4();
    this.log({ level: 'info', message: `Running now ${tempId} (${action})`, taskId: tempId });
    const task = { id: tempId, action, input, createdAt: nowIso(), approved: true, dryRun } as any;
    try {
      const result = await this.executeTask(task);
      this.log({ level: 'info', message: `Immediate result: ${tempId} -> ${result}`, taskId: tempId });
      return result;
    } catch (e: any) {
      this.log({ level: 'error', message: `Immediate task failed: ${String(e)}`, taskId: tempId });
      throw e;
    }
  }

  approveTask(taskId: string) {
    const t = this.state.queue.find(q => q.id === taskId);
    if (!t) return;
    t.approved = true;
    this.log({ level: 'info', message: `Task approved ${taskId}`, taskId });
    saveState(this.state);
    this.notify();
  }

  private async tick() {
    // run one task per tick
    if (!this.state.running) return;
    const task = this.state.queue.find(t => t.approved === true) || this.state.queue[0];
    if (!task) return;

    // only execute if approved or action is safe (some travel actions require approval)
    const unsafeActions = ['create-todo', 'reserve_option', 'confirm_booking', 'book_accommodation']; // approval-required actions
    if (!task.approved && unsafeActions.includes(task.action)) {
      this.log({ level: 'warning', message: `Waiting for approval: ${task.id}`, taskId: task.id });
      saveState(this.state);
      this.notify();
      return;
    }

    this.log({ level: 'info', message: `Executing task ${task.id} (${task.action})`, taskId: task.id });
    try {
      const result = await this.executeTask(task);
      this.log({ level: 'info', message: `Task result: ${task.id} -> ${result}`, taskId: task.id });
    } catch (e: any) {
      this.log({ level: 'error', message: `Task failed: ${String(e)}`, taskId: task.id });
    }

    // remove task after execution
    this.state.queue = this.state.queue.filter(q => q.id !== task.id);
    saveState(this.state);
    this.notify();
  }

  private async executeTask(task: AgentTask) {
    // call LLM via client. fallback to mock if provider isn't configured or allowed
    const provider = this.state.provider || (process.env.REACT_APP_AGENT_PROVIDER === 'groq' ? 'groq' : 'mock');
    const llm = await callLLM(`Perform ${task.action} on: ${task.input}`, provider as any);

    // Respect dryRun: only return descriptive output
    const output = await this.mockAction(task.action, task.input, task.dryRun ?? true, llm);
    return output;
  }

  private async mockAction(action: AgentActionName, input: string, dryRun: boolean, llmOutput: string) {
    // implement shallow mock actions
    await new Promise(res => setTimeout(res, 400));
    switch (action) {
      case 'search':
        return `search results for '${input}' (mock)`;
      case 'search_flights': {
        // input expected as JSON string { origin, destination, departDate, returnDate?, passengers?, budget? }
        let q: any = { raw: input };
        try { q = JSON.parse(input); } catch (e) { /* keep raw */ }
        const mockItineraries = [
          { id: 'opt-1', price: '$450', stops: 1, totalTime: '12h 30m', carrier: 'MockAir', details: '1 stop' },
          { id: 'opt-2', price: '$520', stops: 0, totalTime: '9h 45m', carrier: 'FlyProto', details: 'non-stop' }
        ];
        return `MOCK_ITINERARIES:${JSON.stringify({ query: q, options: mockItineraries })}`;
      }
      case 'reserve_option': {
        // input should contain option id or details
        if (dryRun) return `DRY-RUN: would reserve option ${input}`;
        const reservationId = `res-${Math.random().toString(36).slice(2,8)}`;
        return `RESERVATION_OK:${JSON.stringify({ reservationId, option: input })}`;
      }
      case 'confirm_booking': {
        if (dryRun) return `DRY-RUN: would confirm & charge for booking ${input}`;
        const bookingId = `bk-${Math.random().toString(36).slice(2,8)}`;
        return `BOOKING_CONFIRMED:${JSON.stringify({ bookingId, reservation: input })}`;
      }
      case 'book_accommodation': {
        // input expected as JSON string { destination, checkIn, checkOut, guests?, budget?, preferences? }
        let q: any = { raw: input };
        try { q = JSON.parse(input); } catch (e) { /* keep raw */ }
        if (dryRun) return `DRY-RUN: would search hotels for ${JSON.stringify(q)}`;
        const mockHotels = [
          { id: 'hotel-1', name: 'Grand Plaza Hotel', price: '$120/night', rating: 4.5, amenities: ['WiFi', 'Pool', 'Gym'] },
          { id: 'hotel-2', name: 'City Center Inn', price: '$85/night', rating: 4.2, amenities: ['WiFi', 'Breakfast'] },
          { id: 'hotel-3', name: 'Luxury Suites', price: '$200/night', rating: 4.8, amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'] }
        ];
        const bookingId = `acc-${Math.random().toString(36).slice(2,8)}`;
        return `ACCOMMODATION_BOOKED:${JSON.stringify({ bookingId, query: q, options: mockHotels, selected: mockHotels[0] })}`;
      }
      case 'summarize':
        return `summary: ${llmOutput}`;
      case 'create-todo':
        if (dryRun) return `DRY-RUN: would create todo '${input}'`;
        // in real mode we might persist to backend or mutate app state via a callback
        return `CREATED TODO '${input}' (mock persisted)`;
      case 'noop':
      default:
        return `noop for '${input}'`;
    }
  }

  log(l: Omit<AgentLog, 'id' | 'timestamp'>) {
    const entry: AgentLog = { id: uuidv4(), timestamp: nowIso(), ...l };
    this.state.logs.unshift(entry);
    // keep logs bounded
    if (this.state.logs.length > 200) this.state.logs = this.state.logs.slice(0, 200);
    saveState(this.state);
    this.notify();
  }

  getState(): AgentState { return JSON.parse(JSON.stringify(this.state)); }

  subscribe(cb: () => void) { this.subscribers.add(cb); return () => this.subscribers.delete(cb); }

  private notify() { Array.from(this.subscribers).forEach(s => { try { s(); } catch {} }); }
}

// export a singleton agent
export const agent = new Agent();
