import * as mockCrossNode from 'models/frontend/CrossNode/CrossNode.mock';
import { TreeNode } from 'models/frontend/CrossTree/TreeNode';

export const ed3HeteroHerm = new TreeNode(mockCrossNode.ed3HeteroHerm, {
  x: -300,
  y: -300,
});

export const ed3HeteroMale = new TreeNode(mockCrossNode.ed3HeteroMale, {
  x: 300,
  y: -300,
});

export const ed3HomoHerm = new TreeNode(
  mockCrossNode.ed3HomoHerm,
  {
    x: 0,
    y: 0,
  },
  ed3HeteroMale,
  ed3HeteroHerm
);
