import { StoryFn, Meta } from '@storybook/react';
import {
  CrossEditorFilter,
  CrossEditorFilterUpdate,
  CrossFilterModal,
} from 'components/CrossFilterModal/CrossFilterModal';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
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
  filters = new Map<string, CrossEditorFilter>(),
  updateFilter = () => {},
}: {
  childNodes: Array<Node<CrossNodeModel>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;
  filters: Map<string, CrossEditorFilter>;
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
        filters={filters}
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

const ed3Filter = new Map<string, CrossEditorFilter>();
ed3Filter.set(
  ed3AsChild.parentNode ?? '',
  new CrossEditorFilter({
    alleleNames: new Set(['ed3']),
    exprPhenotypes: new Set(['unc-119']),
    reqConditions: new Set(),
    supConditions: new Set(),
  })
);
export const WithAppliedfilter = Template.bind({});
WithAppliedfilter.args = {
  childNodes: [ed3AsChild, n765AsChild],
  filters: ed3Filter,
};
