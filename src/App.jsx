import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [button1Count, setButton1Count] = useState(0)
  const [button2Count, setButton2Count] = useState(0)

  return (
    <>

      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Hello, Vite/React template.</h1>

      <div className="card">

        <button onClick={() => setButton1Count((button1Count) => button1Count + 1)}>
          Increment by 1 = {button1Count}
        </button>

        <button onClick={() => setButton2Count((button2Count) => button2Count + 2)}>
          Increment by 2 = {button2Count}
        </button>

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR.
        </p>

      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more.
      </p>

    </>
  )
}

export default App
