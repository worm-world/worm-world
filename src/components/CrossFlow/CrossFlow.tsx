import { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  updateEdge,
  OnNodesChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import FlowWrapper from 'components/FlowWrapper/FlowWrapper';

const initialEdges: Edge[] = [
  {
    id: 'edge1',
    source: 'node1',
    target: 'xNode1',
    className: 'stroke-2 stroke-red-400',
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge2',
    source: 'node2',
    target: 'xNode1',
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge3',
    source: 'xNode1',
    target: 'node3',
    style: { strokeWidth: 2 },
  },
];

interface iCrossFlowProps {
  className?: string;
  nodes: Node[];
  onNodesChange: OnNodesChange;
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(() => ({ flowWrapper: FlowWrapper }), []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge<any>, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );
  const onConnect = useCallback(
    (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <ReactFlow
      className={props.className}
      zoomOnScroll={true}
      fitView
      nodes={props.nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={props.onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeUpdate={onEdgeUpdate}
      onConnect={onConnect}
      defaultViewport={{ x: 0, y: 0, zoom: 5 }}
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
