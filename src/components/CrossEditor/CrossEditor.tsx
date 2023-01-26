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
import { useState, useCallback } from 'react';
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
  currentTree: CrossTree;
}

const CrossEditor = (props: CrossEditorProps): JSX.Element => {
  const [nodes, setNodes] = useState<Node[]>(props.currentTree.nodes);
  const [edges, setEdges] = useState<Edge[]>(props.currentTree.edges);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  resetNextId(nodes);

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

  const buttons = [
    <button
      key='save'
      className='btn'
      onClick={() => saveTree(nodes, edges, props.currentTree)}
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
              name={props.currentTree.name ?? ''}
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

// We are going to be adding new nodes, so we need to standardize ids and avoid collision
const resetNextId = (nodes: Node[]): void => {
  let maxId = 0;
  nodes.forEach((node) => {
    if (parseInt(node.id) > maxId) {
      maxId = parseInt(node.id);
    }
  });
  nextId = maxId + 1;
};

const addNewCrossNodeToFlow = (
  existingNodes: Node[],
  setNodes: (nodes: Node[]) => void,
  newNode: CrossNodeModel
): void => {
  const newFlowNode: Node = {
    id: (nextId++).toString(),
    type: 'crossNodeFlowWrapper',
    position: { x: 150, y: -100 },
    data: newNode,
    connectable: true,
  };
  setNodes([...existingNodes, newFlowNode]);
};

const saveTree = (nodes: Node[], edges: Edge[], tree: CrossTree): void => {
  const newCrossTree = new CrossTree({
    id: tree.id,
    name: tree.name,
    description: tree.description,
    settings: {
      longName: tree.settings.longName,
      contents: tree.settings.contents,
    },
    nodes,
    edges,
    lastSaved: new Date(),
    genes: [],
    variations: [],
  });

  saveCrossTree(newCrossTree).catch((error) => error);
};

export default CrossEditor;
