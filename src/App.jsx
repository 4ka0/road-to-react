import * as React from 'react';

const date = {
  year: "2023",
  month: "September",
  day: "4",
};

const fruits = ["apples", "oranges", "lemons", "grapes", "melons"];

function getGreeting(name) {
  return "Hi, " + name + ".";
  return "Hi, {name}.";
}

function App() {
  return (
    <div>
      <p>

        {getGreeting("Jon")}

        <br /><br />

        Today is {date.month} {date.day}, {date.year}.

        <br /><br />

        Here are some of my favourite fruits:
        <ul>
          {fruits.map(fruit => { return <li>{fruit}</li> })}
        </ul>

      </p>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
