import { Handle, Position } from 'reactflow';

export interface FlowWrapperProps {
  data: JSX.Element | JSX.Element[];
}

// Container used to wrap components for use in React Flow
const FlowWrapper = (props: FlowWrapperProps): JSX.Element => {
  return (
    <div className='h-fit w-fit'>
      <Handle id='top' type='source' position={Position.Top} />
      <Handle id='bottom' type='source' position={Position.Bottom} />
      <Handle id='left' type='source' position={Position.Left} />
      <Handle id='right' type='source' position={Position.Right} />
      {props.data}
    </div>
  );
};

export default FlowWrapper;
