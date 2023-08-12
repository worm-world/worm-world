import { insertCrossDesign, updateCrossDesign } from 'api/crossDesign';
import { insertTasks } from 'api/task';
import {
  ContextMenu,
  useContextMenuState,
} from 'components/ContextMenu/ContextMenu';
import {
  StrainFilter,
  type StrainFilterUpdate,
} from 'models/frontend/StrainFilter/StrainFilter';
import { StrainFilterModal } from 'components/StrainFilterModal/StrainFilterModal';
import EditorTop from 'components/EditorTop/EditorTop';
import { type MenuItem } from 'components/Menu/Menu';
import NoteForm from 'components/NoteForm/NoteForm';
import StrainForm from 'components/StrainForm/StrainForm';
import { Sex } from 'models/enums';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import CrossDesign, {
  addToArray,
} from 'models/frontend/CrossDesign/CrossDesign';
import { Strain } from 'models/frontend/Strain/Strain';
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
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import {
  FaRegStickyNote as NoteIcon,
  FaSave as SaveIcon,
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
  type XYPosition,
  MiniMap,
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
import 'reactflow/dist/style.css';
import { NoteNode } from 'components/NoteNode/NoteNode';
import StrainNode from 'components/StrainNode/StrainNode';
import EditorContext from 'components/EditorContext/EditorContext';
import CustomControls from 'components/CustomControls/CustomControls';
import MiddleNode from 'components/MiddleNode/MiddleNode';
import FilteredOutModal from 'components/FilteredOutModal/FilteredOutModal';

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

enum DrawerType {
  AddStrain,
  Cross,
  AddNote,
  EditNote,
}
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
  const [drawerState, setDrawerState] = useState<DrawerState>({
    type: DrawerType.AddStrain,
    isOpen: false,
  });
  const [saveStrainModalState, setSaveStrainModalState] =
    useState<StrainModalState>({ isOpen: false, strain: new Strain() });
  const [showGenes, setShowGenes] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setIsSaving(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      updateCrossDesign(
        new CrossDesign({
          ...props.crossDesign,
          nodes,
          edges,
          name,
          lastSaved: new Date(),
        }).generateRecord()
      )
        .then(() => {
          setIsSaving(false);
        })
        .catch(() => {
          toast.error('Unable to save design');
        });
    }, 1000);
  }, [nodes, edges, name]);

  const closeDrawer = (): void => {
    setDrawerState({
      ...drawerState,
      isOpen: false,
    });
  };

  const hideConnectedEdges = (node: Node, hidden = true): void => {
    setEdges((edges) =>
      addToArray(
        edges,
        ...getConnectedEdges([node], edges).map((conEdge) => {
          conEdge.hidden = hidden;
          return conEdge;
        })
      )
    );
  };

  const editorContextValue = {
    showGenes,
    toggleSex: (id: string): void => {
      const node = reactFlowInstance.getNode(id);
      if (node === undefined || node.type !== NodeType.Strain) {
        console.error(
          'Cannot toggle sex of node that is undefined or not a strain'
        );
        return;
      }
      setNodes((nodes) =>
        addToArray(nodes, {
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
          setNodes((nodes) => addToArray(nodes, { ...node, data: strain }));
        })
        .catch(console.error);
    },
    openNote: (id: string) => {
      setDrawerState({ type: DrawerType.EditNote, isOpen: true, id });
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
          setDrawerState({ type: DrawerType.Cross, isOpen: true, id });
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
      ...getOutgoers(node, nodes, edges),
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
        // TODO fix delete grandchild
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
        addToArray(nodes, ...updatedParentsOfRemoved)
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
    const [hermNodeId, maleNodeId] =
      args.sourceHandle === 'right'
        ? [args.source, args.target]
        : [args.target, args.source];

    const hermNode = reactFlowInstance.getNode(hermNodeId ?? '');
    const maleNode = reactFlowInstance.getNode(maleNodeId ?? '');

    if (hermNode === undefined || maleNode === undefined) {
      console.error('Cannot cross with an undefined node');
      return;
    }
    if (
      hermNode.type !== NodeType.Strain ||
      maleNode.type !== NodeType.Strain
    ) {
      console.error('Cannot cross with a non-strain node');
      return;
    }

    const hermStrain: Strain = hermNode.data;
    const maleStrain: Strain = maleNode.data;

    if (hermStrain.sex === maleStrain.sex) {
      toast.error('Can only mate strains that are different sexes');
      return;
    }

    if (hermStrain.isParent || maleStrain.isParent) {
      toast.error("A single strain can't be involved in multiple crosses");
      return;
    }

    matedCross(hermNode, maleNode).catch(console.error);
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
    else setDrawerState({ type: DrawerType.Cross, isOpen: true, id: node.id });
  }, []);

  const updateFilter = (update: StrainFilterUpdate): void => {
    const filter: StrainFilter =
      reactFlowInstance.getNode(update.filterId)?.data ?? new StrainFilter();
    filter.update(update);
    const childNodes = nodes.filter(
      (node) => node.parentNode === update.filterId
    );

    childNodes.forEach((node: Node<Strain>) => {
      node.hidden =
        !node.data.passesFilter(filter) || filter.hidden.has(node.id);
      hideConnectedEdges(node, node.hidden);
    });
    const middleNode = reactFlowInstance.getNode(update.filterId);
    if (middleNode === undefined) {
      console.error('Middle node undefined');
      return;
    }
    middleNode.data = new StrainFilter({ ...filter });

    // Reposition child nodes
    const visibleChildNodes = childNodes.filter(
      (node) => !(node.hidden ?? false)
    );
    const positions = CrossDesign.calculateChildPositions(
      middleNode.type === NodeType.X ? NodeType.X : NodeType.Self,
      visibleChildNodes.length
    );
    visibleChildNodes.forEach((childNode, idx) => {
      childNode.position = positions[idx];
    });

    setNodes((nodes) => addToArray(nodes, middleNode, ...childNodes));
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
    setNodes((nodes) => addToArray(nodes, noteNode));
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
    setNodes((nodes) => addToArray(nodes, noteNode));
    closeDrawer();
  };

  const addStrain = (strain: Strain): void => {
    const strainNode: Node<Strain> = {
      id: props.crossDesign.createId(),
      data: strain,
      position: getNodePositionFromLastClick(),
      type: NodeType.Strain,
    };
    setNodes((nodes) => addToArray(nodes, strainNode));
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
    const selfNode: Node<StrainFilter> = {
      id: props.crossDesign.createId(),
      position: CrossDesign.getSelfNodePos(),
      parentNode: parentNode.id,
      data: new StrainFilter(),
      type: NodeType.Self,
    };
    const parentToSelf: Edge = {
      id: props.crossDesign.createId(),
      source: parentNode.id,
      target: selfNode.id,
      sourceHandle: 'bottom',
    };
    const strainOpts = await parentNode.data.selfCross();
    const childNodes = getChildNodes(selfNode, strainOpts);
    const childEdges = childNodes.map((node) => {
      return {
        id: props.crossDesign.createId(),
        source: selfNode.id,
        target: node.id,
      };
    });
    setNodes((nodes) => addToArray(nodes, parentNode, selfNode, ...childNodes));
    setEdges((edges) => [...edges, parentToSelf, ...childEdges]);
  };

  const matedCross = async (
    hermNode: Node<Strain>,
    maleNode: Node<Strain>,
    fromHerm = true
  ): Promise<void> => {
    // Mark as parents
    maleNode.data = new Strain({ ...maleNode.data, isParent: true });
    hermNode.data = new Strain({ ...hermNode.data, isParent: true });

    const xNode: Node<StrainFilter> = {
      id: props.crossDesign.createId(),
      data: new StrainFilter(),
      position: CrossDesign.getXNodePos(hermNode),
      type: NodeType.X,
    };

    xNode.parentNode = hermNode.id;
    maleNode.parentNode = maleNode.parentNode ?? hermNode.id;

    if (fromHerm) maleNode.position = CrossDesign.getRelStrainPos(hermNode);
    else {
      const tempPos = CrossDesign.getRelStrainPos(maleNode);
      hermNode.position = CrossDesign.getAbsolutePos(tempPos, maleNode);
    }

    const hermStrain = hermNode.data;
    const maleStrain = maleNode.data;
    const edge1 = {
      id: props.crossDesign.createId(),
      source: hermNode.id,
      target: xNode.id,
      sourceHandle: 'right',
      targetHandle: 'left',
    };
    const edge2 = {
      id: props.crossDesign.createId(),
      source: maleNode.id,
      target: xNode.id,
      sourceHandle: 'left',
      targetHandle: 'right',
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
      addToArray(nodes, hermNode, maleNode, xNode, ...childNodes)
    );
    setEdges((edges) => [...edges, edge1, edge2, ...childEdges]);
  };

  /** Create a collection of strain nodes to represent children of a cross, from child strain options */
  const getChildNodes = (
    middleNode: Node,
    childStrains: Strain[]
  ): Array<Node<Strain>> => {
    const childPositions = CrossDesign.calculateChildPositions(
      middleNode.type === NodeType.X ? NodeType.X : NodeType.Self,
      childStrains.length
    );

    const childNodes: Array<Node<Strain>> = childStrains.map((child, i) => {
      return {
        id: props.crossDesign.createId(),
        data: child,
        position: childPositions[i],
        parentNode: middleNode.id,
        type: NodeType.Strain,
      } satisfies Node<Strain>;
    });
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
      position: { x: 0, y: 0 },
      type: NodeType.Strain,
    };

    (existingNode.data.sex === Sex.Hermaphrodite
      ? matedCross(existingNode, newNode)
      : matedCross(newNode, existingNode, false)
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
      .getTasks(node)
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
  const getStrainFormCallback = (): ((strain: Strain) => void) => {
    if (drawerState.type === DrawerType.AddStrain) return addStrain;
    const id = drawerState.id;
    if (drawerState.type === DrawerType.Cross && id !== undefined)
      return (strain: Strain) => {
        matedCrossWithForm(strain, id);
      };
    console.error('Drawer not properly set up');
    return () => {};
  };

  /** Gets onSubmit callback for the note form based on current state  */
  const getNoteFormCallback = (): ((content: string) => void) => {
    if (drawerState.type === DrawerType.AddNote) return addNote;
    const id = drawerState.id;
    if (drawerState.type === DrawerType.EditNote && id !== undefined)
      return (content: string) => {
        editNote(content, id);
      };
    console.error('Drawer not properly set up');
    return () => {};
  };

  const nodeTypes = useMemo(
    () => ({
      strain: StrainNode,
      self: MiddleNode,
      x: MiddleNode,
      note: NoteNode,
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
        {nodes
          .filter(
            (node) => node.type === NodeType.Self || node.type === NodeType.X
          )
          .map((middleNode, idx) => (
            <Fragment key={idx}>
              <StrainFilterModal
                filterId={middleNode.id}
                childNodes={nodes.filter(
                  (node) => node.parentNode === middleNode.id
                )}
                filter={middleNode.data}
                updateFilter={updateFilter}
              />
              <FilteredOutModal
                filterId={middleNode.id}
                excludedNodes={nodes.filter(
                  (node) => node.parentNode === middleNode.id && node.hidden
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
                    setDrawerState({
                      type: DrawerType.AddStrain,
                      isOpen: true,
                    });
                  }}
                >
                  <button className='flex flex-row' name='add-cross-node'>
                    <AddIcon className='text-xl text-base-content' />
                    <p>Add Strain</p>
                  </button>
                </li>
                <li
                  onClick={() => {
                    setDrawerState({ type: DrawerType.AddNote, isOpen: true });
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
              isSaving={isSaving}
              name={name}
              setName={setName}
            />
            <EditorContext.Provider value={editorContextValue}>
              <ReactFlow
                fitView
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
                  toggleGenes={() => {
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
              {drawerState.type === DrawerType.AddNote ||
              drawerState.type === DrawerType.EditNote ? (
                <NoteForm
                  header={
                    drawerState.type === DrawerType.AddNote
                      ? 'Add Note'
                      : 'Edit Note'
                  }
                  buttonText={
                    drawerState.type === DrawerType.AddNote
                      ? 'Add Note'
                      : 'Edit Note'
                  }
                  callback={getNoteFormCallback()}
                  content={
                    drawerState.id !== undefined
                      ? reactFlowInstance.getNode(drawerState.id)?.data
                      : ''
                  }
                />
              ) : (
                <StrainForm
                  onSubmit={getStrainFormCallback()}
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

export default Editor;
