import * as React from 'react';


// A custom hook for a value to be updated and stored in local storage.
// The "key" is a unique identifier for the value in question in the storage.
// This allows this hook to be used for more than one purpose hereafter.
// I.e. for the searchTerm and also possibly for other variables.
const useStorageState = (key, initialState) => {

  // The React useState hook is used for managing the state of a searched term.
  // The initial state of "value" (searched term) is either retrieved from local
  // storage if it exists there or is set to the given initialState.
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  // The React useEffect hook us used to trigger a side-effect whenever "value"
  // (searched term) changes. The most recent "value" is stored in the browser
  // so as to be remembered if the user closes the browser page.
  // useEffect takes two args. The first is the actual side-effect that is run.
  // The second is an array of variables. If any of the variables change, the
  // side-effect is run.
  React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]
  );

  return [value, setValue];
};


// The main app component.
const App = () => {

  // Available developer stories.
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
    {
      title: "Apple Jam",
      url: "https://redux.js.org/",
      author: "Bryan Bookstaff",
      num_comments: 4,
      points: 3,
      objectID: 2,
    },
  ]

  // Uses the custom hook declared above.
  // "search" is passed as a key underwhich searchTerm is stored in local storage.
  // "" is the initial state os searchTerm.
  const [searchTerm, setSearchTerm] = useStorageState("search", "");

  // An event handler that is used as a callback handler for information to be
  // passed from a child to a parent component (here, the information is an event
  // generated by keyboard input in the input field in the Search component).
  const handleSearch = (event) => {
    // Update state of searchTerm.
    setSearchTerm(event.target.value);
  };

  // Filters the available stories by the current searchTerm defined in the
  // above state handler.
  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>My Hacker Stories</h1>

      {/* Above handleSearch event handler passed to the Search component.
          The current searchTerm is also passed down. */}
      <Search search={searchTerm} onSearch={handleSearch} />

      <br />
      <hr />

      <List list={searchedStories} />

    </>
  );
};


// Component for a search field.
const Search = ({ search, onSearch }) => {
  return (
    <>
      <label htmlFor="search">Search: </label>

      {/* By passing the current searchTerm down from App to here, the current
          state of searchTerm can be explicitly set as the value of the below
          input field.
          The onChange event is passed via props to onSearch defined in the
          Search instantiation. This process of passing state from a child
          component to the parent component is called "lifting state". */}
      <input id="search" type="text" value={search} onChange={onSearch} />
    </>
  );
};


// Component for displaying a list of stories.
// Instead of passing "props" to this component and then using "props.list" in
// the component, it is more conventional to use JS object destructuring in the
// component's function signature "{ list }" to make it possible to then simply
// use "list" instead of "props.list".
const List = ({ list }) => {
  return (
    <ul>
      {list.map((item) => {
        return (
          <Item key={item.objectID} item={item} />
        );
      })}
    </ul>
  );
};


// Component for displaying an individual item of a list.
const Item = ({ item }) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>; {item.author}</span>
      <span>; {item.num_comments} comments</span>
      <span>; {item.points} points</span>
    </li>
  );
};


export default App;
