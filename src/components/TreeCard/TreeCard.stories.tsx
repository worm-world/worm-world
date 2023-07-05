import { StoryFn, Meta } from '@storybook/react';
import TreeCard from 'components/TreeCard/TreeCard';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { BrowserRouter } from 'react-router-dom';

const MockTreeCard = ({
  tree: tree,
}: {
  tree: CrossTree;
}): React.JSX.Element => {
  return (
    <BrowserRouter>
      <TreeCard tree={tree} refreshTrees={() => {}}></TreeCard>
    </BrowserRouter>
  );
};

export default {
  title: 'Components/TreeCard',
  component: TreeCard,
} as Meta<typeof TreeCard>;

const Template: StoryFn<typeof TreeCard> = (args) => {
  return <MockTreeCard {...args}></MockTreeCard>;
};

export const Primary = Template.bind({});
Primary.args = { tree: mockCrossTree.simpleCrossTree };
