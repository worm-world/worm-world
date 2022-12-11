import Tab from '@mui/material/Tab';
import { TopNav } from 'components/TopNav/TopNav';
import CrossNode from 'components/crossNode/CrossNode';
import * as testData from 'components/crossNode/CrossNode.data';
import RightDrawer from 'components/rightDrawer/RightDrawer';
import React from 'react';
import CrossFlow from 'components/crossFlow/CrossFlow';
import { Box, Divider } from '@mui/material';

const prototypeCrossNodes = [
  <CrossNode key={1} {...testData.wildCrossNode}></CrossNode>,
  <CrossNode key={2} {...testData.crossNode1}></CrossNode>,
  <CrossNode key={3} {...testData.crossNode2}></CrossNode>,
  <CrossNode key={4} {...testData.crossNode3}></CrossNode>,
];

const CrossPage = (): JSX.Element => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(true);

  return (
    <>
      <TopNav title={'Cross Designer'}>
        <Tab label='New Cross' />
        <Tab label='Open Cross' />
        <Tab label='Export Cross' />
      </TopNav>
      <Divider />
      <Box sx={{ width: '100%', height: '100%' }}>
        <CrossFlow />
      </Box>
      <RightDrawer
        initialDrawerWidth={240}
        isOpen={rightDrawerOpen}
        maxWidth={400}
        close={() => setRightDrawerOpen(false)}
      >
        <Box sx={{ width: 1 }}>{prototypeCrossNodes}</Box>
      </RightDrawer>
    </>
  );
};

export default CrossPage;
