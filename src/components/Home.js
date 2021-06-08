import React, { Component } from 'react';

class Home extends Component {
  constructor(){
    super();
    this.state = {
      user: "",
      language: "-"
    }
  }

  async retrieveRepos() {
    try {
      const link = `https://api.github.com/users/${this.state.user}/repos`
      const data = await fetch(link).then(res => res.json())
      const response = await fetch(link).then(res => res)
      return response.headers.status === 200 ? data : {message: "Not Found"}
    } catch (err) {
      console.error(err.message)
    }
  }

  async extractRepoLanguages() {
    const repos = await this.retrieveRepos()
    if(repos.message === "Not Found"){
      return [[{}],[{}]]
    } else {
      const languages = repos.map(repo => repo.language)
      console.log(repos, languages)
      return [repos, languages]
    }
  }

  async countOfLanguages() {
    const [repos, languages] = await this.extractRepoLanguages()
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
      <input type='submit' data-testid='Submit'/>
       <div className='result' data-testid='result'>
       Language(s) used the most: {this.state.language}
       </div>
     </form>
    </div>
    );
  }
}

export default Home;
