/**
 * The approach here is to 'load' the editor with a cross tree.
 * That cross tree model is unchanged when the user adds nodes and edges, but the editor's tree is updated through such
 * interaction. The in-editor tree is read into a cross tree model when save is clicked. This is to say,
 * the editor manages its own state and only exchanges state with the exterior software through load and save operations.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getFilteredAlleles } from 'api/allele';
import CrossFlow, { FlowType } from 'components/CrossFlow/CrossFlow';
import CrossNodeForm from 'components/CrossNodeForm/CrossNodeForm';
import EditorTop from 'components/EditorTop/EditorTop';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import RightDrawer from 'components/RightDrawer/RightDrawer';
import { Allele } from 'models/frontend/Allele/Allele';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import {
  Edge,
  Connection,
  addEdge,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  NodeChange,
  XYPosition,
} from 'reactflow';
import { saveCrossTree } from 'api/crossTree';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain, StrainOption } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import { MenuItem } from 'components/CrossNodeMenu/CrossNodeMenu';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { toast } from 'react-toastify';

export interface CrossEditorProps {
  currentTree: CrossTree;
}

type DrawerState = 'default' | 'cross';

const CrossEditor = (props: CrossEditorProps): JSX.Element => {
  const treeRef = useRef(props.currentTree);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>('default');
  const [nodes, setNodes] = useState<Node[]>(treeRef.current.nodes);
  const [edges, setEdges] = useState<Edge[]>(treeRef.current.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      (treeRef.current.nodes = applyNodeChanges(
        changes,
        treeRef.current.nodes
      )),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      (treeRef.current.edges = applyEdgeChanges(
        changes,
        treeRef.current.edges
      )),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) =>
      (treeRef.current.edges = addEdge(connection, treeRef.current.edges)),
    []
  );

  const refresh = (() => {
    const [setVal, set] = useState(false);
    return useCallback(() => set(!setVal), []);
  })();
  useEffect(() => {
    setNodes([...treeRef.current.nodes]);
    setEdges([...treeRef.current.edges]);
  });

  // #region Flow Component Creation
  const createStrainNode = (
    sex: Sex,
    strain: Strain,
    position: XYPosition
  ): Node => {
    const nodeId = props.currentTree.getNextId();
    const strainNode: Node = {
      id: nodeId,
      type: FlowType.Strain,
      position,
      data: {
        sex,
        strain,
        getMenuItems: (node: CrossNodeModel) =>
          getCrossNodeMenuItems(node, nodeId),
      },
    };
    return strainNode;
  };

  const createXIcon = (position: XYPosition): Node => {
    const newXIcon: Node = {
      id: props.currentTree.getNextId(),
      type: FlowType.XIcon,
      position,
      data: {},
      connectable: true,
    };
    return newXIcon;
  };

  const createSelfIcon = (position: XYPosition): Node => {
    const newSelfIcon: Node = {
      id: props.currentTree.getNextId(),
      type: FlowType.SelfIcon,
      position,
      data: {},
      connectable: true,
    };
    return newSelfIcon;
  };

  const createEdge = (
    source: Node,
    target: Node,
    args?: { sourceHandle?: string; targetHandle?: string }
  ): Edge => {
    const edge: Edge = {
      id: props.currentTree.getNextId(),
      source: source.id,
      target: target.id,
      sourceHandle: args?.sourceHandle,
      targetHandle: args?.targetHandle,
    };
    return edge;
  };
  // #endregion Flow Component Creation

  const getDrawerCallback = (): ((sex: Sex, pairs: AllelePair[]) => void) => {
    switch (drawerState) {
      case 'default':
        return addStrain;
      case 'cross':
        return crossNodes;
      default:
        return () => {};
    }
  };

  const addStrain = (sex: Sex, pairs: AllelePair[]): void => {
    const newStrain = createStrainNode(
      sex,
      new Strain({ allelePairs: pairs }),
      { x: 0, y: 0 }
    );
    treeRef.current.addNode(newStrain);
    refresh();
  };

  const selfCross = (): void => {
    const selfIconPos = treeRef.current.getSelfIconPos();
    const selfIcon = createSelfIcon(selfIconPos);
    const edge = createEdge(treeRef.current.getCurrNode(), selfIcon, {
      sourceHandle: 'bottom',
    });
    const currStrain: CrossNodeModel = treeRef.current.getCurrNode().data;
    if (currStrain === undefined) toast.error('something went wrong...');
    const children = currStrain.strain.selfCross();

    const childPositions = calculateChildPositions(
      selfIcon.position,
      children,
      selfIcon.width ?? undefined,
      treeRef.current.getCurrNode().width ?? undefined
    );
    const childrenNodes = children.map((child, i) => {
      return createStrainNode(
        Sex.Hermaphrodite,
        child.strain,
        childPositions[i]
      );
    });
    const childrenEdges = childrenNodes.map((node) =>
      createEdge(selfIcon, node)
    );

    treeRef.current.addNodes([selfIcon, ...childrenNodes]);
    treeRef.current.addEdges([edge, ...childrenEdges]);
    refresh();
  };

  const crossNodes = (sex: Sex, pairs: AllelePair[]): void => {
    const xIconPos = treeRef.current.getXIconPos();
    const strainPos = treeRef.current.getCrossStrainPos();

    const xIcon = createXIcon(xIconPos);
    const newStrainNode = createStrainNode(
      sex,
      new Strain({ allelePairs: pairs }),
      strainPos
    );

    const e1 = createEdge(treeRef.current.getCurrNode(), xIcon, {
      targetHandle:
        treeRef.current.getCurrNode().data.sex === Sex.Male ? 'left' : 'right',
    });
    const e2 = createEdge(newStrainNode, xIcon, {
      targetHandle: newStrainNode.data.sex === Sex.Male ? 'left' : 'right',
    });

    const newStrain: CrossNodeModel = newStrainNode.data;
    const otherStrain: CrossNodeModel = treeRef.current.getCurrNode().data;
    const children = newStrain.strain.crossWith(otherStrain.strain);

    const childPositions = calculateChildPositions(
      xIcon.position,
      children,
      xIcon.width ?? undefined,
      treeRef.current.getCurrNode().width ?? undefined
    );

    const childrenNodes = children.map((child, i) => {
      return createStrainNode(
        Sex.Hermaphrodite,
        child.strain,
        childPositions[i]
      );
    });

    const childrenEdges = childrenNodes.map((node) => createEdge(xIcon, node));
    treeRef.current.addNodes([xIcon, newStrainNode, ...childrenNodes]);
    treeRef.current.addEdges([e1, e2, ...childrenEdges]);
    refresh();
  };

  const getCrossNodeMenuItems = (
    crossNode: CrossNodeModel,
    nodeId: string
  ): MenuItem[] => {
    const canSelfCross = crossNode.sex === Sex.Hermaphrodite;
    const selfOption: MenuItem = {
      icon: <SelfCrossIcon />,
      text: 'Self cross',
      menuCallback: () => {
        treeRef.current.setCurrNode(nodeId);
        selfCross();
      },
    };
    const crossOption: MenuItem = {
      icon: <CrossIcon />,
      text: 'Cross',
      menuCallback: () => {
        treeRef.current.setCurrNode(nodeId);
        setDrawerState('cross');
        setRightDrawerOpen(true);
      },
    };
    const exportOption: MenuItem = {
      icon: <ScheduleIcon />,
      text: 'schedule',
      menuCallback: () => {},
    };

    const items = [crossOption, exportOption];
    if (canSelfCross) items.unshift(selfOption);

    return items;
  };

  const buttons = [
    <button
      key='save'
      className='btn-primary btn mr-4'
      onClick={() => saveTree(nodes, edges, props.currentTree)}
    >
      Save
    </button>,
    <button
      key='addNewNode'
      className='btn ml-auto mr-10'
      onClick={() => {
        setRightDrawerOpen(true);
        setDrawerState('default');
      }}
    >
      Add New Cross Node
    </button>,
  ];

  let enforcedSex: Sex | undefined;
  if (drawerState === 'cross')
    enforcedSex =
      treeRef.current.getCurrNode().data?.sex === Sex.Male
        ? Sex.Hermaphrodite
        : Sex.Male;

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
                getFilteredAlleles={getFilteredAlleles}
                onSubmitCallback={getDrawerCallback()}
                createAlleleFromRecord={Allele.createFromRecord}
                enforcedSex={enforcedSex}
              />
            </RightDrawer>
          </div>
        </div>
      </div>
    </>
  );
};

const saveTree = (nodes: Node[], edges: Edge[], tree: CrossTree): void => {
  tree.lastSaved = new Date();
  tree.nodes = nodes;
  tree.edges = edges;
  saveCrossTree(tree).catch((error) => error);
};

const calculateChildPositions = (
  parentPos: XYPosition,
  children: StrainOption[],
  parentWidth?: number,
  childWidth?: number
): XYPosition[] => {
  const parWidth = parentWidth ?? 64;
  const width = childWidth ?? 256;
  const startingX = parentPos.x + parWidth / 2;
  const nodePadding = 10;
  const xDistance = width + nodePadding;
  const totalWidth = xDistance * children.length - nodePadding;
  const offSet = totalWidth / 2;
  const yPos = parentPos.y + 150;

  let currXPos = startingX - offSet;
  const positions: XYPosition[] = [];
  children.forEach((_) => {
    positions.push({
      x: currXPos,
      y: yPos,
    });
    currXPos += xDistance;
  });
  return positions;
};

export default CrossEditor;
