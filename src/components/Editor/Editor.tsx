import { insertTree, updateTree } from 'api/crossTree';
import { insertDbTasks } from 'api/task';
import {
  ContextMenu,
  useContextMenuState,
} from 'components/ContextMenu/ContextMenu';
import {
  OffspringFilter,
  type OffspringFilterUpdate,
} from 'components/OffspringFilter/OffspringFilter';
import { OffspringFilterModal } from 'components/OffspringFilterModal/OffspringFilterModal';
import CrossFlow, { FlowType } from 'components/CrossFlow/CrossFlow';
import EditorTop from 'components/EditorTop/EditorTop';
import FilteredOutModal from 'components/FilteredOutModal/FilteredOutModal';
import {
  FILTERED_OUT_NODE_WIDTH,
  type FilteredOutNodeProps,
} from 'components/FilteredOutNode/FilteredOutNode';
import { type MenuItem } from 'components/Menu/Menu';
import NoteForm from 'components/NoteForm/NoteForm';
import { NoteNodeProps } from 'components/NoteNode/NoteNodeProps';
import StrainForm from 'components/StrainForm/StrainForm';
import { Sex } from 'models/enums';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import CrossTree, { NODE_PADDING } from 'models/frontend/CrossTree/CrossTree';
import { type Strain, type StrainOption } from 'models/frontend/Strain/Strain';
import { StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import {
  Fragment,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
} from 'react';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import {
  FaRegStickyNote as NoteIcon,
  FaSave as SaveIcon,
} from 'react-icons/fa';
import { FiPlusCircle as AddIcon } from 'react-icons/fi';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Position,
  applyNodeChanges,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeAddChange,
  type NodeChange,
  type NodeDimensionChange,
  type NodePositionChange,
  type NodeRemoveChange,
  type NodeResetChange,
  type NodeSelectionChange,
  type OnConnectStartParams,
  type ReactFlowInstance,
  type XYPosition,
} from 'reactflow';
import { BiX as CloseIcon } from 'react-icons/bi';
import SaveStrainModal from 'components/SaveStrainModal/SaveStrainModal';

export interface EditorProps {
  crossTree: CrossTree;
  /*
   * This is used to determine if the context menu should be shown.
   * In attempting to use a right click event in testing, the context menu never shows up.
   * Not sure why, but this is a workaround.
   */
  testing?: boolean;
}

export const ShowGenesContext = createContext(true);

type DrawerState = 'addStrain' | 'cross' | 'addNote' | 'editNote';

