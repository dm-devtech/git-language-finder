const getRepoData = async(user, numberOfPages) => {
    const apiToken = process.env.REACT_APP_TOKEN

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

module.exports = getRepoData