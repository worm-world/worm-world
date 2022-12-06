import React from 'react';
import { getGenes } from 'api/gene';
import { TopNav } from 'components/TopNav/TopNav';
import { getAlleles } from 'api/allele';
import { getAlleleExpressions } from 'api/alleleExpressions';
import { getAlteringConditions, getConditions } from 'api/condition';
import { getAlteringPhenotypes, getPhenotypes } from 'api/phenotype';
import { getVariations } from 'api/variationInfo';
import { Gene } from 'models/frontend/Gene';
import { Allele } from 'models/frontend/Allele';
import { AlleleExpression } from 'models/frontend/AlleleExpression';
import { Condition } from 'models/frontend/Condition';
import { Phenotype } from 'models/frontend/Phenotype';
import { VariationInfo } from 'models/frontend/VariationInfo';
import { DBError } from 'models/error';

const Home = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Home'} />
      <h1>To see these buttons in action, open up the console output</h1>
      <div>
        <button
          onClick={() => {
            getGenes()
              .then((res) => {
                if (res instanceof DBError) return;
                const genes = res.map((record) =>
                  Gene.createFromRecord(record)
                );
                console.log(genes);
              })
              .catch((err) => err);
          }}
        >
          get genes
        </button>
        <button
          onClick={() => {
            getAlleles()
              .then((res) => {
                if (res instanceof DBError) return;
                const alleles = res.map((record) =>
                  Allele.createFromRecord(record)
                );
                console.log(alleles);
              })
              .catch((err) => err);
          }}
        >
          get alleles
        </button>
        <button
          onClick={() => {
            getAlleleExpressions()
              .then((res) => {
                if (res instanceof DBError) return;
                const alleleExpressions = res.map((record) =>
                  AlleleExpression.createFromRecord(record)
                );
                console.log(alleleExpressions);
              })
              .catch((err) => err);
          }}
        >
          get Allele expressions
        </button>
        <button
          onClick={() => {
            getConditions()
              .then((res) => {
                if (res instanceof DBError) return;
                const conditions = res.map((record) =>
                  Condition.createFromRecord(record)
                );
                console.log(conditions);
              })
              .catch((err) => err);
          }}
        >
          get conditions
        </button>
        <button
          onClick={() => {
            getPhenotypes()
              .then((res) => {
                if (res instanceof DBError) return;
                const phenotypes = res.map((record) =>
                  Phenotype.createFromRecord(record)
                );
                console.log(phenotypes);
              })
              .catch((err) => err);
          }}
        >
          get phenotypes
        </button>
        <button
          onClick={() => {
            getVariations()
              .then((res) => {
                if (res instanceof DBError) return;
                const varations = res.map((record) =>
                  VariationInfo.createFromRecord(record)
                );
                console.log(varations);
              })
              .catch((err) => err);
          }}
        >
          get variations
        </button>
        <button
          onClick={() => {
            getAlteringPhenotypes('oxIs644', 'YFP(pharynx)', false, false)
              .then((res) => {
                if (res instanceof DBError) return;
                const alteringPhenotypes = res.map((record) =>
                  Phenotype.createFromRecord(record)
                );
                console.log(alteringPhenotypes);
              })
              .catch((err) => err);
          }}
        >
          get required phenotypes
        </button>
        <button
          onClick={() => {
            getAlteringConditions('n765', 'lin-15B', false, false)
              .then((res) => {
                if (res instanceof DBError) return;
                const alteringConditions = res.map((record) =>
                  Condition.createFromRecord(record)
                );
                console.log(alteringConditions);
              })
              .catch((err) => err);
          }}
        >
          get required required conditions
        </button>
      </div>
    </div>
  );
};

export default Home;
