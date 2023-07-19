import { StoryFn, Meta } from '@storybook/react';
import { NoteNode, NoteNodeProps } from 'components/NoteNode/NoteNode';

export default {
  title: 'Components/NoteNode',
  component: NoteNode,
} as Meta<typeof NoteNode>;

const Template: StoryFn<typeof NoteNode> = (props: NoteNodeProps) => {
  return <NoteNode {...props} />;
};

export const empty = Template.bind({});
empty.args = { data: '' };

export const withContent = Template.bind({});
withContent.args = { data: 'This is some content.' };

export const withScroller = Template.bind({});
withScroller.args = {
  data:
    'Lorem ipsum dolor sit amet, \
    consectetur adipiscing elit, sed do eiusmod tempor \
    incididunt ut labore et dolore magna aliqua. \
    Ut enim ad minim veniam, quis nostrud exercitation \
    ullamco laboris nisi ut aliquip ex ea commodo consequat.',
};
