import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from '../components/TopNav/TopNav';
import { Routes, Route } from 'react-router-dom';
import Paths from '../routes/frontend';
import Home from './home';

const Import = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Data Upload'}>
        <Tab label='Genotype' />
        <Tab label='Allele' />
        <Tab label='Phenotype' />
        <Tab label='Strain' />
      </TopNav>
      <Routes>
        <Route path={Paths.HomePath} element={<Home />} />
      </Routes>
    </div>
  );
};

export default Import;
