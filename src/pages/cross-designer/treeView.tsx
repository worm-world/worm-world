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
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { useOutletContext } from 'react-router-dom';
import { TreeNode } from 'models/frontend/CrossTree/TreeNode';

const addNewNodeToFlow = (
  existingNodes: Node[],
  setNodes: (nodes: Node[]) => void,
  newNode: CrossNodeModel
): void => {
  const newTreeNode: TreeNode = new TreeNode(newNode, { x: 0, y: 0 });
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
  const [currentTreeId, setCurrentTreeId]: [number, (num: number) => void] =
    useOutletContext();
  // For now, ignore tree id and use mock
  const tree: CrossTree = mockCrossTree.ed3CrossTree;

  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);
  const [initialNodes, initialEdges] = getInitialNodesAndEdges(tree);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
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
                crossTree={tree}
              />
            </div>
          </div>
        </div>
        <div className={'drawer-end drawer-side h-full '}>
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
    if (treeNode.maleParent) {
      initialEdges.push({
        id: `${treeNode.maleParent.id}-${treeNode.id}`,
        source: treeNode.maleParent.id.toString(),
        target: treeNode.id.toString(),
      });
      if (treeNode.femaleParent) {
        initialEdges.push({
          id: `${treeNode.femaleParent.id}-${treeNode.id}`,
          source: treeNode.femaleParent.id.toString(),
          target: treeNode.id.toString(),
        });
      }
    }
  });
  console.log('nodes', initialNodes);
  return [initialNodes, initialEdges];
};

export default CrossPage;
