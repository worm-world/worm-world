import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Todo from './pages/todo';
import Import from './pages/import';
import Home from './pages/home';
import CrossPage from './pages/crossPage';
import Paths from './routes/frontend';
import Layout from './components/layout/layout';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={Paths.CrossDesignerPath} element={<CrossPage />} />
          <Route path={Paths.HomePath} element={<Home />} />
          <Route path={Paths.TodoPath} element={<Todo />} />
          <Route path={Paths.ImportPath} element={<Import />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
