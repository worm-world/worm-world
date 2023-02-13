import { plainToInstance, instanceToPlain } from 'class-transformer';

export interface iTaskDependency {
  parentId: string;
  childId: string;
}

export class TaskDependency {
  parentId: string = '';
  childId: string = '';

  constructor(taskDep: iTaskDependency) {
    Object.assign(this, taskDep);
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): TaskDependency {
    return [plainToInstance(TaskDependency, JSON.parse(json))].flat()[0];
  }
}
