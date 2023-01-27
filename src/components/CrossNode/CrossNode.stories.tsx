import { StoryFn, Meta } from '@storybook/react';
import CrossNode from 'components/CrossNode/CrossNode';
import { ReactFlowProvider } from 'reactflow';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';
import iCrossNode from 'models/frontend/CrossNode/CrossNode';

export default {
  title: 'Components/Cross Node',
  component: CrossNode,
  argTypes: {
    isSelected: { control: { type: 'boolean' } },
    sex: {
      options: [0, 1, 2],
      control: { type: 'select' },
    },
  },
} as Meta<typeof CrossNode>;

const Template: StoryFn<typeof CrossNode> = (args: iCrossNode) => {
  return (
    <ReactFlowProvider>
      <CrossNode {...args}></CrossNode>
    </ReactFlowProvider>
  );
};

export const empty = Template.bind({});
empty.args = crossNodeMock.empty;

export const wild = Template.bind({});
wild.args = crossNodeMock.wild;

export const smallMutated = Template.bind({});
smallMutated.args = crossNodeMock.smallMutated;

export const mutated = Template.bind({});
mutated.args = crossNodeMock.mutated;

export const badMutationLists = Template.bind({});
badMutationLists.args = crossNodeMock.badMutationLists;

export const badAllele = Template.bind({});
badAllele.args = crossNodeMock.badAllele;

export const monoid = Template.bind({});
monoid.args = crossNodeMock.monoid;

export const diploid = Template.bind({});
diploid.args = crossNodeMock.diploid;
