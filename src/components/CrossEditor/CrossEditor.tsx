/**
 * The approach here is to 'load' the editor with a cross tree.
 * That cross tree model is unchanged when the user adds nodes and edges, but the editor's tree is updated through such
 * interaction. The in-editor tree is read into a cross tree model when save is clicked. This is to say, the editor manages its own state
 * and only exchanges state with the exterior software through load and save operations.
 */

import { getFilteredAlleles } from 'api/allele';
import { getFilteredGenes } from 'api/gene';
import { getFilteredVariations } from 'api/variationInfo';
import CrossFlow from 'components/CrossFlow/CrossFlow';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import EditorTop from 'components/EditorTop/EditorTop';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import RightDrawer from 'components/RightDrawer/RightDrawer';
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
import { saveCrossTree } from 'api/crossTree';

let nextId = 0; // used to identify nodes in tree
export interface CrossEditorProps {
  crossTree: CrossTree | null;
}

const CrossEditor = (props: CrossEditorProps): JSX.Element => {
  if (props.crossTree === null) return <></>; // Still loading

  assignIdsToTreeNodes(props.crossTree);

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
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const buttons = [
    <button
      key='save'
      className='btn'
      onClick={() => saveTree(nodes, edges, props.crossTree as CrossTree)}
    >
      Save
    </button>,
    <button
      key='addNewNode'
      className='btn ml-auto mr-10'
      onClick={() => setRightDrawerOpen(true)}
    >
      Add New Cross Node
    </button>,
  ];

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
              buttons={buttons}
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
                  addNewCrossNodeToFlow(nodes, setNodes, newNode)
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

// Within a react flow, tree node models need to have unique identifiers
// corresponding to their CrossNodeWrappers, allowing us to look up the cross node model from id
const assignIdsToTreeNodes = (crossTree: CrossTree): void => {
  crossTree.treeNodes.forEach((node) => {
    node.id = node.id ?? nextId++;
  });
};

const addNewCrossNodeToFlow = (
  existingNodes: Node[],
  setNodes: (nodes: Node[]) => void,
  newNode: CrossNodeModel
): void => {
  const newTreeNode: TreeNode = new TreeNode({
    value: newNode,
    position: { x: 0, y: 0 },
  });

  const newFlowNode: Node = {
    id: (nextId++).toString(),
    type: 'crossNodeFlowWrapper',
    position: { x: 150, y: -100 },
    data: newTreeNode.crossNodeModel,
    connectable: true,
  };
  setNodes([...existingNodes, newFlowNode]);
};

const getNodesAndEdges = (crossTree: CrossTree): [Node[], Edge[]] => {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  crossTree.treeNodes.forEach((treeNode) => {
    initialNodes.push({
      id: `${treeNode.id}`,
      type: 'crossNodeFlowWrapper',
      position: treeNode.position,
      data: treeNode.crossNodeModel,
    });
    if (
      treeNode.femaleParent !== undefined &&
      treeNode.maleParent !== undefined
    ) {
      constructFemaleMaleAndChild(treeNode, initialNodes, initialEdges);
    } else if (treeNode.femaleParent !== undefined) {
      constructHermaphroditeAndChild(treeNode, initialNodes, initialEdges);
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
  const xNodeId = (nextId++).toString();
  initialNodes.push({
    id: xNodeId,
    type: 'xNodeFlowWrapper',
    position: {
      // Centered between parents
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
    data: undefined,
  });
  initialEdges.push({
    id: `${childNode.femaleParent?.id}-${xNodeId}`,
    source: childNode.femaleParent?.id?.toString() ?? '',
    sourceHandle: 'left',
    target: xNodeId,
    targetHandle: 'right',
  });
  initialEdges.push({
    id: `${childNode.maleParent?.id}-${xNodeId}`,
    source: childNode.maleParent?.id?.toString() ?? '',
    sourceHandle: 'right',
    target: xNodeId,
    targetHandle: 'left',
  });
  initialEdges.push({
    id: `${xNodeId}-${childNode.id}`,
    source: xNodeId,
    sourceHandle: 'bottom',
    target: `${childNode.id}`,
    targetHandle: 'top',
  });
};

/**
 * Adds an self-node to the tree and edges connecting
 * hermaphrodite to selfnode and selfnode to child
 */
const constructHermaphroditeAndChild = (
  childNode: TreeNode,
  initialNodes: Node[],
  initialEdges: Edge[]
): void => {
  const selfNodeId = (nextId++).toString();
  initialNodes.push({
    id: selfNodeId,
    type: 'selfNodeFlowWrapper',
    position: {
      x: (childNode.femaleParent?.position.x ?? 0) + 96,
      y: (childNode.femaleParent?.position.y ?? 0) + 124,
    },
    data: undefined,
  });
  initialEdges.push({
    id: `${childNode.femaleParent?.id}-${selfNodeId}`,
    source: childNode.femaleParent?.id?.toString() ?? '',
    sourceHandle: 'bottom',
    target: `${selfNodeId}`,
    targetHandle: 'top',
  });
  initialEdges.push({
    id: `${selfNodeId}-${childNode.id}`,
    source: selfNodeId,
    sourceHandle: 'bottom',
    target: `${childNode.id}`,
    targetHandle: 'top',
  });
};

const saveTree = (nodes: Node[], edges: Edge[], tree: CrossTree): void => {
  const treeNodes = new Map<string, TreeNode>(); // id -> node
  const xNodeIds: string[] = [];
  const selfNodeIds: string[] = [];

  nodes.forEach((node) => {
    if (node.type === 'crossNodeFlowWrapper') {
      const newTreeNode = new TreeNode({
        id: parseInt(node.id),
        value: node.data,
        position: { x: node.position.x, y: node.position.y },
      });
      treeNodes.set(newTreeNode?.id?.toString() ?? '', newTreeNode);
    } else if (node.type === 'xNodeFlowWrapper') {
      xNodeIds.push(node.id);
    } else {
      selfNodeIds.push(node.id);
    }
  });

  edges.forEach((edge) => {
    // child nodes emanate from x nodes or self nodes
    if (xNodeIds.includes(edge.source) || selfNodeIds.includes(edge.source)) {
      const childNode = treeNodes.get(edge.target);
      // Find child's parent(s)
      if (childNode !== undefined) {
        edges.forEach((edge2) => {
          if (edge2.target === edge.source) {
            // Then edge2 is from a parent
            if (edge2.sourceHandle === 'right') {
              // Only males have right handles
              childNode.maleParent = treeNodes.get(edge2.source);
            } else {
              childNode.femaleParent = treeNodes.get(edge2.source);
            }
          }
        });
      }
    }
  });

  const newCrossTree = new CrossTree({
    id: 7,
    name: tree.name,
    description: tree.description,
    settings: {
      longName: tree.settings.longName,
      contents: tree.settings.contents,
    },
    treeNodes: Array.from(treeNodes.values()),
    lastSaved: new Date(),
    genes: [],
    variations: [],
  });

  saveCrossTree(newCrossTree)
    .then()
    .catch((error) => error);
};

export default CrossEditor;
