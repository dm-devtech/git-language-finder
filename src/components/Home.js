import React, { useState } from 'react';

function Home() {
  const [user, setUser] = React.useState("");

  const handleSubmit = (e) => {
     e.preventDefault();
     alert(`Submitting User: ${user}`)
   }

  return (
    <div>
     <h1>Git Hub Language Finder</h1>

     <form onSubmit={handleSubmit}>
      <textarea
        onChange={(e) => setUser(e.target.value)}
        data-testid='input-field'
        style={{width: "200px"}}
        name='user'
        value={user}
       />
      <button type='submit' data-testid='Submit'>Submit</button>
     </form>
    </div>
    );
  }

export default Home;
