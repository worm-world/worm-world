import { StoryFn, Meta } from '@storybook/react';
import {
  OffspringFilter,
  OffspringFilterUpdate,
} from 'components/OffspringFilter/OffspringFilter';
import { OffspringFilterModal } from 'components/OffspringFilterModal/OffspringFilterModal';
import { StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import * as mockTrees from 'models/frontend/CrossTree/CrossTree.mock';
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
  childNodes: Array<Node<StrainNodeModel>>;
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
  childNodes: [mockTrees.ed3HeteroHerm, mockTrees.ed3HeteroMale, mockTrees.ed3HomoHerm],
};

export const WithNodeDeselected = Template.bind({});
WithNodeDeselected.args = {
  childNodes: [mockTrees.ed3HeteroHerm, mockTrees.ed3HeteroMale, mockTrees.ed3HomoHerm],
  invisibleSet: new Set(mockTrees.ed3HeteroHerm.id),
};

export const WithToggleCallback = Template.bind({});
WithToggleCallback.args = {
  childNodes: [mockTrees.ed3HeteroHerm, mockTrees.ed3HeteroMale, mockTrees.ed3HomoHerm],
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
  childNodes: [mockTrees.ed3AsChild, mockTrees.n765AsChild],
  filter: ed3Filter,
};
