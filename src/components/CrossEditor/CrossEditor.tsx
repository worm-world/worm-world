import { getFilteredAlleles } from 'api/allele';
import { getFilteredGenes } from 'api/gene';
import { getFilteredVariations } from 'api/variationInfo';
import CrossFlow from 'components/CrossFlow/CrossFlow';
import CrossNode from 'components/CrossNode/CrossNode';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import EditorTop from 'components/EditorTop/EditorTop';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import { XNode } from 'components/XNode/XNode';
import { Allele } from 'models/frontend/Allele/Allele';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { TreeNode } from 'models/frontend/TreeNode/TreeNode';
import React, { useState, useCallback } from 'react';
import {
  Edge,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
  Connection,
  addEdge,
  Node,
} from 'reactflow';

export interface CrossEditorProps {
  crossTree: CrossTree | null;
}

const CrossEditor = (props: CrossEditorProps): JSX.Element => {
  if (props.crossTree === null) return <></>; // Still loading
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);
  const [initialNodes, initialEdges] = getNodesAndEdges(props.crossTree);
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
      <div>
        <div className='drawer drawer-end'>
          <input
            id='right-cross-drawer'
            type='checkbox'
            className='drawer-toggle'
            readOnly
            checked={rightDrawerOpen}
          />
          <div className='drawer-content flex h-screen flex-col'>
            <EditorTop
              name={props.crossTree?.name ?? ''}
              rightButton={rightButton}
            ></EditorTop>
            <div className='grow'>
              <div className='h-full w-full'>
                <CrossFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
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
                addNewCrossNode={(newNode) =>
                  addNewNodeToFlow(nodes, setNodes, newNode)
                }
                alleleCreateFromRecord={Allele.createFromRecord}
              />
            </RightDrawer>
          </div>
        </div>
      </div>
    </>
  );
};

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

const getNodesAndEdges = (crossTree: CrossTree): [Node[], Edge[]] => {
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

export default CrossEditor;
