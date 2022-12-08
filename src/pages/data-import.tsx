import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from 'components/TopNav/TopNav';
import { Routes, Route } from 'react-router-dom';
import Temp from './temp';

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
        <Route path='/temp' element={<Temp />} />
      </Routes>
    </div>
  );
};

export default Import;
