import { useState, useCallback, useEffect, useRef } from 'react';
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
  NodeChange,
  XYPosition,
  useEdgesState,
  ReactFlowInstance,
} from 'reactflow';
import { insertTree, updateTree } from 'api/crossTree';
import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import { FiPlusCircle as AddIcon } from 'react-icons/fi';
import { FaRegStickyNote as NoteIcon } from 'react-icons/fa';
import { MenuItem } from 'components/Menu/Menu';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { toast } from 'react-toastify';
import { insertDbTasks } from 'api/task';
import { useNavigate } from 'react-router-dom';
import NoteForm from 'components/NoteForm/NoteForm';
import { NoteNodeProps } from 'components/NoteNode/NoteNodeProps';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import {
  ContextMenu,
  useContextMenuState,
} from 'components/ContextMenu/ContextMenu';
import {
  CrossFilterModal,
  CrossEditorFilter,
  CrossEditorFilterUpdate,
} from 'components/CrossFilterModal/CrossFilterModal';

export interface CrossEditorProps {
  crossTree: CrossTree;
  /*
   * This is used to determine if the context menu should be shown.
   * In attempting to use a right click event in testing, the context menu never shows up.
   * Not sure why, but this is a workaround.
   */
  testing?: boolean;
}

type DrawerState = 'addStrain' | 'cross' | 'addNote' | 'editNote';

