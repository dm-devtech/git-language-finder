import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';

afterEach(() => {
  jest.clearAllMocks();
});

test('renders Homepage', () => {
  render(<Home />);
});

test('check page title exists', () => {
  const {getByText} = render(<Home/>)
  expect(getByText("Git Hub Language Finder")).toBeInTheDocument();
});

test('check input field exists', () => {
  const {getByTestId} = render(<Home />)
  expect(getByTestId("input-field")).toBeInTheDocument();
});

test('check Submit button exists', () => {
  const {getByTestId} = render(<Home />)
  expect(getByTestId("Submit")).toBeInTheDocument();
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
  expect(alertSpy).not.toHaveBeenCalledWith("octocat")
})

test('testing result', async () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
  const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});

  const fakeApi = [{language:null},{language:null},{language:"Ruby"},{language:"Ruby"},{language:"Ruby"}]

  const dataSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
    const fetchResponse = {
      ok: true,
      json: () => Promise.resolve(fakeApi)
    };
    return Promise.resolve(fetchResponse);
  })

  const { getByText, getByTestId } = render(<Home />);
  const submitButton = getByTestId("Submit")

  fireEvent.change(getByTestId("input-field"), { target: { value: 'octocat' } });
  fireEvent.click(submitButton);

  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(alertSpy).toHaveBeenCalledWith("Submitting User: octocat")
  expect(dataSpy).toHaveBeenCalledTimes(1);
  expect(resultFunctionSpy).toHaveBeenCalled()
  await waitFor(() => expect(getByText("Language(s) used the most: Ruby")).toBeInTheDocument())
})

// EC - invalid user

// EC - no repos

// EC - most popular language = null

// EC - tied top languages
