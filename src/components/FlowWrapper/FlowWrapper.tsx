import { Handle, Position } from 'reactflow';

export interface FlowWrapperProps {
  data: JSX.Element | JSX.Element[];
}

// Container used to wrap components for use in React Flow
const FlowWrapper = (props: FlowWrapperProps): JSX.Element => {
  return (
    <div
      className="w-fit h-fit"
    >
      <Handle type='target' position={Position.Top} />
      {props.data}
      <Handle type='source' position={Position.Bottom} />
    </div>
  );
};

export default FlowWrapper;
