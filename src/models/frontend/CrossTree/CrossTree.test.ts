import { CrossEditorFilter } from 'components/CrossFilterModal/CrossEditorFilter';
import { FlowType } from 'components/CrossFlow/CrossFlow';
import { MenuItem } from 'components/Menu/Menu';
import { Sex } from 'models/enums';
import { iCrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { XYPosition, Node, Edge } from 'reactflow';
import { expect, test, describe } from 'vitest';
import { WILD_ALLELE } from '../Allele/Allele';
import { ed3, n765, ox1059 } from '../Allele/Allele.mock';

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
    invisibleNodes = new Set(),
    crossFilters = new Map(),
    lastSaved = new Date(),
  }: {
    name?: string;
    description?: string;
    settings?: { longName: boolean; contents: boolean };
    nodes?: Node[];
    edges?: Edge[];
    invisibleNodes?: Set<string>;
    crossFilters?: Map<string, CrossEditorFilter>;
    lastSaved?: Date;
  }): CrossTree => {
    return new CrossTree({
      name,
      description,
      settings,
      nodes,
      edges,
      invisibleNodes,
      lastSaved,
      crossFilters,
    });
  };

  const generateNode = ({
    id = 0,
    type = FlowType.Strain,
    position = { x: 0, y: 0 },
    data = generateCrossNodeModel({}),
    parentNode = undefined,
  }: {
    id?: number;
    type?: FlowType;
    position?: XYPosition;
    data?: Object;
    parentNode?: string;
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
    getMenuItems?: (node: iCrossNodeModel) => MenuItem[];
  }): iCrossNodeModel => {
    return { sex, strain, getMenuItems, isChild: false, isParent: false };
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

  test('.removeEdges() leaves edges as is with undefined arguments', () => {
    let id = 0;
    const nodes = [
      generateNode({ id: id++ }), // id: 0
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
    ];
    const edges = [
      generateEdge({ id: id++, source: '0', target: '1' }), // id: 3
      generateEdge({ id: id++, source: '0', target: '2' }),
    ];
    const tree = generateTree({ nodes, edges });
    testTreeNodesAndEdges(tree, nodes, edges);
    tree.edges = CrossTree.removeEdges(tree.edges, {});
    testTreeNodesAndEdges(tree, nodes, edges);
  });
  test('.removeEdges() leaves edges as is with non-matching ids', () => {
    let id = 0;
    const nodes = [
      generateNode({ id: id++ }), // id: 0
      generateNode({ id: id++ }),
      generateNode({ id: id++ }),
    ];
    const edges = [
      generateEdge({ id: id++, source: '0', target: '1' }), // id: 3
      generateEdge({ id: id++, source: '0', target: '2' }),
    ];
    const tree = generateTree({ nodes, edges });
    tree.edges = CrossTree.removeEdges(tree.edges, { sourceId: '3' });
    testTreeNodesAndEdges(tree, nodes, edges);
    tree.edges = CrossTree.removeEdges(tree.edges, { targetId: '4' });
    testTreeNodesAndEdges(tree, nodes, edges);
    tree.edges = CrossTree.removeEdges(tree.edges, {
      sourceId: '0',
      targetId: '4',
    }); // source matches but target DOES NOT
    testTreeNodesAndEdges(tree, nodes, edges);
  });
  test('.removeEdges() removes all edges with same source id', () => {
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
    tree.edges = CrossTree.removeEdges(tree.edges, { sourceId: '1' });
    testTreeNodesAndEdges(tree, nodes, [
      ...edges.slice(0, 3),
      ...edges.slice(5),
    ]);

    tree.edges = CrossTree.removeEdges(tree.edges, { sourceId: '2' });
    testTreeNodesAndEdges(tree, nodes, [...edges.slice(0, 3)]);

    tree.edges = CrossTree.removeEdges(tree.edges, { sourceId: '0' });
    testTreeNodesAndEdges(tree, nodes, []);
  });
  test('.removeEdges() removes all edges with same target id', () => {
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
    tree.edges = CrossTree.removeEdges(tree.edges, { targetId: '3' });
    testTreeNodesAndEdges(tree, nodes, [
      ...edges.slice(0, 3),
      edges[4],
      ...edges.slice(6),
    ]);

    tree.edges = CrossTree.removeEdges(tree.edges, { targetId: '4' });
    testTreeNodesAndEdges(tree, nodes, [...edges.slice(0, 2), edges[7]]);

    tree.edges = CrossTree.removeEdges(tree.edges, { targetId: '5' });
    tree.edges = CrossTree.removeEdges(tree.edges, { targetId: '1' });
    testTreeNodesAndEdges(tree, nodes, [edges[1]]);

    tree.edges = CrossTree.removeEdges(tree.edges, { targetId: '2' });
    testTreeNodesAndEdges(tree, nodes, []);
  });
  test('.removeEdges() removes all edges with same source AND target ids', () => {
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
    tree.edges = CrossTree.removeEdges(tree.edges, {
      sourceId: '1',
      targetId: '4',
    });
    testTreeNodesAndEdges(tree, nodes, [
      ...edges.slice(0, 4),
      ...edges.slice(5),
    ]);

    tree.edges = CrossTree.removeEdges(tree.edges, {
      sourceId: '0',
      targetId: '2',
    });
    tree.edges = CrossTree.removeEdges(tree.edges, {
      sourceId: '1',
      targetId: '3',
    });
    tree.edges = CrossTree.removeEdges(tree.edges, {
      sourceId: '2',
      targetId: '3',
    });
    tree.edges = CrossTree.removeEdges(tree.edges, {
      sourceId: '2',
      targetId: '5',
    });

    testTreeNodesAndEdges(tree, nodes, [edges[0], edges[2], edges[6]]);
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
  test('should be able to serialize and deserialize', () => {
    let id = 0;
    const strain1 = generateCrossNodeModel({
      sex: Sex.Hermaphrodite,
      strain: generateStrain({
        allelePairs: [
          new AllelePair({ top: ed3, bot: WILD_ALLELE }),
          new AllelePair({ top: ox1059, bot: WILD_ALLELE }),
        ],
      }),
    });
    const strain2 = generateCrossNodeModel({ sex: Sex.Male });
    const strain3 = generateCrossNodeModel({
      strain: generateStrain({
        allelePairs: [new AllelePair({ top: n765, bot: n765 })],
      }),
    });
    const selfIcon = generateNode({ id: id++, type: FlowType.SelfIcon });
    const nodes = [
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, type: FlowType.XIcon }),
      generateNode({ id: id++ }),
      generateNode({ id: id++, data: strain3, parentNode: selfIcon.id }),
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

    const invisibleNodes = new Set([nodes[0].id]);
    const crossFilters = new Map<string, CrossEditorFilter>();
    crossFilters.set(
      nodes[4].id,
      new CrossEditorFilter({
        alleleNames: new Set(['n766']),
        exprPhenotypes: new Set(),
        supConditions: new Set(),
        reqConditions: new Set(),
      })
    );

    const tree = generateTree({ nodes, edges, invisibleNodes, crossFilters });
    const treeBack = CrossTree.fromJSON(tree.toJSON());

    expect(treeBack.toJSON()).toEqual(tree.toJSON());
    expect(treeBack.generateRecord(false)).toEqual(tree.generateRecord(false));
  });
  // #endregion tests
});
