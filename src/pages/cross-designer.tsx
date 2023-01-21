import { TopNav } from 'components/TopNav/TopNav';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import React from 'react';
import CrossFlow from 'components/CrossFlow/CrossFlow';
import { Node, useNodesState } from 'reactflow';
import CrossNode from 'components/CrossNode/CrossNode';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import { getFilteredAlleles } from 'api/allele';
import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';
import { Allele } from 'models/frontend/Allele/Allele';
import * as mockCrossTree from 'models/frontend/CrossTree/CrossTree.mock';

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
            <CrossFlow crossTree={mockCrossTree.ed3CrossTree} />
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

export default CrossPage;
