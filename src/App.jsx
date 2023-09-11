import * as React from 'react';


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

  // Event handler for Search in App.
  // Receives event from event handler in Search.
  const handleSearch = (event) => {
    console.log(event.target.value);
  };

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search onSearch={handleSearch} />

      <br />
      <hr />

      <List list={stories}/>

    </div>
  );
};


// Component for a search field.
const Search = (props) => {

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    // Provides event for onSearch event in App as prop.
    props.onSearch(event);
  }

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={handleChange} />
      <p>
        Searching for <strong>&quot;{searchTerm}&quot;</strong>.
      </p>
    </div>
  );
};


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
  );
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
  );
};


export default App;