const Editor = (props: EditorProps): JSX.Element => {
  const navigate = useNavigate();
  const [rightDrawerOpen, setEditorDrawerSideOpen] = useState(false);
  const [drawerState, setDrawerState] = useState<DrawerState>('addStrain');
  const [edges, setEdges] = useEdgesState(props.crossTree.edges);
  const [noteFormContent, setNoteFormContent] = useState('');
  const [nodeMap, setNodeMap] = useState<Map<string, Node>>(
    new Map(props.crossTree.nodes.map((node) => [node.id, node]))
  );
  const [showGenes, setShowGenes] = useState(true);
  const [invisibleNodes, setInvisibleNodes] = useState<Set<string>>(
    new Set(props.crossTree.invisibleNodes)
  );
  const [crossFilters, setOffspringFilters] = useState(
    new Map(props.crossTree.crossFilters)
  );
  const [saveStrainModalIsOpen, setSaveStrainModalIsOpen] = useState(false);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();

  const currNodeId = useRef<string>('');
  const onConnectParams = useRef<OnConnectStartParams | null>(null);

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
    const newNodeMap = new Map<string, Node>();
    const nodes = [...nodeMap.values()];
    const [additions, deletions, dimensions, movements, resets, selections] =
      filterNodeChanges(changes);

    // handle deletions
    let canDelete = deletions.length > 0;
    const selected = deletions.filter((del) => nodeMap.get(del.id)?.selected);
    selected.forEach((selectedNode) => {
      const toDelete = nodeMap.get(selectedNode.id);
      if (
        toDelete?.parentNode !== undefined &&
        toDelete.type === FlowType.Strain
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
    const invisibleDeletions = nodes
      .filter(
        (node) =>
          invisibleNodes.has(node.id) &&
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
    applyNodeChanges(toApply, nodes).forEach((node) =>
      newNodeMap.set(node.id, node)
    );

    if (canDelete) {
      // update parent nodes
      const parentNodes = parentIds.flatMap((id) => nodeMap.get(id) ?? []);
      const parentIdSet = new Set(parentIds);
      parentNodes.forEach((node) => {
        node.data = copyNodeData(node, {
          isParent: false,
          toggleNodeSex: () => {
            toggleStrainNodeSex(node.id);
          },
          toggleNodeHetPair: (pair) => {
            toggleHetPair(pair, node.id);
          },
        });

        // clear parent relationship between 2 nodes crossed together
        const clearParentId =
          node.parentNode !== undefined && parentIdSet.has(node.parentNode);
        node.parentNode = clearParentId ? undefined : node.parentNode;

        newNodeMap.set(node.id, node);
      });

      // remove unneeded edges
      const allDeletions = new Set(deletions.map((d) => d.id));
      const edgesToDelete = new Set(
        edges.filter((edge) => allDeletions.has(edge.target)).map((e) => e.id)
      );
      const newEdges = edges.filter((edge) => !edgesToDelete.has(edge.id));
      setEdges(newEdges);
    }

    setNodeMap(newNodeMap);

    if (deletions.length > 0) saveTree();
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
    // check for invalid connection types
    if (
      args.sourceHandle === 'top' ||
      args.sourceHandle === 'bottom' ||
      args.targetHandle === 'top' ||
      args.targetHandle === 'bottom'
    )
      return;
    const lNodeId = args.sourceHandle === 'right' ? args.source : args.target;
    const rNodeId = args.sourceHandle === 'right' ? args.target : args.source;

    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const lNode = nodeMap.get(lNodeId ?? '');
      const rNode = nodeMap.get(rNodeId ?? '');
      if (lNode === undefined || rNode === undefined) {
        console.error('Cannot cross with an undefined node');
        return nodeMap;
      }
      if (lNode.type !== FlowType.Strain || rNode.type !== FlowType.Strain) {
        console.error('Cannot cross with a non-strain node');
        return nodeMap;
      }

      const lStrain: StrainNodeModel = lNode.data;
      const rStrain: StrainNodeModel = rNode.data;

      if (lStrain.sex !== Sex.Male || rStrain.sex !== Sex.Hermaphrodite) {
        toast.error('Can only cross strains that are different sexes');
        return nodeMap;
      }

      if (lStrain.isParent || rStrain.isParent) {
        toast.error("A single strain can't be involved in multiple crosses");
        return nodeMap;
      }

      matedCross(lNode, rNode).catch(console.error);
      return nodeMap;
    });
  }, []);

  /** Called after onConnect or after dragging an edge */
  const onConnectEnd = useCallback(() => {
    const params = onConnectParams.current;
    if (params === null || params === undefined) return;
    if (params.handleType === 'target') return;
    const nodeId = params.nodeId;
    if (nodeId === null || nodeId === undefined) {
      console.error('NodeId is null or undefined');
      return;
    }

    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const currNode = nodeMap.get(params.nodeId ?? '');

      if (currNode === undefined) return nodeMap;
      if (currNode.type !== FlowType.Strain) return nodeMap;
      const currStrain = currNode.data as StrainNodeModel;

      if (currStrain.isParent) {
        toast.error('Cannot cross a strain already involved in a cross');
        return nodeMap;
      }

      if (params.handleId === Position.Bottom) {
        const refNode = nodeMap.get(nodeId);
        if (refNode === undefined || refNode.type !== FlowType.Strain) {
          console.error(
            'Cannot self-cross a node that is undefined/not a strain'
          );
        } else {
          selfCross(refNode.id).catch(console.error);
        }
      } else {
        currNodeId.current = nodeId;
        setDrawerState('cross');
        setEditorDrawerSideOpen(true);
      }
      return nodeMap;
    });
  }, []);

  /**
   * When we deserialize from a cross tree, all function member variables are
   * undefined. Because of this, we need to "re-hydrate them" with our current
   * functionality if we want to still be able to call/interact with them.
   */
  useEffect(() => {
    setOffspringFilters(
      (filters: Map<string, OffspringFilter>): Map<string, OffspringFilter> => {
        setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
          const nodes = [...nodeMap.values()];
          const refreshedNodes = nodes.map((node) => {
            if (node.type === FlowType.Strain) {
              const data: StrainNodeModel = node.data;
              node.data = new StrainNodeModel({
                sex: data.sex,
                strain: data.strain,
                probability: data.probability,
                isParent: data.isParent,
                isChild: data.isChild,
                getMenuItems: (model: StrainNodeModel) =>
                  getStrainNodeMenuItems(model, node.id, data.isParent),
                toggleSex: data.isParent
                  ? undefined
                  : () => {
                      toggleStrainNodeSex(node.id);
                    },
                toggleHetPair: (pair) => {
                  toggleHetPair(pair, node.id);
                },
              });
            } else if (node.type === FlowType.Note) {
              node.data = new NoteNodeProps({
                content: node.data.content,
                onDoubleClick: () => {
                  currNodeId.current = node.id;
                  setNoteFormContent(node.data.content);
                  setDrawerState('editNote');
                  setEditorDrawerSideOpen(true);
                },
              });
            } else if (
              node.type === FlowType.XIcon ||
              node.type === FlowType.SelfIcon
            ) {
              loadIconWithData(node);
            }

            return node;
          });
          refreshedNodes.forEach((node) => nodeMap.set(node.id, node));
          return new Map(nodeMap);
        });
        return filters;
      }
    );
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
    strain: Strain;
    position: XYPosition;
    isParent: boolean;
    isChild: boolean;
    sex: Sex;
    parentNode?: string;
    probability?: number;
    id?: string;
  }): Node<StrainNodeModel> => {
    const nodeId = id ?? props.crossTree.createId();
    const strainNode: Node = {
      id: nodeId,
      type: FlowType.Strain,
      position,
      parentNode,
      data: new StrainNodeModel({
        sex,
        strain,
        probability,
        isParent,
        isChild,
        getMenuItems: (node: StrainNodeModel) =>
          getStrainNodeMenuItems(node, nodeId, isParent),
        toggleSex: isParent
          ? undefined
          : () => {
              toggleStrainNodeSex(nodeId);
            },
        toggleHetPair: (pair) => {
          toggleHetPair(pair, nodeId);
        },
      }),
      className: 'nowheel',
    };
    return strainNode;
  };

  /** Create a node representing all offspring excluded by filter */
  const createFilteredOutNode = (
    position: XYPosition,
    parentNode: string
  ): Node<FilteredOutNodeProps> => {
    const newNode: Node<FilteredOutNodeProps> = {
      id: props.crossTree.createId(),
      type: FlowType.FilteredOut,
      position,
      parentNode,
      data: { nodeId: parentNode },
    };
    return newNode;
  };

  /** Creates a node representing the x icon */
  const createXIcon = (parentNode: Node<StrainNodeModel>): Node => {
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

  const loadIconWithData = (iconNode: Node): void => {
    const data = {
      id: iconNode.id,
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
          currNodeId.current = noteNode.id;
          setNoteFormContent(content);
          setDrawerState('editNote');
          setEditorDrawerSideOpen(true);
        },
      }),
      className: 'nowheel',
    };
    return noteNode;
  };

  /** Passed to strain node, determines what happens when the sex icon is clicked */
  const toggleStrainNodeSex = (nodeId: string): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const node = nodeMap.get(nodeId);
      if (node === undefined || node.type !== FlowType.Strain) {
        console.error(
          'Cannot toggle the sex of a node that is undefined/not a strain'
        );
        return nodeMap;
      }

      const data: StrainNodeModel = node.data;
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
    saveTree();
  };

  const toggleHetPair = (pair: AllelePair, nodeId: string): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const node = nodeMap.get(nodeId);
      if (node === undefined || node.type !== FlowType.Strain) {
        console.error(
          'Cannot toggle het pair on a node that is undefined/not a strain'
        );
        return nodeMap;
      }

      const data: StrainNodeModel = node.data;

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
    saveTree();
  };

  /** Show the filterOut node child of nodeId if any strain children of nodeId are hidden */
  const updateFilterOutNodeVisibility = (nodeId: string): void => {
    const filterOutNode = [...nodeMap.values()]
      .filter(
        (node) =>
          node.parentNode === nodeId && node.type === FlowType.FilteredOut
      )
      .at(0);
    const strainNodes = [...nodeMap.values()].filter(
      (node) => node.parentNode === nodeId && node.type === FlowType.Strain
    );
    if (filterOutNode !== undefined) {
      setInvisibleNodes((invisibleNodes: Set<string>) => {
        if (strainNodes.some((node) => invisibleNodes.has(node.id))) {
          invisibleNodes.delete(filterOutNode.id);
        } else {
          invisibleNodes.add(filterOutNode.id);
        }
        return new Set(invisibleNodes);
      });
    }
  };

  const toggleNodeVisibility = (nodeId: string): void => {
    const children = [...nodeMap.values()].filter(
      (node: Node) => node.parentNode === nodeId
    );
    if (children.length > 0) {
      toast.error("Can't mark a parent node as invisible");
      return;
    }
    setInvisibleNodes((invisibleNodes: Set<string>): Set<string> => {
      invisibleNodes.has(nodeId)
        ? invisibleNodes.delete(nodeId)
        : invisibleNodes.add(nodeId);
      return new Set(invisibleNodes);
    });
    const parentNodeId = nodeMap.get(nodeId)?.parentNode;
    if (parentNodeId !== undefined) updateFilterOutNodeVisibility(parentNodeId);
    saveTree();
  };

  const handleFilterUpdate = (update: OffspringFilterUpdate): void => {
    setOffspringFilters((filters): Map<string, OffspringFilter> => {
      const filter =
        filters.get(update.nodeId) ??
        new OffspringFilter({
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
          const childList: Array<Node<StrainNodeModel>> = [
            ...nodeMap.values(),
          ].filter(
            (node) =>
              node.parentNode === update.nodeId && node.type === FlowType.Strain
          );

          if (filter.isEmpty()) {
            filters.delete(update.nodeId);
            childList.forEach((node) => invisibleNodes.delete(node.id));
          } else {
            childList.forEach((node) => {
              if (
                !OffspringFilter.includedInFilter(node, filter) &&
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
    updateFilterOutNodeVisibility(update.nodeId);
    saveTree();
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
    setEditorDrawerSideOpen(false);
    saveTree();
  };

  /** Edits a current note's content */
  const editNote = (): void => {
    const noteNode = nodeMap.get(currNodeId.current);
    if (noteNode === undefined || noteNode.type !== FlowType.Note) {
      console.error(
        'Cannot edit note when currNode is undefined or is not a note type'
      );
      return;
    }

    const noteData: NoteNodeProps = noteNode.data;
    noteData.content = noteFormContent;
    addToOrUpdateNodeMap(noteNode);
    setEditorDrawerSideOpen(false);
    saveTree();
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
    setEditorDrawerSideOpen(false);
    saveTree();
  };

  const selfCross = async (parentNodeId: string): Promise<void> => {
    let parentNode: Node | undefined;
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      parentNode = nodeMap.get(parentNodeId);
      return nodeMap;
    });
    if (parentNode === undefined || parentNode.type !== FlowType.Strain) {
      console.error('Cannot self-cross a node that is undefined/not a strain');
      return;
    }

    // Mark as parent
    parentNode.data = copyNodeData(parentNode, { isParent: true });

    // Create nodes and edges
    const selfNode = createSelfIcon(parentNode.id);
    loadIconWithData(selfNode);
    const edgeToIcon = createEdge(parentNode.id, selfNode.id, {
      sourceHandle: 'bottom',
    });
    const parentStrain = parentNode.data as StrainNodeModel;
    const childStrains = await parentStrain.strain.selfCross();
    const childNodes = getChildNodes(selfNode, childStrains);
    const childEdges = childNodes.map((node) =>
      createEdge(selfNode.id, node.id)
    );

    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      [parentNode, selfNode, ...childNodes].forEach(
        (node) => node !== undefined && nodeMap.set(node.id, node)
      );
      setEdges((edges) => [...edges, edgeToIcon, ...childEdges]);
      return new Map(nodeMap);
    });
    saveTree();
  };

  const matedCross = async (
    lNode: Node<StrainNodeModel>,
    rNode: Node<StrainNodeModel>
  ): Promise<void> => {
    // Mark as parents
    lNode.data = copyNodeData(lNode, { isParent: true });
    rNode.data = copyNodeData(rNode, { isParent: true });

    // Update positioning of one of the parent strains
    const lControlsR = rNode.parentNode === undefined;
    if (lControlsR) {
      rNode.parentNode = lNode.id;
      rNode.position = CrossTree.getMatedStrainPos(lNode.data.sex);
    } else {
      lNode.parentNode = rNode.id;
      lNode.position = CrossTree.getMatedStrainPos(rNode.data.sex);
    }

    // Create new nodes and edges
    const xNode = createXIcon(lNode);
    loadIconWithData(xNode);
    const lStrain = lNode.data;
    const rStrain = rNode.data;
    const e1 = createEdge(lNode.id, xNode.id, {
      targetHandle: lStrain.sex === Sex.Male ? 'left' : 'right',
      sourceHandle: lStrain.sex !== Sex.Male ? 'left' : 'right',
    });
    const e2 = createEdge(rNode.id, xNode.id, {
      targetHandle: rStrain.sex === Sex.Male ? 'left' : 'right',
      sourceHandle: rStrain.sex !== Sex.Male ? 'left' : 'right',
    });
    const children = await lStrain.strain.crossWith(rStrain.strain);
    const childNodes = getChildNodes(xNode, children);
    const childEdges = childNodes.map((node) => createEdge(xNode.id, node.id));

    // Update state
    setNodeMap((nodeMap) => {
      [lNode, rNode, xNode, ...childNodes].forEach((node) =>
        nodeMap.set(node.id, node)
      );
      return new Map(nodeMap);
    });
    setEdges((edges) => [...edges, e1, e2, ...childEdges]);

    saveTree();
  };

  /** Create a collection of strain nodes to represent children of a cross, from child strain options */
  const getChildNodes = (
    middleNode: Node,
    childOptions: StrainOption[]
  ): Node[] => {
    childOptions.sort((c1, c2) => c1.prob - c2.prob);

    const childPositions = CrossTree.calculateChildPositions(
      middleNode.type === FlowType.XIcon ? FlowType.XIcon : FlowType.SelfIcon,
      childOptions
    );

    const childNodes: Node[] = childOptions.map((child, i) => {
      return createStrainNode({
        sex: Sex.Hermaphrodite,
        strain: child.strain,
        position: childPositions[i],
        isParent: false,
        isChild: true,
        probability: child.prob,
        parentNode: middleNode.id,
      });
    });

    if (childNodes.length > 0) {
      const filteredOutNode = createFilteredOutNode(
        {
          x: childPositions[0].x - FILTERED_OUT_NODE_WIDTH - NODE_PADDING,
          y: childPositions[0].y,
        },
        middleNode.id
      );
      setInvisibleNodes((invisibleNodes) => {
        invisibleNodes.add(filteredOutNode.id);
        return invisibleNodes;
      });
      childNodes.unshift(filteredOutNode);
    }
    return childNodes;
  };

  /**
   * Params are provided by the strainNode form's onSubmit callback function
   */
  const matedCrossWithFormData = (sex: Sex, strain: Strain): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      const startingNode = nodeMap.get(currNodeId.current);
      if (startingNode === undefined || startingNode.type !== FlowType.Strain) {
        console.error(
          'Cannot cross currNode with a form node when currNode is undefined or not a strain'
        );
        return nodeMap;
      }

      const currStrain: StrainNodeModel = startingNode.data;
      const formNode = createStrainNode({
        sex,
        strain,
        position: CrossTree.getMatedStrainPos(currStrain.sex),
        isParent: true,
        isChild: false,
      });

      currStrain.sex === Sex.Male
        ? matedCross(startingNode, formNode).catch(console.error)
        : matedCross(formNode, startingNode).catch(console.error);

      setEditorDrawerSideOpen(false);
      return nodeMap;
    });
  };

  /** Clones the passed node's data and optionally marks as a parent/child */
  const copyNodeData = (
    node: Node<StrainNodeModel>,
    {
      isChild = node.data.isChild,
      isParent = node.data.isParent,
      toggleNodeSex = node.data.toggleSex,
      toggleNodeHetPair = node.data.toggleHetPair,
    }
  ): StrainNodeModel => {
    const updatedParentData = new StrainNodeModel({
      sex: node.data.sex,
      strain: node.data.strain,
      isChild,
      isParent,
      probability: node.data.probability,
      getMenuItems: () => getStrainNodeMenuItems(node.data, node.id, isParent),
      toggleHetPair: isParent || isChild ? undefined : toggleNodeHetPair,
      toggleSex: isParent ? undefined : toggleNodeSex, // disable toggle action
    });
    return updatedParentData;
  };

  const getStrainNodeMenuItems = (
    strainNode: StrainNodeModel | null | undefined,
    nodeId: string,
    isParent: boolean = false
  ): MenuItem[] => {
    if (strainNode === undefined || strainNode === null) return [];
    const selfOption: MenuItem = {
      icon: <SelfCrossIcon />,
      text: 'Self-cross',
      menuCallback: () => {
        selfCross(nodeId).catch(console.error);
      },
    };
    const crossOption: MenuItem = {
      icon: <CrossIcon />,
      text: 'Cross',
      menuCallback: () => {
        currNodeId.current = nodeId;
        setDrawerState('cross');
        setEditorDrawerSideOpen(true);
      },
    };
    const scheduleOption: MenuItem = {
      icon: <ScheduleIcon />,
      text: 'Schedule',
      menuCallback: () => {
        scheduleNode(nodeId);
      },
    };
    const saveStrainOption: MenuItem = {
      icon: <SaveIcon />,
      text: 'Save strain',
      menuCallback: () => {
        currNodeId.current = nodeId;
        setSaveStrainModalIsOpen(true);
      },
    };

    const menuOptions = [scheduleOption];
    if (!isParent) menuOptions.push(crossOption);
    if (strainNode.sex === Sex.Hermaphrodite && !isParent)
      menuOptions.push(selfOption);
    if (strainNode.strain.name === undefined)
      menuOptions.push(saveStrainOption);
    return menuOptions;
  };

  const scheduleNode = (nodeId: string): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      setEdges((edges: Edge[]): Edge[] => {
        const node = nodeMap.get(nodeId);
        if (node === undefined || node.type !== FlowType.Strain) {
          console.error(
            'The node you are trying to schedule is undefined/not a strain'
          );
          return edges;
        }

        const clonedTree = props.crossTree.clone();
        clonedTree.nodes = [...nodeMap.values()];
        clonedTree.edges = [...edges];
        clonedTree.editable = false;
        const tasks = clonedTree
          .generateTasks(node)
          .map((task) => task.generateRecord());
        insertTree(clonedTree.generateRecord(clonedTree.editable))
          .then(async () => {
            await insertDbTasks(tasks);
          })
          .then(() => {
            navigate('/schedules/todo');
          })
          .catch(console.error);

        return edges;
      });
      return nodeMap;
    });
  };

  const saveTree = (showSuccessMessage = false): void => {
    setNodeMap((nodeMap: Map<string, Node>): Map<string, Node> => {
      setEdges((edges: Edge[]): Edge[] => {
        setInvisibleNodes((invisibleNodes: Set<string>): Set<string> => {
          setOffspringFilters(
            (
              crossFilters: Map<string, OffspringFilter>
            ): Map<string, OffspringFilter> => {
              const tree = props.crossTree;
              tree.nodes = [...nodeMap.values()];
              tree.edges = edges;
              tree.invisibleNodes = invisibleNodes;
              tree.crossFilters = crossFilters;
              tree.lastSaved = new Date();
              updateTree(tree.generateRecord(props.crossTree.editable))
                .then(() => {
                  if (showSuccessMessage)
                    toast.success('Successfully saved design');
                })
                .catch(() => {
                  toast.error('Unable to save design');
                });

              return crossFilters;
            }
          );
          return invisibleNodes;
        });
        return edges;
      });
      return nodeMap;
    });
  };

  /** Gets onSubmit callback for the strain form based on current state  */
  const getOnSubmitForStrainForm = (): ((sex: Sex, strain: Strain) => void) => {
    switch (drawerState) {
      case 'addStrain':
        return addStrain;
      case 'cross':
        return matedCrossWithFormData;
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

  let enforcedSex: Sex | undefined;
  const currNode = nodeMap.get(currNodeId.current);
  if (drawerState === 'cross')
    enforcedSex =
      currNode?.data?.sex === Sex.Male ? Sex.Hermaphrodite : Sex.Male;

  return (
    <ShowGenesContext.Provider value={showGenes}>
      <div className='drawer drawer-end'>
        <input
          id='cross-editor-drawer'
          type='checkbox'
          className='drawer-toggle'
        />
        <div className='drawer-content'>
          {[...nodeMap.values()]
            .filter(
              (node) =>
                node.type === FlowType.SelfIcon || node.type === FlowType.XIcon
            )
            .map((iconNode, idx) => (
              <Fragment key={idx}>
                <OffspringFilterModal
                  nodeId={iconNode.id}
                  childNodes={[...nodeMap.values()].filter(
                    (node) =>
                      node.parentNode === iconNode.id &&
                      node.type === FlowType.Strain
                  )}
                  invisibleSet={new Set([...invisibleNodes])}
                  toggleVisible={toggleNodeVisibility}
                  filter={crossFilters.get(iconNode.id)}
                  updateFilter={handleFilterUpdate}
                />
                <FilteredOutModal
                  nodeId={iconNode.id}
                  excludedNodes={[...nodeMap.values()].filter(
                    (node) =>
                      node.parentNode === iconNode.id &&
                      node.type === FlowType.Strain &&
                      invisibleNodes.has(node.id)
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
              {showRightClickMenu && props.crossTree.editable && (
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
              <EditorTop tree={props.crossTree} />
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
                onEdgesChange={() => {}}
                onConnectStart={onConnectStart}
                onConnect={onConnect}
                onConnectEnd={onConnectEnd}
                onNodeDragStop={() => {
                  saveTree();
                }}
                reactFlowInstance={reactFlowInstance}
                toggleShowGenes={() => {
                  setShowGenes(!showGenes);
                }}
                treeEditable={props.crossTree.editable}
              />
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
                <label htmlFor='my-drawer-4' className='drawer-overlay' />
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
                  />
                )}
              </div>
            </div>
          </div>
          <SaveStrainModal
            isOpen={saveStrainModalIsOpen}
            setIsOpen={setSaveStrainModalIsOpen}
            strainNode={nodeMap.get(currNodeId.current)}
          />
        </div>
      </div>
    </ShowGenesContext.Provider>
  );
};

export default Editor;
