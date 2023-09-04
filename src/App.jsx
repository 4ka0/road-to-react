import * as React from 'react';

const date = {
  year: "2023",
  month: "September",
  day: "4",
};

function getGreeting(name) {
  return "Hi, " + name + ".";
  return "Hi, {name}.";
}

function App() {
  return (
    <div>
      <h1>
        {getGreeting("Jon")}
        <br />
        Today is {date.month} {date.day}, {date.year}.
      </h1>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
