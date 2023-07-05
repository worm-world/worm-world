import { Link } from 'react-router-dom';
import { BiCalendar, BiData } from 'react-icons/bi';
import { TbBinaryTree } from 'react-icons/tb';
import { useEffect } from 'react';
import { themeChange } from 'theme-change';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.JSX.Element;
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

const NavItems = (): React.JSX.Element => {
  return (
    <>
      {navItems.map((item) => (
        <li key={item.name}>
          <Link
            to={item.path}
            className='pl-5'
            onClick={() => document.getElementById('nav-drawer')?.click()}
          >
            {item.icon}
            {item.name}
          </Link>
        </li>
      ))}
    </>
  );
};

const allThemes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
];

const Layout = (props: LayoutProps): React.JSX.Element => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <div className='drawer h-screen w-screen'>
      <input id='nav-drawer' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content h-full'>{props.children}</div>

      <div className='drawer-side z-50' data-testid='side-drawer'>
        <label htmlFor='nav-drawer' className='drawer-overlay' />
        <div className='flex h-screen flex-col justify-between bg-base-100'>
          <ul className='menu p-4'>
            <li key='wormworld'>
              <Link
                to={'/'}
                onClick={() => document.getElementById('nav-drawer')?.click()}
              >
                <img
                  alt='WormWorld'
                  src='/wormworld_logo.svg'
                  className='w-56'
                />
              </Link>
            </li>
            <div className='divider' />
            <NavItems />
          </ul>
          <div className='p-4'>
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
