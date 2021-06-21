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

  test('edge case; no form data given', async () => {
    getRepoData.mockImplementation(() => [])
    retrieveUserData.mockImplementation(() => 1)

     const { getByText, getByTestId } = render(<Home />);
     const submitButton = getByTestId("Submit")

     fireEvent.change(getByTestId("input-field"), { target: { } });
     fireEvent.click(submitButton);

     await waitFor(() => expect(getByText("Language(s) used the most: Not Found")).toBeInTheDocument())
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

//   test('edge case; testing response error code', async () => {
//     const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
//     const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});
//     const repoLanguagesSpy = jest.spyOn(Home.prototype, 'checkResult')

//     const fakeData = [{language:"JavaScript"},{language:"JavaScript"}]

//     const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
//       const fetchResponse = {
//         ok: true,
//         json: () => Promise.resolve(fakeData),
//         status: 404
//       };
//       return Promise.resolve(fetchResponse);
//     })

//     const { getByText, getByTestId } = render(<Home />);
//     const submitButton = getByTestId("Submit")

//     fireEvent.change(getByTestId("input-field"), { target: { value: 'otherUser' } });
//     fireEvent.click(submitButton);

//     expect(alertSpy).toHaveBeenCalledTimes(1);
//     expect(alertSpy).toHaveBeenCalledWith("Submitting User: otherUser")
//     expect(fetchSpy).toHaveBeenCalledTimes(1)
//     expect(resultFunctionSpy).toHaveBeenCalled()
//     expect(repoLanguagesSpy).toHaveBeenCalled()
//     await waitFor(() => expect(getByText("Language(s) used the most: Not Found")).toBeInTheDocument())
//   })

})
