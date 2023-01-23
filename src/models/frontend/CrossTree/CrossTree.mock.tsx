import * as mockTreeNode from 'models/frontend/TreeNode/TreeNode.mock';
import CrossTree from 'models/frontend/CrossTree/CrossTree';
import { Gene } from '../Gene/Gene';

export const simpleCrossTree = new CrossTree({
  id: 0,
  description: 'Cross two ed3 heterozygous',
  name: 'ed3 Cross',
  settings: {
    longName: false,
    contents: false,
  },
  genes: [new Gene({ sysName: 'M142.1', chromosome: 'III' })],
  variations: [],
  treeNodes: [
    mockTreeNode.ed3HeteroHerm,
    mockTreeNode.ed3HeteroMale,
    mockTreeNode.ed3HomoHerm,
  ],
  lastSaved: new Date(),
});

export const mediumCrossTree = new CrossTree({
  id: 1,
  description: 'Cross two ed3 heterozygous',
  name: 'Make unc-33(-)',
  settings: {
    longName: false,
    contents: false,
  },
  treeNodes: [
    mockTreeNode.node1,
    mockTreeNode.node2,
    mockTreeNode.node3,
    mockTreeNode.node4,
    mockTreeNode.node5,
    mockTreeNode.node6,
    mockTreeNode.node7,
  ],
  genes: [new Gene({ sysName: 'CB204', chromosome: 'IV' })],
  variations: [],
  lastSaved: new Date('2023-01-18'),
});
