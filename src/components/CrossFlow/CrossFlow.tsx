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
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FlowWrapper from 'components/FlowWrapper/FlowWrapper';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

interface iCrossFlowProps {
  className?: string;
  crossTree: CrossTree;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(() => ({ flowWrapper: FlowWrapper }), []);

  return (
    <ReactFlow
      className={props.className}
      connectionMode={ConnectionMode.Loose}
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
