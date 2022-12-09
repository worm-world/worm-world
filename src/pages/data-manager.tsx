import { Tab } from '@mui/material';
import { TopNav } from 'components/TopNav/TopNav';
import { Link, Outlet } from 'react-router-dom';
import 'styles/data-manager.css';

const Import = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Data Manager'} tabIndex={false}>
        <Tab label='Gene' component={Link} to='gene' />
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
        />
      </TopNav>
      <div className='px-6'>
        <Outlet />
      </div>
    </div>
  );
};

export default Import;
