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

  const toggleNavbar = (): void => setsideNavIsOpen(!sideNavIsOpen);
  return (
    <>
      <SideNav drawerWidth={drawerWidth} isOpen={sideNavIsOpen} />
      <main style={{ marginLeft: sideNavIsOpen ? drawerWidth : 0 }}>
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
