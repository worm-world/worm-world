import { type CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';

export default interface ScheduleNode {
  id: number;
  scheduleTreeId: number;
  crossNode: CrossNodeModel;
  deadline: Date;
  completed: boolean;
  notes: string;
}
