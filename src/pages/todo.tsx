import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from '../components/TopNav/TopNav';
import { Routes, Route } from 'react-router-dom';
import Paths from '../routes/frontend';
import Home from './home';

const Todo = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Scheduler'} tabIndex={1}>
        <Tab label='View Single Cross' />
        <Tab label='Open ToDo' />
        <Tab label='Import Cross' />
      </TopNav>
      <Routes>
        <Route path={Paths.HomePath} element={<Home />} />
      </Routes>
    </div>
  );
};

export default Todo;
