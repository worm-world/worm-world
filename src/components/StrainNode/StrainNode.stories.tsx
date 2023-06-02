import { Meta, StoryFn } from '@storybook/react';
import StrainNode, { StrainNodeProps } from 'components/StrainNode/StrainNode';
import * as strainNodeMock from 'models/frontend/StrainNodeModel/StrainNodeModel\.mock';
import { ReactFlowProvider } from 'reactflow';

export default {
  title: 'Components/StrainNode',
  component: StrainNode,
  argTypes: {
    isSelected: { control: { type: 'boolean' } },
    sex: {
      options: [0, 1, 2],
      control: { type: 'select' },
    },
  },
} as Meta<typeof StrainNode>;

const Template: StoryFn<typeof StrainNode> = (args: StrainNodeProps) => {
  return (
    <ReactFlowProvider>
      <StrainNode model={args.model}></StrainNode>
    </ReactFlowProvider>
  );
};

export const empty = Template.bind({});
empty.args = { model: strainNodeMock.maleWild };

export const N2 = Template.bind({});
N2.args = { model: strainNodeMock.maleN2 };

export const MT2495 = Template.bind({});
MT2495.args = { model: strainNodeMock.maleMT2495 };

export const BT14 = Template.bind({});
BT14.args = { model: strainNodeMock.maleBT14 };


