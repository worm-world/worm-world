import { StoryFn, Meta } from '@storybook/react';
import SavedTreeCard from 'components/SavedTreeCard/SavedTreeCard';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { BrowserRouter } from 'react-router-dom';

const MockSavedTreeCard = ({
  tree: tree,
}: {
  tree: CrossTree;
}): JSX.Element => {
  return (
    <BrowserRouter>
      <SavedTreeCard tree={tree}></SavedTreeCard>
    </BrowserRouter>
  );
};

export default {
  title: 'Components/SavedTreeCard',
  component: SavedTreeCard,
} as Meta<typeof SavedTreeCard>;

const Template: StoryFn<typeof SavedTreeCard> = (args) => {
  return <MockSavedTreeCard {...args}></MockSavedTreeCard>;
};

export const Primary = Template.bind({});
Primary.args = { tree: mockCrossTree.simpleCrossTree };
