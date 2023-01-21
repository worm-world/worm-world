import { Link, To } from 'react-router-dom';
import {
  BiShareAlt as AccountTreeIcon,
  BiCalendar as EventNoteIcon,
  BiData as Dataset,
} from 'react-icons/bi';
import { Key, useEffect } from 'react';
import { themeChange } from 'theme-change';
interface SideNavProps {
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
    icon: <AccountTreeIcon className='text-2xl' />,
  },
  {
    name: 'Scheduler',
    path: '/scheduler',
    icon: <EventNoteIcon className='text-2xl' />,
  },
  {
    name: 'Data Manager',
    path: 'data-manager/gene',
    icon: <Dataset className='text-2xl' />,
  },
];

const getListItems = (): JSX.Element[] => {
  return SideNavItems.map((item) => (
    <li key={item.name as Key}>
      <Link to={item.path as To} className='pl-5'>
        {item.icon}
        {item.name}
      </Link>
    </li>
  ));
};

const allThemes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];

const SideNav = (props: SideNavProps): JSX.Element => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <div
      className={'drawer-side'}
      data-testid='side-drawer'
      style={{ width: props.drawerWidth }}
    >
      <label
        htmlFor='nav-drawer'
        className='drawer-overlay bg-transparent'
        hidden={true}
      ></label>
      <div className='flex flex-col justify-between border-r-4 border-r-base-300 bg-base-200'>
        <ul className='menu w-full'>
          <li key='wormworld'>
            <Link to={'/' as To}>
              <h4 className='pl-2 text-center text-4xl'>WormWorld</h4>
            </Link>
          </li>
          {getListItems()}
        </ul>
        <div className='pb-5 pl-5'>
          <label className='label'>Theme</label>
          <select className='select-bordered select' data-choose-theme>
            {allThemes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
          <div className='grid w-32 grid-cols-4 pt-2'>
            <div className='h-2 w-full bg-primary'>&nbsp;</div>
            <div className='h-2 w-full bg-secondary'>&nbsp;</div>
            <div className='h-2 w-full bg-accent'>&nbsp;</div>
            <div className='h-2 w-full bg-neutral'>&nbsp;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
