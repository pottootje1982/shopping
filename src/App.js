import React from 'react';
import logo from './logo.svg';
import './App.css';
import Timer from "./Components/Timer";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> 
      </header>
      <Timer></Timer>
    </div>
  );
}

export default App;
