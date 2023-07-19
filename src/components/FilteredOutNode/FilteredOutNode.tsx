import { FaEllipsisH } from 'react-icons/fa';
import { Handle, Position } from 'reactflow';

export const FILTERED_OUT_NODE_WIDTH = 144; // w-36

const FilteredOutNode = (props: { id: string }): React.JSX.Element => {
  return (
    <div>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <label
        className='flex h-36 w-36 flex-col rounded bg-base-200 p-4 text-center shadow hover:cursor-pointer hover:bg-base-300'
        htmlFor={`filtered-out-modal-${props.id}`}
      >
        <FaEllipsisH className='m-auto' size='20' />
      </label>
    </div>
  );
};

export default FilteredOutNode;
