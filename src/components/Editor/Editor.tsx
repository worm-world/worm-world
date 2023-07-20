import { insertCrossDesign, updateCrossDesign } from 'api/crossDesign';
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
  useEffect,
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
import { ImLoop2 as SelfIcon } from 'react-icons/im';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactFlow, {
  Position,
  applyNodeChanges,
  type NodeRemoveChange,
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
  getIncomers,
  getConnectedEdges,
  getOutgoers,
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
  testing?: boolean; // This is used to determine if the context menu should be shown (testing workaround)
}

interface DrawerState {
  type: DrawerType;
  isOpen: boolean;
  id?: string;
}
type DrawerType = 'addStrain' | 'cross' | 'addNote' | 'editNote';

interface StrainModalState {
  isOpen: boolean;
  strain?: Strain;
}

const Editor = (props: EditorProps): React.JSX.Element => {
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  const onConnectParams = useRef<OnConnectStartParams | null>(null);
  const [name, setName] = useState(props.crossDesign.name);
  const [nodes, setNodes] = useState(props.crossDesign.nodes);
  const [edges, setEdges] = useState(props.crossDesign.edges);
  const [offspringFilters, setOffspringFilters] = useState(
    props.crossDesign.offspringFilters
  );
  const [drawerState, setDrawerState] = useState<DrawerState>({
    type: 'addStrain',
    isOpen: false,
  });
  const [saveStrainModalState, setSaveStrainModalState] =
    useState<StrainModalState>({ isOpen: false, strain: new Strain() });
  const [showGenes, setShowGenes] = useState(true);
  const [saveState, setSaveState] = useState({
    isSaving: false,
    lastSaved: props.crossDesign.lastSaved,
  });
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setSaveState((saveState) => {
      return { ...saveState, isSaving: true };
    });
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const time = new Date();
      updateCrossDesign(
        new CrossDesign({
          ...props.crossDesign,
          nodes,
          edges,
          offspringFilters,
          name,
          lastSaved: time,
        }).generateRecord()
      )
        .then(() => {
          setSaveState((saveState) => {
            return { lastSaved: time, isSaving: false };
          });
        })
        .catch(() => {
          toast.error('Unable to save design');
        });
    }, 1000);
  }, [nodes, edges, offspringFilters, name]);

  const closeDrawer = (): void => {
    setDrawerState({
      type: 'addStrain',
      isOpen: false,
    });
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

      setNodes((nodes) =>
        addNodes(nodes, {
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
          setNodes((nodes) => addNodes(nodes, { ...node, data: strain }));
        })
        .catch(console.error);
    },
    openNote: (id: string) => {
      setDrawerState({ type: 'editNote', isOpen: true, id });
    },
    getMenuItems: (id: string): MenuItem[] => {
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
        icon: <SelfIcon />,
        text: 'Self-cross',
        menuCallback: () => {
          selfCross(id).catch(console.error);
        },
      };
      const cross: MenuItem = {
        icon: <CrossIcon />,
        text: 'Cross',
        menuCallback: () => {
          setDrawerState({ type: 'cross', isOpen: true, id });
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
          setSaveStrainModalState({ isOpen: true });
        },
      };

      const menuOptions = [schedule];
      if (!strainNode.data.isParent) menuOptions.push(cross);
      if (
        strainNode.data.sex === Sex.Hermaphrodite &&
        !strainNode.data.isParent
      )
        menuOptions.push(self);
      if (strainNode.data.name === undefined) menuOptions.push(saveStrain);
      return menuOptions;
    },
  };

  /**
   * This function sets up right click handler overrides that check if the right click is on an HTML
   * element that has a class that matches any of the passed in class names.
   * If it does, then that click fires activates the context menu and updates the x & y click position.
   */
  const { rightClickXPos, rightClickYPos, showRightClickMenu } =
    useContextMenuState(['react-flow__pane'], props.testing);
  const flowRef = useRef<HTMLDivElement>(null);

  const addNodes = (existingNodes: Node[], ...newNodes: Node[]): Node[] => {
    const newIds = newNodes.map((newNode) => newNode.id);
    return [
      ...existingNodes.filter((node) => !newIds.includes(node.id)),
      ...newNodes,
    ];
  };

  const isValidNodeRemoveChange = (
    nodeRemoveChange: NodeRemoveChange,
    nodeRemoveChanges: NodeRemoveChange[]
  ): boolean => {
    const node = reactFlowInstance.getNode(nodeRemoveChange.id);
    if (node === undefined) return false;
    if (node.type !== NodeType.Strain) return true;

    // Strain nodes must not be involved in a cross not slated for removal
    const involvedMiddleNodes = [
      ...getIncomers(node, nodes, edges),
      ...getOutgoers(node, nodes, edges).filter(
        (outNode) => outNode.type === NodeType.X
      ),
    ].map((node) => node.id);
    const removalChangeIds = nodeRemoveChanges.map(
      (nodeRemoveChange) => nodeRemoveChange.id
    );
    return (
      involvedMiddleNodes.length === 0 ||
      involvedMiddleNodes.every((involvedMiddleNode) =>
        removalChangeIds.includes(involvedMiddleNode)
      )
    );
  };

  const onNodesChange = (changes: NodeChange[]): void => {
    const [nodeRemoveChanges, othehermNodeChanges] =
      categorizeNodeChanges(changes);

    // Don't remove any child strains
    const validNodeRemoveChanges: NodeRemoveChange[] = nodeRemoveChanges.every(
      (nodeRemoveChange) =>
        isValidNodeRemoveChange(nodeRemoveChange, nodeRemoveChanges)
    )
      ? nodeRemoveChanges
      : [];

    if (nodeRemoveChanges.length > 0 && validNodeRemoveChanges.length === 0)
      toast.error('Cannot remove a strain involved in a cross');

    const removed = validNodeRemoveChanges.flatMap(
      (nodeRemoveChange) => reactFlowInstance.getNode(nodeRemoveChange.id) ?? []
    );

    const parentsOfRemoved = removed.flatMap((node) =>
      getIncomers(node, nodes, edges)
    );

    const updatedParentsOfRemoved = parentsOfRemoved.map((node) => {
      if (node.type === NodeType.Strain) {
        node.data = new Strain({ ...node.data, isParent: false });
        // Remove parent node relationship between previously mated strains
        if (
          node.parentNode !== undefined &&
          getOutgoers(node, nodes, edges)
            .filter((outNode) => outNode.type === NodeType.X)
            .every((involvedXNode) =>
              validNodeRemoveChanges
                .map((nodeRemoveChange) => nodeRemoveChange.id)
                .includes(involvedXNode.id)
            )
        )
          node.parentNode = undefined;
      }
      return node;
    });

    setNodes((nodes) =>
      applyNodeChanges(
        [validNodeRemoveChanges, othehermNodeChanges].flat(),
        addNodes(nodes, ...updatedParentsOfRemoved)
      )
    );

    setEdges((edges) =>
      validNodeRemoveChanges.length > 0
        ? edges.filter(
            (edge) =>
              !getConnectedEdges(removed, edges)
                .map((conEdge) => conEdge.id)
                .includes(edge.id)
          )
        : edges
    );
  };

  const categorizeNodeChanges = (
    changes: NodeChange[]
  ): [NodeRemoveChange[], NodeChange[]] => {
    const removals: NodeRemoveChange[] = [];
    const otherChanges: NodeChange[] = [];
    changes.forEach((change) => {
      change.type === 'remove'
        ? removals.push(change)
        : otherChanges.push(change);
    });

    return [removals, otherChanges];
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
    const [maleNodeId, hermNodeId] =
      args.sourceHandle === 'right'
        ? [args.source, args.target]
        : [args.target, args.source];

    const maleNode = reactFlowInstance.getNode(maleNodeId ?? '');
    const hermNode = reactFlowInstance.getNode(hermNodeId ?? '');
    if (maleNode === undefined || hermNode === undefined) {
      console.error('Cannot cross with an undefined node');
      return;
    }
    if (
      maleNode.type !== NodeType.Strain ||
      hermNode.type !== NodeType.Strain
    ) {
      console.error('Cannot cross with a non-strain node');
      return;
    }

    const maleStrain: Strain = maleNode.data;
    const hermStrain: Strain = hermNode.data;

    if (maleStrain.sex === hermStrain.sex) {
      toast.error('Can only mate strains that are different sexes');
      return;
    }

    if (maleStrain.isParent || hermStrain.isParent) {
      toast.error("A single strain can't be involved in multiple crosses");
      return;
    }

    matedCross(maleNode, hermNode).catch(console.error);
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
    if (params.nodeId === null || params.nodeId === undefined) {
      console.error('Id is null or undefined');
      return;
    }
    const node = reactFlowInstance.getNode(params.nodeId);

    if (node === undefined || node.type !== NodeType.Strain) {
      toast.error('Node is not a defined strain');
      return;
    } else if ((node as Node<Strain>).data.isParent) {
      toast.error('Cannot cross a strain already involved in a cross');
      return;
    }

    if (params.handleId === Position.Bottom)
      selfCross(node.id).catch(console.error);
    else setDrawerState({ type: 'cross', isOpen: true, id: node.id });
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

    setOffspringFilters((offspringFilters) => new Map(offspringFilters));
    updateFilterOutNodeVisibility(update.nodeId);
  };

  const getNodePositionFromLastClick = (): XYPosition => {
    const bounodes = flowRef?.current?.getBoundingClientRect() ?? {
      left: 0,
      top: 0,
    };
    return (
      reactFlowInstance?.project({
        x: rightClickXPos - bounodes.left,
        y: rightClickYPos - bounodes.top,
      }) ?? { x: 0, y: 0 }
    );
  };

  const addNote = (content: string): void => {
    const noteNode: Node<string> = {
      id: props.crossDesign.createId(),
      data: content,
      position: getNodePositionFromLastClick(),
      type: NodeType.Note,
    };
    setNodes((nodes) => addNodes(nodes, noteNode));
    closeDrawer();
  };

  const editNote = (content: string, id: string): void => {
    const noteNode = reactFlowInstance.getNode(id);
    if (noteNode === undefined || noteNode.type !== NodeType.Note) {
      console.error(
        'Cannot edit note when hermNode is undefined or is not a note type'
      );
      return;
    }
    noteNode.data = content;
    setNodes((nodes) => addNodes(nodes, noteNode));
    closeDrawer();
  };

  const addStrain = (strain: Strain): void => {
    const strainNode: Node<Strain> = {
      id: props.crossDesign.createId(),
      data: strain,
      position: getNodePositionFromLastClick(),
      type: NodeType.Strain,
    };
    setNodes((nodes) => addNodes(nodes, strainNode));
    closeDrawer();
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
    console.log('pts', parentToSelf);
    const childStrains = await parentNode.data.selfCross();
    const childNodes = getChildNodes(selfNode, childStrains);
    const childEdges = childNodes.map((node) => {
      return {
        id: props.crossDesign.createId(),
        source: selfNode.id,
        target: node.id,
      };
    });

    console.log('nodes', nodes);
    console.log(
      'newNodes',
      addNodes(nodes, parentNode, selfNode, ...childNodes)
    );
    setNodes((nodes) => addNodes(nodes, parentNode, selfNode, ...childNodes));
    setEdges((edges) => [...edges, parentToSelf, ...childEdges]);
  };

  const matedCross = async (
    maleNode: Node<Strain>,
    hermNode: Node<Strain>
  ): Promise<void> => {
    // Mark as parents
    maleNode.data = new Strain({ ...maleNode.data, isParent: true });
    hermNode.data = new Strain({ ...hermNode.data, isParent: true });

    hermNode.position = CrossDesign.getMatedStrainPos(maleNode.data.sex);
    maleNode.position = CrossDesign.getMatedStrainPos(hermNode.data.sex);

    const xNode: Node = {
      id: props.crossDesign.createId(),
      data: {},
      position: CrossDesign.getXNodePos(maleNode),
      type: NodeType.X,
    };

    [xNode.parentNode, maleNode.parentNode, hermNode.parentNode] =
      maleNode.parentNode !== undefined || hermNode.parentNode === undefined
        ? [maleNode.id, maleNode.parentNode, maleNode.id]
        : [hermNode.id, hermNode.id, hermNode.parentNode];

    const maleStrain = maleNode.data;
    const hermStrain = hermNode.data;
    const edge1 = {
      id: props.crossDesign.createId(),
      source: maleNode.id,
      target: xNode.id,
      sourceHandle: maleStrain.sex === Sex.Hermaphrodite ? 'left' : 'right',
      targetHandle: maleStrain.sex === Sex.Male ? 'left' : 'right',
    };
    const edge2 = {
      id: props.crossDesign.createId(),
      source: hermNode.id,
      target: xNode.id,
      sourceHandle: hermStrain.sex === Sex.Hermaphrodite ? 'left' : 'right',
      targetHandle: hermStrain.sex === Sex.Male ? 'left' : 'right',
    };
    const childOptions = await maleStrain.crossWith(hermStrain);
    const childNodes = getChildNodes(xNode, childOptions);
    const childEdges = childNodes.map((node) => {
      return {
        id: props.crossDesign.createId(),
        source: xNode.id,
        target: node.id,
      };
    });

    setNodes((nodes) =>
      addNodes(nodes, maleNode, hermNode, xNode, ...childNodes)
    );
    setEdges((edges) => [...edges, edge1, edge2, ...childEdges]);
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
      setNodes((nodes) => addNodes(nodes, filteredOutNode));
      childNodes.unshift(filteredOutNode);
    }
    return childNodes;
  };

  /**
   * Params are provided by the strainNode form's onSubmit callback function
   */
  const matedCrossWithForm = (strain: Strain, existingNodeId: string): void => {
    const existingNode = reactFlowInstance.getNode(existingNodeId);
    if (existingNode === undefined || existingNode.type !== NodeType.Strain) {
      console.error(
        'Cannot cross with a form-created node when existing node is undefined or not a strain'
      );
      return;
    }

    const newNode: Node<Strain> = {
      id: props.crossDesign.createId(),
      data: strain,
      position: CrossDesign.getMatedStrainPos(existingNode.data.sex),
      type: NodeType.Strain,
    };

    (existingNode.data.sex === Sex.Male
      ? matedCross(existingNode, newNode)
      : matedCross(newNode, existingNode)
    ).catch(console.error);
    closeDrawer();
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
  const getOnSubmitFohermStrainForm = (
    id?: string
  ): ((strain: Strain) => void) => {
    if (drawerState.type === 'addStrain') return addStrain;
    if (drawerState.type === 'cross' && id !== undefined)
      return (strain: Strain) => {
        matedCrossWithForm(strain, id);
      };
    console.error('Drawer not properly set up');
    return () => {};
  };

  /** Gets onSubmit callback for the note form based on current state  */
  const getOnSubmitForNoteForm = (id?: string): ((content: string) => void) => {
    if (drawerState.type === 'addNote') return addNote;
    if (drawerState.type === 'editNote' && id !== undefined)
      return (content: string) => {
        editNote(content, id);
      };
    console.error('Drawer not properly set up');
    return () => {};
  };

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
            checked={drawerState.isOpen}
            readOnly
          />
          <div className='drawer-content flex h-screen flex-col'>
            {showRightClickMenu && props.crossDesign.editable && (
              <ContextMenu xPos={rightClickXPos} yPos={rightClickYPos}>
                <li
                  onClick={() => {
                    setDrawerState({ type: 'addStrain', isOpen: true });
                  }}
                >
                  <button className='flex flex-row' name='add-cross-node'>
                    <AddIcon className='text-xl text-base-content' />
                    <p>Add Strain</p>
                  </button>
                </li>
                <li
                  onClick={() => {
                    setDrawerState({ type: 'addNote', isOpen: true });
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
            <EditorTop
              crossDesign={props.crossDesign}
              isSaving={saveState.isSaving}
              lastSaved={saveState.lastSaved}
              name={name}
              setName={setName}
            />
            <EditorContext.Provider value={editorContextValue}>
              <ReactFlow
                fitView
                nodesFocusable
                ref={flowRef}
                zoomOnScroll={true}
                nodeTypes={nodeTypes}
                defaultViewport={{ x: 0, y: 0, zoom: 5 }}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
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
              onClick={closeDrawer}
            />
            <div
              className={
                'flex h-screen flex-col overflow-y-auto bg-base-100 p-4'
              }
              hidden={!drawerState.isOpen}
            >
              <button className='self-end' onClick={closeDrawer}>
                <CloseIcon className='text-3xl' />
              </button>
              {drawerState.type === 'addNote' ||
              drawerState.type === 'editNote' ? (
                <NoteForm
                  header={
                    drawerState.type === 'addNote' ? 'Add note' : 'Edit note'
                  }
                  buttonText='Create'
                  callback={function (): void {
                    throw new Error('Function not implemented.');
                  }}
                  nodeId={''}
                />
              ) : (
                <StrainForm
                  onSubmit={getOnSubmitFohermStrainForm(drawerState.id)}
                  newId={props.crossDesign.createId()}
                  showGenes={showGenes}
                  enforcedSex={
                    drawerState.id === undefined
                      ? undefined
                      : reactFlowInstance.getNode(drawerState.id)?.data.sex ===
                        Sex.Hermaphrodite
                      ? Sex.Male
                      : Sex.Hermaphrodite
                  }
                />
              )}
            </div>
          </div>
        </div>
        <SaveStrainModal
          isOpen={saveStrainModalState.isOpen}
          setIsOpen={(isOpen: boolean) => {
            setSaveStrainModalState({ ...saveStrainModalState, isOpen });
          }}
          strain={saveStrainModalState.strain ?? new Strain()}
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
