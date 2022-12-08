import Tab from '@mui/material/Tab';
import React from 'react';
import { TopNav } from 'components/TopNav/TopNav';
import { Routes, Route } from 'react-router-dom';
import Temp from './temp';

const CrossPage = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Cross Designer'}>
        <Tab label='New Cross' />
        <Tab label='Open Cross' />
        <Tab label='Export Cross' />
      </TopNav>
      <Routes>
        <Route path='/temp' element={<Temp />} />
      </Routes>
    </div>
  );
};

export default CrossPage;
