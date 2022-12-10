import Tab from '@mui/material/Tab';
import { TopNav } from 'components/TopNav/TopNav';
import CrossNode from 'components/crossNode/CrossNode';
import * as testData from 'components/crossNode/CrossNode.data';

const CrossPage = (): JSX.Element => {
  return (
    <div>
      <TopNav title={'Cross Designer'}>
        <Tab label='New Cross' />
        <Tab label='Open Cross' />
        <Tab label='Export Cross' />
      </TopNav>
      <CrossNode {...testData.crossNode1}></CrossNode>
    </div>
  );
};

export default CrossPage;
