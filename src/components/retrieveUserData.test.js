import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';

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
    const fakeApi = [{public_repos: 2}, {language:null},{language:null},{language:"Ruby"},{language:"Ruby"},{language:"Ruby"}]

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
        status: 200
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'octocat' } });
    fireEvent.click(submitButton);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(getByText("Language(s) used the most: Ruby")).toBeInTheDocument())
  })

  test('edge case; no form data given', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledWith("Submitting User: ")
    await waitFor(() => expect(getByText("Language(s) used the most: -")).toBeInTheDocument())
  })

  test('edge case; testing tied result i.e. two languages are most used', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
    const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});

    const fakeApi = [{language:"JavaScript"},{language:"JavaScript"},{language:"Ruby"},{language:"Ruby"}]

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
        status: 200
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'testUser' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Submitting User: testUser")
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(resultFunctionSpy).toHaveBeenCalled()
    await waitFor(() => expect(getByText("Language(s) used the most: JavaScript / Ruby")).toBeInTheDocument())
  })

  test('edge case; testing if most repos dont have a language', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
    const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});

    const fakeApi = [{language:null},{language:null},{language:null},{language:"Ruby"}]

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
        status: 200
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'differentUser' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Submitting User: differentUser")
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(resultFunctionSpy).toHaveBeenCalled()
    await waitFor(() => expect(getByText("Language(s) used the most: No Language")).toBeInTheDocument())
  })

  test('edge case; testing 3 tied result i.e. two languages are most used', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
    const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});
    const repoLanguagesSpy = jest.spyOn(Home.prototype, 'checkResult')

    const fakeData = [ {language:"JavaScript"},{language:"JavaScript"},{language:"Ruby"},{language:"Ruby"},{language:"C#"},{language:"C#"}]

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeData),
        status: 200
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'otherUser' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Submitting User: otherUser")
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(repoLanguagesSpy).toHaveBeenCalled()
    expect(resultFunctionSpy).toHaveBeenCalled()
    await waitFor(() => expect(getByText("Language(s) used the most: JavaScript / Ruby / C#")).toBeInTheDocument())
  })

  test('edge case; testing response error code', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
    const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});
    const repoLanguagesSpy = jest.spyOn(Home.prototype, 'checkResult')

    const fakeData = [{language:"JavaScript"},{language:"JavaScript"}]

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeData),
        status: 404
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'otherUser' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Submitting User: otherUser")
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(resultFunctionSpy).toHaveBeenCalled()
    expect(repoLanguagesSpy).toHaveBeenCalled()
    await waitFor(() => expect(getByText("Language(s) used the most: Not Found")).toBeInTheDocument())
  })

})

