import React, { useState } from 'react';
import './app.scss';
import background from './images/background.jpg';

function App() {
  const [time, setTime] = useState(Date.now());
  function handleClick() {
    setTime(Date.now());
  }
  return (
    <div className="App">
      <label>Time: {time}</label>
      <button onClick={handleClick}>update</button>
      <img className="background" src={background} alt="Chongqing" title="2 years"/>
    </div>
  );
}

export default App;