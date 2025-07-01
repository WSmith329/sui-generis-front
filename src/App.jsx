import { BrowserRouter } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import { Main } from './components';
import Navbar from './components/shared/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <div id='app-container'>
        <main id='main-container'>
          <Navbar />
          <Main />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
