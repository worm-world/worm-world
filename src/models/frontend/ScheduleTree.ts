import TreeNode from './TreeNode';

export default interface ScheduleTree {
  crossTree: TreeNode;
  deadline: Date;
  completed: Boolean;
}
