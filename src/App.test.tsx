import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders something meaningful', () => {
  render(<App />);
  expect(screen.getByText(/задачи|todo/i)).toBeInTheDocument();
});

