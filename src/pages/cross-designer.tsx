import Tab from '@mui/material/Tab';
import { TopNav } from 'components/TopNav/TopNav';
import CrossNode from 'components/crossNode/CrossNode';
import * as testData from 'components/crossNode/CrossNode.data';
import RightDrawer from '../components/rightDrawer/RightDrawer';
import React from 'react';

const CrossPage = (): JSX.Element => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(true);

  return (
    <>
      <TopNav title={'Cross Designer'}>
        <Tab label='New Cross' />
        <Tab label='Open Cross' />
        <Tab label='Export Cross' />
      </TopNav>
      <CrossNode {...testData.crossNode1}></CrossNode>
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
