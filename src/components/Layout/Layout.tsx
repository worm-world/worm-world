import { useState } from 'react';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import SideNav from 'components/SideNav/SideNav';

const drawerWidth = 240;

const Layout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactJSXElement => {
  const [sideNavIsOpen, setsideNavIsOpen] = useState<boolean>(true);

  const sideNavOpenStyles = {
    height: '100%',
    marginLeft: drawerWidth,
  };
  const sideNavClosedStyles = {
    height: '100%',
    marginLeft: '0px',
  };
  const toggleNavbar = (): void => setsideNavIsOpen(!sideNavIsOpen);

  return (
    <main>
      <SideNav drawerWidth={drawerWidth} isOpen={sideNavIsOpen} />
      <div
        style={sideNavIsOpen ? sideNavOpenStyles : sideNavClosedStyles}
        data-testid='layout-menu'
      >
        <Button
          style={{
            paddingTop: '35px',
            paddingBottom: '35px',
            zIndex: 999,
            boxShadow: 'none',
            position: 'absolute',
          }}
          onClick={toggleNavbar}
        >
          <MenuIcon />
        </Button>
        {children}
      </div>
    </main>
  );
};
export default Layout;
