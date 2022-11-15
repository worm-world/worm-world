import Tab from '@mui/material/Tab';
import React from 'react';
import { TopNav } from '../components/TopNav/TopNav';

const CrossPage = (): JSX.Element => {
  return (
    <TopNav title={'Cross Designer'}>
      <Tab label='New Cross' />
      <Tab label='Open Cross' />
      <Tab label='Export Cross' />
    </TopNav>
  );
};

export default CrossPage;
