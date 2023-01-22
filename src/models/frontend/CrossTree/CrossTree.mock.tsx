import * as mockTreeNode from 'models/frontend/CrossTree/TreeNode.mock';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

export const ed3CrossTree = new CrossTree({
  id: 0n,
  description: 'Cross two ed3 heterozygous',
  settings: {
    longName: false,
    contents: false,
  },
  treeNodes: [
    mockTreeNode.ed3HeteroHerm,
    mockTreeNode.ed3HeteroMale,
    mockTreeNode.ed3HomoHerm,
  ],
});
