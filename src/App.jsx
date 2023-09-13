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
  // (searched term) changes. Basically, when the search term changes (a char is
  // entered or deleted, the most recent "value" is stored in the browser so as
  // to be remembered if the user closes the browser page.
  // useEffect takes two args. The first is the actual side-effect that is run.
  // The second is an array of variables. If any of the variables change, the
  // side-effect is run.
  React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]
  );

  return [value, setValue];
};


// Developer stories.
const initialStories = [
  {
    objectID: 0,
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
  },
  {
    objectID: 1,
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
  },
  {
    objectID: 2,
    title: "Alpine JS",
    url: "https://redux.js.org/",
    author: "Raymond Wigshaw",
    num_comments: 4,
    points: 3,
  },
  {
    objectID: 3,
    title: "Bootstrap",
    url: "https://redux.js.org/",
    author: "Susan Flywheel",
    num_comments: 4,
    points: 3,
  },
  {
    objectID: 4,
    title: "Django",
    url: "https://redux.js.org/",
    author: "Jennifer Workgray",
    num_comments: 4,
    points: 3,
  },
  {
    objectID: 5,
    title: "Django Rest Framework",
    url: "https://redux.js.org/",
    author: "Jimbo Greenchin",
    num_comments: 4,
    points: 3,
  },
]


// A promise for an object holding a list of stories.
// Set up so as to simulate calling an external API (e.g. with a delay of 1 sec)
// to receive a list of stories.
const getAsyncStories = () =>
  new Promise((resolve, reject) =>
    setTimeout(reject, 2000)
  );


// Reducer function to handle state for the stories.
// A reducer is used when managing the state of more than one related item
// (in this case retrieving the list of stories, errors, loading state, and CRUD
// functions therefor). This helps to avoid impossible states arising as the
// values for each state can be more finely controlled.
// In comparison, the useState hook is used when managing the state of one item.
const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,  // Spread operator used to include everything from the "state" object.
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
      case "STORIES_FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter(
            (story) => action.payload.objectID !== story.objectID
          ),
        };
    default:
      throw new Error();
  }
};


// The main app component.
const App = () => {

  // Uses the above reducer to manage state for the list of stories
  // and also for conditional display for while data is retrieved and for if
  // there is an error when retrieving the data.
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {
      data: [],  // An array to hold the list of stories.
      isLoading: false,
      isError: false,
    }
  );

  // An empty array of stories is initially used when rendering the components,
  // and then the stories are fetched asynchronously using the side-effect hook
  // shown below.
  // The loading indicator is set to true/false accordingly therein.
  React.useEffect(() => {

    dispatchStories({ type: "STORIES_FETCH_INIT" });

    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data.stories,
        });
      })
      .catch(() =>
        dispatchStories({ type: "STORIES_FETCH_FAILURE" })
      );
  }, []);

  // An event handler to remove an item from the list.
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };


  // SEARCH FUNCTIONALITY.

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
  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>My Hacker Stories</h1>

      {/* Above handleSearch event handler passed to the Search component.
          The current searchTerm is also passed down.
          Just using "isFocused" is the same as "isFocused={true}" */}
      <InputWithLabel
        id="search"
        type="text"
        value={searchTerm}
        onInputChange={handleSearch}
        isFocused
      >
          <strong>Search:</strong>
      </InputWithLabel>

      <br />
      <hr />

      {/* Conditional rendering based on "isError".
          If true, an error message is displayed.
          If false, nothing is displayed. */}
      {stories.isError ? (
        <p>Data could not be loaded.</p>
      ) : (
        null
      )}

      {/* Conditional rendering based on "isLoading".
          If true, a loading indicator is displayed.
          If false, the list of stories is displayed. */}
      {stories.isLoading ? (
        <p>Loading data ...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}

    </>
  );
};


// Component for displaying an input field with a label.
// Designed to be reusable for different kinds of input fields, but in the case
// of this app, this is just used for the search field which accepts text.
// The "children" prop passes everthing included between the <InputWithLabel>
// opening and closing tags when instantiated in App, which in this case is:
// "<strong>Search:</strong>"
const InputWithLabel = ({id, type, value, onInputChange, isFocused, children}) => {
  return (
    <>
      {/* "htmlFor" is the JSX version of the "for" attribute used in an
          ordinary HTML label tag. */}
      <label htmlFor={id}>{children}</label>

      &nbsp;

      {/* By passing the current searched term from App to here as the "value",
          this can be explicitly set as the value of the below input field.

          If an onChange event occurs in the input field (basically if a single
          char is entered/deleted), this is passed to onInputChange which is
          defined in the InputWithLabel instantiation in App, and is then
          handled by handleSearch.
          This process of passing state from a child component to the parent
          component is called "lifting state". */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        autoFocus={isFocused}
      />
    </>
  );
};


// Component for displaying a list of stories.
// Instead of passing "props" to this component and then using "props.list" in
// the component, it is more conventional to use JS object destructuring in the
// component's function signature "{ list, onRemoveItem }" to make it possible
// to then simply use "list" instead of "props.list", "props.onRemoveItem", etc.
// "onRemoveItem" is an event handler being passed down from App to Item.
const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => {
        return (
          <Item
            key={item.objectID}
            item={item}
            onRemoveItem={onRemoveItem}
          />
        );
      })}
    </ul>
  );
};


// Component for displaying an individual item of a list.
const Item = ({ item, onRemoveItem }) => {

  // Callback handler to handle removing an item.
  const handleRemoveItem = () => {
    onRemoveItem(item);
  };

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>; {item.author}</span>
      <span>; {item.num_comments} comments</span>
      <span>; {item.points} points </span>
      <span>
        <button type="button" onClick={handleRemoveItem}>
          Delete
        </button>
      </span>
    </li>
  );
};


export default App;
