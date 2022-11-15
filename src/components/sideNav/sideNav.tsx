import { Link } from 'react-router-dom';
import Paths from '../../routes/frontend';
import { List, Drawer, Button } from '@mui/material';
import './sideNav.css';

interface SideNavProps {
  isOpen: boolean;
  drawerWidth: number;
}

function SideNav(props: SideNavProps): JSX.Element {
  return (
    <>
      <Drawer
        sx={{
          width: props.drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: props.drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={props.isOpen}
      >
        <List id='sidenav-list'>
          <Button
            className='sidenav-button'
            component={Link}
            to={Paths.HomePath}
          >
            Home
          </Button>
          <Button
            className='sidenav-button'
            component={Link}
            to={Paths.CrossDesignerPath}
          >
            Designer
          </Button>
          <Button
            className='sidenav-button'
            component={Link}
            to={Paths.TodoPath}
          >
            Scheduler
          </Button>
          <Button
            className='sidenav-button'
            component={Link}
            to={Paths.ImportPath}
          >
            Data Manager
          </Button>
        </List>
      </Drawer>
    </>
  );
}

export default SideNav;
