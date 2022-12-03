import { StoryFn, Meta } from '@storybook/react';

import Layout from './layout';

export default {
  title: 'Components/Layout',
  component: Layout,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof Layout>;

const Template: StoryFn<typeof Layout> = () => <Layout>{}</Layout>;

export const Primary = Template.bind({});
