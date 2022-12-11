import { StoryFn, Meta } from '@storybook/react';
import Layout from 'components/Layout/Layout';

export default {
  title: 'Components/Layout',
  component: Layout,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Layout>;

const Template: StoryFn<typeof Layout> = () => <Layout>{}</Layout>;

export const Primary = Template.bind({});
