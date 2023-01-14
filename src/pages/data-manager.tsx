import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';
import 'styles/data-manager.css';

const Import = (): JSX.Element => {
  return (
    <div className='data-manager'>
      <TopNav title={'Data Manager'} tabIndex={false}>
        <Link to="gene" className='tab'>Gene</Link>
        <Link to="variation" className='tab'>Variation</Link>
        <Link to="allele" className='tab'>Allele</Link>
        <Link to="phenotype"className='tab'>Phenotype</Link>
        <Link to="condition" className='tab'>Condition</Link>
        <Link to="allele-expression" className='tab'>Allele Expression</Link>
        <Link to="expression-relation" className='tab'>Expression Relation</Link>

        {/* <Tab label='Gene' component={Link} to='gene' />
        <Tab label='Variation' component={Link} to='variation' />
        <Tab label='Allele' component={Link} to='allele' />
        <Tab label='Phenotype' component={Link} to='phenotype' />
        <Tab label='Condition' component={Link} to='condition' />
        <Tab
          label='Allele Expression'
          component={Link}
          to='allele-expression'
        />
        <Tab
          label='Expression Relation'
          component={Link}
          to='expression-relation'
        /> */}
      </TopNav>
      <div className='px-6 pt-2'>
        <Outlet />
      </div>
    </div>
  );
};

export default Import;
