import { useCallback, useState, useRef } from 'react';
import './App.css';
import ReactFlow, { OnConnectStartParams } from 'react-flow-renderer';
import {
  useReactFlow, 
  useNodesState, 
  useEdgesState, 
  Node, 
  Edge, 
  NodeChange, 
  EdgeChange,
  addEdge,
  Connection,
  ReactFlowProvider
} from 'react-flow-renderer';

const initialNodes: Node[] = [
  { id: '0', data: { label: 'Node 1' }, position: { x: 5, y: 5 } },
];


let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 3,
};

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const onConnect = useCallback((params : Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const onConnectStart = useCallback((_ : any, {nodeId} : OnConnectStartParams) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectStop = useCallback(
    (event: MouseEvent) => {

      const targetIsPane = (event.target instanceof Element) && event.target?.classList.contains('react-flow__pane');

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        // @ts-ignore
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          // we are removing the half of the node width (75) to center the new node
          position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
          data: { label: `Node ${id}` },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds: Edge[]) =>
          eds.concat({ id, source: connectingNodeId.current, target: id } as Edge)
        );
      }
    },
    [project]
  );

  return (
    <div className="main" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectStop={onConnectStop}
        fitView
        fitViewOptions={fitViewOptions}
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);