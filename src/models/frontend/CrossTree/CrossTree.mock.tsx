import * as mockTreeNode from 'models/frontend/CrossTree/TreeNode.mock';
import CrossTree from 'models/frontend/CrossTree/CrossTree';

export const ed3CrossTree = new CrossTree({
  id: 0,
  description: 'Cross two ed3 heterozygous',
  name: 'ed3 Cross',
  settings: {
    longName: false,
    contents: false,
  },
  treeNodes: [
    mockTreeNode.ed3HeteroHerm,
    mockTreeNode.ed3HeteroMale,
    mockTreeNode.ed3HomoHerm,
  ],
  lastSaved: new Date(),
});
