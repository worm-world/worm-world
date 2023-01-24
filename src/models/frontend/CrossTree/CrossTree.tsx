import { TreeNode } from 'models/frontend/TreeNode/TreeNode';
import { Gene } from '../Gene/Gene';
import { VariationInfo } from '../VariationInfo/VariationInfo';

interface iCrossTree {
  id: number; // Unique identifier
  name: string;
  description: string;
  settings: {
    // AKA toggles
    longName: boolean;
    contents: boolean;
  };
  treeNodes: TreeNode[];
  lastSaved: Date;
  genes: Gene[]; // To display in each node
  variations: VariationInfo[]; // To display in each node
}

export default class CrossTree {
  id: number;
  name: string;
  description: string;
  lastSaved: Date;

  settings: {
    longName: boolean;
    contents: boolean;
  };

  treeNodes: TreeNode[];

  constructor(params: iCrossTree) {
    this.id = params.id; // TODO: Get from DB if undefined to ensure uniqueness
    this.name = params.name;
    this.description = params.description;
    this.lastSaved = params.lastSaved;
    this.settings = params.settings;
    this.treeNodes = params.treeNodes;
  }
}
