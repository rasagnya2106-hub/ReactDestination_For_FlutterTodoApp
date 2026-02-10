import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CounterComponent from './CounterComponent';

describe('Counter increments smoke test', () => {
  test('increments counter on button click', () => {
    render(<CounterComponent />);

    expect(screen.getAllByText('0')).toHaveLength(1);
    expect(screen.queryByText('1')).not.toBeInTheDocument();

    const incrementButton = screen.getByRole('button', { name: /increment/i });
    fireEvent.click(incrementButton);

    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(1);
  });
});