import React from 'react';

const Home = ({props}) =>
   (
    <div>
     <h1>Git Hub Language Finder</h1>

     <form onSubmit={props}>
      <button type='submit' data-testid='Submit'>Submit</button>
     </form>
    </div>
    );

export default Home;
