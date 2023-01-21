import { TopNav } from 'components/TopNav/TopNav';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import React from 'react';
import CrossFlow from 'components/CrossFlow/CrossFlow';
import { Node, useNodesState } from 'reactflow';
import CrossNode from 'components/CrossNode/CrossNode';
import { XNode } from 'components/XNode/XNode';
import * as mock from 'models/frontend/CrossNode/CrossNode.mock';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import { getFilteredAlleles } from 'api/allele';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Allele } from 'models/frontend/Allele/Allele';

let nextNodeId = 5;

const addNewNodeToFlow = (
  nodes: Node[],
  setNodes: (nodes: Node[]) => void,
  newNode: CrossNodeModel
): void => {
  const newFlowNode: Node = {
    id: nextNodeId.toString(),
    type: 'flowWrapper',
    position: { x: 150, y: -100 },
    data: <CrossNode {...newNode} />,
    connectable: true,
  };
  nextNodeId += 1;
  setNodes([...nodes, newFlowNode]);
};

const CrossPage = (): JSX.Element => {
  const [rightDrawerOpen, setRightDrawerOpen] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const rightButton = (
    <button
      className='btn ml-auto mr-10'
      onClick={() => setRightDrawerOpen(true)}
    >
      Add New Cross Node
    </button>
  );

  return (
    <div className='drawer drawer-end'>
      <input
        id='right-cross-drawer'
        type='checkbox'
        className='drawer-toggle'
        readOnly
        checked={rightDrawerOpen}
      />
      <div className='drawer-content flex h-screen flex-col'>
        <TopNav title={'Cross Designer'} rightButton={rightButton}>
          <span key='new-cross'>New Cross</span>
          <span key='open-cross'>Open Cross</span>
          <span key='export-cross'>Export Cross</span>
        </TopNav>
        <div className='grow'>
          <div className='h-full w-full'>
            <CrossFlow
              nodes={nodes}
              onNodesChange={onNodesChange}
              className={''}
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
            getFilteredAlleles={getFilteredAlleles}
            addNewCrossNode={(newNode: CrossNodeModel) => {
              addNewNodeToFlow(nodes, setNodes, newNode);
              setRightDrawerOpen(false);
            }}
            createAlleleFromRecord={Allele.createFromRecord}
          />
        </RightDrawer>
      </div>
    </div>
  );
};

const initialNodes: Array<Node<JSX.Element>> = [
  {
    id: 'node1',
    type: 'flowWrapper', // This is the type of our custom node
    position: { x: -150, y: -100 },
    data: <CrossNode {...mock.emptyMale}></CrossNode>, // data = children for flowWrapper
    connectable: true,
  },
  {
    id: 'node2',
    type: 'flowWrapper',
    position: { x: 150, y: -100 },
    data: <CrossNode {...mock.wild}></CrossNode>,
    connectable: true,
  },
  {
    id: 'node3',
    type: 'flowWrapper',
    position: { x: 0, y: 200 },
    data: <CrossNode {...mock.wild}></CrossNode>,
    connectable: true,
  },
  {
    id: 'xNode1',
    type: 'flowWrapper',
    position: { x: 95, y: 75 },
    data: <XNode />,
    connectable: true,
  },
];

export default CrossPage;
