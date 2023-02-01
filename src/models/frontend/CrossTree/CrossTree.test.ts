import { FlowType } from 'components/CrossFlow/CrossFlow';
import { MenuItem } from 'components/CrossNodeMenu/CrossNodeMenu';
import { Sex } from 'models/enums';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { XYPosition, Node, Edge } from 'reactflow';
import { expect, test, describe } from 'vitest';

describe('cross tree', () => {
  // #region generator functions
  const generateTree = ({
    name = '',
    description = '',
    settings = {
      longName: false,
      contents: false,
    },
    nodes = [],
    edges = [],
    lastSaved = new Date(),
  }: {
    name?: string;
    description?: string;
    settings?: { longName: boolean; contents: boolean };
    nodes?: Node[];
    edges?: Edge[];
    lastSaved?: Date;
  }): CrossTree => {
    return new CrossTree({
      name,
      description,
      settings,
      nodes,
      edges,
      lastSaved,
    });
  };

  const generateNode = ({
    id = 0,
    type = FlowType.Strain,
    position = { x: 0, y: 0 },
    data = generateCrossNodeModel({}),
  }: {
    id?: number;
    type?: FlowType;
    position?: XYPosition;
    data?: Object;
  }): Node => {
    return {
      id: id.toString(),
      type,
      position,
      data,
    };
  };

  const generateCrossNodeModel = ({
    sex = Sex.Male,
    strain = generateStrain({}),
    getMenuItems = undefined,
  }: {
    sex?: Sex;
    strain?: Strain;
    getMenuItems?: (node: CrossNodeModel) => MenuItem[];
  }): CrossNodeModel => {
    return { sex, strain, getMenuItems };
  };

  const generateStrain = ({
    allelePairs = [],
    name = undefined,
    notes = undefined,
  }: {
    name?: string;
    allelePairs?: AllelePair[];
    notes?: string;
  }): Strain => {
    return new Strain({ name, allelePairs, notes });
  };

  const generateEdge = ({
    source,
    target,
    id = 0,
    sourceHandle,
    targetHandle,
  }: {
    source: string;
    target: string;
    id?: number;
    sourceHandle?: string;
    targetHandle?: string;
  }): Edge => {
    return {
      id: id.toString(),
      source,
      target,
      sourceHandle,
      targetHandle,
    };
  };
  // #endregion generator functions

  // #region testing functions
  const testTreeNodesAndEdges = (
    tree: CrossTree,
    nodes: Node[] = [],
    edges: Edge[] = []
  ): void => {
    // test nodes
    expect(tree.nodes).toHaveLength(nodes.length);
    tree.nodes.forEach((node, idx) => {
      expect(node.id).toBe(nodes[idx].id);
      expect(node.type).toBe(nodes[idx].type);
      expect(node.data).toBe(nodes[idx].data);
    });

    // test edges
    expect(tree.edges).toHaveLength(edges.length);
    tree.edges.forEach((edge, idx) => {
      expect(edge.id).toBe(edges[idx].id);
      expect(edge.source).toBe(edges[idx].source);
      expect(edge.target).toBe(edges[idx].target);
      expect(edge.sourceHandle).toBe(edges[idx].sourceHandle);
      expect(edge.targetHandle).toBe(edges[idx].targetHandle);
    });
  };
  // #endregion testing functions

  // #region tests
  test('constructs an empty tree', () => {
    const name = 'empty tree';
    const description = 'sample description';
    const lastSaved = new Date();

    const tree = generateTree({ name, description, lastSaved });
    expect(tree.nodes).toHaveLength(0);
    expect(tree.edges).toHaveLength(0);
    expect(tree.name).toBe(name);
    expect(tree.description).toBe(description);
    expect(tree.lastSaved).toBe(lastSaved);
  });
  test('constructs a tree with nodes', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const selfIcon = generateNode({ id: id++, type: FlowType.SelfIcon });
    const xIcon = generateNode({ id: id++, type: FlowType.XIcon });
    const nodes = [strainNode, selfIcon, xIcon];
    const tree = generateTree({ nodes });
    testTreeNodesAndEdges(tree, nodes);
  });
  test('constructs a tree with edges and nodes', () => {
    let id = 0;
    const maleData = generateCrossNodeModel({ sex: Sex.Male });
    const hermData = generateCrossNodeModel({ sex: Sex.Hermaphrodite });

    const maleNode = generateNode({ id: id++, data: maleData });
    const hermNode = generateNode({ id: id++, data: hermData });
    const xIcon = generateNode({ id: id++, type: FlowType.XIcon });

    const nodes = [maleNode, hermNode, xIcon];
    const edges = [
      generateEdge({
        id: id++,
        source: maleNode.id,
        target: xIcon.id,
        targetHandle: 'left',
      }),
      generateEdge({
        id: id++,
        source: hermNode.id,
        target: xIcon.id,
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
    ];

    const tree = generateTree({ nodes, edges });
    testTreeNodesAndEdges(tree, nodes, edges);
  });
  test('constructs a tree with new list of nodes/edges', () => {
    let id = 0;
    const strainNode = generateNode({
      id: id++,
      data: generateCrossNodeModel({ sex: Sex.Hermaphrodite }),
    });
    const selfIcon = generateNode({ id: id++, type: FlowType.SelfIcon });

    const nodes = [strainNode, selfIcon];
    const edges = [
      generateEdge({
        id: id++,
        source: strainNode.id,
        target: strainNode.id,
        sourceHandle: 'bottom',
      }),
    ];

    const tree = generateTree({ nodes, edges });
    expect(tree.nodes).not.toBe(nodes);
    expect(tree.edges).not.toBe(edges);
    testTreeNodesAndEdges(tree, nodes, edges);
  });

  test('.addNode() adds to empty tree', () => {
    const tree = generateTree({});
    const xIcon = generateNode({ type: FlowType.XIcon });
    testTreeNodesAndEdges(tree);

    tree.addNode(xIcon);
    testTreeNodesAndEdges(tree, [xIcon]);
  });
  test('.addNode() adds to filled tree', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const selfIcon = generateNode({ id: id++, type: FlowType.SelfIcon });
    const xIcon = generateNode({ id: id++, type: FlowType.XIcon });
    const nodes = [strainNode, selfIcon, xIcon];
    const tree = generateTree({ nodes });

    const newNode = generateNode({ id: id++ });
    tree.addNode(newNode);

    testTreeNodesAndEdges(tree, [...nodes, newNode]);
  });
  test('.addNode() creates a new copy of nodes', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const nodes = [strainNode];
    const tree = generateTree({ nodes });

    const oldNodeList = tree.nodes;
    expect(tree.nodes).toBe(oldNodeList);

    const newNode = generateNode({ id: id++ });
    tree.addNode(newNode);
    oldNodeList.push(newNode);
    expect(tree.nodes).not.toBe(oldNodeList);

    testTreeNodesAndEdges(tree, [...nodes, newNode]);
  });

  test('.addNodes() adds to empty tree', () => {
    let id = 0;
    const tree = generateTree({});
    const strainNode = generateNode({ id: id++ });
    const xIcon = generateNode({ type: FlowType.XIcon });
    testTreeNodesAndEdges(tree);

    const nodes = [xIcon, strainNode];
    tree.addNodes(nodes);
    testTreeNodesAndEdges(tree, nodes);
  });
  test('.addNodes() adds to filled tree', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const selfIcon = generateNode({ id: id++, type: FlowType.SelfIcon });
    const xIcon = generateNode({ id: id++, type: FlowType.XIcon });
    const nodes = [strainNode, selfIcon, xIcon];
    const tree = generateTree({ nodes });

    const newNodes = [
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
    ];
    tree.addNodes(newNodes);

    testTreeNodesAndEdges(tree, [...nodes, ...newNodes]);
  });
  test('.addNodes() creates a new copy of nodes', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const nodes = [strainNode];
    const tree = generateTree({ nodes });

    const oldNodeList = tree.nodes;
    expect(tree.nodes).toBe(oldNodeList);

    const newNode = generateNode({ id: id++ });
    tree.addNodes([newNode]);
    oldNodeList.push(newNode);
    expect(tree.nodes).not.toBe(oldNodeList);

    testTreeNodesAndEdges(tree, [...nodes, newNode]);
  });

  test('.addEdge() adds to empty tree', () => {
    const tree = generateTree({});
    const edge = generateEdge({ source: '0', target: '1' });

    tree.addEdge(edge);
    testTreeNodesAndEdges(tree, [], [edge]);
  });
  test('.addEdge() adds to filled tree', () => {
    let id = 0;
    const maleData = generateCrossNodeModel({ sex: Sex.Male });
    const hermData = generateCrossNodeModel({ sex: Sex.Hermaphrodite });

    const maleNode = generateNode({ id: id++, data: maleData });
    const hermNode = generateNode({ id: id++, data: hermData });
    const xIcon = generateNode({ id: id++, type: FlowType.XIcon });

    const nodes = [maleNode, hermNode, xIcon];
    const edges = [
      generateEdge({
        id: id++,
        source: maleNode.id,
        target: xIcon.id,
        targetHandle: 'left',
      }),
      generateEdge({
        id: id++,
        source: hermNode.id,
        target: xIcon.id,
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
    ];

    const tree = generateTree({ nodes, edges });

    const newEdge = generateEdge({
      id: id++,
      source: hermNode.id,
      target: xIcon.id,
      sourceHandle: 'bottom',
    });
    tree.addEdge(newEdge);

    testTreeNodesAndEdges(tree, nodes, [...edges, newEdge]);
  });
  test('.addEdge() creates a new copy of edges', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const nodes = [strainNode];
    const tree = generateTree({ nodes });

    const oldEdgeList = tree.edges;
    expect(tree.edges).toBe(oldEdgeList);

    const newEdge = generateEdge({
      id: id++,
      target: strainNode.id,
      source: strainNode.id,
    });
    tree.addEdge(newEdge);
    oldEdgeList.push(newEdge);
    expect(tree.edges).not.toBe(oldEdgeList);

    testTreeNodesAndEdges(tree, nodes, [newEdge]);
  });

  test('.addEdges() adds to empty tree', () => {
    const tree = generateTree({});
    const edges = [
      generateEdge({ source: '0', target: '1' }),
      generateEdge({ source: '1', target: '2' }),
      generateEdge({ source: '2', target: '3' }),
    ];

    tree.addEdges(edges);
    testTreeNodesAndEdges(tree, [], edges);
  });
  test('.addEdges() adds to filled tree', () => {
    let id = 0;
    const maleData = generateCrossNodeModel({ sex: Sex.Male });
    const hermData = generateCrossNodeModel({ sex: Sex.Hermaphrodite });

    const maleNode = generateNode({ id: id++, data: maleData });
    const hermNode = generateNode({ id: id++, data: hermData });
    const xIcon = generateNode({ id: id++, type: FlowType.XIcon });

    const nodes = [maleNode, hermNode, xIcon];
    const edges = [
      generateEdge({
        id: id++,
        source: maleNode.id,
        target: xIcon.id,
        targetHandle: 'left',
      }),
      generateEdge({
        id: id++,
        source: hermNode.id,
        target: xIcon.id,
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
    ];

    const tree = generateTree({ nodes, edges });
    const newEdge = generateEdge({
      id: id++,
      source: hermNode.id,
      target: xIcon.id,
      sourceHandle: 'bottom',
    });
    tree.addEdges([newEdge]);

    testTreeNodesAndEdges(tree, nodes, [...edges, newEdge]);
  });
  test('.addEdges() creates a new copy of edges', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const nodes = [strainNode];
    const tree = generateTree({ nodes });

    const oldEdgeList = tree.edges;
    expect(tree.edges).toBe(oldEdgeList);

    const newEdge = generateEdge({ source: '0', target: '1' });
    tree.addEdges([newEdge]);
    oldEdgeList.push(newEdge);
    expect(tree.edges).not.toBe(oldEdgeList);

    testTreeNodesAndEdges(tree, nodes, [newEdge]);
  });

  test('.getNextId() returns 0 for new tree', () => {
    const tree = generateTree({});
    expect(tree.getNextId()).toBe('0');
  });
  test('.getNextId() increments every call', () => {
    let currId = 0;
    const tree = generateTree({});
    while (currId < 10) expect(tree.getNextId()).toBe((currId++).toString());
  });
  test('.getCurrId() returns -1 for new tree', () => {
    const tree = generateTree({});
    expect(tree.getCurrId()).toBe('-1');
  });
  test('.getCurrId() returns same after value multiple calls', () => {
    const tree = generateTree({});
    for (let i = 0; i < 10; i++) expect(tree.getCurrId()).toBe('-1');
  });
  test('.getCurrId() returns same value as last .getNextId() call', () => {
    const tree = generateTree({});
    let currId = tree.getNextId();
    expect(tree.getCurrId()).toBe(currId);
    expect(tree.getNextId()).toBe('1');

    for (let i = 0; i < 10; i++) currId = tree.getNextId();
    expect(tree.getCurrId()).toBe(currId);
  });
  test('.getCurrId() returns highest node/edge id upon instantiation', () => {
    const nodes = [
      generateNode({ id: 6 }),
      generateNode({ id: 12 }),
      generateNode({ id: 11 }),
    ];
    const edges = [
      generateEdge({ id: 16, source: '6', target: '12' }),
      generateEdge({ id: 4, source: '12', target: '11' }),
    ];
    const nodeTree = generateTree({ nodes });
    const edgeTree = generateTree({ edges });
    const fullTree = generateTree({ nodes, edges });

    expect(nodeTree.getCurrId()).toBe('12');
    expect(edgeTree.getCurrId()).toBe('16');
    expect(fullTree.getCurrId()).toBe('16');
  });

  test('currNode instantiates to default for empty tree', () => {
    const tree = generateTree({});
    expect(tree.getCurrNode().id).toBe('-1');
    expect(tree.getCurrNode().position).toEqual({ x: 0, y: 0 });
    expect(tree.getCurrNode().data).toEqual({});
  });
  test('currNode instantiates to first passed node in nonempty tree', () => {
    const nodes = [
      generateNode({ id: 6 }),
      generateNode({ id: 12 }),
      generateNode({ id: 11 }),
    ];
    const tree = generateTree({ nodes });
    expect(tree.getCurrNode().id).toBe('6');
  });
  test('.setCurrNode() updates currNode if found', () => {
    const nodes = [
      generateNode({ id: 6 }),
      generateNode({ id: 12 }),
      generateNode({ id: 11 }),
    ];
    const tree = generateTree({ nodes });
    expect(tree.getCurrNode().id).toBe('6');
    tree.setCurrNode('12');
    expect(tree.getCurrNode().id).toBe('12');
  });
  test('.setCurrNode() updates currNode to default if not found', () => {
    const nodes = [
      generateNode({ id: 6 }),
      generateNode({ id: 12 }),
      generateNode({ id: 11 }),
    ];
    const tree = generateTree({ nodes });
    tree.setCurrNode('33');
    expect(tree.getCurrNode().id).toBe('-1');
  });

  test('.getChildNodeAndEdges() returns empty array for unconnected nodes', () => {
    let id = 0;
    const nodes = [
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
    ];
    const tree = generateTree({ nodes });
    expect(tree.getDecendentNodesAndEdges(nodes[0])).toEqual([[], []]);
  });
  test('.getChildNodeAndEdges() returns empty array for nonexisting node', () => {
    let id = 0;
    const nodes = [
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
    ];
    const tree = generateTree({ nodes });

    const notPartOfTree = generateNode({ id: id++ });
    expect(tree.getDecendentNodesAndEdges(notPartOfTree)).toEqual([[], []]);
  });
  test('.getChildNodeAndEdges() returns edges and nodes', () => {
    let id = 0;
    const nodes = [
      generateNode({ id: id++ }), // id: 0
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
      generateNode({ id: id++ }), // id: 5
    ];
    const edges = [
      generateEdge({ id: id++, source: '0', target: '1' }), // id: 6
      generateEdge({ id: id++, source: '0', target: '2' }),
      generateEdge({ id: id++, source: '0', target: '4' }),
      generateEdge({ id: id++, source: '1', target: '3' }), // id: 9
      generateEdge({ id: id++, source: '1', target: '4' }),
      generateEdge({ id: id++, source: '2', target: '3' }), // id: 11
      generateEdge({ id: id++, source: '2', target: '4' }),
      generateEdge({ id: id++, source: '2', target: '5' }), // id: 13
    ];
    const tree = generateTree({ nodes, edges });
    const [childNodes0, childEdges0] = tree.getDecendentNodesAndEdges(nodes[0]);
    const [childNodes1, childEdges1] = tree.getDecendentNodesAndEdges(nodes[1]);
    const [childNodes2, childEdges2] = tree.getDecendentNodesAndEdges(nodes[2]);

    expect(childNodes0).toHaveLength(5);
    expect(childNodes1).toHaveLength(2);
    expect(childNodes2).toHaveLength(3);

    expect(childNodes0).toEqual([
      nodes[1],
      nodes[2],
      nodes[4],
      nodes[3],
      nodes[5],
    ]);
    expect(childNodes1).toEqual([nodes[3], nodes[4]]);
    expect(childNodes2).toEqual([nodes[3], nodes[4], nodes[5]]);

    expect(childEdges0).toHaveLength(8);
    expect(childEdges1).toHaveLength(2);
    expect(childEdges2).toHaveLength(3);

    expect(childEdges0).toEqual(edges);
    expect(childEdges1).toEqual([edges[3], edges[4]]);
    expect(childEdges2).toEqual([edges[5], edges[6], edges[7]]);
  });
  test('.getChildNodeAndEdges() can handle cycles', () => {
    let id = 0;
    const nodes = [
      generateNode({ id: id++ }), // id: 0
      generateNode({ id: id++ }),
    ];
    const edges = [
      generateEdge({ id: id++, source: '0', target: '1' }), // id: 2
      generateEdge({ id: id++, source: '1', target: '0' }),
    ];
    const tree = generateTree({ nodes, edges });
    const [childNodes0, childEdges0] = tree.getDecendentNodesAndEdges(nodes[0]);
    const [childNodes1, childEdges1] = tree.getDecendentNodesAndEdges(nodes[1]);

    expect(childNodes0).toHaveLength(1);
    expect(childNodes1).toHaveLength(1);
    expect(childNodes0).toEqual([nodes[1]]);
    expect(childNodes1).toEqual([nodes[0]]);

    expect(childEdges0).toEqual(edges);
    expect(childEdges1).toEqual(edges.reverse());
  });

  test('.getChildNodeAndEdges() can handle cycles', () => {
    let id = 0;
    const nodes = [
      generateNode({ id: id++ }), // id: 0
      generateNode({ id: id++ }),
    ];
    const edges = [
      generateEdge({ id: id++, source: '0', target: '1' }), // id: 2
      generateEdge({ id: id++, source: '1', target: '0' }),
    ];
    const tree = generateTree({ nodes, edges });
    const [childNodes0, childEdges0] = tree.getDecendentNodesAndEdges(nodes[0]);
    const [childNodes1, childEdges1] = tree.getDecendentNodesAndEdges(nodes[1]);

    expect(childNodes0).toHaveLength(1);
    expect(childNodes1).toHaveLength(1);
    expect(childNodes0).toEqual([nodes[1]]);
    expect(childNodes1).toEqual([nodes[0]]);

    expect(childEdges0).toEqual(edges);
    expect(childEdges1).toEqual(edges.reverse());
  });

  test('.generateTasks() returns empty list from no crosses', () => {
    const nodes = [generateNode({})];
    const tree = generateTree({ nodes });
    expect(tree.generateTasks(nodes[0])).toHaveLength(0);
  });
  test('.generateTasks() returns self cross tasks', () => {
    let id = 0;
    const strain1 = generateCrossNodeModel({ sex: Sex.Hermaphrodite });
    const nodes = [
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, type: FlowType.SelfIcon }),
      generateNode({ id: id++ }),
    ];
    const edges = [
      generateEdge({
        id: id++,
        source: '0',
        target: '1',
        sourceHandle: 'bottom',
      }),
      generateEdge({ id: id++, source: '1', target: '2' }),
    ];

    const tree = generateTree({ nodes, edges });
    expect(tree.generateTasks(nodes[0])).toHaveLength(0);

    const tasks = tree.generateTasks(nodes[2]);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].action).toBe('SelfCross');
    // expect(tasks[0].strain1).toBe(JSON.stringify(strain1));
    expect(tasks[0].strain2).toBeNull();
  });
  test('.generateTasks() returns regular cross tasks', () => {
    let id = 0;
    const strain1 = generateCrossNodeModel({ sex: Sex.Hermaphrodite });
    const strain2 = generateCrossNodeModel({ sex: Sex.Male });
    const nodes = [
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, type: FlowType.XIcon }),
      generateNode({ id: id++ }),
    ];
    const edges = [
      generateEdge({
        id: id++,
        source: '0',
        target: '2',
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
      generateEdge({
        id: id++,
        source: '1',
        target: '2',
        targetHandle: 'left',
      }),
      generateEdge({ id: id++, source: '2', target: '3' }),
    ];

    const tree = generateTree({ nodes, edges });
    expect(tree.generateTasks(nodes[0])).toHaveLength(0);
    expect(tree.generateTasks(nodes[1])).toHaveLength(0);

    const tasks = tree.generateTasks(nodes[3]);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].action).toBe('Cross');
    // expect(tasks[0].strain1).toBe(JSON.stringify(strain1));
    // expect(tasks[0].strain2).toBe(JSON.stringify(strain2));
  });
  test('.generateTasks() generates multiple tasks', () => {
    let id = 0;
    const strain1 = generateCrossNodeModel({ sex: Sex.Hermaphrodite });
    const strain2 = generateCrossNodeModel({ sex: Sex.Male });
    const strain3 = generateCrossNodeModel({});
    const nodes = [
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, type: FlowType.XIcon }),
      generateNode({ id: id++ }),
      generateNode({ id: id++, type: FlowType.SelfIcon }),
      generateNode({ id: id++, data: strain3 }),
    ];
    const edges = [
      generateEdge({
        id: id++,
        source: '0',
        target: '2',
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
      generateEdge({
        id: id++,
        source: '1',
        target: '2',
        targetHandle: 'left',
      }),
      generateEdge({ id: id++, source: '2', target: '3' }),
      generateEdge({ id: id++, source: '3', target: '4' }),
      generateEdge({ id: id++, source: '4', target: '5' }),
    ];

    const tree = generateTree({ nodes, edges });
    expect(tree.generateTasks(nodes[0])).toHaveLength(0);
    expect(tree.generateTasks(nodes[1])).toHaveLength(0);

    const tasks = tree.generateTasks(nodes[5]);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].action).toBe('SelfCross');
    // expect(tasks[0].strain1).toBe(JSON.stringify(strain3));
    expect(tasks[0].strain2).toBeNull();
    expect(tasks[1].action).toBe('Cross');
    // expect(tasks[1].strain1).toBe(JSON.stringify(strain1));
    // expect(tasks[1].strain2).toBe(JSON.stringify(strain2));
  });
  // #endregion tests
});
