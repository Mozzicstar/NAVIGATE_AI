import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgentInline from './AgentInline';
import { agent } from '../agent/agent';

jest.mock('../agent/llm', () => ({
  callLLM: jest.fn(async (p: string) => `MOCK_SUGGESTION: ${p.slice(0, 40)}`)
}));

describe('AgentInline', () => {
  beforeEach(() => {
    localStorage.clear();
    const s = { running: false, queue: [], logs: [], provider: 'mock' };
    localStorage.setItem('relocate_ai_agent_state_v1', JSON.stringify(s));
  });

  it('renders suggestion and queues a task via modal confirm', async () => {
    const item: any = { id: '1', title: 'Book flight to Dubai', detail: 'We need to book a flight', priority: 'high', deadline: 'soon', estimatedTime: '30m', checked: false, source: 'test', risk: '' };
    const ctx: any = { origin: 'NYC', destination: 'DXB', departureDate: '2026-02-01' };

    render(<AgentInline item={item} userContext={ctx} />);

    // suggestion should be visible
    expect(screen.getByText(/Agent suggestion/i)).toBeInTheDocument();

    // click Ask agent
    fireEvent.click(screen.getByText(/Ask agent/i));

    // Wait for modal title to appear
    await waitFor(() => expect(screen.getByText(/Agent:/i)).toBeInTheDocument());

    // Confirm queue
    fireEvent.click(screen.getByText(/Queue suggestion/i));

    // Wait for queue to be added to agent state
    await waitFor(() => {
      const raw = localStorage.getItem('relocate_ai_agent_state_v1') || '{}';
      const st = JSON.parse(raw);
      expect(st.queue.length).toBeGreaterThan(0);
    });
  });
});
