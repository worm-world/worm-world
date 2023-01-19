import { getFilteredGenes, getGenes } from 'api/gene';
import { TopNav } from 'components/TopNav/TopNav';
import { getAlleles, getFilteredAlleles } from 'api/allele';
import {
  getAlleleExpressions,
  getFilteredAlleleExpressions,
  insertDbAlleleExpression,
} from 'api/alleleExpressions';
import {
  getAlteringConditions,
  getConditions,
  getFilteredConditions,
} from 'api/condition';
import {
  getAlteringPhenotypes,
  getFilteredPhenotypes,
  getPhenotypes,
} from 'api/phenotype';
import { getFilteredVariations, getVariations } from 'api/variationInfo';
import { Gene } from 'models/frontend/Gene/Gene';
import { Allele } from 'models/frontend/Allele/Allele';
import { AlleleExpression } from 'models/frontend/AlleleExpression';
import { Condition } from 'models/frontend/Condition';
import { Phenotype } from 'models/frontend/Phenotype';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { Dominance } from 'models/enums';
import 'styles/home.css';
import { toast } from 'react-toastify';
import { DynamicSearch } from 'components/DynamicSearch/DynamicSearch';

const Home = (): JSX.Element => {
  return (
    <div className='home'>
      <TopNav title={'Home'} />
      <h1 className='mt-6 mb-4'>
        To see these buttons in action, open up the console output
      </h1>
      <div className='example-btns px-6'>
        <button
          className='btn m-2'
          onClick={() => {
            getGenes()
              .then((res) => {
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
          className='btn m-2'
          onClick={() => {
            getAlleles()
              .then((res) => {
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
          className='btn m-2'
          onClick={() => {
            getAlleleExpressions()
              .then((res) => {
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
          className='btn m-2'
          onClick={() => {
            const toInsert: db_AlleleExpression = {
              alleleName: 'oxTi75',
              expressingPhenotypeName: 'dpy-10',
              expressingPhenotypeWild: false,
              dominance: Dominance.Dominant,
            };
            insertDbAlleleExpression(toInsert).catch((err) => {
              console.log('noooooo', err);
            });
          }}
        >
          insert Allele expression (may have already been inserted)
        </button>
        <button
          className='btn m-2'
          onClick={() => {
            getConditions()
              .then((res) => {
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
          className='btn m-2'
          onClick={() => {
            getPhenotypes()
              .then((res) => {
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
          className='btn m-2'
          onClick={() => {
            getVariations()
              .then((res) => {
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
          className='btn m-2'
          onClick={() => {
            getAlteringPhenotypes('oxIs644', 'YFP(pharynx)', false, false)
              .then((res) => {
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
          className='btn m-2'
          onClick={() => {
            getAlteringConditions('n765', 'lin-15B', false, false)
              .then((res) => {
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
      <h1 className='pt-6 pb-4'>Toast Buttons</h1>
      <div className='toast-btns px-6'>
        <button
          className='btn-error btn m-2'
          onClick={() => {
            toast.error('Example error');
          }}
        >
          error toast
        </button>
        <button
          className='btn-success btn m-2'
          onClick={() => {
            toast.success('Example success');
          }}
        >
          success toast
        </button>
      </div>
      <h1 className='pt-6 pb-4'>Dynamic Search Examples</h1>
      <DynamicSearch
        getFilteredRecordApi={getFilteredAlleles}
        searchOn='Name'
        selectInputOn='name'
        displayResultsOn={['name']}
        placeholder='search allele name'
      />
      <DynamicSearch
        getFilteredRecordApi={getFilteredGenes}
        searchOn='DescName'
        selectInputOn='descName'
        displayResultsOn={['descName']}
        placeholder='search gene name'
      />
      <DynamicSearch
        getFilteredRecordApi={getFilteredConditions}
        searchOn='Name'
        selectInputOn='name'
        displayResultsOn={['name']}
        placeholder='search condition name'
      />
      <DynamicSearch
        getFilteredRecordApi={getFilteredPhenotypes}
        searchOn='Name'
        selectInputOn='name'
        displayResultsOn={['name']}
        placeholder='search phenotype name'
      />
      <DynamicSearch
        getFilteredRecordApi={getFilteredAlleleExpressions}
        searchOn='AlleleName'
        selectInputOn='alleleName'
        displayResultsOn={[
          'alleleName',
          'dominance',
          'expressingPhenotypeName',
          'expressingPhenotypeWild',
        ]}
        placeholder='search allele_expr by allele name'
      />
    </div>
  );
};

export default Home;
