import { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import FlowWrapper from 'components/FlowWrapper/FlowWrapper';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import CrossNode from 'components/CrossNode/CrossNode';
import { TreeNode } from 'models/frontend/CrossTree/TreeNode';

interface iCrossFlowProps {
  className?: string;
  crossTree: CrossTree;
}

// function addParents(
//   initialNodes: Array<Node<JSX.Element>>,
//   treeNode: TreeNode
// ) {}

const CrossFlow = (props: iCrossFlowProps): JSX.Element => {
  const nodeTypes = useMemo(() => ({ flowWrapper: FlowWrapper }), []);

  const initialNodes: Array<Node<JSX.Element>> = [];

  props.crossTree.trees.forEach((treeNode) => {
    // Breadth first search
    const fringe: TreeNode[] = [treeNode];
    let nextId = 0;
    while (fringe.length > 0) {
      const treeNode = fringe.pop() as TreeNode; // guaranteed assertion b/c line above
      initialNodes.unshift({
        id: `node-${nextId++}`,
        type: 'flowWrapper',
        position: treeNode.position,
        data: <CrossNode model={treeNode.crossNodeModel}></CrossNode>,
        connectable: false,
      });
      if (treeNode.maleParent !== undefined) {
        fringe.push(treeNode.maleParent);
      }
      if (treeNode.femaleParent !== undefined) {
        fringe.push(treeNode.femaleParent);
      }
    }
  });

  console.log(initialNodes);

  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // const onEdgeUpdate = useCallback(
  //   (oldEdge: Edge<any>, newConnection: Connection) =>
  //     setEdges((els) => updateEdge(oldEdge, newConnection, els)),
  //   []
  // );
  // const onConnect = useCallback(
  //   (params: Edge<any> | Connection) => setEdges((eds) => addEdge(params, eds)),
  //   []
  // );

  return (
    <ReactFlow
      className={props.className}
      zoomOnScroll={true}
      fitView
      nodes={initialNodes}
      // edges={edges}
      nodeTypes={nodeTypes}
      // onNodesChange={props.onNodesChange}
      // onEdgesChange={onEdgesChange}
      // onEdgeUpdate={onEdgeUpdate}
      // onConnect={onConnect}
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
