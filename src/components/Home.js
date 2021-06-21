import React, { useState } from 'react';
import RetrieveUserData from './retrieveUserData';
import GetRepoData from './getRepoData';

const Home = () => {
  const [user, setUser] = useState("")
  const [language, setLanguage] = useState(null)
  const [error, setError] = useState(null)

  async function pagesOfRepos() {
    const totalPagesOfRepos = await RetrieveUserData(user)
    console.log(totalPagesOfRepos)
    return totalPagesOfRepos
  }

  async function getRepoData() {
    const repoData = GetRepoData(user, await pagesOfRepos())
    console.log(repoData)
    return repoData
  }

  const uniqueLanguages = async(languages) => {
    const uniqLanguages = Array.from(new Set(languages))
    return uniqLanguages
  }
    
  const countOfLanguages = async(languages, uniqueLanguages) => {
    const languageAndCount = []

    for(let i = 0; i < uniqueLanguages.length; i++){
      languageAndCount.push([uniqueLanguages[i], languages.filter((v) => (v === uniqueLanguages[i])).length])
    }

    return languageAndCount
  }

  const highestLangCount = (languageAndCount) => {
    const countOnly = languageAndCount.map(([language, count]) => count)
    const highestCount = Math.max(...countOnly)
    return highestCount
  }

  const mostUsedLanguages = async(languageAndCount, highestCount) => {
    const mostUsedLanguagesAndCount = languageAndCount.filter(([language, count]) => count === highestCount)
    const mostUsedLanguages = mostUsedLanguagesAndCount.flat().filter(l => l === null || typeof l === "string").map(l => l === null ? "No Language" : l)
    const result = mostUsedLanguages.join(" / ")

    return result
  }

  const getResult = async() => {
    const pages = await pagesOfRepos()
    try {
      const repoData = await getRepoData(pages)
      const uniqLanguages = await uniqueLanguages(repoData)
      const count = await countOfLanguages(repoData, uniqLanguages)
      const highestCount = await highestLangCount(count)
      const languages = await mostUsedLanguages(count, highestCount)
      console.log(languages)
      setLanguage(languages)
    } catch(error) {
      console.error(error)
    }
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
             <button onClick={getResult} data-testid='Submit' className="add-button">Submit</button>

          <div className='body-text' data-testid='result'>
            Language(s) used the most: {language}
          </div>
      </div>
    );
  }


export default Home;
