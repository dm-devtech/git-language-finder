import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders Homepage', () => {
  render(<Home />);
});

test('check page title exists', () => {
  const {getByText} = render(<Home/>)
  expect(getByText("Git Hub Language Finder")).toBeInTheDocument();
});
