import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from '../components/TopNav/TopNav';

const Todo = (): JSX.Element => {
  return (
    <TopNav title={'Scheduler'}>
      <Tab label='View Single Cross' />
      <Tab label='Open ToDo' />
      <Tab label='Import Cross' />
    </TopNav>
  );
};

export default Todo;
