const retrieveUserData = async(user) => {
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
    const totalPagesOfRepos = Math.ceil(userData.public_repos/100)
    return totalPagesOfRepos
  }

module.exports = retrieveUserData