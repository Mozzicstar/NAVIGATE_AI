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
    expect(screen.getByText(/Agent:/i)).toBeInTheDocument();

    // start the quick action
    fireEvent.click(screen.getByText(/Yes, do it/i));

    // confirm (form appears, then confirm)
    fireEvent.click(screen.getByText(/Confirm/i));

    // Wait for booking confirmation to appear (allow a few seconds for mock flow)
    await screen.findByText(/Flight booked — confirmation/i, {}, { timeout: 5000 });
  });
});
