import ScheduleNode from 'models/frontend/ScheduleNode';

export default interface ScheduleTree {
  crossTree: ScheduleNode;
  deadline: Date;
  completed: Boolean;
}
