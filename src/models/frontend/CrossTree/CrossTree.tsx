import { TreeNode } from 'models/frontend/CrossTree/TreeNode';

interface iCrossTree {
  id: number;
  name: string;
  description: string;
  settings: {
    longName: boolean;
    contents: boolean;
  };
  treeNodes: TreeNode[];
  lastSaved: Date;
}

export default class CrossTree {
  id: number;
  name: string;
  description: string;
  settings: {
    longName: boolean;
    contents: boolean;
  };

  treeNodes: TreeNode[];
  lastSaved: Date;

  constructor(params: iCrossTree) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.settings = params.settings;
    this.treeNodes = params.treeNodes;
    this.lastSaved = params.lastSaved;
  }
}
