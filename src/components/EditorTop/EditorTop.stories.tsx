import { StoryFn, Meta } from '@storybook/react';
import EditorTop from 'components/EditorTop/EditorTop';
import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';

export default {
  title: 'Components/EditorTop',
  component: EditorTop,
} as Meta<typeof EditorTop>;

const Template: StoryFn<typeof EditorTop> = (args) => {
  return <EditorTop {...args} />;
};

export const primary = Template.bind({});
primary.args = {
  crossDesign: new CrossDesign({
    name: 'My Tree',
    nodes: [],
    edges: [],
    lastSaved: new Date(),
    editable: true,
  }),
};

export const longTitle = Template.bind({});
longTitle.args = {
  crossDesign: new CrossDesign({
    name: 'My Cross Design Has a Very Long Name that May Not Fit',
    nodes: [],
    edges: [],
    lastSaved: new Date(),
    editable: true,
  }),
};
