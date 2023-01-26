import { StoryFn, Meta } from '@storybook/react';
import CrossEditor, {
  CrossEditorProps,
} from 'components/CrossEditor/CrossEditor';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

export default {
  title: 'Components/CrossEditor',
  component: CrossEditor,
} as Meta<typeof CrossEditor>;

const Template: StoryFn<typeof CrossEditor> = (args: CrossEditorProps) => {
  return <CrossEditor {...args}></CrossEditor>;
};

export const primary = Template.bind({});
primary.args = { currentTree: mockCrossTree.simpleCrossTree };

export const secondary = Template.bind({});
secondary.args = { currentTree: mockCrossTree.mediumCrossTree };
