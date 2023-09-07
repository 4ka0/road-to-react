import * as React from 'react';


const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]


// Component for a list.
const List = () => (
  <ul>
    {list.map((item) => (
      <li key={item.objectID}>
        <a href={item.url}>{item.title}</a>, {item.author} ({item.num_comments} comments, {item.points} points)
      </li>
    ))}
  </ul>
);


// Component for a search field.
const Search = () => (
  <div>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" />
  </div>
);


// The main app component.
const App = () => (
  <div>
    <h1>My Hacker Stories</h1>
    <Search />
    <br />
    <hr />
    <List />
  </div>
);

export default App;
