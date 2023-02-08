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
import { insertTree } from 'api/crossTree';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import { MenuItem } from 'components/CrossNodeMenu/CrossNodeMenu';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { toast } from 'react-toastify';
import { insertDbTasks } from 'api/task';
import { useNavigate } from 'react-router-dom';
import NoteForm from 'components/NoteForm/NoteForm';

export interface CrossEditorProps {
  crossTree: CrossTree;
}

type DrawerState = 'addStrain' | 'cross' | 'addNote' | 'replaceNote';

const CrossEditor = (props: CrossEditorProps): JSX.Element => {
  const treeRef = useRef(props.crossTree);
  const navigate = useNavigate();
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>('addStrain');
  const [nodes, setNodes] = useState<Node[]>(treeRef.current.nodes);
  const [edges, setEdges] = useState<Edge[]>(treeRef.current.edges);
  const [noteFormContent, setNoteFormContent] = useState('');

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    treeRef.current.nodes = applyNodeChanges(changes, treeRef.current.nodes);
    refresh();
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    treeRef.current.edges = applyEdgeChanges(changes, treeRef.current.edges);
    refresh();
  }, []);
  const onConnect = useCallback((connection: Connection) => {
    treeRef.current.edges = addEdge(connection, treeRef.current.edges);
    refresh();
  }, []);

  const refresh = (() => {
    const [, set] = useState(false);
    return useCallback(() => set((a) => !a), []);
  })();

  useEffect(() => {
    setNodes([...treeRef.current.nodes]);
    setEdges([...treeRef.current.edges]);
  }, [treeRef.current.nodes, treeRef.current.edges]);
  // #region Flow Component Creation
  const createStrainNode = (
    sex: Sex,
    strain: Strain,
    position: XYPosition,
    probability?: number
  ): Node => {
    const nodeId = treeRef.current.getNextId();
    const strainNode: Node = {
      id: nodeId,
      type: FlowType.Strain,
      position,
      data: {
        sex,
        strain,
        probability,
        getMenuItems: (node: CrossNodeModel) =>
          getCrossNodeMenuItems(node, nodeId),
        toggleSex: () => toggleCrossNodeSex(nodeId),
      },
      className: 'nowheel',
    };
    return strainNode;
  };

  const createXIcon = (position: XYPosition): Node => {
    const newXIcon: Node = {
      id: treeRef.current.getNextId(),
      type: FlowType.XIcon,
      position,
      data: {},
    };
    return newXIcon;
  };

  const createSelfIcon = (position: XYPosition): Node => {
    const newSelfIcon: Node = {
      id: treeRef.current.getNextId(),
      type: FlowType.SelfIcon,
      position,
      data: {},
    };
    return newSelfIcon;
  };

  const createEdge = (
    source: Node,
    target: Node,
    args?: { sourceHandle?: string; targetHandle?: string }
  ): Edge => {
    const edge: Edge = {
      id: treeRef.current.getNextId(),
      source: source.id,
      target: target.id,
      sourceHandle: args?.sourceHandle,
      targetHandle: args?.targetHandle,
    };
    return edge;
  };

  const createNote = (content: string, position: XYPosition): Node => {
    const noteNode: Node = {
      id: treeRef.current.getNextId(),
      type: FlowType.Note,
      position,
      data: {
        content,
        onDoubleClick: () => {
          treeRef.current.setCurrNode(noteNode.id);
          setNoteFormContent(content);
          setDrawerState('replaceNote');
          setRightDrawerOpen(true);
        },
      },
      className: 'nowheel',
    };
    return noteNode;
  };

  const toggleCrossNodeSex = (nodeId: string): void => {
    const oldNode = treeRef.current.getNodeById(nodeId);
    const data: CrossNodeModel = oldNode.data;
    const [childNodes] = treeRef.current.getDecendentNodesAndEdges(oldNode);
    if (data.sex === undefined || data.sex === null) return;
    if (childNodes.length > 0) {
      toast.error(
        "Can't change the sex of a strain currently involved in a cross"
      );
      return;
    }

    // get dependent edges to update
    const parentIconId =
      treeRef.current.edges.find((edge) => edge.target === oldNode.id)
        ?.source ?? '-1';
    const parentIcon = treeRef.current.getNodeById(parentIconId);

    // replace node with new node of opposite sex
    const newSex = data.sex === Sex.Male ? Sex.Hermaphrodite : Sex.Male;
    treeRef.current.removeNode(oldNode);
    const newNode = createStrainNode(newSex, data.strain, oldNode.position);
    treeRef.current.addNode(newNode);

    // update edges with new id and add to map
    treeRef.current.removeEdges({
      sourceId: parentIconId,
      targetId: oldNode.id,
    });
    if (parentIconId !== '-1')
      treeRef.current.addEdge(createEdge(parentIcon, newNode));
  };
  // #endregion Flow Component Creation

  const getCrossNodeFormCallback = (): ((
    sex: Sex,
    pairs: AllelePair[]
  ) => void) => {
    switch (drawerState) {
      case 'addStrain':
        return addStrain;
      case 'cross':
        return crossNodes;
      default:
        return () => {};
    }
  };

  const getNoteFormCallback = (): (() => void) => {
    switch (drawerState) {
      case 'addNote':
        return addNote;
      case 'replaceNote':
        return replaceNote;
      default:
        return () => {};
    }
  };

  const addNote = (): void => {
    const newNote = createNote(noteFormContent, { x: 0, y: 0 });
    treeRef.current.addNode(newNote);
    setRightDrawerOpen(false);
  };

  const replaceNote = (): void => {
    const newNote = createNote(
      noteFormContent,
      treeRef.current.getCurrNode()?.position
    );
    treeRef.current.removeNode(treeRef.current.getCurrNode());
    treeRef.current.addNode(newNote);
    setRightDrawerOpen(false);
  };

  const addStrain = (sex: Sex, pairs: AllelePair[]): void => {
    const newStrain = createStrainNode(
      sex,
      new Strain({ allelePairs: pairs }),
      { x: 0, y: 0 }
    );
    treeRef.current.addNode(newStrain);
    setRightDrawerOpen(false);
  };

  const selfCross = (): void => {
    const currNode = treeRef.current.getCurrNode();
    const selfIconPos = treeRef.current.getSelfIconPos();
    const selfIcon = createSelfIcon(selfIconPos);
    const edge = createEdge(currNode, selfIcon, { sourceHandle: 'bottom' });

    const currStrain: CrossNodeModel = currNode.data;
    if (currStrain === undefined) toast.error('something went wrong...');
    const children = currStrain.strain.selfCross();
    children.sort((c1, c2) => c1.prob - c2.prob);

    const childPositions = treeRef.current.calculateChildPositions(
      selfIcon,
      currNode,
      children
    );
    const childNodes = children.map((child, i) => {
      return createStrainNode(
        Sex.Hermaphrodite,
        child.strain,
        childPositions[i],
        child.prob
      );
    });
    const childEdges = childNodes.map((node) => createEdge(selfIcon, node));
    treeRef.current.addNodes([selfIcon, ...childNodes]);
    treeRef.current.addEdges([edge, ...childEdges]);
    refresh();
  };

  const crossNodes = (sex: Sex, pairs: AllelePair[]): void => {
    const currNode = treeRef.current.getCurrNode();
    const xIconPos = props.crossTree.getXIconPos();
    const strainPos = props.crossTree.getCrossStrainPos();

    const xIcon = createXIcon(xIconPos);
    const newStrainNode = createStrainNode(
      sex,
      new Strain({ allelePairs: pairs }),
      strainPos
    );

    const e1 = createEdge(currNode, xIcon, {
      targetHandle: currNode.data.sex === Sex.Male ? 'left' : 'right',
    });
    const e2 = createEdge(newStrainNode, xIcon, {
      targetHandle: newStrainNode.data.sex === Sex.Male ? 'left' : 'right',
    });

    const newStrain: CrossNodeModel = newStrainNode.data;
    const otherStrain: CrossNodeModel = currNode.data;
    const children = newStrain.strain.crossWith(otherStrain.strain);
    children.sort((c1, c2) => c1.prob - c2.prob);

    const childPositions = treeRef.current.calculateChildPositions(
      xIcon,
      currNode,
      children
    );

    const childrenNodes = children.map((child, i) => {
      return createStrainNode(
        Sex.Hermaphrodite,
        child.strain,
        childPositions[i],
        child.prob
      );
    });

    const childrenEdges = childrenNodes.map((node) => createEdge(xIcon, node));
    treeRef.current.addNodes([xIcon, newStrainNode, ...childrenNodes]);
    treeRef.current.addEdges([e1, e2, ...childrenEdges]);
    setRightDrawerOpen(false);
  };

  const getCrossNodeMenuItems = (
    crossNode: CrossNodeModel | null | undefined,
    nodeId: string
  ): MenuItem[] => {
    if (crossNode === undefined || crossNode === null) return [];
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
      text: 'Schedule',
      menuCallback: () => {
        const clonedTree = treeRef.current.clone();
        clonedTree.setCurrNode(nodeId);
        const tasks = clonedTree.generateTasks(clonedTree.getCurrNode());

        insertTree(clonedTree.generateRecord(false))
          .then(
            async () =>
              await insertDbTasks(tasks)
                .then(() => navigate('/scheduler/todo'))
                .catch((error) => console.error(error))
          )
          .catch((error) => console.error(error));
      },
    };

    const items = [crossOption, exportOption];
    if (canSelfCross) items.unshift(selfOption);

    return items;
  };

  const buttons = [
    <button
      key='save'
      className='btn-primary btn'
      onClick={() => saveTree(treeRef.current)}
    >
      Save
    </button>,
    <button
      key='addNewNode'
      className='btn'
      onClick={() => {
        setRightDrawerOpen(true);
        setDrawerState('addStrain');
      }}
    >
      Add Cross Node
    </button>,
    <button
      className='btn'
      key='addNotes'
      onClick={() => {
        setDrawerState('addNote');
        setNoteFormContent('');
        setRightDrawerOpen(true);
      }}
    >
      Add Note
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
              name={props.crossTree.name ?? ''}
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
              {drawerState === 'addNote' ? (
                <NoteForm
                  header='Add a note'
                  buttonText='Create'
                  content={noteFormContent}
                  setContent={setNoteFormContent}
                  callback={getNoteFormCallback()}
                />
              ) : drawerState === 'replaceNote' ? (
                <NoteForm
                  header='Edit note'
                  buttonText='Save changes'
                  content={noteFormContent}
                  setContent={setNoteFormContent}
                  callback={getNoteFormCallback()}
                />
              ) : (
                <CrossNodeForm
                  getFilteredAlleles={getFilteredAlleles}
                  onSubmitCallback={getCrossNodeFormCallback()}
                  createAlleleFromRecord={Allele.createFromRecord}
                  enforcedSex={enforcedSex}
                />
              )}
            </RightDrawer>
          </div>
        </div>
      </div>
    </>
  );
};

const saveTree = (tree: CrossTree): void => {
  tree.lastSaved = new Date();
  insertTree(tree.generateRecord(true)).catch((error) => console.error(error));
};

export default CrossEditor;
