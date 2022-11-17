import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../sideNav/sideNav';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 240;

export default function Layout(): JSX.Element {
  const [sideNavIsOpen, setsideNavIsOpen] = useState<boolean>(true);
  const toggleNavbar = (): void => setsideNavIsOpen(!sideNavIsOpen);
  return (
    <>
      <SideNav drawerWidth={drawerWidth} isOpen={sideNavIsOpen} />
      <main style={{ marginLeft: sideNavIsOpen ? drawerWidth : 0 }}>
        <Button onClick={toggleNavbar}>
          <MenuIcon />
        </Button>
        <Outlet />
      </main>
    </>
  );
}
