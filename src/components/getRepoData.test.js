import getRepoData from './getRepoData';

afterEach(() => {
  jest.restoreAllMocks();
});

  test('testing result', async () => {
    const fakeApi = [{language:null},{language:null},{language:"Ruby"},{language:"Ruby"},{language:"Ruby"}]

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
        status: 200
      };
      return Promise.resolve(fetchResponse);
    })
    
    expect(await getRepoData("test", 1)).toEqual([null, null, "Ruby", "Ruby", "Ruby"])
  })

  test('testing result', async () => {
    const fakeApi = [{language:"JavaScript"},{language:null},{language:"Ruby"},{language:"Ruby"},{language:"C#"},{language:"JavaScript"},{language:"JavaScript"}]

    const fetchSpy = jest.spyOn(window, 'fetch').mockImplementation(() => {
      const fetchResponse = {
        ok: true,
        json: () => Promise.resolve(fakeApi),
        status: 200
      };
      return Promise.resolve(fetchResponse);
    })
    
    expect(await getRepoData("test", 1)).toEqual([
      'JavaScript',
      null,
      'Ruby',
      'Ruby',
      'C#',
      'JavaScript',
      'JavaScript'
    ])
  })

