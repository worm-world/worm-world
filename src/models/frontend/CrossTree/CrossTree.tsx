import { TreeNode } from 'models/frontend/CrossTree/TreeNode';

interface iCrossTree {
  id: bigint;
  description: string;
  settings: {
    longName: boolean;
    contents: boolean;
  };
  trees: TreeNode[];
}

// Technically a cross forest
export default class CrossTree {
  id: bigint;
  description: string;
  settings: {
    longName: boolean;
    contents: boolean;
  };

  trees: TreeNode[];

  constructor(params: iCrossTree) {
    this.id = params.id;
    this.description = params.description;
    this.settings = params.settings;
    this.trees = params.trees;
  }
}
