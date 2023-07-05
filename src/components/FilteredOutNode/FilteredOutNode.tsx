import { FaEllipsisH } from 'react-icons/fa';

export interface FilteredOutNodeProps {
  nodeId: string;
}

export const FILTERED_OUT_NODE_WIDTH = 144; // w-36

const FilteredOutNode = (props: FilteredOutNodeProps): React.JSX.Element => {
  return (
    <label
      className='flex h-36 w-36 flex-col rounded bg-base-200 p-4 text-center shadow hover:cursor-pointer hover:bg-base-300'
      htmlFor={`filtered-out-modal-${props.nodeId}`}
    >
      <FaEllipsisH className='m-auto' size='20' />
    </label>
  );
};

export default FilteredOutNode;
