import { TopNav } from 'components/TopNav/TopNav';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import React, { useCallback, useState } from 'react';
import CrossFlow from 'components/CrossFlow/CrossFlow';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import CrossNode from 'components/CrossNode/CrossNode';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import { getFilteredVariations } from 'api/variationInfo';
import { getFilteredGenes } from 'api/gene';
import { getFilteredAlleles } from 'api/allele';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Allele } from 'models/frontend/Allele/Allele';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useOutletContext } from 'react-router-dom';
import { TreeNode } from 'models/frontend/CrossTree/TreeNode';
import { XNode } from 'components/XNode/XNode';

const addNewNodeToFlow = (
  existingNodes: Node[],
  setNodes: (nodes: Node[]) => void,
  newNode: CrossNodeModel
): void => {
  const newTreeNode: TreeNode = new TreeNode({
    value: newNode,
    position: { x: 0, y: 0 },
  });
  const newFlowNode: Node = {
    id: newTreeNode.id.toString(),
    type: 'flowWrapper',
    position: { x: 150, y: -100 },
    data: <CrossNode model={newNode} />,
    connectable: true,
  };
  setNodes([...existingNodes, newFlowNode]);
};

const CrossPage = (): JSX.Element => {
  const [currentTree]: [CrossTree, (tree: CrossTree) => void] =
    useOutletContext();

  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);
  const [initialNodes, initialEdges] = getInitialNodesAndEdges(currentTree);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const rightButton = (
    <button
      className='btn ml-auto mr-10'
      onClick={() => setRightDrawerOpen(true)}
    >
      Add New Cross Node
    </button>
  );

  return (
    <>
      <TopNav title={'Cross Designer'} rightButton={rightButton}></TopNav>
      <div className='drawer drawer-end'>
        <input
          id='right-cross-drawer'
          type='checkbox'
          className='drawer-toggle'
          readOnly
          checked={rightDrawerOpen}
        />
        <div className='drawer-content flex h-screen flex-col'>
          <div className='grow'>
            <div className='h-full w-full'>
              <CrossFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                crossTree={currentTree}
              />
            </div>
          </div>
        </div>
        <div className={'drawer-side drawer-end h-full '}>
          <label
            htmlFor='right-cross-drawer'
            className='drawer-overlay'
            onClick={() => setRightDrawerOpen(false)}
          ></label>
          <RightDrawer
            initialDrawerWidth={240}
            isOpen={rightDrawerOpen}
            maxWidth={400}
            close={() => setRightDrawerOpen(false)}
          >
            <CrossNodeForm
              getFilteredGenes={getFilteredGenes}
              getFilteredVariations={getFilteredVariations}
              getFilteredAlleles={getFilteredAlleles}
              addNewCrossNode={(crossNode: CrossNodeModel) =>
                addNewNodeToFlow(nodes, setNodes, crossNode)
              }
              alleleCreateFromRecord={Allele.createFromRecord}
            />
          </RightDrawer>
        </div>
      </div>
    </>
  );
};

const getInitialNodesAndEdges = (crossTree: CrossTree): [Node[], Edge[]] => {
  const initialNodes: Array<Node<JSX.Element>> = [];
  const initialEdges: Array<Edge<JSX.Element>> = [];

  crossTree.treeNodes.forEach((treeNode) => {
    initialNodes.push({
      id: `${treeNode.id}`,
      type: 'flowWrapper',
      position: treeNode.position,
      data: <CrossNode model={treeNode.crossNodeModel}></CrossNode>,
    });
    if (
      treeNode.femaleParent !== undefined &&
      treeNode.maleParent !== undefined
    ) {
      constructFemaleMaleAndChild(treeNode, initialNodes, initialEdges);
    } else if (treeNode.maleParent !== undefined) {
      initialEdges.push({
        id: `${treeNode.maleParent.id}-${treeNode.id}`,
        source: treeNode.maleParent.id.toString(),
        sourceHandle: 'bottom',
        target: treeNode.id.toString(),
        targetHandle: 'top',
      });
    } else if (treeNode.femaleParent !== undefined) {
      initialEdges.push({
        id: `${treeNode.femaleParent.id}-${treeNode.id}`,
        source: treeNode.femaleParent.id.toString(),
        sourceHandle: 'bottom',
        target: treeNode.id.toString(),
        targetHandle: 'top',
      });
    }
  });
  return [initialNodes, initialEdges];
};

/**
 * Adds an X-node to the tree and edges connecting
 * female to X, male to X, and X to child
 */
const constructFemaleMaleAndChild = (
  childNode: TreeNode,
  initialNodes: Node[],
  initialEdges: Edge[]
): void => {
  initialNodes.push({
    id: `x-node-${childNode.id}`,
    type: 'flowWrapper',
    position: {
      x:
        ((childNode.femaleParent?.position.x ?? 0) +
          (childNode.maleParent?.position.x ?? 0)) /
          2 +
        96,
      y:
        ((childNode.femaleParent?.position.y ?? 0) +
          (childNode.maleParent?.position.y ?? 0)) /
          2 +
        24,
    },
    data: <XNode />,
  });
  initialEdges.push({
    id: `${childNode.femaleParent?.id}-${childNode.id}`,
    source: childNode.femaleParent?.id.toString() ?? '',
    sourceHandle: 'left',
    target: `x-node-${childNode.id}`,
    targetHandle: 'right',
  });
  initialEdges.push({
    id: `${childNode.maleParent?.id}-${childNode.id}`,
    source: childNode.maleParent?.id.toString() ?? '',
    sourceHandle: 'right',
    target: `x-node-${childNode.id}`,
    targetHandle: 'left',
  });
  initialEdges.push({
    id: `x-node-${childNode.id}-${childNode.id}`,
    source: `x-node-${childNode.id}`,
    sourceHandle: 'bottom',
    target: `${childNode.id}`,
    targetHandle: 'top',
  });
};

export default CrossPage;
