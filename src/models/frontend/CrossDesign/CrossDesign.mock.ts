import CrossDesign from 'models/frontend/CrossDesign/CrossDesign';
import { type Edge, type Node } from 'reactflow';
import { NodeType } from 'components/Editor/Editor';
import * as strains from 'models/frontend/Strain/Strain.mock';
import { type Strain } from 'models/frontend/Strain/Strain';

export const emptyCrossDesign = new CrossDesign({
  name: 'Empty cross tree',
  nodes: [],
  edges: [],
  offspringFilters: new Map(),
  lastSaved: new Date(),
  editable: true,
});

export const ed3HeteroMale: Node<Strain> = {
  id: '0',
  type: NodeType.Strain,
  data: strains.ed3Het.toMale(),
  position: {
    x: -300,
    y: -300,
  },
};

export const ed3HeteroHerm: Node<Strain> = {
  id: '1',
  type: NodeType.Strain,
  data: strains.ed3Het,
  position: {
    x: 300,
    y: -300,
  },
};

export const ed3HomoHerm: Node<Strain> = {
  id: '2',
  type: NodeType.Strain,
  data: strains.ed3Homo,
  position: {
    x: 0,
    y: 0,
  },
};

export const xNode: Node = {
  id: '3',
  type: NodeType.X,
  data: null,
  position: {
    x: 96,
    y: -276,
  },
};

export const edgeMale: Edge = {
  id: 'e0-3',
  source: '0',
  target: '3',
};

export const edgeFemale: Edge = {
  id: 'e1-3',
  source: '1',
  target: '3',
  targetHandle: 'left',
};

export const edgeChild: Edge = {
  id: 'e3-2',
  source: '3',
  target: '2',
};

export const simpleCrossDesign = new CrossDesign({
  name: 'ed3 Cross',
  nodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm, xNode],
  edges: [edgeMale, edgeFemale, edgeChild],
  lastSaved: new Date(),
  offspringFilters: new Map(),
  editable: true,
});

export const node1: Node<Strain> = {
  id: '0',
  type: NodeType.Strain,
  data: strains.e204Wild.toMale(),
  position: {
    x: -600,
    y: -1000,
  },
};
export const node2: Node<Strain> = {
  id: '1',
  type: NodeType.Strain,
  data: strains.e204Homo,
  position: {
    x: 0,
    y: -1000,
  },
};
export const node3: Node<Strain> = {
  id: '2',
  type: NodeType.Strain,
  data: strains.e204Het.toMale(),
  position: {
    x: -300,
    y: -800,
  },
};
export const node4: Node<Strain> = {
  id: '3',
  type: NodeType.Strain,
  data: strains.ox802Homo,
  position: {
    x: 300,
    y: -800,
  },
};
export const node5: Node<Strain> = {
  id: '4',
  type: NodeType.Strain,
  data: strains.e204HetOx802Het,
  position: {
    x: 0,
    y: -600,
  },
};
export const node6: Node<Strain> = {
  id: '5',
  type: NodeType.Strain,
  data: strains.e204HomoOx802Het,
  position: {
    x: 0,
    y: -400,
  },
};
export const node7: Node<Strain> = {
  id: '6',
  type: NodeType.Strain,
  data: strains.e204HomoOx802Homo,
  position: {
    x: 0,
    y: -200,
  },
};

export const xNode1: Node = {
  id: '7',
  type: NodeType.X,
  data: null,
  position: {
    x: -204,
    y: -976,
  },
};

export const xNode2: Node = {
  id: '8',
  type: NodeType.X,
  data: null,
  position: {
    x: 96,
    y: -776,
  },
};

export const selfNode1: Node = {
  id: '9',
  type: NodeType.Self,
  data: null,
  position: {
    x: 96,
    y: -476,
  },
};

export const selfNode2: Node = {
  id: '10',
  type: NodeType.Self,
  data: null,
  position: {
    x: 96,
    y: -276,
  },
};

export const edges: Edge[] = [
  {
    id: 'e0-7',
    source: '0',
    target: '7',
  },
  {
    id: 'e1-7',
    source: '1',
    target: '7',
    sourceHandle: 'left',
    targetHandle: 'right',
  },
  {
    id: 'e7-2',
    source: '7',
    target: '2',
  },
  { id: 'e2-8', source: '2', target: '8' },
  {
    id: 'e3-8',
    source: '3',
    target: '8',
    targetHandle: 'right',
    sourceHandle: 'left',
  },
  { id: 'e8-4', source: '8', target: '4' },
  { id: 'e4-9', source: '4', target: '9', sourceHandle: 'bottom' },
  { id: 'e9-5', source: '9', target: '5' },
  { id: 'e5-10', source: '5', target: '10', sourceHandle: 'bottom' },
  { id: 'e10-6', source: '10', target: '6' },
];

export const mediumCrossDesign = new CrossDesign({
  name: 'Make unc-33(-)',
  nodes: [
    node1,
    node2,
    node3,
    node4,
    node5,
    node6,
    node7,
    xNode1,
    xNode2,
    selfNode1,
    selfNode2,
  ],
  edges,
  offspringFilters: new Map(),
  lastSaved: new Date('2023-01-18'),
  editable: true,
});

export const selfNodeAsParent: Node = {
  id: '0',
  type: NodeType.Self,
  data: null,
  position: {
    x: 0,
    y: 0,
  },
};

export const ed3AsChild: Node<Strain> = {
  id: '1',
  type: NodeType.Strain,
  data: strains.ed3Homo,
  position: {
    x: 0,
    y: 0,
  },
  parentNode: '0',
};
export const n765AsChild: Node<Strain> = {
  id: '1',
  type: NodeType.Strain,
  data: strains.n765Homo,
  position: {
    x: 0,
    y: 0,
  },
  parentNode: '0',
};
