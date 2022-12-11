import { useState } from 'react';
import SideNav from 'components/sideNav/sideNav';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

const drawerWidth = 240;

const Layout = ({
  children,
}: {
  children: React.ReactNode;
}): ReactJSXElement => {
  const [sideNavIsOpen, setsideNavIsOpen] = useState<boolean>(true);

  const sideNavOpenStyles = {
    width: `100% - ${drawerWidth}`,
    height: '100%',
    marginLeft: drawerWidth,
  };
  const sideNavClosedStyles = {
    width: '100%',
    height: '100%',
    marginLeft: '0px',
  };
  const toggleNavbar = (): void => setsideNavIsOpen(!sideNavIsOpen);

  return (
    <>
      <SideNav drawerWidth={drawerWidth} isOpen={sideNavIsOpen} />
      <main style={sideNavIsOpen ? sideNavOpenStyles : sideNavClosedStyles}>
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
      </main>
    </>
  );
};
export default Layout;
