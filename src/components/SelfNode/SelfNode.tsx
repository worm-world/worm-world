import { TbArrowLoopLeft as SelfIcon } from 'react-icons/tb';
import { Handle, Position } from 'reactflow';

export const MIDDLE_NODE_WIDTH = 64; // w-16
export const MIDDLE_NODE_HEIGHT = 64; // w-16

export const SelfNode = (props: { id: string }): React.JSX.Element => {
  return (
    <div className='h-fit w-fit'>
      <Handle key='top' id='top' type='target' position={Position.Top} />
      <Handle
        key='bottom'
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      {/* <label key={props.id} htmlFor={`cross-filter-modal-${props.id}`}> */}
      <div className='h-16 w-16 rounded-full bg-secondary p-4 shadow transition hover:cursor-pointer hover:bg-secondary-focus'>
        <SelfIcon className='h-8 w-8 text-3xl text-primary-content' />
      </div>
      {/* </label> */}
    </div>
  );
};
