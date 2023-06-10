import { OffspringFilter } from 'components/OffspringFilter/OffspringFilter';
import { FlowType } from 'components/CrossFlow/CrossFlow';
import { type MenuItem } from 'components/Menu/Menu';
import { Sex } from 'models/enums';
import { type IStrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import CrossTree, {
  type ICrossTree,
} from 'models/frontend/CrossTree/CrossTree';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { type XYPosition, type Node, type Edge } from 'reactflow';
import { expect, test, describe } from 'vitest';
import { ed3, n765, ox1059 } from 'models/frontend/Allele/Allele.mock';
import moment from 'moment';

describe('cross tree', () => {
  // #region generator functions
  const generateTree = ({
    name = '',
    nodes = [],
    edges = [],
    invisibleNodes = new Set<string>(),
    crossFilters = new Map(),
    lastSaved = new Date(),
    editable = true,
  }: Partial<ICrossTree>): CrossTree => {
    return new CrossTree({
      name,
      nodes,
      edges,
      invisibleNodes,
      lastSaved,
      crossFilters,
      editable,
    });
  };

  const generateNode = ({
    id = 0,
    type = FlowType.Strain,
    position = { x: 0, y: 0 },
    data = generateStrainNodeModel({}),
    parentNode = undefined,
  }: {
    id?: number;
    type?: FlowType;
    position?: XYPosition;
    data?: unknown;
    parentNode?: string;
  }): Node => {
    return {
      id: id.toString(),
      type,
      position,
      data,
    };
  };

  const generateStrainNodeModel = ({
    sex = Sex.Male,
    strain = generateStrain({}),
    getMenuItems = undefined,
  }: {
    sex?: Sex;
    strain?: Strain;
    getMenuItems?: (node: IStrainNodeModel) => MenuItem[];
  }): IStrainNodeModel => {
    return { sex, strain, getMenuItems, isChild: false, isParent: false };
  };

  const generateStrain = ({
    allelePairs = [],
    name = undefined,
    description = undefined,
  }: {
    name?: string;
    allelePairs?: AllelePair[];
    description?: string;
  }): Strain => {
    return new Strain({ name, allelePairs, description });
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
    const lastSaved = new Date();

    const tree = generateTree({ name, lastSaved });
    expect(tree.nodes).toHaveLength(0);
    expect(tree.edges).toHaveLength(0);
    expect(tree.name).toBe(name);
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
    const maleData = generateStrainNodeModel({ sex: Sex.Male });
    const hermData = generateStrainNodeModel({ sex: Sex.Hermaphrodite });

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
      data: generateStrainNodeModel({ sex: Sex.Hermaphrodite }),
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
  test('.generateTasks() returns self-cross tasks', () => {
    let id = 0;
    const strain1 = generateStrainNodeModel({ sex: Sex.Hermaphrodite });
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
    expect(tasks[0].strain2).toBeUndefined();
  });
  test('.generateTasks() returns regular cross tasks', () => {
    let id = 0;
    const strain1 = generateStrainNodeModel({ sex: Sex.Hermaphrodite });
    const strain2 = generateStrainNodeModel({ sex: Sex.Male });
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
    expect(tasks[0].dueDate?.getDay()).toBe(new Date().getDay());
  });
  test('.generateTasks() generates multiple tasks', () => {
    let id = 0;
    const strain1 = generateStrainNodeModel({ sex: Sex.Hermaphrodite });
    const strain2 = generateStrainNodeModel({ sex: Sex.Male });
    const strain3 = generateStrainNodeModel({});
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
    expect(tasks[0].strain2).toBeUndefined();
    expect(tasks[1].action).toBe('Cross');
    const today = new Date().getDate();
    const todayPlusThree = moment().add(3, 'days').toDate().getDate();
    expect(tasks[0].dueDate?.getDate()).toBe(todayPlusThree);
    expect(tasks[1].dueDate?.getDate()).toBe(today);
    // expect(tasks[1].strain1).toBe(JSON.stringify(strain1));
    // expect(tasks[1].strain2).toBe(JSON.stringify(strain2));
  });
  test('.generateTasks() correctly bumps dates', () => {
    let id = 0;
    const strain1 = generateStrainNodeModel({ sex: Sex.Hermaphrodite });
    const strain2 = generateStrainNodeModel({ sex: Sex.Male });
    const nodes = [
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, data: strain1 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, data: strain2 }),
      generateNode({ id: id++, type: FlowType.XIcon }),
      generateNode({ id: id++, type: FlowType.XIcon }),
      generateNode({ id: id++, type: FlowType.XIcon }),
      generateNode({ id: id++, type: FlowType.SelfIcon }),
      generateNode({ id: id++, type: FlowType.SelfIcon }),
    ];
    const edges = [
      generateEdge({
        id: id++,
        source: '0',
        target: '9',
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
      generateEdge({
        id: id++,
        source: '1',
        target: '9',
        targetHandle: 'left',
      }),
      generateEdge({ id: id++, source: '9', target: '2' }),
      generateEdge({ id: id++, source: '2', target: '12' }),
      generateEdge({ id: id++, source: '12', target: '3' }),
      generateEdge({ id: id++, source: '3', target: '13' }),
      generateEdge({
        id: id++,
        source: '13',
        target: '4',
        targetHandle: 'top',
      }),
      generateEdge({
        id: id++,
        source: '5',
        target: '10',
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
      generateEdge({
        id: id++,
        source: '6',
        target: '10',
        targetHandle: 'left',
      }),
      generateEdge({ id: id++, source: '10', target: '7' }),
      generateEdge({
        id: id++,
        source: '4',
        target: '11',
        sourceHandle: 'left',
        targetHandle: 'right',
      }),
      generateEdge({
        id: id++,
        source: '7',
        target: '11',
        targetHandle: 'left',
      }),
      generateEdge({ id: id++, source: '11', target: '8' }),
    ];
    const tree = generateTree({ nodes, edges });
    const tasks = tree.generateTasks(nodes[8]);
    expect(tasks).toHaveLength(5);
    const today = new Date().getDate();
    const todayPlusThree = moment().add(3, 'days').toDate().getDate();
    const todayPlusSix = moment().add(6, 'days').toDate().getDate();
    const todayPlusNine = moment().add(9, 'days').toDate().getDate();
    expect(tasks[0].dueDate?.getDate()).toBe(todayPlusNine);
    expect(tasks[1].dueDate?.getDate()).toBe(todayPlusSix);
    expect(tasks[2].dueDate?.getDate()).toBe(todayPlusThree);
    expect(tasks[3].dueDate?.getDate()).toBe(today);
    // expect(tasks[4].dueDate?.getDate()).toBe(todayPlusSix);
  });

  test('should be able to serialize and deserialize', () => {
    let id = 0;
    const strain1 = generateStrainNodeModel({
      sex: Sex.Hermaphrodite,
      strain: generateStrain({
        allelePairs: [
          new AllelePair({ top: ed3, bot: ed3.getWild() }),
          new AllelePair({ top: ox1059, bot: ox1059.getWild() }),
        ],
      }),
    });
    const strain2 = generateStrainNodeModel({ sex: Sex.Male });
    const strain3 = generateStrainNodeModel({
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
    const crossFilters = new Map<string, OffspringFilter>();
    crossFilters.set(
      nodes[4].id,
      new OffspringFilter({
        alleleNames: new Set(['n766']),
        exprPhenotypes: new Set(),
        supConditions: new Set(),
        reqConditions: new Set(),
      })
    );

    const tree = generateTree({ nodes, edges, invisibleNodes, crossFilters });
    const treeBack = CrossTree.fromJSON(tree.toJSON());

    expect(treeBack.toJSON()).toEqual(tree.toJSON());
    expect(treeBack.generateRecord(treeBack.editable)).toEqual(
      tree.generateRecord(tree.editable)
    );
  });
  // #endregion tests
});
