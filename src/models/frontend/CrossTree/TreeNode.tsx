import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';

export interface Point {
  x: number;
  y: number;
}

export class TreeNode {
  crossNodeModel: CrossNodeModel;
  position: Point;
  maleParent?: TreeNode;
  femaleParent?: TreeNode;

  constructor(
    value: CrossNodeModel,
    position: Point,
    maleParent?: TreeNode,
    femaleParent?: TreeNode
  ) {
    this.crossNodeModel = value;
    this.maleParent = maleParent;
    this.femaleParent = femaleParent;
    this.position = position;
  }

  public setMaleParent(maleParent: TreeNode): void {
    this.maleParent = maleParent;
  }

  public setFemaleParent(femaleParent: TreeNode): void {
    this.maleParent = femaleParent;
  }
}
