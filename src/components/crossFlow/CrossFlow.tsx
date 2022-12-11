import CrossNodeElement from 'components/crossNode/CrossNode';
import CrossNode from 'models/frontend/CrossNode';
import { useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  crossNode1,
  crossNode2,
  crossNode3,
} from 'components/crossNode/CrossNode.data';

const initialNodes: Array<Node<CrossNode>> = [
  {
    id: 'node1',
    type: 'crossNode',
    position: { x: -300, y: -100 },
    data: crossNode1,
  },
  {
    id: 'node2',
    type: 'crossNode',
    position: { x: 0, y: -100 },
    data: crossNode2,
  },
  {
    id: 'node3',
    type: 'crossNode',
    position: { x: -150, y: 100 },
    data: crossNode3,
  },
];

interface iCrossFlowProps {
  className?: string;
}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(() => ({ crossNode: CrossNodeElement }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  return (
    <ReactFlow
      className={props.className}
      zoomOnScroll={true}
      // preventScrolling={false}
      fitView
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      defaultViewport={{ x: 0, y: 0, zoom: 5 }}
    >
      <Controls position='top-left' />
      <MiniMap position='bottom-left' />
      <Background className='-z-50' color='gray' size={1} gap={16} />
    </ReactFlow>
  );
};

export default CrossFlow;
