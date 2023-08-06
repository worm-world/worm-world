import { StoryFn, Meta } from '@storybook/react';
import FilteredOutModal from 'components/FilteredOutModal/FilteredOutModal';
import {
  ed3HeteroHerm,
  ed3HeteroMale,
  ed3HomoHerm,
} from 'models/frontend/CrossDesign/CrossDesign.mock';

export default {
  title: 'Components/FilteredOutModal',
  component: FilteredOutModal,
} as Meta<typeof FilteredOutModal>;

const Template: StoryFn<typeof FilteredOutModal> = (args) => {
  args.filterId = 'fakeId';
  return (
    <>
      <label htmlFor='filtered-out-modal-fakeId' className='btn btn-primary'>
        Click me to show modal
      </label>
      <FilteredOutModal {...args} />
    </>
  );
};

export const oneStrain = Template.bind({});
oneStrain.args = { excludedNodes: [ed3HeteroHerm] };

export const manyStrains = Template.bind({});
manyStrains.args = {
  excludedNodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm],
};
