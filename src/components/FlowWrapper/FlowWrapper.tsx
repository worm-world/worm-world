import { Box } from '@mui/material';
import { Handle, Position } from 'reactflow';

export interface FlowWrapperProps {
  data: JSX.Element | JSX.Element[];
}

// Container used to wrap components for use in React Flow
const FlowWrapper = (props: FlowWrapperProps): JSX.Element => {
  return (
    <Box>
      <Handle type='target' position={Position.Top} />
      {props.data}
      <Handle type='source' position={Position.Bottom} />
    </Box>
  );
};

export default FlowWrapper;
