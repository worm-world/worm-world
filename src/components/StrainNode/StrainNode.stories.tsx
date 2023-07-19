import { Meta, StoryFn } from '@storybook/react';
import StrainNode, { StrainNodeProps } from 'components/StrainNode/StrainNode';
import { ReactFlowProvider } from 'reactflow';
import * as strains from 'models/frontend/Strain/Strain.mock';

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
      <StrainNode data={args.data} id={''}></StrainNode>
    </ReactFlowProvider>
  );
};

export const empty = Template.bind({});
empty.args = { data: strains.emptyWild.toMale() };

export const N2 = Template.bind({});
N2.args = { data: strains.N2.toMale() };

export const MT2495 = Template.bind({});
MT2495.args = { data: strains.MT2495.toMale() };

export const BT14 = Template.bind({});
BT14.args = { data: strains.BT14.toMale() };


