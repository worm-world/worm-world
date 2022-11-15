import { Tab } from '@mui/material';
import React from 'react';
import { TopNav } from '../components/TopNav/TopNav';

const Import = (): JSX.Element => {
  return (
    <TopNav title={'Data Upload'}>
      <Tab label='Genotype' />
      <Tab label='Allele' />
      <Tab label='Phenotype' />
      <Tab label='Strain' />
    </TopNav>
  );
};

export default Import;
