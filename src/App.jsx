import * as React from 'react';


// Component for a list.
const List = (props) => {
  return (
    <ul>
      {props.list.map((item) => {
        return (
          <Item key={item.objectID} item={item}/>
        );
      })}
    </ul>
  )
};


const Item = (props) => {
  return (
    <li>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>; {props.item.author}</span>
      <span>; {props.item.num_comments} comments</span>
      <span>; {props.item.points} points</span>
    </li>
  )
};


// Component for a search field.
const Search = () => {

  const handleChange = (event) => {
    console.log(event);
    console.log(event.target.value);
  }

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
    </div>
  )
};


// The main app component.
const App = () => {

  const stories = [
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

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search />
      <br />
      <hr />
      <List list={stories}/>
    </div>
  )
};

export default App;
