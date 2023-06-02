import { StoryFn, Meta } from '@storybook/react';
import {
  CrossEditorFilter,
  CrossEditorFilterUpdate,
} from 'components/CrossFilterModal/CrossEditorFilter';
import { CrossFilterModal } from 'components/CrossFilterModal/CrossFilterModal';
import { StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import {
  ed3AsChild,
  ed3HeteroHerm,
  ed3HeteroMale,
  ed3HomoHerm,
  n765AsChild,
} from 'models/frontend/CrossTree/CrossTree.mock';
import { Node } from 'reactflow';

export default {
  title: 'Components/CrossFilterModal',
  component: CrossFilterModal,
} as Meta<typeof CrossFilterModal>;

const Template: StoryFn<typeof CrossFilterModal> = ({
  childNodes = [],
  invisibleSet = new Set(),
  toggleVisible = () => {},
  filter = undefined,
  updateFilter = () => {},
}: {
  childNodes: Array<Node<StrainNodeModel>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;
  filter?: CrossEditorFilter;
  updateFilter: (update: CrossEditorFilterUpdate) => void;
}) => {
  return (
    <>
      <label htmlFor='cross-filter-modal' className='btn-primary btn'>
        Click me to show modal
      </label>
      <CrossFilterModal
        childNodes={childNodes}
        invisibleSet={invisibleSet}
        toggleVisible={toggleVisible}
        filter={filter}
        updateFilter={updateFilter}
      ></CrossFilterModal>
    </>
  );
};

export const Empty = Template.bind({});

export const WithNodes = Template.bind({});
WithNodes.args = {
  childNodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm],
};

export const WithNodeDeselected = Template.bind({});
WithNodeDeselected.args = {
  childNodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm],
  invisibleSet: new Set(ed3HeteroHerm.id),
};

export const WithToggleCallback = Template.bind({});
WithToggleCallback.args = {
  childNodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm],
  toggleVisible: (nodeId: string) => {
    alert('Clicked node with id: ' + nodeId);
  },
  updateFilter: (_: CrossEditorFilterUpdate) => {
    alert('called update');
  },
};

const ed3Filter = new CrossEditorFilter({
  alleleNames: new Set(['ed3']),
  exprPhenotypes: new Set(['unc-119']),
  reqConditions: new Set(),
  supConditions: new Set(),
});
export const WithAppliedfilter = Template.bind({});
WithAppliedfilter.args = {
  childNodes: [ed3AsChild, n765AsChild],
  filter: ed3Filter,
};
