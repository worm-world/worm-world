import { StrainFilter } from 'models/frontend/StrainFilter/StrainFilter';
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
    strainFilters = new Map(),
    lastSaved = new Date(),
    editable = true,
  }: Partial<ICrossDesign>): CrossDesign => {
    return new CrossDesign({
      name,
      nodes,
      edges,
      lastSaved,
      strainFilters,
      editable,
    });
  };

  const generateNode = ({
    id = 0,
    type = NodeType.Strain,
    position = { x: 0, y: 0 },
    strain = new Strain(),
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
    const maleStrain = new Strain({ sex: Sex.Male });
    const hermStrain = new Strain();

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
      strain: new Strain(),
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

  test('.getTasks() returns empty list from no crosses', () => {
    const nodes = [generateNode({})];
    const crossDesign = generateTree({ nodes });
    expect(crossDesign.getTasks(nodes[0])).toHaveLength(0);
  });
  test('.getTasks() returns self-cross tasks', () => {
    let id = 0;
    const hermStrain = new Strain();
    const nodes = [
      generateNode({ id: id++, strain: hermStrain }),
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
    expect(crossDesign.getTasks(nodes[0])).toHaveLength(0);

    const tasks = crossDesign.getTasks(nodes[2]);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].action).toBe('SelfCross');
    // expect(tasks[0].hermStrain).toBe(JSON.stringify(hermStrain));
    expect(tasks[0].maleStrain).toBeUndefined();
  });
  test('.getTasks() returns regular cross tasks', () => {
    let id = 0;
    const hermStrain = new Strain();
    const maleStrain = new Strain();
    const nodes = [
      generateNode({ id: id++, strain: hermStrain }),
      generateNode({ id: id++, strain: maleStrain }),
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
    expect(crossDesign.getTasks(nodes[0])).toHaveLength(0);
    expect(crossDesign.getTasks(nodes[1])).toHaveLength(0);

    const tasks = crossDesign.getTasks(nodes[3]);
    expect(tasks).toHaveLength(1);
    expect(tasks[0].action).toBe('Cross');
    // expect(tasks[0].hermStrain).toBe(JSON.stringify(hermStrain));
    // expect(tasks[0].maleStrain).toBe(JSON.stringify(maleStrain));
    expect(tasks[0].dueDate?.getDay()).toBe(new Date().getDay());
  });
  test('.getTasks() generates multiple tasks', () => {
    let id = 0;
    const hermStrain = new Strain({ sex: Sex.Hermaphrodite });
    const maleStrain = new Strain({ sex: Sex.Male });
    const strain3 = new Strain();
    const nodes = [
      generateNode({ id: id++, strain: hermStrain }),
      generateNode({ id: id++, strain: maleStrain }),
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
    expect(crossDesign.getTasks(nodes[0])).toHaveLength(0);
    expect(crossDesign.getTasks(nodes[1])).toHaveLength(0);

    const tasks = crossDesign.getTasks(nodes[5]);
    expect(tasks).toHaveLength(2);
    expect(tasks[0].action).toBe('self-cross');
    expect(tasks[0].maleStrain).toBeUndefined();
    expect(tasks[1].action).toBe('cross');
    const today = new Date().getDate();
    const todayPlusThree = moment().add(3, 'days').toDate().getDate();
    expect(tasks[0].dueDate?.getDate()).toBe(todayPlusThree);
    expect(tasks[1].dueDate?.getDate()).toBe(today);
  });
  test('.getTasks() correctly bumps dates', () => {
    let id = 0;
    const hermStrain = new Strain();
    const maleStrain = new Strain();
    const nodes = [
      generateNode({ id: id++, strain: hermStrain }),
      generateNode({ id: id++, strain: maleStrain }),
      generateNode({ id: id++, strain: hermStrain }),
      generateNode({ id: id++, strain: maleStrain }),
      generateNode({ id: id++, strain: hermStrain }),
      generateNode({ id: id++, strain: maleStrain }),
      generateNode({ id: id++, strain: hermStrain }),
      generateNode({ id: id++, strain: maleStrain }),
      generateNode({ id: id++, strain: maleStrain }),
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
    const tasks = crossDesign.getTasks(nodes[8]);
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
    const hermStrain = new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3.toWild() }),
        new AllelePair({ top: ox1059, bot: ox1059.toWild() }),
      ],
      sex: Sex.Hermaphrodite,
    });
    const maleStrain = new Strain();
    const strain3 = new Strain({
      allelePairs: [new AllelePair({ top: n765, bot: n765 })],
      sex: Sex.Hermaphrodite,
    });
    const selfNode = generateNode({ id: id++, type: NodeType.Self });
    const nodes = [
      generateNode({ id: id++, strain: hermStrain }),
      generateNode({ id: id++, strain: maleStrain }),
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

    const strainFilters = new Map<string, StrainFilter>();
    strainFilters.set(
      nodes[4].id,
      new StrainFilter({
        alleleNames: new Set(['n766']),
        exprPhenotypes: new Set(),
        supConditions: new Set(),
        reqConditions: new Set(),
        hidden: new Set(),
      })
    );

    const crossDesign = generateTree({ nodes, edges, strainFilters });
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
