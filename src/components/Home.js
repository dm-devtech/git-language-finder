import React, { Component } from 'react';

class Home extends Component {
  constructor(){
    super();
    this.state = {
      user: "",
      language: "-"
    }
  }

  async retrieveUserData(){
    const apiToken = process.env.REACT_APP_TOKEN

    const userLink = `https://api.github.com/users/${this.state.user}`
    const userData = await fetch(userLink,
      {
        headers: {
          authorization: `token ${apiToken}`
        }
      }
    ).then(res => res.json())

    const totalUserRepos = userData.public_repos
    const totalPagesOfRepos = Math.ceil(userData.public_repos/100)
    return totalPagesOfRepos
  }

  async retrieveRepos() {
    const apiToken = process.env.REACT_APP_TOKEN
    const totalPagesOfRepos = await this.retrieveUserData()
    const allLanguages = []

    for(let i = 1; i <= totalPagesOfRepos; i++){
      const link = `https://api.github.com/users/${this.state.user}/repos?page=${i}&per_page=100`
      const data = await fetch(link,
        {
          headers: {
            authorization: `token ${apiToken}`
          }
        }
      ).then(res => res.json())
      const languagesArray = data.map(repo => repo.language)
      allLanguages.push(languagesArray)
    }

    const message = "Not Found"
    const response = await fetch(`https://api.github.com/users/${this.state.user}/repos`, {
        headers: {
          authorization: `token ${apiToken}`
        }
      }).then(res => res)
    return response.status !== 200 ? message : allLanguages.flat()
  }

  async checkResult() {
    const languages = await this.retrieveRepos()
    if(languages === "Not Found"){
      return []
    } else {
      return languages
    }
  }

  async countOfLanguages() {
    const languages = await this.checkResult()
    const uniqLanguages = Array.from(new Set(languages))
    const languageAndCount = []
    const countOnly = []

    for(let i = 0; i < uniqLanguages.length; i++){
      countOnly.push(languages.filter((v) => (v === uniqLanguages[i])).length)
      languageAndCount.push([uniqLanguages[i], languages.filter((v) => (v === uniqLanguages[i])).length])
    }

    return [countOnly, languageAndCount]
  }

  async mostUsedLanguages() {
    const [countOnly, languageCount] = await this.countOfLanguages()
    const highestCount = Math.max(...countOnly)
    const mostUsedLanguagesAndCount = languageCount.filter(([language, count]) => count === highestCount)
    const mostUsedLanguages = mostUsedLanguagesAndCount.flat().filter(l => l === null || typeof l === "string").map(l => l === null ? "No Language" : l)

    const result = mostUsedLanguages.join(" / ")

    result === "" ? this.setState({language: "Not Found"}) : this.setState({language: result})
    return result
  }

  submitHandler = (event) => {
    event.preventDefault();
    alert("Submitting User: " + this.state.user);
    this.mostUsedLanguages()
  }

  changeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  async componentDidMount() {
    const languages = await this.mostUsedLanguages()
    this.setState({language: languages})
  }

  render() {
    return (
      <div>
        <h1>Git Hub Language Finder</h1>
          <form onSubmit={this.submitHandler}>
            <input
              type='text'
              onChange={this.changeHandler}
              data-testid='input-field'
              name='user'
             />
             <input type='submit' data-testid='Submit' className="add-button"/>
          </form>

          <div className='body-text' data-testid='result'>
            Language(s) used the most: {this.state.language}
          </div>
      </div>
    );
  }
}

export default Home;
