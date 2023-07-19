import { OffspringFilter } from 'components/OffspringFilter/OffspringFilter';
import { type MenuItem } from 'components/Menu/Menu';
import { Sex } from 'models/enums';
import CrossDesign, {
  type ICrossDesign,
} from 'models/frontend/CrossDesign/CrossDesign';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { type XYPosition, type Node, type Edge } from 'reactflow';
import { expect, test, describe } from 'vitest';
import { ed3, n765, ox1059 } from 'models/frontend/Allele/Allele.mock';
import moment from 'moment';
import { NodeType } from 'components/Editor/Editor';

describe('cross crossDesign', () => {
  // #region generator functions
  const generateTree = ({
    name = '',
    nodes = [],
    edges = [],
    offspringFilters = new Map(),
    lastSaved = new Date(),
    editable = true,
  }: Partial<ICrossDesign>): CrossDesign => {
    return new CrossDesign({
      name,
      nodes,
      edges,
      lastSaved,
      offspringFilters,
      editable,
    });
  };

  const generateNode = ({
    id = 0,
    type = NodeType.Strain,
    position = { x: 0, y: 0 },
    strain = generateStrain({}),
    parentNode = undefined,
  }: {
    id?: number;
    type?: NodeType;
    position?: XYPosition;
    strain?: unknown;
    parentNode?: string;
  }): Node => {
    return {
      id: id.toString(),
      type,
      position,
      data: strain,
    };
  };

  const generateStrain = ({
    allelePairs = [],
    sex = Sex.Hermaphrodite,
  }: {
    allelePairs?: AllelePair[];
    sex?: Sex;
  }): Strain => {
    return new Strain({ allelePairs, sex });
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
    crossDesign: CrossDesign,
    nodes: Node[] = [],
    edges: Edge[] = []
  ): void => {
    // test nodes
    expect(crossDesign.nodes).toHaveLength(nodes.length);
    crossDesign.nodes.forEach((node, idx) => {
      expect(node.id).toBe(nodes[idx].id);
      expect(node.type).toBe(nodes[idx].type);
      expect(node.data).toBe(nodes[idx].data);
    });

    // test edges
    expect(crossDesign.edges).toHaveLength(edges.length);
    crossDesign.edges.forEach((edge, idx) => {
      expect(edge.id).toBe(edges[idx].id);
      expect(edge.source).toBe(edges[idx].source);
      expect(edge.target).toBe(edges[idx].target);
      expect(edge.sourceHandle).toBe(edges[idx].sourceHandle);
      expect(edge.targetHandle).toBe(edges[idx].targetHandle);
    });
  };
  // #endregion testing functions

  // #region tests
  test('constructs an empty crossDesign', () => {
    const name = 'empty crossDesign';
    const lastSaved = new Date();

    const crossDesign = generateTree({ name, lastSaved });
    expect(crossDesign.nodes).toHaveLength(0);
    expect(crossDesign.edges).toHaveLength(0);
    expect(crossDesign.name).toBe(name);
    expect(crossDesign.lastSaved).toBe(lastSaved);
  });
  test('constructs a crossDesign with nodes', () => {
    let id = 0;
    const strainNode = generateNode({ id: id++ });
    const selfNode = generateNode({ id: id++, type: NodeType.Self });
    const xIcon = generateNode({ id: id++, type: NodeType.X });
    const nodes = [strainNode, selfNode, xIcon];
    const crossDesign = generateTree({ nodes });
    testTreeNodesAndEdges(crossDesign, nodes);
  });
  test('constructs a crossDesign with edges and nodes', () => {
    let id = 0;
    const maleStrain = generateStrain({ sex: Sex.Male });
    const hermStrain = generateStrain({});

    const maleNode = generateNode({ id: id++, strain: maleStrain });
    const hermNode = generateNode({ id: id++, strain: hermStrain });
    const xIcon = generateNode({ id: id++, type: NodeType.X });

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

    const crossDesign = generateTree({ nodes, edges });
    testTreeNodesAndEdges(crossDesign, nodes, edges);
  });
  test('constructs a crossDesign with new list of nodes/edges', () => {
    let id = 0;
    const strainNode = generateNode({
      id: id++,
      strain: generateStrain({}),
    });
    const selfNode = generateNode({ id: id++, type: NodeType.Self });

    const nodes = [strainNode, selfNode];
    const edges = [
      generateEdge({
        id: id++,
        source: strainNode.id,
        target: strainNode.id,
        sourceHandle: 'bottom',
      }),
    ];

    const crossDesign = generateTree({ nodes, edges });
    expect(crossDesign.nodes).not.toBe(nodes);
    expect(crossDesign.edges).not.toBe(edges);
    testTreeNodesAndEdges(crossDesign, nodes, edges);
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
    const crossDesign = generateTree({ nodes, edges });
    testTreeNodesAndEdges(crossDesign, nodes, edges);
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {});
    testTreeNodesAndEdges(crossDesign, nodes, edges);
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
    const crossDesign = generateTree({ nodes, edges });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '3',
    });
    testTreeNodesAndEdges(crossDesign, nodes, edges);
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      targetId: '4',
    });
    testTreeNodesAndEdges(crossDesign, nodes, edges);
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '0',
      targetId: '4',
    }); // source matches but target DOES NOT
    testTreeNodesAndEdges(crossDesign, nodes, edges);
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
    const crossDesign = generateTree({ nodes, edges });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '1',
    });
    testTreeNodesAndEdges(crossDesign, nodes, [
      ...edges.slice(0, 3),
      ...edges.slice(5),
    ]);

    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '2',
    });
    testTreeNodesAndEdges(crossDesign, nodes, [...edges.slice(0, 3)]);

    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '0',
    });
    testTreeNodesAndEdges(crossDesign, nodes, []);
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
    const crossDesign = generateTree({ nodes, edges });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      targetId: '3',
    });
    testTreeNodesAndEdges(crossDesign, nodes, [
      ...edges.slice(0, 3),
      edges[4],
      ...edges.slice(6),
    ]);

    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      targetId: '4',
    });
    testTreeNodesAndEdges(crossDesign, nodes, [...edges.slice(0, 2), edges[7]]);

    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      targetId: '5',
    });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      targetId: '1',
    });
    testTreeNodesAndEdges(crossDesign, nodes, [edges[1]]);

    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      targetId: '2',
    });
    testTreeNodesAndEdges(crossDesign, nodes, []);
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
    const crossDesign = generateTree({ nodes, edges });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '1',
      targetId: '4',
    });
    testTreeNodesAndEdges(crossDesign, nodes, [
      ...edges.slice(0, 4),
      ...edges.slice(5),
    ]);

    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '0',
      targetId: '2',
    });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '1',
      targetId: '3',
    });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '2',
      targetId: '3',
    });
    crossDesign.edges = CrossDesign.removeEdges(crossDesign.edges, {
      sourceId: '2',
      targetId: '5',
    });

    testTreeNodesAndEdges(crossDesign, nodes, [edges[0], edges[2], edges[6]]);
  });

  test('.generateTasks() returns empty list from no crosses', () => {
    const nodes = [generateNode({})];
    const crossDesign = generateTree({ nodes });
    expect(crossDesign.generateTasks(nodes[0])).toHaveLength(0);
  });
  test('.generateTasks() returns self-cross tasks', () => {
    let id = 0;
    const strain1 = generateStrain({});
    const nodes = [
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, type: NodeType.Self }),
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

    const crossDesign = generateTree({ nodes, edges });
    expect(crossDesign.generateTasks(nodes[0])).toHaveLength(0);

    const tasks = crossDesign.generateTasks(nodes[2]);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].action).toBe('SelfCross');
    // expect(tasks[0].strain1).toBe(JSON.stringify(strain1));
    expect(tasks[0].strain2).toBeUndefined();
  });
  test('.generateTasks() returns regular cross tasks', () => {
    let id = 0;
    const strain1 = generateStrain({});
    const strain2 = generateStrain({});
    const nodes = [
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, type: NodeType.X }),
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

    const crossDesign = generateTree({ nodes, edges });
    expect(crossDesign.generateTasks(nodes[0])).toHaveLength(0);
    expect(crossDesign.generateTasks(nodes[1])).toHaveLength(0);

    const tasks = crossDesign.generateTasks(nodes[3]);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].action).toBe('Cross');
    // expect(tasks[0].strain1).toBe(JSON.stringify(strain1));
    // expect(tasks[0].strain2).toBe(JSON.stringify(strain2));
    expect(tasks[0].dueDate?.getDay()).toBe(new Date().getDay());
  });
  test('.generateTasks() generates multiple tasks', () => {
    let id = 0;
    const strain1 = generateStrain({ sex: Sex.Hermaphrodite });
    const strain2 = generateStrain({ sex: Sex.Male });
    const strain3 = generateStrain({});
    const nodes = [
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, type: NodeType.X }),
      generateNode({ id: id++ }),
      generateNode({ id: id++, type: NodeType.Self }),
      generateNode({ id: id++, strain: strain3 }),
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

    const crossDesign = generateTree({ nodes, edges });
    expect(crossDesign.generateTasks(nodes[0])).toHaveLength(0);
    expect(crossDesign.generateTasks(nodes[1])).toHaveLength(0);

    const tasks = crossDesign.generateTasks(nodes[5]);
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
    const strain1 = generateStrain({});
    const strain2 = generateStrain({});
    const nodes = [
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, type: NodeType.X }),
      generateNode({ id: id++, type: NodeType.X }),
      generateNode({ id: id++, type: NodeType.X }),
      generateNode({ id: id++, type: NodeType.Self }),
      generateNode({ id: id++, type: NodeType.Self }),
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
    const crossDesign = generateTree({ nodes, edges });
    const tasks = crossDesign.generateTasks(nodes[8]);
    expect(tasks).toHaveLength(5);
    const today = new Date().getDate();
    const todayPlusThree = moment().add(3, 'days').toDate().getDate();
    const todayPlusSix = moment().add(6, 'days').toDate().getDate();
    const todayPlusNine = moment().add(9, 'days').toDate().getDate();
    expect(tasks[0].dueDate?.getDate()).toBe(todayPlusNine);
    expect(tasks[1].dueDate?.getDate()).toBe(todayPlusSix);
    expect(tasks[2].dueDate?.getDate()).toBe(todayPlusThree);
    expect(tasks[3].dueDate?.getDate()).toBe(today);
  });

  test('should be able to serialize and deserialize', () => {
    let id = 0;
    const strain1 = generateStrain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3.toWild() }),
        new AllelePair({ top: ox1059, bot: ox1059.toWild() }),
      ],
      sex: Sex.Hermaphrodite,
    });
    const strain2 = generateStrain({});
    const strain3 = generateStrain({
      allelePairs: [new AllelePair({ top: n765, bot: n765 })],
      sex: Sex.Hermaphrodite,
    });
    const selfNode = generateNode({ id: id++, type: NodeType.Self });
    const nodes = [
      generateNode({ id: id++, strain: strain1 }),
      generateNode({ id: id++, strain: strain2 }),
      generateNode({ id: id++, type: NodeType.X }),
      generateNode({ id: id++ }),
      generateNode({ id: id++, strain: strain3, parentNode: selfNode.id }),
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

    const offspringFilters = new Map<string, OffspringFilter>();
    offspringFilters.set(
      nodes[4].id,
      new OffspringFilter({
        alleleNames: new Set(['n766']),
        exprPhenotypes: new Set(),
        supConditions: new Set(),
        reqConditions: new Set(),
      })
    );

    const crossDesign = generateTree({ nodes, edges, offspringFilters });
    const crossDesignBack = CrossDesign.fromJSON(crossDesign.toJSON());

    expect(crossDesignBack.toJSON()).toEqual(crossDesign.toJSON());
    expect(crossDesignBack.generateRecord()).toEqual(
      crossDesign.generateRecord()
    );

    expect(
      crossDesignBack.nodes
        .filter((node) => node.type === NodeType.Strain)
        .every((node) => (node.data as Strain).getAllelePairs !== undefined)
    );
  });
});
