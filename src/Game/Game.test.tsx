import { render, screen } from '@testing-library/react';
import React from 'react';
import Game from './Game';

test('renders learn react link', () => {
  render(<Game />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
