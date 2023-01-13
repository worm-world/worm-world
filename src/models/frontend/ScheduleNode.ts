import CrossNode from 'models/frontend/CrossNode/CrossNode';

export default interface ScheduleNode {
  id: number;
  scheduleTreeId: number;
  crossNode: CrossNode;
  deadline: Date;
  completed: Boolean;
  notes: string;
}
