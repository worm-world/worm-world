import { useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  EdgeChange,
  NodeChange,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  CrossNodeFlowWrapper,
  SelfNodeFlowWrapper,
  XNodeFlowWrapper,
} from 'components/FlowWrapper/FlowWrapper';

interface iCrossFlowProps {
  className?: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(
    () => ({
      crossNodeFlowWrapper: CrossNodeFlowWrapper,
      xNodeFlowWrapper: XNodeFlowWrapper,
      selfNodeFlowWrapper: SelfNodeFlowWrapper,
    }),
    []
  );

  return (
    <ReactFlow
      className={props.className}
      zoomOnScroll={true}
      nodeTypes={nodeTypes}
      fitView
      defaultViewport={{ x: 0, y: 0, zoom: 5 }}
      nodes={props.nodes}
      edges={props.edges}
      onNodesChange={props.onNodesChange}
      onEdgesChange={props.onEdgesChange}
      onConnect={props.onConnect}
    >
      <Controls position='top-left' className='bg-base-100 text-base-content' />
      <MiniMap
        position='bottom-left'
        className='bg-base-300'
        nodeClassName='bg-base-100'
      />
      <Background className='-z-50 bg-base-300' size={1} gap={16} />
    </ReactFlow>
  );
};

export default CrossFlow;
