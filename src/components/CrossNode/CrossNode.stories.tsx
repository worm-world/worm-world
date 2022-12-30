import { StoryFn, Meta } from '@storybook/react';
import CrossNode, { CrossNodeProps } from 'components/CrossNode/CrossNode';
import { ReactFlowProvider } from 'reactflow';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';

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

const Template: StoryFn<typeof CrossNode> = (args: CrossNodeProps) => {
  return (
    <ReactFlowProvider>
      <CrossNode {...args}></CrossNode>
    </ReactFlowProvider>
  )
};

export const empty = Template.bind({});
empty.args = { data: crossNodeMock.empty };

export const wild = Template.bind({});
wild.args = { data: crossNodeMock.wild };

export const mutated = Template.bind({});
mutated.args = { data: crossNodeMock.mutated};

export const badMutationLists = Template.bind({});
badMutationLists.args = { data: crossNodeMock.badMutationLists };

export const badAllele = Template.bind({});
badAllele.args = { data: crossNodeMock.badAllele };

export const monoid = Template.bind({});
monoid.args = { data: crossNodeMock.monoid };

export const diploid = Template.bind({});
diploid.args = { data: crossNodeMock.diploid };
