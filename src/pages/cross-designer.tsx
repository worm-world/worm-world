import Tab from '@mui/material/Tab';
import { TopNav } from 'components/TopNav/TopNav';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import React from 'react';
import CrossFlow from 'components/CrossFlow/CrossFlow';
import { Box, Divider } from '@mui/material';

const CrossPage = (): JSX.Element => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(true);

  return (
    <div className='h-screen flex flex-col'>
      <TopNav title={'Cross Designer'}>
        <Tab label='New Cross' />
        <Tab label='Open Cross' />
        <Tab label='Export Cross' />
      </TopNav>
      <Divider />
      <div className='grow'>
        <div className='pb-2 w-full h-full'>
          <CrossFlow className={'border-b-2 p'} />
        </div>
        <RightDrawer
          className={'shrink'}
          initialDrawerWidth={240}
          isOpen={rightDrawerOpen}
          maxWidth={400}
          close={() => setRightDrawerOpen(false)}
        >
          <Box sx={{ width: 1 }}>{}</Box>
        </RightDrawer>
      </div>
    </div>
  );
};

export default CrossPage;
