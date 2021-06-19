import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from './Home';

afterEach(() => {
  jest.restoreAllMocks();
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

