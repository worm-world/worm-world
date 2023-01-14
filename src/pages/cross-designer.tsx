import { TopNav } from 'components/TopNav/TopNav';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import React from 'react';
import CrossFlow from 'components/CrossFlow/CrossFlow';

const CrossPage = (): JSX.Element => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(true);

  return (
    <div className='h-screen flex flex-col'>
      <TopNav title={'Cross Designer'}>
        <span>New Cross</span>
        <span>Open Cross</span>
        <span>Export Cross</span>
      </TopNav>
      <div className='grow'>
        <div className='pb-2 w-full h-full'>
          <CrossFlow className={'border-b-2 p bg-zinc-50'} />
        </div>
        <RightDrawer
          className={'shrink'}
          initialDrawerWidth={240}
          isOpen={rightDrawerOpen}
          maxWidth={400}
          close={() => setRightDrawerOpen(false)}
        >
        </RightDrawer>
      </div>
    </div>
  );
};

export default CrossPage;
