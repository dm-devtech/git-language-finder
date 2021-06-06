import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';

test('renders Homepage', () => {
  render(<Home />);
});

test('check page title exists', () => {
  const {getByText} = render(<Home/>)
  expect(getByText("Git Hub Language Finder")).toBeInTheDocument();
});

// test.only("submit button can be clicked", () => {
//   const onSubmit = jest.fn(e => e.preventDefault());
//   const { getByText } = render(<Home handleSubmit={onSubmit} />);
//   const submitButton = getByText("Submit")
//   fireEvent.click(submitButton);
//   expect(onSubmit).toHaveBeenCalledTimes(1);
// });

test('check input field exists', () => {
  const {getByTestId, getByText} = render(<Home />)
  expect(getByTestId("input-field")).toBeInTheDocument();
});

test('When form submitted alert message appears', async () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  const { getByTestId } = render(<Home />);
  const submitButton = getByTestId("Submit")

  fireEvent.change(getByTestId("input-field"), { target: { value: 'octocat' } });
  fireEvent.click(submitButton);

  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(alertSpy).toHaveBeenCalledWith("Submitting User: octocat")
})

test('no form data given', async () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  const { getByTestId } = render(<Home />);
  const submitButton = getByTestId("Submit")

  fireEvent.change(getByTestId("input-field"), { target: {  } });
  fireEvent.click(submitButton);

  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(alertSpy).not.toHaveBeenCalledWith("Submitting User: octocat")
})

// test input gets put into fetch

// test input then submit does something

// EC - invalid user

// EC - no repos

// EC - most popular language = null

// EC - tied top languages

// css
