import {Link} from 'react-router-dom'
import Paths from '../routes/frontend';

function Navbar(): JSX.Element {
  return (
      <nav id='navbar'>
        <div id='title'>
        <Link to={Paths.HomePath}>
          WormWorld
         </Link>
        </div>
        <div id='nav-items'>
          <Link to={Paths.CrossDesignerPath}>
            <div className='nav-item'>Designer</div>
          </Link>
          <Link to={Paths.TodoPath}>
            <div className='nav-item'>Scheduler</div>
          </Link>
          <Link to={Paths.ImportPath}>
            <div className='nav-item'>Data Manager</div>
          </Link>
        </div>
      </nav>
  );
};

export default Navbar;
