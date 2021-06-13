## Git Language Finder
- Finds the most common coding language used by a Github user

### Git Authentication
- set up environment variable in .env file in root as follows:
REACT_APP_TOKEN='API TOKEN' but replace API TOKEN as necessary

### Running the app
- Clone the repo
- Navigate to the local repo directory
- Install dependencies with ```yarn install```
- Use ```yarn start``` to run the app
- On the app page enter a Github username and click submit

### Screenshots
![home](screenshots/home.JPG)

### Note on the test
- Ensuring that all repos were captured was problematic as this required iterating over pages of repos and ensuring the number of iterations did not exceed actual pages of repos for the user entered.  This meant calling the git user profile api to calculate number of pages of repos the entered user has.  As a result the mocking of fetch in my tests was affected by having two fetches in the program and as a result some tests now fail.  

### Tests
- To run tests do ```yarn test```

#### Code Coverage
- NB 4 tests fail so below is not an accurate representation

File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------|---------|----------|---------|---------|-------------------
All files       |     100 |       90 |     100 |     100 |
 src            |     100 |      100 |     100 |     100 |
  App.js        |     100 |      100 |     100 |     100 |
 src/components |     100 |       90 |     100 |     100 |
  Home.js       |     100 |       90 |     100 |     100 | 84


### Tech used:
- ReactJS (create-react-app)
- React testing library
