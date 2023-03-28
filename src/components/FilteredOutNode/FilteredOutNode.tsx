import { FaEllipsisH } from 'react-icons/fa';

export interface FilteredOutNodeProps {
  nodeId: string;
}

const FilteredOutNode = (props: FilteredOutNodeProps): JSX.Element => {
  return (
    <label
      className='flex h-[7.75rem] w-32 flex-col rounded bg-base-200 p-4 text-center shadow hover:cursor-pointer hover:bg-base-300'
      htmlFor={`filtered-out-modal-${props.nodeId}`}
    >
      <FaEllipsisH className='m-auto' size='20' />
    </label>
  );
};

export default FilteredOutNode;
