import * as React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link}
    from 'react-router-dom';
import { Cross } from './components/Cross';
import Todo from './pages/todo';
import Import from './pages/import';
import Home from './pages/home';
import CrossPage from './pages/crossPage';
import Paths from './routes/frontend'

function App() {
  return (
    <div>
    <Router>
      {/*Make sure to put the NavBar component inside the router component*/}
      <Link to={Paths.CrossDeignerPath}>
        Take Me To Cross!<br></br>
      </Link>
      <Link to={Paths.TodoPath}>
        Take Me To Todo!<br></br>
      </Link>
      <Link to={Paths.ImportPath}>
        Take Me To import!<br></br>
      </Link>
      <Routes>
        <Route path={Paths.CrossDeignerPath} element={<CrossPage />} />
        <Route path={Paths.HomePath} element={<Home />} />
        <Route path={Paths.TodoPath} element={<Todo/>} />
        <Route path={Paths.ImportPath} element={<Import/>} />
        test
      </Routes>
    </Router>
    </div>
  );
}

export default App;