import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';
jest.mock('./retrieveUserData');
import retrieveUserData from "./retrieveUserData";
jest.mock('./getRepoData');
import getRepoData from "./getRepoData";

afterEach(() => {
  jest.restoreAllMocks();
});

describe('testing main page', () => {
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

  test('testing result', async () => {
    getRepoData.mockImplementation(() => [null, null, "Ruby", "Ruby", "Ruby"])
    retrieveUserData.mockImplementation(() => 1)

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'octocat' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText("Language(s) used the most: Ruby")).toBeInTheDocument())
  })

  test('edge case; testing tied result i.e. two languages are most used', async () => {
    getRepoData.mockImplementation(() => ["JavaScript", "JavaScript", "JavaScript", "Ruby", "Ruby", "Ruby"])
    retrieveUserData.mockImplementation(() => 1)

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'testUser' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText("Language(s) used the most: JavaScript / Ruby")).toBeInTheDocument())
  })

  test('edge case; testing if most repos dont have a language', async () => {
    getRepoData.mockImplementation(() => [null, null, null, "Ruby", "Ruby"])
    retrieveUserData.mockImplementation(() => 1)

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'differentUser' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText("Language(s) used the most: No Language")).toBeInTheDocument())
  })

  test('edge case; testing 3 tied result i.e. two languages are most used', async () => {
    getRepoData.mockImplementation(() => ["JavaScript", "JavaScript", "JavaScript", "Ruby", "Ruby", "Ruby", "C#", "C#", "C#"])
    retrieveUserData.mockImplementation(() => 1)

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'otherUser' } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(getByText("Language(s) used the most: JavaScript / Ruby / C#")).toBeInTheDocument())
  })


})
