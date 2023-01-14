import { Link, To } from 'react-router-dom';
import { BiShareAlt as AccountTreeIcon, BiCalendar as EventNoteIcon, BiData as Dataset  } from 'react-icons/bi';
import { Key } from 'react';
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
    icon: <AccountTreeIcon className='text-2xl'/>,
  },
  { name: 'Scheduler', path: '/scheduler', icon: <EventNoteIcon  className='text-2xl'/> },
  { name: 'Data Manager', path: 'data-manager/gene', icon: <Dataset className='text-2xl'/> },
];

const getListItems = (): JSX.Element[] => {
  return SideNavItems.map((item) => (
    <li key={item.name as Key} >
      <Link to={item.path as To} className='pl-5'>
        {item.icon}
        {item.name}
      </Link>
    </li>
  ));
};

const SideNav = (props: SideNavProps): JSX.Element => {
  return (
    <div className='drawer-side' style={{ width: props.drawerWidth }}>
      <label htmlFor="nav-drawer" className="drawer-overlay opacity-0"></label>
      <ul className="menu w-full">
        <li key="wormworld" >
          <Link to={'/' as To}>
            <h4 className='text-4xl pl-2 text-center'>
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
