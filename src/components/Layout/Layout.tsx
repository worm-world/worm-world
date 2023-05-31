import { Link, type To } from 'react-router-dom';
import { BiCalendar, BiData } from 'react-icons/bi';
import { TbBinaryTree } from 'react-icons/tb';
import { type Key, useEffect } from 'react';
import { themeChange } from 'theme-change';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  {
    name: 'Cross Designs',
    path: '/',
    icon: <TbBinaryTree className='text-2xl' />,
  },
  {
    name: 'Schedules',
    path: '/schedules/todo',
    icon: <BiCalendar className='text-2xl' />,
  },
  {
    name: 'Data Tables',
    path: '/data-tables/genes',
    icon: <BiData className='text-2xl' />,
  },
];

const getListItems = (): JSX.Element[] => {
  return navItems.map((item) => (
    <li key={item.name as Key}>
      <Link
        to={item.path as To}
        className='pl-5'
        onClick={() => document.getElementById('nav-drawer')?.click()}
      >
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
  // 'synthwave',
  // 'retro',
  // 'cyberpunk',
  // 'valentine',
  // 'halloween',
  // 'garden',
  // 'forest',
  // 'aqua',
  // 'lofi',
  // 'pastel',
  // 'fantasy',
  // 'wireframe',
  // 'black',
  // 'luxury',
  // 'dracula',
  // 'cmyk',
  // 'autumn',
  // 'business',
  // 'acid',
  // 'lemonade',
  // 'night',
  // 'coffee',
  // 'winter',
];

const Layout = (props: LayoutProps): JSX.Element => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <div className='drawer'>
      <input id='nav-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content'>{props.children}</div>

      <div className='drawer-side' data-testid='side-drawer'>
        <label htmlFor='nav-drawer' className='drawer-overlay'></label>
        <div className='flex h-full w-60 flex-col justify-between  bg-base-100'>
          <ul className='menu mt-4'>
            <li key='wormworld'>
              <Link
                to={'/' as To}
                onClick={() => document.getElementById('nav-drawer')?.click()}
              >
                <img
                  alt='WormWorld'
                  src='/wormworld_logo.svg'
                  className=' w-52'
                />
              </Link>
            </li>
            <div className='divider mt-0' />
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
              <div className='h-2 bg-primary'>&nbsp;</div>
              <div className='h-2 bg-secondary'>&nbsp;</div>
              <div className='h-2 bg-accent'>&nbsp;</div>
              <div className='h-2 bg-neutral'>&nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
