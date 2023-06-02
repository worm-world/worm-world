import { Meta, StoryFn } from '@storybook/react';
import {
  StrainFlowWrapper,
  StrainFlowWrapperProps,
} from 'components/FlowWrapper/FlowWrapper';
import * as strainNodeMock from 'models/frontend/StrainNode/StrainNode.mock';
import { ReactFlowProvider } from 'reactflow';

export default {
  title: 'Components/StrainNodeFlowWrapper',
  component: StrainFlowWrapper,
} as Meta<typeof StrainFlowWrapper>;

const Template: StoryFn<typeof StrainFlowWrapper> = (
  props: StrainFlowWrapperProps
) => {
  return (
    <ReactFlowProvider>
      <StrainFlowWrapper {...props}></StrainFlowWrapper>
    </ReactFlowProvider>
  );
};

export const wrapperOfStrainNode = Template.bind({});
wrapperOfStrainNode.args = { data: strainNodeMock.mutated };
