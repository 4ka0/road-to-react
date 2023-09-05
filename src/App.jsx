import * as React from 'react';

const date = {
  year: "2023",
  month: "September",
  day: "4",
};

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

function getGreeting(name) {
  return "Hi, " + name + ".";
}

function App() {
  return (
    <div>
      <p>

        {getGreeting("Jon")}

        <br /><br />

        Today is {date.month} {date.day}, {date.year}.

        <br /><br />

        Iterating through a list of JavaScript objects using map():
        <ul>
          {list.map(function (item) {
            return (
              <li key={item.objectID}>
                <a href={item.url}>{item.title}</a>, {item.author} ({item.num_comments} comments, {item.points} points)
              </li>
            );
          })}
        </ul>

      </p>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
