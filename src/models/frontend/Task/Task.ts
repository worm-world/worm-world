import { Action } from 'models/db/task/Action';
import { db_Task } from 'models/db/task/db_Task';
import { CrossNodeModel } from '../CrossNode/CrossNode';
import { Type, plainToInstance, instanceToPlain } from 'class-transformer';
import { empty } from 'models/frontend/CrossNode/CrossNode.mock';

export interface iTask {
  id: string;
  dueDate?: Date;

  action: Action;
  strain1: CrossNodeModel;

  strain2?: CrossNodeModel;

  notes?: string;
  completed: boolean;
  treeId: string;
}

export class Task {
  id: string;
  @Type(() => Date)
  dueDate?: Date;

  action: Action;
  @Type(() => CrossNodeModel)
  strain1: CrossNodeModel;

  @Type(() => CrossNodeModel)
  strain2?: CrossNodeModel;

  notes?: string;
  completed: boolean;
  treeId: string;

  constructor(task: db_Task) {
    if (task === null || task === undefined) {
      this.id = '';
      this.action = 'SelfCross';
      this.strain1 = empty;
      this.completed = false;
      this.treeId = '';
    } else {
      this.id = task.id;
      this.dueDate =
        task.due_date !== null ? new Date(task.due_date) : undefined;
      this.action = task.action;
      this.strain1 = CrossNodeModel.fromJSON(task.strain1);
      this.strain2 =
        task.strain2 !== null
          ? CrossNodeModel.fromJSON(task.strain2)
          : undefined;
      this.notes = task.notes ?? undefined;
      this.completed = task.completed;
      this.treeId = task.tree_id;
    }
  }

  public generateRecord(): db_Task {
    return {
      id: this.id,
      due_date: this.dueDate?.toISOString() ?? null,
      action: this.action,
      strain1: this.strain1.toJSON(),
      strain2: this.strain2?.toJSON() ?? null,
      notes: this.notes ?? null,
      completed: this.completed,
      tree_id: this.treeId,
    };
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Task {
    return [plainToInstance(Task, JSON.parse(json))].flat()[0];
  }
}
