import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';
import 'styles/data-tables.css';

const DataTables = (): JSX.Element => {
  return (
    <div className='data-tables'>
      <TopNav title={'Data Tables'} tabIndex={0}>
        <Link key='genes' to='genes' className='tab'>
          Genes
        </Link>
        <Link key='variations' to='variations' className='tab'>
          Variations
        </Link>
        <Link key='alleles' to='alleles' className='tab'>
          Alleles
        </Link>
        <Link key='phenotypes' to='phenotypes' className='tab'>
          Phenotypes
        </Link>
        <Link key='conditions' to='conditions' className='tab'>
          Conditions
        </Link>
        <Link key='allele-expressions' to='allele-expressions' className='tab'>
          Allele Expressions
        </Link>
        <Link
          key='expression-relations'
          to='expression-relations'
          className='tab'
        >
          Expression Relations
        </Link>
        <Link key='strains' to='strains' className='tab'>
          Strains
        </Link>
        <Link key='strain-alleles' to='strain-alleles' className='tab'>
          Strain Alleles
        </Link>
      </TopNav>
      <Outlet />
    </div>
  );
};

export default DataTables;
