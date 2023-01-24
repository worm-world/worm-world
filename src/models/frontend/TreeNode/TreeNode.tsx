import CrossNodeModel from 'models/frontend/CrossNode/CrossNode';

let nextId = 0;

export interface Point {
  x: number;
  y: number;
}

export class TreeNode {
  id: number;
  crossNodeModel: CrossNodeModel;
  position: Point;
  maleParent?: TreeNode;
  femaleParent?: TreeNode;

  constructor(params: {
    value: CrossNodeModel;
    position: Point;
    maleParent?: TreeNode;
    femaleParent?: TreeNode;
  }) {
    this.id = nextId++;
    this.crossNodeModel = params.value;
    this.maleParent = params.maleParent;
    this.femaleParent = params.femaleParent;
    this.position = params.position;
  }

  public setMaleParent(maleParent: TreeNode): void {
    this.maleParent = maleParent;
  }

  public setFemaleParent(femaleParent: TreeNode): void {
    this.maleParent = femaleParent;
  }
}
