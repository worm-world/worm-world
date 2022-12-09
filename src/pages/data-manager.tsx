import { Tab } from '@mui/material';
import { TopNav } from 'components/TopNav/TopNav';
import { Link, useOutlet } from 'react-router-dom';
import 'styles/data-manager.css';

const Import = (): JSX.Element => {
  const outlet = useOutlet();
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
      {outlet != null || <h1 className='p-4 text-2xl'>Select a data tab.</h1>}
    </div>
  );
};

export default Import;
