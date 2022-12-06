import React from 'react';
import { getGene } from '../api/gene';
import { TopNav } from 'components/TopNav/TopNav';
import { getAlleles } from '../api/allele';
import { getAlleleExpressions } from '../api/alleleExpressions';
import { getAlteringConditions, getConditions } from '../api/condition';
import { getAlteringPhenotypes, getPhenotypes } from '../api/phenotype';
import { getVariations } from '../api/variationInfo';
import { Gene } from '../models/frontend/Gene';

const Home = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Home'} />
      <button
        onClick={() => {
          getGene('unc-119')
            .then((res) => {
              if (res != null) {
                const gene = Gene.createFromRecord(res);

                console.log(gene);
              }
            })
            .catch((err) => err);
        }}
      >
        get gene
      </button>
      <button
        onClick={() => {
          getAlleles()
            .then((res) => console.log(res))
            .catch((err) => err);
        }}
      >
        get allele
      </button>
      <button
        onClick={() => {
          getAlleleExpressions()
            .then((res) => console.log(res))
            .catch((err) => err);
        }}
      >
        get Allele expression
      </button>
      <button
        onClick={() => {
          getConditions()
            .then((res) => console.log(res))
            .catch((err) => err);
        }}
      >
        get condition
      </button>
      <button
        onClick={() => {
          getPhenotypes()
            .then((res) => console.log(res))
            .catch((err) => err);
        }}
      >
        get phenotype
      </button>
      <button
        onClick={() => {
          getVariations()
            .then((res) => console.log(res))
            .catch((err) => err);
        }}
      >
        get variation
      </button>
      <button
        onClick={() => {
          getAlteringPhenotypes('oxIs644', 'YFP(pharynx)', false, false)
            .then((res) => console.log(res))
            .catch((err) => err);
        }}
      >
        get required phenotypes
      </button>
      <button
        onClick={() => {
          getAlteringConditions('n765', 'lin-15B', false, false)
            .then((res) => console.log(res))
            .catch((err) => err);
        }}
      >
        get required required conditions
      </button>
    </div>
  );
};

export default Home;
