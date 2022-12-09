import { Link, To } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Drawer,
  Typography,
} from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { Key } from 'react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Dataset } from '@mui/icons-material';

interface SideNavProps {
  isOpen: boolean;
  drawerWidth: number;
}

interface SideNavItem {
  name: String;
  path: String;
  icon: JSX.Element;
}

const SideNavItems: SideNavItem[] = [
  {
    name: 'Cross Designer',
    path: '/cross-designer',
    icon: <AccountTreeIcon />,
  },
  { name: 'Scheduler', path: '/scheduler', icon: <EventNoteIcon /> },
  { name: 'Data Manager', path: '/data-manager', icon: <Dataset /> },
];

const navHeader = (): ReactJSXElement => {
  return (
    <Link to={'/' as To}>
      <Typography variant='h4' align='center'>
        WormWorld
      </Typography>
    </Link>
  );
};

const getListItems = (): ReactJSXElement[] => {
  return SideNavItems.map((item) => (
    <Link key={item.name as Key} to={item.path as To}>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItemButton>
      </ListItem>
    </Link>
  ));
};

const SideNav = (props: SideNavProps): ReactJSXElement => {
  return (
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
      {navHeader()}
      <List>{getListItems()}</List>
    </Drawer>
  );
};

export default SideNav;
