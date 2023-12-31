import * as React from "react";
import axios from "axios";


// A custom hook for a value to be updated and stored in local storage.
// The "key" is a unique identifier for the value in question in the storage.
// This allows this hook to be used for more than one purpose hereafter.
// I.e. for the searchTerm and also possibly for other variables.
const useStorageState = (key, initialState) => {

  // The React useState hook is used for managing the state of the value in
  // question. The initial state of "value" (searched term) is either retrieved
  // from local storage if it exists there or is set to the given initialState.
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  // The React useEffect hook is used to trigger a side-effect whenever "value"
  // (searched term) changes. Basically, when the search term changes (a char is
  // entered or deleted), the most recent "value" is stored in the browser so as
  // to be remembered if the user closes the browser page.
  // useEffect is ahook that for synchronizing a component with an external
  // system such as local browser storage or an external API.
  // useEffect takes two args. The first is the actual side-effect that is run.
  // The second is an array of variables. If any of the variables change, the
  // side-effect is run.
  React.useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]
  );

  return [value, setValue];
};


// Hacker News API endpoint.
const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";


// Reducer function to handle state for the stories.
// A reducer is used when managing the state of more than one related item
// (in this case retrieving the list of stories, fetching error, loading state,
// and a remove function. This helps to avoid impossible states arising as the
// values for each state can be more finely controlled.
// In comparison, the useState hook is used when managing the state of one item.
const storiesReducer = (state, action) => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      console.log(state);
      return {
        ...state,  // Spread operator to include everything from "state" object.
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

  // STATEFUL VARIABLES

  // The stories.
  // Is stateful since the list changes based on the user search term.
  // Uses the above reducer to manage state for the list of stories
  // and also for conditional display for while data is retrieved and for if
  // there is an error when retrieving the data.
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    // Initial values.
    {
      data: [],  // An array to hold the list of stories. Empty at first.
      isLoading: false,
      isError: false,
    }
  );

  // The search term.
  // Is stateful since the user search term changes.
  // Uses the custom hook declared above.
  // "search" is passed as a key underwhich searchTerm is stored in local storage.
  // "" is the initial state as searchTerm.
  const [searchTerm, setSearchTerm] = useStorageState("search", "");

  // The API URL
  // Is stateful since the user search term changes.
  // Hook to set the URL to be used.
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  // EVENT HANDLERS

  // Memoized function used for fetching data.
  // Memoized functions are useful for moving reusable code to outside of a
  // side-effect hook. Used in the side-effect hook after this function, but can
  // also be used elsewhere if necessary.
  // Uses async/await and axios.
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    try{
      const result = await axios.get(url);
      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  // Side-effect hook to fetch stories from the API.
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);


  // An event handler to remove an item from the list.
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: item,
    });
  };

  // An event handler that is used as a callback handler for information to be
  // passed from a child to a parent component (here, the information is an event
  // generated by keyboard input in the input field in the Search component).
  // Updates the state of the search term everytime a key is pressed.
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();  // To prevent browser default page reload.
  };

  return (
    <>
      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

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
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

    </>
  );
};


const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => {
  return (
    <>
      <form onSubmit={onSearchSubmit} >

        <InputWithLabel
          id="search"
          value={searchTerm}
          onInputChange={onSearchInput}
          isFocused  // Just using "isFocused" is the same as "isFocused={true}"
        >
            <strong>Search:</strong>
        </InputWithLabel>

        &nbsp;

        <button type="submit" disabled={!searchTerm} >
          Submit
        </button>

      </form>
    </>
  );
};


// Component for displaying an input field with a label.
// Used in the SeachForm component above.
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
          char is entered/deleted), this is passed through the parent components
          to the handleSearchInput event handler defined in App.
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
          Remove
        </button>
      </span>
    </li>
  );
};


export default App;
