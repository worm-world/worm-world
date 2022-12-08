import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Layout from './layout';

export default {
  title: 'Components/Layout',
  component: Layout,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Layout>;

const Template: ComponentStory<typeof Layout> = () => <Layout>{}</Layout>;

export const Primary = Template.bind({});
