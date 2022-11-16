import { Link } from 'react-router-dom';
import Paths from '../../routes/frontend';
import { List, ListItem, ListItemIcon, ListItemButton, ListItemText, Drawer } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DataSetIcon from '@mui/icons-material/Dataset';
import EventNoteIcon from '@mui/icons-material/EventNote';
import './sideNav.css';
import { Typography } from '@mui/material';

interface SideNavProps {
  isOpen: boolean;
  drawerWidth: number;
}

let SideNavItems: { name: string, path: string, icon: JSX.Element}[] = [
  {name: 'Cross Designer', path: Paths.CrossDesignerPath, icon: <AccountTreeIcon />},
  {name: 'Scheduler', path: Paths.TodoPath, icon: <EventNoteIcon />},
  {name: 'Data Manager', path: Paths.ImportPath, icon: <DataSetIcon /> },
]

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
        <Typography component={Link} to={Paths.HomePath} id='side-nav-title'>WormWorld</Typography>
        <List id='side-nav-list'>
          {SideNavItems.map((item) => (
            <ListItem key={item.name} component={Link} to={item.path} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>))
          }
        </List>
      </Drawer>
    </>
  );
}

export default SideNav;
