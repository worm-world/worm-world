import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: 'node1', position: { x: -10, y: 0 }, data: { label: '1' } },
  { id: 'node2', position: { x: 25, y: 25 }, data: { label: '2' } },
];

const CrossFlow = (): JSX.Element => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  return (
    <ReactFlow
      zoomOnScroll={false}
      preventScrolling={false}
      fitView
      nodes={nodes}
      onNodesChange={onNodesChange}
      defaultViewport={{ x: 0, y: 0, zoom: 0.2 }}
    >
      <Background color='blue' size={2} gap={24} />
      <Controls position='top-left' />
      <MiniMap position='top-right' />
    </ReactFlow>
  );
};

export default CrossFlow;
