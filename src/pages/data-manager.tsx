import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';
import 'styles/data-manager.css';

const Import = (): JSX.Element => {
  return (
    <div className='data-manager'>
      <TopNav title={'Data Manager'} tabIndex={0}>
        <Link key='gene' to='gene' className='tab'>
          Gene
        </Link>
        <Link key='variation' to='variation' className='tab'>
          Variation
        </Link>
        <Link key='allele' to='allele' className='tab'>
          Allele
        </Link>
        <Link key='phenotype' to='phenotype' className='tab'>
          Phenotype
        </Link>
        <Link key='condition' to='condition' className='tab'>
          Condition
        </Link>
        <Link key='allele-expression' to='allele-expression' className='tab'>
          Allele Expression
        </Link>
        <Link
          key='expression-relation'
          to='expression-relation'
          className='tab'
        >
          Expression Relation
        </Link>
      </TopNav>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Import;
