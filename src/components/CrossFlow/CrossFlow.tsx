import CrossNodeElement from 'components/CrossNode/CrossNode';
import CrossNode from 'models/frontend/CrossNode/CrossNode';
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
import {
  crossNode1,
  crossNode2,
  crossNode3,
} from 'components/CrossNode/CrossNode.data';
import { XNode } from 'components/XNode/XNode';

const initialNodes: Array<Node<CrossNode | {}>> = [
  {
    id: 'node1',
    type: 'crossNode',
    position: { x: -150, y: -100 },
    data: crossNode1,
    connectable: true,
  },
  {
    id: 'node2',
    type: 'crossNode',
    position: { x: 150, y: -100 },
    data: crossNode2,
    connectable: true,
  },
  {
    id: 'node3',
    type: 'crossNode',
    position: { x: 0, y: 200 },
    data: crossNode3,
    connectable: true,
  },
  {
    id: 'xNode1',
    type: 'xNode',
    position: { x: 95, y: 75 },
    data: {},
    connectable: true,
  },
];

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
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(
    () => ({ crossNode: CrossNodeElement, xNode: XNode }),
    []
  );
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
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
      // preventScrolling={false}
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
      <Controls position='top-left' />
      <MiniMap position='bottom-left' />
      <Background className='-z-50' color='gray' size={1} gap={16} />
    </ReactFlow>
  );
};

export default CrossFlow;
