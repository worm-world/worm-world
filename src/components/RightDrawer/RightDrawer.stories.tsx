import { StoryFn, Meta } from '@storybook/react';
import RightDrawer from 'components/RightDrawer/RightDrawer';

export default {
  title: 'Components/RightDrawer',
  component: RightDrawer,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta<typeof RightDrawer>;

const Template: StoryFn<typeof RightDrawer> = (args) => {
  args.close = () => alert('close button pressed');
  return <div className='drawer drawer-end'>
    <input id="my-drawer" type="checkbox" defaultChecked className="drawer-toggle" />
    <div className="drawer-content">
      <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
    </div>
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <RightDrawer {...args} />
    </div>
  </div>;
};
export const Primary = Template.bind({});
Primary.args = {
  initialDrawerWidth: 100,
  maxWidth: 400,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  initialDrawerWidth: 100,
  maxWidth: 400,
  isOpen: true,
  children: <div>Children here</div>,
};
