import { TopNav } from 'components/TopNav/TopNav';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import React from 'react';
import CrossFlow from 'components/CrossFlow/CrossFlow';

const CrossPage = (): JSX.Element => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(true);

  return (
    <div className='drawer drawer-end'>
      <input
        id='right-cross-drawer'
        type='checkbox'
        className='drawer-toggle'
        readOnly
        checked={rightDrawerOpen}
      />
      <div className='drawer-content flex h-screen flex-col'>
        <TopNav title={'Cross Designer'}>
          <span key='new-cross'>New Cross</span>
          <span key='open-cross'>Open Cross</span>
          <span key='export-cross'>Export Cross</span>
        </TopNav>
        <div className='grow'>
          <div className='h-full w-full'>
            <CrossFlow className={''} />
          </div>
        </div>
      </div>
      <div className={'drawer-side drawer-end h-full '}>
        <label
          htmlFor='right-cross-drawer'
          className='drawer-overlay'
          onClick={() => setRightDrawerOpen(false)}
        ></label>
        <RightDrawer
          // className={'shrink'}
          initialDrawerWidth={240}
          isOpen={rightDrawerOpen}
          maxWidth={400}
          close={() => setRightDrawerOpen(false)}
        ></RightDrawer>
      </div>
    </div>
  );
};

export default CrossPage;
