import { TreeNode } from 'models/frontend/CrossTree/TreeNode';
import { Gene } from '../Gene/Gene';
import { VariationInfo } from '../VariationInfo/VariationInfo';

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
  genes: Gene[];
  variations: VariationInfo[];
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
