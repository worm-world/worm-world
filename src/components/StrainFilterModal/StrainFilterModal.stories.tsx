import { StoryFn, Meta } from '@storybook/react';
import {
  StrainFilter,
  StrainFilterUpdate,
} from 'models/frontend/StrainFilter/StrainFilter';
import * as crossDesigns from 'models/frontend/CrossDesign/CrossDesign.mock';
import { Strain } from 'models/frontend/Strain/Strain';
import { Node } from 'reactflow';
import { StrainFilterModal } from 'components/StrainFilterModal/StrainFilterModal';

export default {
  title: 'Components/StrainFilterModal',
  component: StrainFilterModal,
} as Meta<typeof StrainFilterModal>;

const Template: StoryFn<typeof StrainFilterModal> = ({
  childNodes = [],
  filter = undefined,
  updateFilter = () => {},
}: {
  childNodes: Array<Node<Strain>>;
  filter?: StrainFilter;
  updateFilter: (update: StrainFilterUpdate) => void;
}) => {
  return (
    <>
      <label htmlFor='strain-filter-modal' className='btn btn-primary'>
        Click me to show modal
      </label>
      <StrainFilterModal
        childNodes={childNodes}
        filter={filter ?? new StrainFilter()}
        updateFilter={updateFilter}
        filterId={''}
      />
    </>
  );
};

export const Empty = Template.bind({});

export const WithNodes = Template.bind({});
WithNodes.args = {
  childNodes: [
    crossDesigns.ed3HeteroHerm,
    crossDesigns.ed3HeteroMale,
    crossDesigns.ed3HomoHerm,
  ],
};

export const WithNodeDeselected = Template.bind({});
WithNodeDeselected.args = {
  childNodes: [
    crossDesigns.ed3HeteroHerm,
    crossDesigns.ed3HeteroMale,
    crossDesigns.ed3HomoHerm,
  ],
};

export const WithToggleCallback = Template.bind({});
WithToggleCallback.args = {
  childNodes: [
    crossDesigns.ed3HeteroHerm,
    crossDesigns.ed3HeteroMale,
    crossDesigns.ed3HomoHerm,
  ],
  updateFilter: (_: StrainFilterUpdate) => {
    alert('called update');
  },
};

const ed3Filter = new StrainFilter({
  alleleNames: new Set(['ed3']),
  exprPhenotypes: new Set(['unc-119']),
  reqConditions: new Set(),
  supConditions: new Set(),
  hiddenNodes: new Set(),
});
export const WithAppliedfilter = Template.bind({});
WithAppliedfilter.args = {
  childNodes: [crossDesigns.ed3AsChild, crossDesigns.n765AsChild],
  filter: ed3Filter,
};
