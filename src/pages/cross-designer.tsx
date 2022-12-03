import Tab from '@mui/material/Tab';
import React from 'react';
import { TopNav } from 'components/TopNav/TopNav';
import RightDrawer from '../components/rightDrawer/RightDrawer';

const CrossPage = (): JSX.Element => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(true)

  return (
    <>
      <TopNav title={'Cross Designer'}>
        <Tab label='New Cross' />
        <Tab label='Open Cross' />
        <Tab label='Export Cross' />
      </TopNav>
      <RightDrawer
        initialDrawerWidth={240}
        isOpen={rightDrawerOpen}
        maxWidth={300}
        close={() => setRightDrawerOpen(false)}
      ></RightDrawer>
    </>
  );
};

export default CrossPage;
