import { StoryFn, Meta } from '@storybook/react';
import CrossEditor, {
  CrossEditorProps,
} from 'components/CrossEditor/CrossEditor';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import { BrowserRouter } from 'react-router-dom';

export default {
  title: 'Components/CrossEditor',
  component: CrossEditor,
} as Meta<typeof CrossEditor>;

const Template: StoryFn<typeof CrossEditor> = (args: CrossEditorProps) => {
  return (
    <BrowserRouter>
      <CrossEditor {...args}></CrossEditor>;
    </BrowserRouter>
  );
};

export const primary = Template.bind({});
primary.args = { crossTree: mockCrossTree.simpleCrossTree };

export const secondary = Template.bind({});
secondary.args = { crossTree: mockCrossTree.mediumCrossTree };
