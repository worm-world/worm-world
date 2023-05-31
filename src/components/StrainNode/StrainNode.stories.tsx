import { Meta, StoryFn } from '@storybook/react';
import StrainNode, { iStrainNodeProps } from 'components/StrainNode/StrainNode';
import * as strainNodeMock from 'models/frontend/StrainNode/StrainNode.mock';
import { ReactFlowProvider } from 'reactflow';

export default {
  title: 'Components/Cross Node',
  component: StrainNode,
  argTypes: {
    isSelected: { control: { type: 'boolean' } },
    sex: {
      options: [0, 1, 2],
      control: { type: 'select' },
    },
  },
} as Meta<typeof StrainNode>;

const Template: StoryFn<typeof StrainNode> = (args: iStrainNodeProps) => {
  return (
    <ReactFlowProvider>
      <StrainNode model={args.model}></StrainNode>
    </ReactFlowProvider>
  );
};

export const empty = Template.bind({});
empty.args = { model: strainNodeMock.empty };

export const wild = Template.bind({});
wild.args = { model: strainNodeMock.wild };

export const smallMutated = Template.bind({});
smallMutated.args = { model: strainNodeMock.smallMutated };

export const mutated = Template.bind({});
mutated.args = { model: strainNodeMock.mutated };

export const badMutationLists = Template.bind({});
badMutationLists.args = { model: strainNodeMock.badMutationLists };

export const badAllele = Template.bind({});
badAllele.args = { model: strainNodeMock.badAllele };

export const monoid = Template.bind({});
monoid.args = { model: strainNodeMock.monoid };

export const diploid = Template.bind({});
diploid.args = { model: strainNodeMock.diploid };

export const extrachromArray = Template.bind({});
extrachromArray.args = { model: strainNodeMock.ecaStrainNode };
