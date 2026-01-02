import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const headers = screen.getAllByText(/RelocateAI/i);
  expect(headers.length).toBeGreaterThan(0);
});
