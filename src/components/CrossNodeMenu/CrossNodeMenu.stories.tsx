import { StoryFn, Meta } from '@storybook/react';
import { BiBaseball, BiBody, BiChair } from 'react-icons/bi';
import {
  CrossNodeMenu,
  iCrossNodeMenu,
} from 'components/CrossNodeMenu/CrossNodeMenu';

export default {
  title: 'Components/CrossNodeMenu',
  component: CrossNodeMenu,
} as Meta<typeof CrossNodeMenu>;

const Template: StoryFn<typeof CrossNodeMenu> = (args: iCrossNodeMenu) => {
  return <CrossNodeMenu {...args}></CrossNodeMenu>;
};

export const Primary = Template.bind({});
Primary.args = {
  items: [
    {
      icon: <BiBaseball />,
      text: 'Option 1',
      menuCallback: () => alert('clicked option 1'),
    },
    {
      icon: <BiBody />,
      text: 'Option 2',
      menuCallback: () => alert('clicked option 2'),
    },
    {
      icon: <BiChair />,
      text: 'Option 3',
      menuCallback: () => alert('clicked option 3'),
    },
  ],
};

export const NoIcons = Template.bind({});
NoIcons.args = {
  items: [
    {
      text: 'Option 1',
      menuCallback: () => alert('clicked option 1'),
    },
    {
      text: 'Option 2',
      menuCallback: () => alert('clicked option 2'),
    },
    {
      text: 'Option 3',
      menuCallback: () => alert('clicked option 3'),
    },
  ],
};
