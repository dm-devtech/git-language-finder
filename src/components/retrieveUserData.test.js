import retrieveUserData from './retrieveUserData';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('testing main page', () => {
  test('testing result', async () => {
    const fakeApi = {public_repos: 300}

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi)
      };
      return Promise.resolve(fetchResponse);
    }) 

    expect(await retrieveUserData("octocat")).toEqual(3)
  })

   test('one page of repos', async () => {
    const fakeApi = {public_repos: 10}

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi)
      };
      return Promise.resolve(fetchResponse);
    }) 

    expect(await retrieveUserData("octocat")).toEqual(1)
  })

})

