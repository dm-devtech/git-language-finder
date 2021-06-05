import { render, fireEvent } from '@testing-library/react';
import Home from './Home';

test('renders Homepage', () => {
  render(<Home />);
});

test('check page title exists', () => {
  const {getByText} = render(<Home/>)
  expect(getByText("Git Hub Language Finder")).toBeInTheDocument();
});

test("submit button can be clicked", () => {
  const onSubmit = jest.fn(e => e.preventDefault());
  const { getByText } = render(<Home props={onSubmit} />);
  const submitButton = getByText("Submit")
  fireEvent.click(submitButton);
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('check input exists', () => {
  const {getByTestId, getByText} = render(<Home />)
  expect(getByTestId("input-field")).toBeInTheDocument();
});
