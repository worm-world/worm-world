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
import styles from './sideNav.module.css';

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
  { name: 'Data Manager', path: 'data-manager/gene', icon: <Dataset /> },
];

const getListItems = (): ReactJSXElement[] => {
  return SideNavItems.map((item) => (
    <li>
      <Link key={item.name as Key} to={item.path as To}>
        {item.icon}
        {item.name}
      </Link>
    </li>
  ));
};

// const SideNav = (props: SideNavProps): ReactJSXElement => {
//   return (
//     <Drawer
//       sx={{
//         width: props.drawerWidth,
//         flexShrink: 0,
//         '& .MuiDrawer-paper': {
//           width: props.drawerWidth,
//           boxSizing: 'border-box',
//         },
//       }}
//       variant='persistent'
//       anchor='left'
//       open={props.isOpen}
//     >
//       {navHeader()}
//       <ul className="menu bg-base-100 w-full">
//         {getListItems()}
//       </ul>
//     </Drawer>
//   );
// };

const SideNav = (props: SideNavProps): ReactJSXElement => {
  return (
    <div className='drawer-side' style={{ width: props.drawerWidth }}>
      <label htmlFor="nav-drawer" className="drawer-overlay"></label>
      <ul className="menu bg-base-100 w-full">
        <li>
          <Link to={'/' as To}>
            <h4 className='text-4xl text-center'>
              <div className={styles.wormworld}>WormWorld</div>
            </h4>
          </Link>
        </li>
        {getListItems()}
      </ul>
    </div>
  );
};

export default SideNav;
