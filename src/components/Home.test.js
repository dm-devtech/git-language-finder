import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';

beforeEach(() => {

});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Home', () => {
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

    const fakeMessage = [{}]

    const dataSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeMessage),
        headers: {
          status: 200
        }
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'octocat' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Submitting User: octocat")
  })

  test('no form data given', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    const fakeMessage = [{message:"Not Found"}]

    const dataSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeMessage),
        headers: {
          status: 200
        }
      };
      return Promise.resolve(fetchResponse);
    })

    fireEvent.change(getByTestId("input-field"), { target: { } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).not.toHaveBeenCalledWith("octocat")
    await waitFor(() => expect(getByText("Language(s) used the most: Not Found")).toBeInTheDocument())
  })

  test('testing result', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
    const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});

    const fakeApi = [{language:null},{language:null},{language:"Ruby"},{language:"Ruby"},{language:"Ruby"}]

    const dataSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
        headers: {
          status: 200
        }
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

  test('testing tied result i.e. two languages are most used', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
    const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});

    const fakeApi = [{language:"JavaScript"},{language:"JavaScript"},{language:"Ruby"},{language:"Ruby"}]

    const dataSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
        headers: {
          status: 200
        }
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'testUser' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Submitting User: testUser")
    expect(dataSpy).toHaveBeenCalledTimes(1);
    expect(resultFunctionSpy).toHaveBeenCalled()
    await waitFor(() => expect(getByText("Language(s) used the most: JavaScript / Ruby")).toBeInTheDocument())
  })

  test('testing if most repos dont have a language', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
    const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});

    const fakeApi = [{language:null},{language:null},{language:null},{language:"Ruby"}]

    const dataSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
            headers: {
              status: 200
            }
      };
      return Promise.resolve(fetchResponse);
    })

    const { getByText, getByTestId } = render(<Home />);
    const submitButton = getByTestId("Submit")

    fireEvent.change(getByTestId("input-field"), { target: { value: 'differentUser' } });
    fireEvent.click(submitButton);

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(alertSpy).toHaveBeenCalledWith("Submitting User: differentUser")
    expect(dataSpy).toHaveBeenCalledTimes(1);
    expect(resultFunctionSpy).toHaveBeenCalled()
    await waitFor(() => expect(getByText("Language(s) used the most: No Language")).toBeInTheDocument())
  })
})

test('testing 3 tied result i.e. two languages are most used', async () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementationOnce(() => {});
  const resultFunctionSpy = jest.spyOn(Home.prototype, 'mostUsedLanguages').mockImplementationOnce(() => {});

  const fakeData = [ {language:"JavaScript"},{language:"JavaScript"},{language:"Ruby"},{language:"Ruby"},{language:"C#"},{language:"C#"}]

  const dataSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
    const fetchResponse = {
      ok: true,
      json: () => Promise.resolve(fakeData),
      headers: {
        status: 200
      }
    };
    return Promise.resolve(fetchResponse);
  })

  const { getByText, getByTestId } = render(<Home />);
  const submitButton = getByTestId("Submit")

  fireEvent.change(getByTestId("input-field"), { target: { value: 'otherUser' } });
  fireEvent.click(submitButton);

  expect(alertSpy).toHaveBeenCalledTimes(1);
  expect(alertSpy).toHaveBeenCalledWith("Submitting User: otherUser")
  expect(dataSpy).toHaveBeenCalledTimes(1)
  expect(resultFunctionSpy).toHaveBeenCalled()
  await waitFor(() => expect(getByText("Language(s) used the most: JavaScript / Ruby / C#")).toBeInTheDocument())
})

// // EC - invalid user
