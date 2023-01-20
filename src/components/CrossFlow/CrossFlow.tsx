import CrossNode from 'components/CrossNode/CrossNode';
import { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  Node,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  updateEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { XNode } from 'components/XNode/XNode';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import FlowWrapper from 'components/FlowWrapper/FlowWrapper';

const initialNodes: Array<Node<JSX.Element>> = [
  {
    id: 'node1',
    type: 'flowWrapper', // This is the type of our custom node
    position: { x: -150, y: -100 },
    data: <CrossNode model={mock.emptyMale}></CrossNode>, // data = children for flowWrapper
    connectable: true,
  },
  {
    id: 'node2',
    type: 'flowWrapper',
    position: { x: 150, y: -100 },
    data: <CrossNode model={mock.wild}></CrossNode>,
    connectable: true,
  },
  {
    id: 'node3',
    type: 'flowWrapper',
    position: { x: 0, y: 200 },
    data: <CrossNode model={mock.wild}></CrossNode>,
    connectable: true,
  },
  {
    id: 'xNode1',
    type: 'flowWrapper',
    position: { x: 95, y: 75 },
    data: <XNode />,
    connectable: false,
  },
];

const initialEdges: Edge[] = [
  {
    id: 'edge1',
    source: 'node1',
    target: 'xNode1',
    style: { strokeWidth: 2, stroke: 'hsla(var(--bc)/0.2)' },
  },
  {
    id: 'edge2',
    source: 'node2',
    target: 'xNode1',
    style: { strokeWidth: 2, stroke: 'hsla(var(--bc)/0.2)' },
  },
  {
    id: 'edge3',
    source: 'xNode1',
    target: 'node3',
    style: { strokeWidth: 2, stroke: 'hsla(var(--bc)/0.2)' },
  },
];

interface iCrossFlowProps {
  className?: string;
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(() => ({ flowWrapper: FlowWrapper }), []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
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
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
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
