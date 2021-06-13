import React, { useState } from 'react';

const Home = () => {
  const [user, setUser] = useState("")
  const [language, setLanguage] = useState(null)
  const [error, setError] = useState(null)

  const retrieveUserData = async() => {
    const apiToken = process.env.REACT_APP_TOKEN

    const userLink = `https://api.github.com/users/${user}`
    const response = await fetch(userLink,
      {
        headers: {
          authorization: `token ${apiToken}`
        }
      }
    )

    const userData = await response.json()
    const totalUserRepos = userData.public_repos
    const totalPagesOfRepos = Math.ceil(userData.public_repos/100)
    return totalPagesOfRepos
  }

  const getRepoData = async() => {
    const apiToken = process.env.REACT_APP_TOKEN

    const numberOfPages = await retrieveUserData()

    const urls = [];

    for (let i = 1; i <= numberOfPages; i++) {
      urls.push(`https://api.github.com/users/${user}/repos?page=${i}&per_page=100`);
    }

    let data;

    try {
      data = await Promise.all(urls.map(url => fetch(url).then(res => res.json())));
    } catch (error) {
      console.error(error);
    }

    return data.map(page => page.map(repo => repo.language)).flat();

  }

  const uniqueLanguages = async(languages) => {
    const uniqLanguages = Array.from(new Set(languages))
    return uniqLanguages
  }
    
  const countOfLanguages = async(languages, uniqueLanguages) => {
    const languageAndCount = []
    const countOnly = []

    for(let i = 0; i < uniqueLanguages.length; i++){
      countOnly.push(languages.filter((v) => (v === uniqueLanguages[i])).length)
      languageAndCount.push([uniqueLanguages[i], languages.filter((v) => (v === uniqueLanguages[i])).length])
    }

    return [countOnly, languageAndCount]
  }

  const mostUsedLanguages = async(languageAndCount) => {
    const [countOnly, languageCount] = languageAndCount
    const highestCount = Math.max(...countOnly)
    const mostUsedLanguagesAndCount = languageCount.filter(([language, count]) => count === highestCount)
    const mostUsedLanguages = mostUsedLanguagesAndCount.flat().filter(l => l === null || typeof l === "string").map(l => l === null ? "No Language" : l)
    const result = mostUsedLanguages.join(" / ")

    return result
  }

  const getData = async() => {
    const pages = await retrieveUserData()
    try {
      const repoData = await getRepoData(pages)
      const uniqLanguages = await uniqueLanguages(repoData)
      const count = await countOfLanguages(repoData, uniqLanguages)
      const languages = await mostUsedLanguages(count)
      setLanguage(languages)
    } catch(error) {
      console.error(error)
    }
  }

  const submitHandler = () => {
    mostUsedLanguages()
  }

  const changeHandler = (event) => {
    setUser(event.target.value);
  }

    return (
      <div>
        <h1>Git Hub Language Finder</h1>

            <input
              type='text'
              onChange={changeHandler}
              data-testid='input-field'
              name='user'
              value={user}
             />
             <button onClick={getData} data-testid='Submit' className="add-button">Submit</button>

          <div className='body-text' data-testid='result'>
            Language(s) used the most: {language}
          </div>
      </div>
    );
  }


export default Home;
