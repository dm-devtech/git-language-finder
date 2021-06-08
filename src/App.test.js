import { render, screen } from '@testing-library/react';
import App from './App';

test('renders page', () => {
  render(<App />);
});

test('check page title exists', () => {
  const {getByText} = render(<App/>)
  expect(getByText("Git Hub Language Finder")).toBeInTheDocument();
});
