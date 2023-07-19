import { StoryFn, Meta } from '@storybook/react';
import {
  OffspringFilter,
  OffspringFilterUpdate,
} from 'components/OffspringFilter/OffspringFilter';
import { OffspringFilterModal } from 'components/OffspringFilterModal/OffspringFilterModal';
import * as crossDesigns from 'models/frontend/CrossDesign/CrossDesign.mock';
import { Strain } from 'models/frontend/Strain/Strain';
import { Node } from 'reactflow';

export default {
  title: 'Components/OffspringFilterModal',
  component: OffspringFilterModal,
} as Meta<typeof OffspringFilterModal>;

const Template: StoryFn<typeof OffspringFilterModal> = ({
  childNodes = [],
  invisibleSet = new Set(),
  toggleVisible = () => {},
  filter = undefined,
  updateFilter = () => {},
}: {
  childNodes: Array<Node<Strain>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;
  filter?: OffspringFilter;
  updateFilter: (update: OffspringFilterUpdate) => void;
}) => {
  return (
    <>
      <label htmlFor='cross-filter-modal' className='btn-primary btn'>
        Click me to show modal
      </label>
      <OffspringFilterModal
        childNodes={childNodes}
        invisibleSet={invisibleSet}
        toggleVisible={toggleVisible}
        filter={filter}
        updateFilter={updateFilter}
      ></OffspringFilterModal>
    </>
  );
};

export const Empty = Template.bind({});

export const WithNodes = Template.bind({});
WithNodes.args = {
  childNodes: [crossDesigns.ed3HeteroHerm, crossDesigns.ed3HeteroMale, crossDesigns.ed3HomoHerm],
};

export const WithNodeDeselected = Template.bind({});
WithNodeDeselected.args = {
  childNodes: [crossDesigns.ed3HeteroHerm, crossDesigns.ed3HeteroMale, crossDesigns.ed3HomoHerm],
  invisibleSet: new Set(crossDesigns.ed3HeteroHerm.id),
};

export const WithToggleCallback = Template.bind({});
WithToggleCallback.args = {
  childNodes: [crossDesigns.ed3HeteroHerm, crossDesigns.ed3HeteroMale, crossDesigns.ed3HomoHerm],
  toggleVisible: (nodeId: string) => {
    alert('Clicked node with id: ' + nodeId);
  },
  updateFilter: (_: OffspringFilterUpdate) => {
    alert('called update');
  },
};

const ed3Filter = new OffspringFilter({
  alleleNames: new Set(['ed3']),
  exprPhenotypes: new Set(['unc-119']),
  reqConditions: new Set(),
  supConditions: new Set(),
});
export const WithAppliedfilter = Template.bind({});
WithAppliedfilter.args = {
  childNodes: [crossDesigns.ed3AsChild, crossDesigns.n765AsChild],
  filter: ed3Filter,
};
