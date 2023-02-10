import React, { useState, useCallback, useEffect } from 'react';
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
} from 'reactflow';
import { insertTree, updateTree } from 'api/crossTree';
import { Strain } from 'models/frontend/Strain/Strain';
import { Sex } from 'models/enums';
import { MenuItem } from 'components/Menu/Menu';
import { BsUiChecks as ScheduleIcon } from 'react-icons/bs';
import { TbArrowsCross as CrossIcon } from 'react-icons/tb';
import { ImLoop2 as SelfCrossIcon } from 'react-icons/im';
import { toast } from 'react-toastify';
import { insertDbTasks } from 'api/task';
import { useNavigate } from 'react-router-dom';
import NoteForm from 'components/NoteForm/NoteForm';
import { NoteNodeProps } from 'components/NoteNode/NoteNodeProps';

export interface CrossEditorProps {
  crossTree: CrossTree;
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
    // nodes.forEach((node) => console.log(node.position));
    const movedNodes = applyNodeChanges(changes, nodes);
    movedNodes.forEach((node) => newNodeMap.set(node.id, node));

    // movedNodes.forEach((node) => console.log('moved:', node.position));
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
            getMenuItems: (model: CrossNodeModel) =>
              getCrossNodeMenuItems(model, node.id, data.isParent),
            toggleSex: data.isParent
              ? undefined
              : () => toggleCrossNodeSex(node.id),
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
        }
        return node;
      });

      refreshedNodes.forEach((node) => nodeMap.set(node.id, node));
      return new Map(nodeMap);
    });
  }, []);

  // #region Flow Component Creation
  /** Creates a node representing a strain */
  const createStrainNode = (
    sex: Sex,
    strain: Strain,
    position: XYPosition,
    isParent: boolean,
    probability?: number,
    id?: string
  ): Node<CrossNodeModel> => {
    const nodeId = id ?? props.crossTree.createId();
    const strainNode: Node = {
      id: nodeId,
      type: FlowType.Strain,
      position,
      data: new CrossNodeModel({
        sex,
        strain,
        probability,
        getMenuItems: (node: CrossNodeModel) =>
          getCrossNodeMenuItems(node, nodeId, isParent),
        toggleSex: isParent ? undefined : () => toggleCrossNodeSex(nodeId),
      }),
      className: 'nowheel',
    };
    return strainNode;
  };

  /** Creates a node representing the x icon */
  const createXIcon = (position: XYPosition): Node => {
    const newXIcon: Node = {
      id: props.crossTree.createId(),
      type: FlowType.XIcon,
      position,
      data: {},
    };
    return newXIcon;
  };

  /** Creates a node representing the self icon */
  const createSelfIcon = (position: XYPosition): Node => {
    const newSelfIcon: Node = {
      id: props.crossTree.createId(),
      type: FlowType.SelfIcon,
      position,
      data: {},
    };
    return newSelfIcon;
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
      const graphNodes = [...nodeMap.values()];
      const [childNodes] = CrossTree.getDecendentNodesAndEdges(
        graphNodes,
        edges,
        node
      );

      const data: CrossNodeModel = node.data;
      if (data.sex === undefined || data.sex === null) return nodeMap;

      // need to create a new node with the updated data so the state knows something has changed
      const newSex = data.sex === Sex.Male ? Sex.Hermaphrodite : Sex.Male;
      const newNode = createStrainNode(
        newSex,
        data.strain,
        node.position,
        false,
        data.probability,
        node.id
      );

      // update the map with the new data for the node
      nodeMap.set(node.id, newNode);
      return new Map(nodeMap);
    });
  };

  /** Adds note to editor */
  const addNote = (): void => {
    const newNote = createNote(noteFormContent, { x: 0, y: 0 });
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
    const newStrain = createStrainNode(sex, strain, { x: 0, y: 0 }, false);
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

      const selfIconPos = CrossTree.getSelfIconPos(refNode);
      const selfIcon = createSelfIcon(selfIconPos);
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
        return createStrainNode(
          Sex.Hermaphrodite,
          child.strain,
          childPositions[i],
          false,
          child.prob
        );
      });

      refNode.data = copyNodeAsParent(refNode);

      // update state
      [...childNodes, selfIcon, refNode].forEach((node) => {
        nodeMap.set(node.id, node);
      });

      const childEdges = childNodes.map((node) =>
        createEdge(selfIcon.id, node.id)
      );
      setEdges([...edges, edgeToIcon, ...childEdges]);
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

      const xIconPos = CrossTree.getXIconPos(currNode);
      const strainPos = CrossTree.getCrossStrainPos(currNode);

      const xIcon = createXIcon(xIconPos);
      const formNode = createStrainNode(sex, strain, strainPos, true);

      const otherStrain: CrossNodeModel = currNode.data;
      const newStrain: CrossNodeModel = formNode.data;
      newStrain.toggleSex = undefined; // disable toggling functionality

      const e1 = createEdge(currNode.id, xIcon.id, {
        targetHandle: otherStrain.sex === Sex.Male ? 'left' : 'right',
        sourceHandle: otherStrain.sex !== Sex.Male ? 'left' : 'right',
      });
      const e2 = createEdge(formNode.id, xIcon.id, {
        targetHandle: newStrain.sex === Sex.Male ? 'left' : 'right',
        sourceHandle: newStrain.sex !== Sex.Male ? 'left' : 'right',
      });

      const children = newStrain.strain.crossWith(otherStrain.strain);
      children.sort((c1, c2) => c1.prob - c2.prob);

      const childPositions = CrossTree.calculateChildPositions(
        xIcon,
        currNode,
        children
      );

      const childrenNodes = children.map((child, i) => {
        return createStrainNode(
          Sex.Hermaphrodite,
          child.strain,
          childPositions[i],
          false,
          child.prob
        );
      });

      currNode.data = copyNodeAsParent(currNode);

      const childrenEdges = childrenNodes.map((node) =>
        createEdge(xIcon.id, node.id)
      );

      [currNode, xIcon, formNode, ...childrenNodes].forEach((node) =>
        nodeMap.set(node.id, node)
      );
      setEdges([...edges, e1, e2, ...childrenEdges]);
      setRightDrawerOpen(false);

      return new Map(nodeMap);
    });
  };

  /** Clones the passed nodes data and marks as a parent */
  const copyNodeAsParent = (node: Node<CrossNodeModel>): CrossNodeModel => {
    // update parent to no longer enable sex toggling
    const updatedParentData = new CrossNodeModel({
      sex: node.data.sex,
      strain: node.data.strain,
      getMenuItems: () => getCrossNodeMenuItems(node.data, node.id, true),
      toggleSex: undefined, // disable toggle action
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
        const node = nodeMap.get(nodeId);
        if (node === undefined || node.type !== FlowType.Strain) {
          console.error(
            'boooo - the node you are trying to schedule is undefined/not a strain'
          );
          return;
        }

        const clonedTree = props.crossTree.clone();
        clonedTree.nodes = [...nodeMap.values()];
        clonedTree.edges = edges;

        const tasks = clonedTree.generateTasks(node);

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
      onClick={() => saveTree(props.crossTree, [...nodeMap.values()], edges)}
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
  const currNode = nodeMap.get(currNodeId);
  if (drawerState === 'cross')
    enforcedSex =
      currNode?.data?.sex === Sex.Male ? Sex.Hermaphrodite : Sex.Male;

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
            <EditorTop tree={props.crossTree} buttons={buttons}></EditorTop>
            <div className='grow'>
              <div className='h-full w-full'>
                <CrossFlow
                  nodes={[...nodeMap.values()]}
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

const saveTree = (tree: CrossTree, nodes: Node[], edges: Edge[]): void => {
  tree.nodes = nodes;
  tree.edges = edges;
  tree.lastSaved = new Date();
  updateTree(tree.generateRecord(true))
    .then(() => toast.success('Successfully saved design'))
    .catch((error) => {
      toast.error('Error saving design');
      console.error(error);
    });
};

export default CrossEditor;
