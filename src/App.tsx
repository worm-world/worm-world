import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link}
    from 'react-router-dom';
import { Cross } from './components/Cross';
import Todo from './pages/todo';
import Import from './pages/import';
import Home from './pages/home';
import CrossPage from './pages/crossPage';

function App() {
  return (
    <div>
    <Router>
      {/*Make sure to put the NavBar component inside the router component*/}
      <Link to="/cross">
        Take Me To Cross!<br></br>
      </Link>
      <Link to="/todo">
        Take Me To Todo!<br></br>
      </Link>
      <Link to="/import">
        Take Me To import!<br></br>
      </Link>
      <Routes>
        <Route path='/cross' element={<CrossPage />} />
        <Route path='/' element={<Home />} />
        <Route path='/todo' element={<Todo/>} />
        <Route path='/import' element={<Import/>} />
        test
      </Routes>
    </Router>
    </div>
  );
}

export default App;