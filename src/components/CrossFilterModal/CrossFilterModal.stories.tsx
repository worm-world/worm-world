import { StoryFn, Meta } from '@storybook/react';
import {
  CrossFilterModal,
  CrossFilterProps,
} from 'components/CrossFilterModal/CrossFilterModal';
import {
  ed3HeteroHerm,
  ed3HeteroMale,
  ed3HomoHerm,
} from 'models/frontend/CrossTree/CrossTree.mock';

export default {
  title: 'Components/CrossFilterModal',
  component: CrossFilterModal,
} as Meta<typeof CrossFilterModal>;

const Template: StoryFn<typeof CrossFilterModal> = (
  args: CrossFilterProps = {
    childNodes: [],
    invisibleSet: new Set(),
    toggleVisible: () => {},
  }
) => {
  return (
    <>
      <label htmlFor='cross-filter-modal' className='btn-primary btn'>
        Click me to show modal
      </label>
      <CrossFilterModal {...args}></CrossFilterModal>
    </>
  );
};

export const Empty = Template.bind({});
Empty.args = {
  childNodes: [],
  invisibleSet: new Set(),
  toggleVisible: () => {},
};

export const WithNodes = Template.bind({});
WithNodes.args = {
  childNodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm],
  invisibleSet: new Set(),
  toggleVisible: () => {},
};

export const WithNodeDeselected = Template.bind({});
WithNodeDeselected.args = {
  childNodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm],
  invisibleSet: new Set(ed3HeteroHerm.id),
  toggleVisible: () => {},
};

export const WithToggleCallback = Template.bind({});
WithToggleCallback.args = {
  childNodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm],
  invisibleSet: new Set<string>(),
  toggleVisible: (nodeId: string) => {
    alert('Clicked node with id: ' + nodeId);
  },
};
