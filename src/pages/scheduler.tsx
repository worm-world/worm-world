import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';

const Todo = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Scheduler'} tabIndex={1}>
        <Tab
          label='View Single Cross'
          component={Link}
          to='single-cross-view'
        />
        <Tab label='ToDo' component={Link} to='todo' />
      </TopNav>
      <div className='px-6 pt-2'>
        <Outlet />
      </div>
    </div>
  );
};

export default Todo;
