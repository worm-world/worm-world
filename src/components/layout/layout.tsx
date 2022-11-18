import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../sideNav/sideNav';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import styles from './layout.module.css';

const drawerWidth = 240;

const Layout = (): ReactJSXElement => {
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
        <Outlet />
      </main>
    </>
  );
};
export default Layout;
