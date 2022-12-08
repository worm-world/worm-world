import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from 'components/TopNav/TopNav';
import { Routes, Route } from 'react-router-dom';
import Temp from './temp';

const Todo = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Scheduler'} tabIndex={1}>
        <Tab label='View Single Cross' />
        <Tab label='Open ToDo' />
        <Tab label='Import Cross' />
      </TopNav>
      <Routes>
        <Route path='/temp' element={<Temp />} />
      </Routes>
    </div>
  );
};

export default Todo;
