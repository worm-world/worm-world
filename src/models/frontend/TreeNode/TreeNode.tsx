import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';

export interface Point {
  x: number;
  y: number;
}

export class TreeNode {
  id?: number;
  crossNodeModel: CrossNodeModel;
  position: Point;
  maleParent?: TreeNode;
  femaleParent?: TreeNode;

  constructor(params: {
    value: CrossNodeModel;
    position: Point;
    maleParent?: TreeNode;
    femaleParent?: TreeNode;
    id?: number;
  }) {
    this.crossNodeModel = params.value;
    this.maleParent = params.maleParent;
    this.femaleParent = params.femaleParent;
    this.position = params.position;
    this.id = params.id;
  }

  public setMaleParent(maleParent: TreeNode): void {
    this.maleParent = maleParent;
  }

  public setFemaleParent(femaleParent: TreeNode): void {
    this.maleParent = femaleParent;
  }
}
