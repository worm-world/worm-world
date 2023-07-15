import CrossTree from 'models/frontend/CrossTree/CrossTree';
import * as mockStrainNode from 'models/frontend/StrainData/StrainData.stories';
import { type Edge, type Node } from 'reactflow';
import { FlowType } from 'components/CrossFlow/CrossFlow';
import { type StrainData } from 'models/frontend/StrainData/StrainData';

export const emptyCrossTree = new CrossTree({
  name: 'Empty cross tree',
  nodes: [],
  edges: [],
  invisibleNodes: new Set(),
  crossFilters: new Map(),
  lastSaved: new Date(),
  editable: true,
});

export const ed3HeteroMale: Node<StrainData> = {
  id: '0',
  type: FlowType.Strain,
  data: mockStrainNode.ed3HetMale,
  position: {
    x: -300,
    y: -300,
  },
};

export const ed3HeteroHerm: Node<StrainData> = {
  id: '1',
  type: FlowType.Strain,
  data: mockStrainNode.ed3HetHerm,
  position: {
    x: 300,
    y: -300,
  },
};

export const ed3HomoHerm: Node<StrainData> = {
  id: '2',
  type: FlowType.Strain,
  data: mockStrainNode.ed3HomoHerm,
  position: {
    x: 0,
    y: 0,
  },
};

export const xNode: Node = {
  id: '3',
  type: FlowType.XIcon,
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

export const simpleCrossTree = new CrossTree({
  name: 'ed3 Cross',
  nodes: [ed3HeteroHerm, ed3HeteroMale, ed3HomoHerm, xNode],
  edges: [edgeMale, edgeFemale, edgeChild],
  lastSaved: new Date(),
  invisibleNodes: new Set(),
  crossFilters: new Map(),
  editable: true,
});

export const node0: Node<StrainData> = {
  id: '0',
  type: FlowType.Strain,
  data: mockStrainNode.e204WildMale,
  position: {
    x: -600,
    y: -1000,
  },
};
export const node1: Node<StrainData> = {
  id: '1',
  type: FlowType.Strain,
  data: mockStrainNode.e204HomoHerm,
  position: {
    x: 0,
    y: -1000,
  },
};
export const node2: Node<StrainData> = {
  id: '2',
  type: FlowType.Strain,
  data: mockStrainNode.e204HetMale,
  position: {
    x: -300,
    y: -800,
  },
};
export const node3: Node<StrainData> = {
  id: '3',
  type: FlowType.Strain,
  data: mockStrainNode.ox802HomoHerm,
  position: {
    x: 300,
    y: -800,
  },
};
export const node4: Node<StrainData> = {
  id: '4',
  type: FlowType.Strain,
  data: mockStrainNode.e204HetOx802Het,
  position: {
    x: 0,
    y: -600,
  },
};
export const node5: Node<StrainData> = {
  id: '5',
  type: FlowType.Strain,
  data: mockStrainNode.e204HomoOx802HetHerm,
  position: {
    x: 0,
    y: -400,
  },
};
export const node6: Node<StrainData> = {
  id: '6',
  type: FlowType.Strain,
  data: mockStrainNode.e204HomoOx802HomoHerm,
  position: {
    x: 0,
    y: -200,
  },
};

export const xNode0: Node = {
  id: '7',
  type: FlowType.XIcon,
  data: null,
  position: {
    x: -204,
    y: -976,
  },
};

export const xNode1: Node = {
  id: '8',
  type: FlowType.XIcon,
  data: null,
  position: {
    x: 96,
    y: -776,
  },
};

export const selfNode0: Node = {
  id: '9',
  type: FlowType.SelfIcon,
  data: null,
  position: {
    x: 96,
    y: -476,
  },
};

export const selfNode1: Node = {
  id: '10',
  type: FlowType.SelfIcon,
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

export const mediumCrossTree = new CrossTree({
  name: 'Make unc-33(-)',
  nodes: [
    node0,
    node1,
    node2,
    node3,
    node4,
    node5,
    node6,
    xNode0,
    xNode1,
    selfNode0,
    selfNode1,
  ],
  edges,
  invisibleNodes: new Set(),
  crossFilters: new Map(),
  lastSaved: new Date('2023-01-18'),
  editable: true,
});

export const selfNodeAsParent: Node = {
  id: '0',
  type: FlowType.SelfIcon,
  data: null,
  position: {
    x: 0,
    y: 0,
  },
};

export const ed3AsChild: Node<StrainData> = {
  id: '1',
  type: FlowType.Strain,
  data: mockStrainNode.ed3HomoHerm,
  position: {
    x: 0,
    y: 0,
  },
  parentNode: '0',
};
export const n765AsChild: Node<StrainData> = {
  id: '1',
  type: FlowType.Strain,
  data: mockStrainNode.n765Homo,
  position: {
    x: 0,
    y: 0,
  },
  parentNode: '0',
};
