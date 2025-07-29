import { render, screen } from '@testing-library/react';
import App from './App';

test('renders title and board', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole("grid")).toBeInTheDocument();
  expect(screen.getByText(/Reset Game/i)).toBeInTheDocument();
});
