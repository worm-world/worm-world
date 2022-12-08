import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';

const Import = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Data Upload'}>
        <Tab label='Gene' component={Link} to='insert-gene' />
        <Tab label='Variation' component={Link} to='insert-variation' />
        <Tab label='Allele' component={Link} to='insert-allele' />
        <Tab label='Phenotype' component={Link} to='insert-phenotype' />
        <Tab label='Condition' component={Link} to='insert-condition' />
        <Tab
          label='Allele Expression'
          component={Link}
          to='insert-allele-expression'
        />
        <Tab
          label='Expression Relation'
          component={Link}
          to='insert-expression-relation'
        />
      </TopNav>
      <Outlet />
    </div>
  );
};

export default Import;
