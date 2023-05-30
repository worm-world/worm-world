import type ScheduleNode from 'models/frontend/ScheduleNode';

export default interface ScheduleTree {
  crossTree: ScheduleNode;
  deadline: Date;
  completed: boolean;
}
