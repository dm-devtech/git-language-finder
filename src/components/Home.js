import React from 'react';

const Home = ({props}) =>
   (
    <div>
     <h1>Git Hub Language Finder</h1>

     <form onSubmit={props}>
      <textarea
        data-testid='input-field'
        style={{width: "200px"}}
       />
      <button type='submit' data-testid='Submit'>Submit</button>
     </form>
    </div>
    );

export default Home;
