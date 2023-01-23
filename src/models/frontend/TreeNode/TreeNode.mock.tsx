import * as mockCrossNode from 'models/frontend/CrossNode/CrossNode.mock';
import { TreeNode } from 'models/frontend/TreeNode/TreeNode';

export const ed3HeteroHerm = new TreeNode({
  value: mockCrossNode.ed3HeteroHerm,
  position: {
    x: 300,
    y: -300,
  },
});

export const ed3HeteroMale = new TreeNode({
  value: mockCrossNode.ed3HeteroMale,
  position: {
    x: -300,
    y: -300,
  },
});

export const ed3HomoHerm = new TreeNode({
  value: mockCrossNode.ed3HomoHerm,
  position: {
    x: 0,
    y: 0,
  },
  maleParent: ed3HeteroMale,
  femaleParent: ed3HeteroHerm,
});

// Example "make unc-33(-)" /////////////////////////////////////////

// Named from top left to bottom right in rows
export const node1 = new TreeNode({
  value: mockCrossNode.wildE204Male,
  position: {
    x: -600,
    y: -1000,
  },
});
export const node2 = new TreeNode({
  value: mockCrossNode.homoE204Herm,
  position: {
    x: 0,
    y: -1000,
  },
});
export const node3 = new TreeNode({
  value: mockCrossNode.heteroE204Male,
  position: {
    x: -300,
    y: -800,
  },
  maleParent: node1,
  femaleParent: node2,
});
export const node4 = new TreeNode({
  value: mockCrossNode.homoOx802Herm,
  position: {
    x: 300,
    y: -800,
  },
});
export const node5 = new TreeNode({
  value: mockCrossNode.heteroE204HeteroOx802Herm,
  position: {
    x: 0,
    y: -600,
  },
  maleParent: node3,
  femaleParent: node4,
});
export const node6 = new TreeNode({
  value: mockCrossNode.homoE204HeteroOx802Herm,
  position: {
    x: 0,
    y: -400,
  },
  femaleParent: node5,
});
export const node7 = new TreeNode({
  value: mockCrossNode.homoE204HomoOx802Herm,
  position: {
    x: 0,
    y: -200,
  },
  femaleParent: node6,
});