const CrossEditor = (props: CrossEditorProps): JSX.Element => {
  const navigate = useNavigate();
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>('addStrain');
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.crossTree.edges);
  const [noteFormContent, setNoteFormContent] = useState('');
  const [currNodeId, setCurrNodeId] = useState<string>('');
  const [nodeMap, setNodeMap] = useState<Map<string, Node>>(
    new Map(props.crossTree.nodes.map((node) => [node.id, node]))
  );

  const [invisibleNodes, setInvisibleNodes] = useState<Set<string>>(
    new Set(props.crossTree.invisibleNodes)
  );
  const [currChildNodes, setCurrChildNodes] = useState<Node[]>([]);
  const [crossFilters, setCrossFilters] = useState(
    new Map(props.crossTree.crossFilters)
  );

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  /**
   * This function sets up right click handler overrides that check if the right click is on an HTML
   * element that has a class that matches any of the passed in class names.
   * If it does, then that click fires activates the context menu and updates the x & y click position.
   */
  const { rightClickXPos, rightClickYPos, showRightClickMenu } =
    useContextMenuState(['react-flow__pane'], props.testing);
  const flowRef = useRef<HTMLElement>(null);

  /**
   * sets nodeMap state to include passed node
   */
  const addToOrUpdateNodeMap = (node: Node): void => {
    setNodeMap((nodeMap) => new Map(nodeMap.set(node.id, node)));
  };

  /**
   * Callback used by react flow to update the positions of each node when dragged
   */
  const onNodesChange = (changes: NodeChange[]): void => {
    const newNodeMap = new Map();
    const nodes = [...nodeMap.values()];
    const movedNodes = applyNodeChanges(changes, nodes);
    movedNodes.forEach((node) => newNodeMap.set(node.id, node));
    setNodeMap(newNodeMap);
  };

  /**
   * Callback used by react flow to add edges to node handles when dragged
   */
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  /**
   * When we deserialize from a cross tree, all function member variables are
   * undefined. Because of this, we need to "re-hydrate them" with our current
   * functionality if we want to still be able to call/interact with them.
   */
  useEffect(() => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const refreshedNodes = [...nodeMap.values()].map((node) => {
        if (node.type === FlowType.Strain) {
          const data: CrossNodeModel = node.data;
          node.data = new CrossNodeModel({
            sex: data.sex,
            strain: data.strain,
            probability: data.probability,
            isParent: data.isParent,
            isChild: data.isChild,
            getMenuItems: (model: CrossNodeModel) =>
              getCrossNodeMenuItems(model, node.id, data.isParent),
            toggleSex: data.isParent
              ? undefined
              : () => toggleCrossNodeSex(node.id),
            toggleHetPair: (pair) => toggleHetPair(pair, node.id),
          });
        } else if (node.type === FlowType.Note) {
          node.data = new NoteNodeProps({
            content: node.data.content,
            onDoubleClick: () => {
              setCurrNodeId(node.id);
              setNoteFormContent(node.data.content);
              setDrawerState('editNote');
              setRightDrawerOpen(true);
            },
          });
        } else if (
          node.type === FlowType.XIcon ||
          node.type === FlowType.SelfIcon
        ) {
          const iconChildren = [...nodeMap.values()].filter(
            (child) => child.parentNode === node.id
          );
          loadIconWithData(node, iconChildren);
        }

        return node;
      });
      refreshedNodes.forEach((node) => nodeMap.set(node.id, node));
      return new Map(nodeMap);
    });
  }, []);

  // #region Flow Component Creation
  /** Creates a node representing a strain */
  const createStrainNode = ({
    sex,
    strain,
    position,
    isParent,
    isChild,
    parentNode,
    probability,
    id,
  }: {
    sex: Sex;
    strain: Strain;
    position: XYPosition;
    isParent: boolean;
    isChild: boolean;
    parentNode?: string;
    probability?: number;
    id?: string;
  }): Node<CrossNodeModel> => {
    const nodeId = id ?? props.crossTree.createId();
    const strainNode: Node = {
      id: nodeId,
      type: FlowType.Strain,
      position,
      parentNode,
      data: new CrossNodeModel({
        sex,
        strain,
        probability,
        isParent,
        isChild,
        getMenuItems: (node: CrossNodeModel) =>
          getCrossNodeMenuItems(node, nodeId, isParent),
        toggleSex: isParent ? undefined : () => toggleCrossNodeSex(nodeId),
        toggleHetPair: (pair) => toggleHetPair(pair, nodeId),
      }),
      className: 'nowheel',
    };
    return strainNode;
  };

  /** Creates a node representing the x icon */
  const createXIcon = (parentNode: Node<CrossNodeModel>): Node => {
    const position = CrossTree.getXIconPos(parentNode);
    const newXIcon: Node = {
      id: props.crossTree.createId(),
      type: FlowType.XIcon,
      position,
      parentNode: parentNode.id,
      data: {},
    };
    return newXIcon;
  };

  /** Creates a node representing the self icon */
  const createSelfIcon = (parentNode: string): Node => {
    const position = CrossTree.getSelfIconPos();
    const newSelfIcon: Node = {
      id: props.crossTree.createId(),
      type: FlowType.SelfIcon,
      position,
      parentNode,
      data: {},
    };
    return newSelfIcon;
  };

  const loadIconWithData = (
    iconNode: Node,
    children: Array<Node<CrossNodeModel>>
  ): void => {
    const data = {
      setCurrChildNodes: () => setCurrChildNodes([...children]),
      setCurrFilter: () => {
        setCurrNodeId(iconNode.id);
      },
    };

    iconNode.data = data;
  };

  /** Creates an edge connecting a source node to a target node */
  const createEdge = (
    sourceId: string,
    targetId: string,
    args?: { sourceHandle?: string; targetHandle?: string }
  ): Edge => {
    const edge: Edge = {
      id: props.crossTree.createId(),
      source: sourceId,
      target: targetId,
      sourceHandle: args?.sourceHandle,
      targetHandle: args?.targetHandle,
    };
    return edge;
  };

  /** Creates a node representing a note with content */
  const createNote = (content: string, position: XYPosition): Node => {
    const noteNode: Node = {
      id: props.crossTree.createId(),
      type: FlowType.Note,
      position,
      data: new NoteNodeProps({
        content,
        onDoubleClick: () => {
          setCurrNodeId(noteNode.id);
          setNoteFormContent(content);
          setDrawerState('editNote');
          setRightDrawerOpen(true);
        },
      }),
      className: 'nowheel',
    };
    return noteNode;
  };
  // #endregion Flow Component Creation

  // #region editor interactions
  /** Passed to cross node, determines what happens when the sex icon is clicked */
  const toggleCrossNodeSex = (nodeId: string): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const node = nodeMap.get(nodeId);
      if (node === undefined || node.type !== FlowType.Strain) {
        console.error(
          'uh oh - you tried to toggle the sex of a node that is undefined/not a strain'
        );
        return nodeMap;
      }

      const data: CrossNodeModel = node.data;
      if (data.sex === undefined || data.sex === null) return nodeMap;

      // need to create a new node with the updated data so the state knows something has changed
      const newSex = data.sex === Sex.Male ? Sex.Hermaphrodite : Sex.Male;
      const newNode = createStrainNode({
        sex: newSex,
        strain: data.strain,
        position: node.position,
        isParent: false,
        isChild: data.isChild,
        parentNode: node.parentNode,
        probability: data.probability,
        id: node.id,
      });

      // update the map with the new data for the node
      nodeMap.set(node.id, newNode);
      return new Map(nodeMap);
    });
  };

  const toggleHetPair = (pair: AllelePair, nodeId: string): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const node = nodeMap.get(nodeId);
      if (node === undefined || node.type !== FlowType.Strain) {
        console.error(
          'yikes - tried to toggle het pair on a node that is undefined/not a strain'
        );
        return nodeMap;
      }

      const data: CrossNodeModel = node.data;

      pair.flip();
      // replace node with new node of toggled pair
      const newNode = createStrainNode({
        sex: data.sex,
        strain: data.strain,
        position: node.position,
        isParent: false, // if toggled before, should be able to toggle again
        isChild: false,
        parentNode: node.parentNode,
        probability: data.probability,
        id: node.id,
      });
      nodeMap.set(newNode.id, newNode);
      return new Map(nodeMap);
    });
  };

  const toggleNodeVisibility = (nodeId: string): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const children = [...nodeMap.values()].filter(
        (node: Node) => node.parentNode === nodeId
      );
      if (children.length > 0) {
        toast.error("Whoops! Can't mark a parent node as invisible");
        return nodeMap;
      }
      setInvisibleNodes((invisibleNodes: Set<string>): Set<string> => {
        invisibleNodes.has(nodeId)
          ? invisibleNodes.delete(nodeId)
          : invisibleNodes.add(nodeId);
        return new Set(invisibleNodes);
      });
      return nodeMap;
    });
  };

  const handleFilterUpdate = (update: CrossEditorFilterUpdate): void => {
    setCrossFilters((filters): Map<string, CrossEditorFilter> => {
      const filter =
        filters.get(update.nodeId) ??
        new CrossEditorFilter({
          alleleNames: new Set(),
          exprPhenotypes: new Set(),
          reqConditions: new Set(),
          supConditions: new Set(),
        });
      if (update.action === 'add') filter[update.field].add(update.name);
      if (update.action === 'remove') filter[update.field].delete(update.name);
      if (update.action === 'clear') filter[update.field].clear();
      filters.set(update.nodeId, filter);

      // Mark nodes as (in)visible
      setNodeMap((nodeMap) => {
        setInvisibleNodes((invisibleNodes: Set<string>): Set<string> => {
          const childList: Array<Node<CrossNodeModel>> = [
            ...nodeMap.values(),
          ].filter((node) => node.parentNode === update.nodeId);
          if (filter.isEmpty()) {
            filters.delete(update.nodeId);
            childList.forEach((node) => invisibleNodes.delete(node.id));
          } else {
            childList.forEach((node) => {
              if (
                !CrossEditorFilter.includedInFilter(node, filter) &&
                !node.data.isParent
              )
                invisibleNodes.add(node.id);
              else invisibleNodes.delete(node.id);
            });
          }

          return new Set(invisibleNodes);
        });
        return nodeMap;
      });

      return new Map(filters);
    });
  };

  const getNodePositionFromLastClick = (): XYPosition => {
    const bounds = flowRef?.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
    };
    return (
      reactFlowInstance?.project({
        x: rightClickXPos - bounds.left,
        y: rightClickYPos - bounds.top,
      }) ?? { x: 0, y: 0 }
    );
  };

  /** Adds note to editor */
  const addNote = (): void => {
    const position = getNodePositionFromLastClick();
    const newNote = createNote(noteFormContent, position);
    addToOrUpdateNodeMap(newNote);
    setRightDrawerOpen(false);
  };

  /** Edits a current note's content */
  const editNote = (): void => {
    const noteNode = nodeMap.get(currNodeId);
    if (noteNode === undefined || noteNode.type !== FlowType.Note) {
      console.error(
        'yikes - tried to edit note with currNode is undefined/not a note type'
      );
      return;
    }

    const noteData: NoteNodeProps = noteNode.data;
    noteData.content = noteFormContent;
    addToOrUpdateNodeMap(noteNode);
    setRightDrawerOpen(false);
  };

  /** Adds a "floating" strain node to the editor */
  const addStrain = (sex: Sex, strain: Strain): void => {
    const position = getNodePositionFromLastClick();
    const newStrain = createStrainNode({
      sex,
      strain,
      position,
      isParent: false,
      isChild: false,
    });
    addToOrUpdateNodeMap(newStrain);
    setRightDrawerOpen(false);
  };

  /** */
  const selfCross = (refNodeId: string): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const refNode = nodeMap.get(refNodeId);
      if (refNode === undefined || refNode.type !== FlowType.Strain) {
        console.error(
          'uh oh - you tried to self cross a node that is undefined/not a strain'
        );
        return nodeMap;
      }

      const selfIcon = createSelfIcon(refNode.id);
      const edgeToIcon = createEdge(refNode.id, selfIcon.id, {
        sourceHandle: 'bottom',
      });

      const currStrain: CrossNodeModel = refNode.data;
      const children = currStrain.strain.selfCross();
      children.sort((c1, c2) => c1.prob - c2.prob);

      const childPositions = CrossTree.calculateChildPositions(
        selfIcon,
        refNode,
        children
      );

      const childNodes = children.map((child, i) => {
        return createStrainNode({
          sex: Sex.Hermaphrodite,
          strain: child.strain,
          position: childPositions[i],
          isParent: false,
          isChild: true,
          parentNode: selfIcon.id,
          probability: child.prob,
        });
      });
      loadIconWithData(selfIcon, childNodes);

      refNode.data = copyNodeData(refNode, { isParent: true });

      // update state
      [selfIcon, refNode, ...childNodes].forEach((node) => {
        nodeMap.set(node.id, node);
      });
      const childEdges = childNodes.map((node) =>
        createEdge(selfIcon.id, node.id)
      );
      setEdges((edges) => [...edges, edgeToIcon, ...childEdges]);
      return nodeMap;
    });
  };

  /**
   * Params are provided by the crossNode form's onSubmit callback function
   */
  const regularCrossWithFormData = (sex: Sex, strain: Strain): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const currNode = nodeMap.get(currNodeId);
      if (currNode === undefined || currNode.type !== FlowType.Strain) {
        console.error(
          'sad day - tried crossing currNode with a form node BUT currNode is undefined/not a strain'
        );
        return nodeMap;
      }

      const xIcon = createXIcon(currNode);

      const currStrain: CrossNodeModel = currNode.data;
      const formNode = createStrainNode({
        sex,
        strain,
        position: CrossTree.getCrossStrainPos(currStrain.sex),
        parentNode: currNode.id,
        isParent: true,
        isChild: false,
      });

      const newStrain: CrossNodeModel = formNode.data;
      newStrain.toggleSex = undefined; // disable toggling functionality

      const e1 = createEdge(currNode.id, xIcon.id, {
        targetHandle: currStrain.sex === Sex.Male ? 'left' : 'right',
        sourceHandle: currStrain.sex !== Sex.Male ? 'left' : 'right',
      });
      const e2 = createEdge(formNode.id, xIcon.id, {
        targetHandle: newStrain.sex === Sex.Male ? 'left' : 'right',
        sourceHandle: newStrain.sex !== Sex.Male ? 'left' : 'right',
      });

      const children = newStrain.strain.crossWith(currStrain.strain);
      children.sort((c1, c2) => c1.prob - c2.prob);

      const childPositions = CrossTree.calculateChildPositions(
        xIcon,
        currNode,
        children
      );

      const childrenNodes = children.map((child, i) => {
        return createStrainNode({
          sex: Sex.Hermaphrodite,
          strain: child.strain,
          position: childPositions[i],
          isParent: false,
          isChild: true,
          probability: child.prob,
          parentNode: xIcon.id,
        });
      });
      loadIconWithData(xIcon, childrenNodes);

      currNode.data = copyNodeData(currNode, { isParent: true });

      const childrenEdges = childrenNodes.map((node) =>
        createEdge(xIcon.id, node.id)
      );

      [currNode, formNode, xIcon, ...childrenNodes].forEach((node) =>
        nodeMap.set(node.id, node)
      );
      setEdges((edges) => [...edges, e1, e2, ...childrenEdges]);
      setRightDrawerOpen(false);

      return new Map(nodeMap);
    });
  };

  /** Clones the passed node's data and optionally marks as a parent/child */
  const copyNodeData = (
    node: Node<CrossNodeModel>,
    { isChild = node.data.isChild, isParent = node.data.isParent }
  ): CrossNodeModel => {
    const updatedParentData = new CrossNodeModel({
      sex: node.data.sex,
      strain: node.data.strain,
      isChild,
      isParent,
      probability: node.data.probability,
      getMenuItems: () => getCrossNodeMenuItems(node.data, node.id, isParent),
      toggleHetPair: isParent || isChild ? undefined : node.data.toggleHetPair,
      toggleSex: isParent ? undefined : node.data.toggleSex, // disable toggle action
    });
    return updatedParentData;
  };

  const getCrossNodeMenuItems = (
    crossNode: CrossNodeModel | null | undefined,
    nodeId: string,
    isParent: boolean = false
  ): MenuItem[] => {
    if (crossNode === undefined || crossNode === null) return [];
    const canSelfCross = crossNode.sex === Sex.Hermaphrodite;
    const selfOption: MenuItem = {
      icon: <SelfCrossIcon />,
      text: 'Self cross',
      menuCallback: () => {
        selfCross(nodeId);
      },
    };
    const crossOption: MenuItem = {
      icon: <CrossIcon />,
      text: 'Cross',
      menuCallback: () => {
        setCurrNodeId(nodeId);
        setDrawerState('cross');
        setRightDrawerOpen(true);
      },
    };
    const scheduleOption: MenuItem = {
      icon: <ScheduleIcon />,
      text: 'Schedule',
      menuCallback: () => {
        // get up to date nodes
        setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
          // get up to date edges
          setEdges((edges: Edge[]): Edge[] => {
            setInvisibleNodes((invisibleNodes: Set<string>): Set<string> => {
              const node = nodeMap.get(nodeId);
              if (node === undefined || node.type !== FlowType.Strain) {
                console.error(
                  'boooo - the node you are trying to schedule is undefined/not a strain'
                );
                return invisibleNodes;
              }

              saveTree(
                props.crossTree,
                [...nodeMap.values()],
                edges,
                invisibleNodes
              );
              const clonedTree = props.crossTree.clone();
              const tasks = clonedTree.generateTasks(node);
              insertTree(clonedTree.generateRecord(false))
                .then(async () => await insertDbTasks(tasks))
                .then(() => navigate('/scheduler/todo'))
                .catch((error) => console.error(error));

              return invisibleNodes;
            });
            return edges;
          });
          return nodeMap;
        });
      },
    };

    if (isParent) return [scheduleOption];
    if (canSelfCross) return [selfOption, crossOption, scheduleOption]; // herm strain
    return [crossOption, scheduleOption]; // het strain
  };
  // #endregion editor interacions

  // #region templating
  /** Gets onSubmit callback for the strain form based on current state  */
  const getOnSubmitForStrainForm = (): ((sex: Sex, strain: Strain) => void) => {
    switch (drawerState) {
      case 'addStrain':
        return addStrain;
      case 'cross':
        return regularCrossWithFormData;
      default:
        return () => {};
    }
  };

  /** Gets onSubmit callback for the note form based on current state  */
  const getOnSubmitForNoteForm = (): (() => void) => {
    switch (drawerState) {
      case 'addNote':
        return addNote;
      case 'editNote':
        return editNote;
      default:
        return () => {};
    }
  };
  const buttons = [
    <button
      key='save'
      className='btn-primary btn'
      onClick={() =>
        saveTree(props.crossTree, [...nodeMap.values()], edges, invisibleNodes)
      }
    >
      Save
    </button>,
  ];

  let enforcedSex: Sex | undefined;
  const currNode = nodeMap.get(currNodeId);
  if (drawerState === 'cross')
    enforcedSex =
      currNode?.data?.sex === Sex.Male ? Sex.Hermaphrodite : Sex.Male;

  return (
    <>
      <CrossFilterModal
        childNodes={currChildNodes}
        invisibleSet={invisibleNodes}
        toggleVisible={toggleNodeVisibility}
        filters={crossFilters}
        updateFilter={handleFilterUpdate}
      />
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
            {showRightClickMenu && (
              <ContextMenu xPos={rightClickXPos} yPos={rightClickYPos}>
                <li
                  onClick={() => {
                    setRightDrawerOpen(true);
                    setDrawerState('addStrain');
                  }}
                >
                  <button className='flex flex-row' name='add-cross-node'>
                    <AddIcon className='text-xl text-base-content' />
                    <p>Add Cross Node</p>
                  </button>
                </li>
                <li
                  onClick={() => {
                    setDrawerState('addNote');
                    setNoteFormContent('');
                    setRightDrawerOpen(true);
                  }}
                >
                  <button className='flex flex-row' name='add-note'>
                    <div>
                      <NoteIcon className='fill-base-content text-xl' />
                    </div>
                    <p>Add Note</p>
                  </button>
                </li>
              </ContextMenu>
            )}
            <EditorTop tree={props.crossTree} buttons={buttons}></EditorTop>
            <div className='grow'>
              <div className='h-full w-full'>
                <CrossFlow
                  innerRef={flowRef}
                  onInit={(flow) => {
                    setReactFlowInstance(flow);
                  }}
                  nodes={[...nodeMap.values()].filter(
                    (node) => !invisibleNodes.has(node.id)
                  )}
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
                  callback={getOnSubmitForNoteForm()}
                />
              ) : drawerState === 'editNote' ? (
                <NoteForm
                  header='Edit note'
                  buttonText='Save changes'
                  content={noteFormContent}
                  setContent={setNoteFormContent}
                  callback={getOnSubmitForNoteForm()}
                />
              ) : (
                <CrossNodeForm
                  getFilteredAlleles={getFilteredAlleles}
                  onSubmitCallback={getOnSubmitForStrainForm()}
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
  // #endregion templating
};

const saveTree = (
  tree: CrossTree,
  nodes: Node[],
  edges: Edge[],
  invisibleNodes: Set<string>
): void => {
  tree.nodes = nodes;
  tree.edges = edges;
  tree.invisibleNodes = invisibleNodes;
  tree.lastSaved = new Date();
  updateTree(tree.generateRecord(true))
    .then(() => toast.success('Successfully saved design'))
    .catch((error) => {
      toast.error('Error saving design');
      console.error(error);
    });
};

export default CrossEditor;
