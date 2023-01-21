import { useState } from 'react';
import { BiMenu as MenuIcon } from 'react-icons/bi';
import SideNav from 'components/SideNav/SideNav';

const drawerWidth = 240;
const drawerWidthAdjusted = drawerWidth - 8;

const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [sideNavIsOpen, setsideNavIsOpen] = useState<boolean>(true);

  const sideNavOpenStyles = {
    height: '100%',
    marginLeft: drawerWidthAdjusted,
  };
  const sideNavClosedStyles = {
    height: '100%',
    marginLeft: '0px',
  };
  const toggleNavbar = (): void => setsideNavIsOpen(!sideNavIsOpen);

  return (
    <main>
      <div className='drawer'>
        <input
          id='nav-drawer'
          type='checkbox'
          className='drawer-toggle'
          readOnly
          checked={sideNavIsOpen}
        />
        <div className='drawer-content'>
          <div
            className='transition-[margin-left]'
            style={sideNavIsOpen ? sideNavOpenStyles : sideNavClosedStyles}
            data-testid='layout-menu'
          >
            <label
              className='drawer-button absolute z-50 p-4'
              htmlFor='nav-drawer'
              onClick={() => setTimeout(toggleNavbar, 50)}
            >
              <button>
                <MenuIcon className='text-2xl' />
              </button>
            </label>
            {children}
          </div>
        </div>
        <SideNav drawerWidth={drawerWidth} />
      </div>
    </main>
  );
};
export default Layout;
