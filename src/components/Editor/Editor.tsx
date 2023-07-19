import { insertCrossDesign } from 'api/crossDesign';
import { insertTasks } from 'api/task';
import {
  ContextMenu,
  useContextMenuState,
} from 'components/ContextMenu/ContextMenu';
import {
  OffspringFilter,
  type OffspringFilterUpdate,
} from 'components/OffspringFilter/OffspringFilter';
import { OffspringFilterModal } from 'components/OffspringFilterModal/OffspringFilterModal';
import EditorTop from 'components/EditorTop/EditorTop';
import FilteredOutModal from 'components/FilteredOutModal/FilteredOutModal';
import FilteredOutNode, {
  FILTERED_OUT_NODE_WIDTH,
} from 'components/FilteredOutNode/FilteredOutNode';
import { type MenuItem } from 'components/Menu/Menu';
import NoteForm from 'components/NoteForm/NoteForm';
import StrainForm from 'components/StrainForm/StrainForm';
import { Sex } from 'models/enums';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import CrossDesign, {
  NODE_PADDING,
} from 'models/frontend/CrossDesign/CrossDesign';
import { Strain, type StrainOption } from 'models/frontend/Strain/Strain';
import {
  Fragment,
  useCallback,
  useRef,
  useState,
  useMemo,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { BsUiChecks as ScheduleIcon, BsCardImage } from 'react-icons/bs';
import {
  FaRegStickyNote as NoteIcon,
  FaSave as SaveIcon,
  FaPlus,
  FaMinus,
  FaEye,
} from 'react-icons/fa';
import { FiPlusCircle as AddIcon } from 'react-icons/fi';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactFlow, {
  Position,
  applyNodeChanges,
  type NodeAddChange,
  type NodeDimensionChange,
  type NodePositionChange,
  type NodeRemoveChange,
  type NodeResetChange,
  type NodeSelectionChange,
  type OnConnectStartParams,
  type ReactFlowInstance,
  type XYPosition,
  MiniMap,
  Controls,
  ControlButton,
  Background,
  type Node,
  type Edge,
  type NodeChange,
  type Connection,
  ConnectionMode,
  useReactFlow,
  useUpdateNodeInternals,
} from 'reactflow';
import { BiX as CloseIcon } from 'react-icons/bi';
import SaveStrainModal from 'components/SaveStrainModal/SaveStrainModal';
import { toPng, toSvg } from 'html-to-image';
import 'reactflow/dist/style.css';
import { open } from '@tauri-apps/api/dialog';
import { fs, path } from '@tauri-apps/api';
import { type Options } from 'html-to-image/lib/types';
import { NoteNode } from 'components/NoteNode/NoteNode';
import { SelfNode } from 'components/SelfNode/SelfNode';
import StrainNode from 'components/StrainNode/StrainNode';
import { XNode } from 'components/XNode/XNode';
import EditorContext from 'components/EditorContext/EditorContext';

export enum NodeType {
  Strain = 'strain',
  X = 'x',
  Self = 'self',
  Note = 'note',
  FilteredOut = 'filteredOut',
}

export interface EditorProps {
  crossDesign: CrossDesign;
  setCrossDesign: React.Dispatch<React.SetStateAction<CrossDesign | undefined>>;
  testing?: boolean; // This is used to determine if the context menu should be shown (testing workaround)
}

type DrawerState = 'addStrain' | 'cross' | 'addNote' | 'editNote';

const Editor = (props: EditorProps): React.JSX.Element => {
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  const currNodeId = useRef<string>('');
  const [rightDrawerOpen, setEditorDrawerSideOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>('addStrain');
  const [noteFormContent, setNoteFormContent] = useState('');
  const [showGenes, setShowGenes] = useState(true);
  const [saveStrainModalIsOpen, setSaveStrainModalIsOpen] = useState(false);
  const onConnectParams = useRef<OnConnectStartParams | null>(null);
  const nodes = props.crossDesign.nodes;
  const edges = props.crossDesign.edges;
  const offspringFilters = props.crossDesign.offspringFilters;

  const setNodes = (newNodes: Node[]): void => {
    props.setCrossDesign(
      new CrossDesign({ ...props.crossDesign, nodes: newNodes })
    );
  };

  const setEdges = (newEdges: Edge[]): void => {
    props.setCrossDesign(
      new CrossDesign({ ...props.crossDesign, edges: newEdges })
    );
  };

  const setOffspringFilters = (
    newOffspringFilters: Map<string, OffspringFilter>
  ): void => {
    props.setCrossDesign(
      new CrossDesign({
        ...props.crossDesign,
        offspringFilters: newOffspringFilters,
      })
    );
  };

  const getStrainNodeMenuItems = (id: string): MenuItem[] => {
    const strainNode: Node<Strain> = reactFlowInstance.getNode(
      id
    ) as Node<Strain>;
    if (strainNode === undefined || strainNode.type !== NodeType.Strain) {
      console.error(
        'Cannot get menu items for an undefined or non-strain node.'
      );
      return [];
    }

    const self: MenuItem = {
      icon: <SelfCrossIcon />,
      text: 'Self-cross',
      menuCallback: () => {
        console.log(id);
        selfCross(id).catch(console.error);
      },
    };
    const cross: MenuItem = {
      icon: <CrossIcon />,
      text: 'Cross',
      menuCallback: () => {
        currNodeId.current = id;
        setDrawerState('cross');
        setEditorDrawerSideOpen(true);
      },
    };
    const schedule: MenuItem = {
      icon: <ScheduleIcon />,
      text: 'Schedule',
      menuCallback: () => {
        scheduleNode(id);
      },
    };
    const saveStrain: MenuItem = {
      icon: <SaveIcon />,
      text: 'Save strain',
      menuCallback: () => {
        currNodeId.current = id;
        setSaveStrainModalIsOpen(true);
      },
    };

    const menuOptions = [schedule];
    if (!strainNode.data.isParent) menuOptions.push(cross);
    if (strainNode.data.sex === Sex.Hermaphrodite && !strainNode.data.isParent)
      menuOptions.push(self);
    if (strainNode.data.name === undefined) menuOptions.push(saveStrain);
    return menuOptions;
  };

  const editorContextValue = {
    showGenes: true,
    toggleSex: (id: string): void => {
      const node = reactFlowInstance.getNode(id);
      if (node === undefined || node.type !== NodeType.Strain) {
        console.error(
          'Cannot toggle sex of node that is undefined or not a strain'
        );
        return;
      }

      setNodes(
        addNode(nodes, {
          ...node,
          data: (node as Node<Strain>).data.toggleSex(),
        })
      );
    },
    toggleHetPair: (id: string, pair: AllelePair): void => {
      const node = reactFlowInstance.getNode(id);
      if (node === undefined || node.type !== NodeType.Strain) {
        console.error(
          'Cannot toggle het pair on a node that is undefined/not a strain'
        );
        return;
      }
      const strain: Strain = node.data;

      pair.flip();
      Strain.build({
        allelePairs: strain.getAllelePairs(),
        sex: strain.sex,
      })
        .then((strain) => {
          setNodes(addNode(nodes, { ...node, data: strain }));
        })
        .catch(console.error);
    },
    openNote: (id: string) => {
      setNoteFormContent(reactFlowInstance.getNode(id)?.data);
      setDrawerState('editNote');
      setEditorDrawerSideOpen(true);
    },
    getMenuItems: getStrainNodeMenuItems,
  };

  const getCurrentNode = (): Node | undefined => {
    return reactFlowInstance.getNode(currNodeId.current);
  };

  /**
   * This function sets up right click handler overrides that check if the right click is on an HTML
   * element that has a class that matches any of the passed in class names.
   * If it does, then that click fires activates the context menu and updates the x & y click position.
   */
  const { rightClickXPos, rightClickYPos, showRightClickMenu } =
    useContextMenuState(['react-flow__pane'], props.testing);
  const flowRef = useRef<HTMLDivElement>(null);

  const addNode = (nodes: Node[], node: Node): Node[] => {
    return [...nodes.filter((nd) => nd.id !== node.id), node];
  };

  const onNodesChange = (changes: NodeChange[]): void => {
    const [additions, deletions, dimensions, movements, resets, selections] =
      filterNodeChanges(changes);

    let canDelete = deletions.length > 0;
    const selected = deletions.filter(
      (del) => reactFlowInstance.getNode(del.id)?.selected
    );
    selected.forEach((selectedNode) => {
      const toDelete = reactFlowInstance.getNode(selectedNode.id);
      if (
        toDelete?.parentNode !== undefined &&
        toDelete.type === NodeType.Strain
      ) {
        toast.error("You can't remove a node that is the child of a cross");
        canDelete = false;
      }
    });
    const parentIds = selected.flatMap((selectedNode) =>
      edges
        .filter((edge) => edge.target === selectedNode.id)
        .map((edge) => edge.source)
    );

    // Determine invisible and visible deletions
    const visibleDelSet = new Set(deletions.map((d) => d.id));
    const invisibleDeletions = props.crossDesign.nodes
      .filter(
        (node) =>
          node.hidden === true &&
          node.parentNode !== undefined &&
          visibleDelSet.has(node.parentNode)
      )
      .map((node) => node.id);

    // Mark invisible nodes for deletion
    invisibleDeletions.forEach((del) =>
      deletions.push({ id: del, type: 'remove' })
    );

    // Apply all changes
    const toApply = [
      canDelete ? deletions : [],
      movements,
      dimensions,
      additions,
      resets,
      selections,
    ].flat();
    let newNodes = applyNodeChanges(toApply, props.crossDesign.nodes);

    if (canDelete) {
      // update parent nodes
      const parentNodes = parentIds.flatMap(
        (id) => reactFlowInstance.getNode(id) ?? []
      );
      const parentIdSet = new Set(parentIds);
      parentNodes.forEach((node) => {
        node.data = node.data.clone();
        node.data.isParent = false;

        // clear parent relationship between 2 nodes crossed together
        const clearParentId =
          node.parentNode !== undefined && parentIdSet.has(node.parentNode);
        node.parentNode = clearParentId ? undefined : node.parentNode;

        newNodes = addNode(newNodes, node);
      });

      // remove unneeded edges
      const allDeletions = new Set(deletions.map((d) => d.id));
      const edgesToDelete = new Set(
        edges.filter((edge) => allDeletions.has(edge.target)).map((e) => e.id)
      );
      const newEdges = edges.filter((edge) => !edgesToDelete.has(edge.id));
      setEdges(newEdges);
    }

    setNodes(newNodes);
  };

  /**
   * Filters a generic NodeChange[] list into distinct change lists
   */
  const filterNodeChanges = (
    changes: NodeChange[]
  ): [
    NodeAddChange[],
    NodeRemoveChange[],
    NodeDimensionChange[],
    NodePositionChange[],
    NodeResetChange[],
    NodeSelectionChange[]
  ] => {
    const additions: NodeAddChange[] = changes.flatMap((change) =>
      change.type === 'add' ? change : []
    );
    const deletions: NodeRemoveChange[] = changes.flatMap((change) =>
      change.type === 'remove' ? change : []
    );
    const dimensions: NodeDimensionChange[] = changes.flatMap((change) =>
      change.type === 'dimensions' ? change : []
    );
    const movements: NodePositionChange[] = changes.flatMap((change) =>
      change.type === 'position' ? change : []
    );
    const resets: NodeResetChange[] = changes.flatMap((change) =>
      change.type === 'reset' ? change : []
    );
    const selections: NodeSelectionChange[] = changes.flatMap((change) =>
      change.type === 'select' ? change : []
    );

    return [additions, deletions, dimensions, movements, resets, selections];
  };

  const onConnectStart = useCallback(
    (_: ReactMouseEvent | ReactTouchEvent, params: OnConnectStartParams) => {
      onConnectParams.current = params;
    },
    []
  );

  /**
   * Callback used by react flow to add edges to node handles when dragged
   */
  const onConnect = useCallback((args: Connection) => {
    onConnectParams.current = null; // prevent onConnectEnd from being called
    if (
      args.sourceHandle === 'top' ||
      args.sourceHandle === 'bottom' ||
      args.targetHandle === 'top' ||
      args.targetHandle === 'bottom'
    )
      return;
    const [lNodeId, rNodeId] =
      args.sourceHandle === 'right'
        ? [args.source, args.target]
        : [args.target, args.source];

    const lNode = reactFlowInstance.getNode(lNodeId ?? '');
    const rNode = reactFlowInstance.getNode(rNodeId ?? '');
    if (lNode === undefined || rNode === undefined) {
      console.error('Cannot cross with an undefined node');
      return;
    }
    if (lNode.type !== NodeType.Strain || rNode.type !== NodeType.Strain) {
      console.error('Cannot cross with a non-strain node');
      return;
    }

    const lStrain: Strain = lNode.data;
    const rStrain: Strain = rNode.data;

    if (lStrain.sex === rStrain.sex) {
      toast.error('Can only mate strains that are different sexes');
      return;
    }

    if (lStrain.isParent || rStrain.isParent) {
      toast.error("A single strain can't be involved in multiple crosses");
      return;
    }
    matedCross(lNode, rNode).catch(console.error);
  }, []);

  /** Called after onConnect or after dragging an edge */
  const onConnectEnd = useCallback(() => {
    const params = onConnectParams.current;
    if (
      params === null ||
      params === undefined ||
      params.handleType === 'target' ||
      !props.crossDesign.editable
    )
      return;
    const id = params.nodeId;
    if (id === null || id === undefined) {
      console.error('Id is null or undefined');
      return;
    }

    const currNode = reactFlowInstance.getNode(id);

    if (currNode === undefined) return;
    if (currNode.type !== NodeType.Strain) return;
    const currStrain: Strain = currNode.data;

    if (currStrain.isParent) {
      toast.error('Cannot cross a strain already involved in a cross');
      return nodes;
    }

    if (params.handleId === Position.Bottom) {
      const refNode = reactFlowInstance.getNode(id);
      if (refNode === undefined || refNode.type !== NodeType.Strain) {
        console.error(
          'Cannot self-cross a node that is undefined/not a strain'
        );
      } else {
        selfCross(refNode.id).catch(console.error);
      }
    } else {
      currNodeId.current = id;
      setDrawerState('cross');
      setEditorDrawerSideOpen(true);
    }
  }, []);

  /** Show the filterOut node child of id if any strain children of id are hidden */
  const updateFilterOutNodeVisibility = (id: string): void => {
    const filterOutNode = props.crossDesign.nodes
      .filter(
        (node) => node.parentNode === id && node.type === NodeType.FilteredOut
      )
      .at(0);
    const strainNodes = props.crossDesign.nodes.filter(
      (node) => node.parentNode === id && node.type === NodeType.Strain
    );
    if (filterOutNode !== undefined)
      filterOutNode.hidden = !strainNodes.some((node) => node.hidden);
  };

  const toggleNodeVisibility = (id: string): void => {
    const children = props.crossDesign.nodes.filter(
      (node: Node) => node.parentNode === id
    );
    if (children.length > 0) {
      toast.error("Can't mark a parent node as invisible");
      return;
    }
    const node = reactFlowInstance.getNode(id);
    if (node?.hidden !== undefined) node.hidden = !node.hidden;
    const parentNodeId = reactFlowInstance.getNode(id)?.parentNode;
    if (parentNodeId !== undefined) updateFilterOutNodeVisibility(parentNodeId);
  };

  const handleFilterUpdate = (update: OffspringFilterUpdate): void => {
    const filter =
      offspringFilters.get(update.nodeId) ??
      new OffspringFilter({
        alleleNames: new Set(),
        exprPhenotypes: new Set(),
        reqConditions: new Set(),
        supConditions: new Set(),
      });
    if (update.action === 'add') filter[update.field].add(update.name);
    if (update.action === 'remove') filter[update.field].delete(update.name);
    if (update.action === 'clear') filter[update.field].clear();
    offspringFilters.set(update.nodeId, filter);

    // Hide nodes
    const childList: Array<Node<Strain>> = [...nodes.values()].filter(
      (node) =>
        node.parentNode === update.nodeId && node.type === NodeType.Strain
    );

    if (filter.isEmpty()) {
      offspringFilters.delete(update.nodeId);
      childList.forEach((node) => (node.hidden = false));
    } else {
      childList.forEach((node) => {
        node.hidden =
          !OffspringFilter.includedInFilter(node, filter) &&
          !node.data.isParent;
      });
    }

    setOffspringFilters(new Map(offspringFilters));
    updateFilterOutNodeVisibility(update.nodeId);
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

  const addNote = (): void => {
    const noteNode: Node<string> = {
      id: props.crossDesign.createId(),
      data: noteFormContent,
      position: getNodePositionFromLastClick(),
      type: NodeType.Note,
    };
    setEditorDrawerSideOpen(false);
    setNodes(addNode(nodes, noteNode));
  };

  const editNote = (): void => {
    const noteNode = getCurrentNode();
    if (noteNode === undefined || noteNode.type !== NodeType.Note) {
      console.error(
        'Cannot edit note when currNode is undefined or is not a note type'
      );
      return;
    }
    noteNode.data = noteFormContent;
    setEditorDrawerSideOpen(false);
    setNodes(addNode(nodes, noteNode));
  };

  const addStrain = (strain: Strain): void => {
    const strainNode: Node<Strain> = {
      id: props.crossDesign.createId(),
      data: strain,
      position: getNodePositionFromLastClick(),
      type: NodeType.Strain,
    };
    setNodes(addNode(nodes, strainNode));
    setEditorDrawerSideOpen(false);
  };

  const selfCross = async (parentNodeId: string): Promise<void> => {
    const parentNode: Node<Strain> = reactFlowInstance.getNode(
      parentNodeId
    ) as Node<Strain>;
    if (parentNode === undefined || parentNode.type !== NodeType.Strain) {
      console.error('Cannot self-cross a node that is undefined/not a strain');
      return;
    }

    parentNode.data = new Strain({ ...parentNode.data, isParent: true });
    const selfNode: Node = {
      id: props.crossDesign.createId(),
      position: CrossDesign.getSelfNodePos(),
      parentNode: parentNode.id,
      data: {},
      type: NodeType.Self,
    };
    const parentToSelf: Edge = {
      id: props.crossDesign.createId(),
      source: parentNode.id,
      target: selfNode.id,
      sourceHandle: 'bottom',
    };
    const childStrains = await parentNode.data.selfCross();
    const childNodes = getChildNodes(selfNode, childStrains);
    const childEdges = childNodes.map((node) => {
      return {
        id: props.crossDesign.createId(),
        source: selfNode.id,
        target: node.id,
      };
    });

    setNodes([...addNode(nodes, parentNode), selfNode, ...childNodes]);
    setEdges([...edges, parentToSelf, ...childEdges]);
  };

  const matedCross = async (
    lNode: Node<Strain>,
    rNode: Node<Strain>
  ): Promise<void> => {
    // Mark as parents
    lNode.data = new Strain({ ...lNode.data, isParent: true });
    rNode.data = new Strain({ ...rNode.data, isParent: true });

    // Update positioning of one of the parent strains
    const lControlsR = rNode.parentNode === undefined;
    if (lControlsR) {
      rNode.parentNode = lNode.id;
      rNode.position = CrossDesign.getMatedStrainPos(lNode.data.sex);
    } else {
      lNode.parentNode = rNode.id;
      lNode.position = CrossDesign.getMatedStrainPos(rNode.data.sex);
    }

    // Create new nodes and edges
    const xNode: Node = {
      id: props.crossDesign.createId(),
      data: {},
      position: CrossDesign.getXNodePos(lNode),
      type: NodeType.X,
    };
    const lStrain = lNode.data;
    const rStrain = rNode.data;
    const edge1 = {
      id: props.crossDesign.createId(),
      source: lNode.id,
      target: xNode.id,
      sourceHandle: lStrain.sex === Sex.Hermaphrodite ? 'left' : 'right',
      targetHandle: lStrain.sex === Sex.Male ? 'left' : 'right',
    };
    const edge2 = {
      id: props.crossDesign.createId(),
      source: rNode.id,
      target: xNode.id,
      sourceHandle: rStrain.sex === Sex.Hermaphrodite ? 'left' : 'right',
      targetHandle: rStrain.sex === Sex.Male ? 'left' : 'right',
    };
    const childOptions = await lStrain.crossWith(rStrain);
    const childNodes = getChildNodes(xNode, childOptions);
    const childEdges = childNodes.map((node) => {
      return {
        id: props.crossDesign.createId(),
        source: xNode.id,
        target: node.id,
      };
    });

    let newNodes: Node[] = [];
    [lNode, rNode, xNode, ...childNodes].forEach((node) => {
      newNodes = addNode(nodes, node);
    });
    setNodes(newNodes);
    setEdges([...edges, edge1, edge2, ...childEdges]);
  };

  /** Create a collection of strain nodes to represent children of a cross, from child strain options */
  const getChildNodes = (
    middleNode: Node,
    childOptions: StrainOption[]
  ): Array<Node<Strain>> => {
    const childPositions = CrossDesign.calculateChildPositions(
      middleNode.type === NodeType.X ? NodeType.X : NodeType.Self,
      childOptions
    );

    const childNodes: Array<Node<Strain>> = childOptions.map((child, i) => {
      return {
        id: props.crossDesign.createId(),
        data: child.strain,
        position: childPositions[i],
        parentNode: middleNode.id,
        type: NodeType.Strain,
      } satisfies Node<Strain>;
    });

    if (childNodes.length > 0) {
      const filteredOutNode: Node = {
        id: props.crossDesign.createId(),
        position: {
          x: childPositions[0].x - FILTERED_OUT_NODE_WIDTH - NODE_PADDING,
          y: childPositions[0].y,
        },
        parentNode: middleNode.id,
        data: {},
        hidden: true,
        type: NodeType.FilteredOut,
      };
      setNodes(addNode(nodes, filteredOutNode));
      childNodes.unshift(filteredOutNode);
    }
    return childNodes;
  };

  /**
   * Params are provided by the strainNode form's onSubmit callback function
   */
  const matedCrossWithFormStrain = (strain: Strain): void => {
    const startingNode = getCurrentNode();
    if (startingNode === undefined || startingNode.type !== NodeType.Strain) {
      console.error(
        'Cannot cross currNode with a form node when currNode is undefined or not a strain'
      );
      return;
    }

    const currStrain: Strain = startingNode.data;
    const formNode: Node<Strain> = {
      id: props.crossDesign.createId(),
      data: strain,
      position: CrossDesign.getMatedStrainPos(currStrain.sex),
      type: NodeType.Strain,
    };

    currStrain.sex === Sex.Male
      ? matedCross(startingNode, formNode).catch(console.error)
      : matedCross(formNode, startingNode).catch(console.error);

    setEditorDrawerSideOpen(false);
  };

  const scheduleNode = (id: string): void => {
    const node = reactFlowInstance.getNode(id);
    if (node === undefined || node.type !== NodeType.Strain) {
      console.error(
        'The node you are trying to schedule is undefined/not a strain'
      );
      return;
    }

    const clonedCrossDesign = props.crossDesign.clone(true);
    clonedCrossDesign.editable = false;
    const tasks = clonedCrossDesign
      .generateTasks(node)
      .map((task) => task.generateRecord());
    insertCrossDesign(clonedCrossDesign.generateRecord())
      .then(async () => {
        await insertTasks(tasks);
      })
      .then(() => {
        navigate('/schedules/todo');
      })
      .catch(console.error);
  };

  /** Gets onSubmit callback for the strain form based on current state  */
  const getOnSubmitForStrainForm = (): ((strain: Strain) => void) => {
    switch (drawerState) {
      case 'addStrain':
        return addStrain;
      case 'cross':
        return matedCrossWithFormStrain;
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

  const enforcedSex =
    drawerState !== 'cross'
      ? undefined
      : getCurrentNode()?.data?.sex === Sex.Male
      ? Sex.Hermaphrodite
      : Sex.Male;

  const nodeTypes = useMemo(
    () => ({
      strain: StrainNode,
      x: XNode,
      self: SelfNode,
      note: NoteNode,
      filteredOut: FilteredOutNode,
    }),
    []
  );

  return (
    <div className='drawer drawer-end'>
      <input
        id='cross-editor-drawer'
        type='checkbox'
        className='drawer-toggle'
      />
      <div className='drawer-content'>
        {[...nodes.values()]
          .filter(
            (node) => node.type === NodeType.Self || node.type === NodeType.X
          )
          .map((iconNode, idx) => (
            <Fragment key={idx}>
              <OffspringFilterModal
                nodeId={iconNode.id}
                childNodes={[...nodes.values()].filter(
                  (node) =>
                    node.parentNode === iconNode.id &&
                    node.type === NodeType.Strain
                )}
                invisibleSet={
                  new Set(
                    nodes
                      .filter((node) => node.hidden === true)
                      .map((node) => node.id)
                  )
                }
                toggleVisible={toggleNodeVisibility}
                filter={offspringFilters.get(iconNode.id)}
                updateFilter={handleFilterUpdate}
              />
              <FilteredOutModal
                nodeId={iconNode.id}
                excludedNodes={[...nodes.values()].filter(
                  (node) =>
                    node.parentNode === iconNode.id &&
                    node.type === NodeType.Strain &&
                    nodes.some(
                      (nd) => nd.id === node.id && node.hidden === true
                    )
                )}
              />
            </Fragment>
          ))}
        <div className='drawer drawer-end'>
          <input
            id='right-drawer'
            type='checkbox'
            className='drawer-toggle'
            checked={rightDrawerOpen}
            readOnly
          />
          <div className='drawer-content flex h-screen flex-col'>
            {showRightClickMenu && props.crossDesign.editable && (
              <ContextMenu xPos={rightClickXPos} yPos={rightClickYPos}>
                <li
                  onClick={() => {
                    setEditorDrawerSideOpen(true);
                    setDrawerState('addStrain');
                  }}
                >
                  <button className='flex flex-row' name='add-cross-node'>
                    <AddIcon className='text-xl text-base-content' />
                    <p>Add Strain</p>
                  </button>
                </li>
                <li
                  onClick={() => {
                    setDrawerState('addNote');
                    setNoteFormContent('');
                    setEditorDrawerSideOpen(true);
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
            <EditorTop crossDesign={props.crossDesign} />
            <EditorContext.Provider value={editorContextValue}>
              <ReactFlow
                ref={flowRef}
                zoomOnScroll={true}
                nodeTypes={nodeTypes}
                fitView
                defaultViewport={{ x: 0, y: 0, zoom: 5 }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                nodesFocusable
                connectionMode={ConnectionMode.Loose}
                nodesDraggable={props.crossDesign.editable}
                nodesConnectable={props.crossDesign.editable}
                elementsSelectable={props.crossDesign.editable}
              >
                <CustomControls
                  reactFlowInstance={reactFlowInstance}
                  toggleShowGenes={() => {
                    setShowGenes(!showGenes);
                  }}
                  crossDesignEditable={props.crossDesign.editable}
                />
                <MiniMap
                  position='bottom-left'
                  className='bg-base-300'
                  nodeClassName='bg-base-100'
                />
                <Background className='-z-50 bg-base-300' size={1} gap={16} />
              </ReactFlow>
            </EditorContext.Provider>
          </div>
          <div className={'drawer-side'}>
            <label
              htmlFor='cross-editor-drawer'
              className='drawer-overlay'
              onClick={() => {
                setEditorDrawerSideOpen(false);
              }}
            />
            <div
              className={
                'flex h-screen flex-col overflow-y-auto bg-base-100 p-4'
              }
              hidden={!rightDrawerOpen}
            >
              <button
                className='self-end'
                onClick={() => {
                  setEditorDrawerSideOpen(false);
                }}
              >
                <CloseIcon className='text-3xl' />
              </button>
              {drawerState === 'addNote' ? (
                <NoteForm
                  header='Add note'
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
                <StrainForm
                  onSubmit={getOnSubmitForStrainForm()}
                  enforcedSex={enforcedSex}
                  newId={props.crossDesign.createId()}
                  showGenes={showGenes}
                />
              )}
            </div>
          </div>
        </div>
        <SaveStrainModal
          isOpen={saveStrainModalIsOpen}
          setIsOpen={setSaveStrainModalIsOpen}
          strainNode={getCurrentNode()}
        />
      </div>
    </div>
  );
};

type SaveMethod = 'png' | 'svg';
const saveMethodFuncs: Record<
  SaveMethod,
  (node: HTMLElement, options: Options) => Promise<string>
> = {
  png: toPng,
  svg: toSvg,
};

const downloadImage = async (
  strainUrl: string,
  saveMethod: SaveMethod,
  dir: string | null
): Promise<void> => {
  const a = document.createElement('a');
  let filename = `cross-crossDesign-${new Date().toISOString()}.${saveMethod}`;
  // workaround  because of this: https://github.com/tauri-apps/tauri/issues/4633
  if (window.__TAURI_IPC__ !== undefined) {
    if (dir !== null && dir !== undefined) {
      filename = await path.join(dir, filename);
    }
    const strainBlob = await (await fetch(strainUrl)).blob();
    switch (saveMethod) {
      case 'png':
        fs.writeBinaryFile(filename, await strainBlob.arrayBuffer(), {
          dir: dir === null ? fs.BaseDirectory.Download : undefined,
        })
          .then(() => toast.success('Exported PNG to ' + filename))
          .catch(toast.error);
        break;
      case 'svg':
        fs.writeTextFile(filename, await strainBlob.text(), {
          dir: dir === null ? fs.BaseDirectory.Download : undefined,
        })
          .then(() => toast.success('Exported SVG to ' + filename))
          .catch(toast.error);
        break;
    }
  } else {
    a.setAttribute('download', filename);
    a.setAttribute('href', strainUrl);
    a.click();
  }
};

const saveImg = (saveMethod: SaveMethod): void => {
  const saveFunc = saveMethodFuncs[saveMethod];
  const reactFlowElem = document.querySelector('.react-flow');
  if (reactFlowElem === null) {
    alert('Could not find react-flow element');
    return;
  }
  Promise.all([
    open({
      directory: true,
    }),
    saveFunc(reactFlowElem as HTMLElement, {
      width: 1920,
      height: 1080,
      quality: 1,
      skipAutoScale: false,
      pixelRatio: 1,
      filter: (node: Element | undefined) => {
        // we don't want to add the minimap and the controls to the image
        if (node === undefined) {
          return false;
        } else if (
          node.classList !== undefined &&
          (node.classList.contains('react-flow__minimap') ||
            node.classList.contains('react-flow__controls') ||
            node.classList.contains('react-flow__background') ||
            node.classList.contains('react-flow__attribution'))
        ) {
          return false;
        }
        return true;
      },
    }),
  ])
    .then(async ([dir, strainUrl]) => {
      await downloadImage(strainUrl, saveMethod, dir as string | null);
    })
    .catch((e) => {
      alert(e);
    });
};

interface CustomControlsProps {
  reactFlowInstance?: ReactFlowInstance;
  toggleShowGenes: () => void;
  crossDesignEditable: boolean;
}

const CustomControls = (props: CustomControlsProps): React.JSX.Element => {
  return (
    <Controls
      position='top-left'
      className='bg-base-100 text-base-content'
      showZoom={false}
      showInteractive={props.crossDesignEditable}
    >
      <ControlButton
        onClick={() => props.reactFlowInstance?.zoomIn({ duration: 150 })}
      >
        <FaPlus className='hover:cursor-pointer' />
      </ControlButton>
      <ControlButton
        onClick={() => props.reactFlowInstance?.zoomOut({ duration: 150 })}
      >
        <FaMinus className='hover:cursor-pointer' />
      </ControlButton>
      <ControlButton className='drowndown-hover dropdown'>
        <div>
          <label tabIndex={0} className=''>
            <BsCardImage className='text-3xl text-base-content hover:cursor-pointer' />
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow'
          >
            <li>
              <a
                target='_blank'
                onClick={() => {
                  saveImg('png');
                }}
              >
                Export to PNG
              </a>
            </li>
            <li>
              <a
                target='_blank'
                onClick={() => {
                  saveImg('svg');
                }}
              >
                Export to SVG
              </a>
            </li>
          </ul>
        </div>
      </ControlButton>
      <ControlButton
        onClick={() => {
          props.toggleShowGenes();
        }}
      >
        <FaEye />
      </ControlButton>
    </Controls>
  );
};

export default Editor;
