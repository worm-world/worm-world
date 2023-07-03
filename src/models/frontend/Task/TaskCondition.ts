import { plainToInstance, instanceToPlain } from 'class-transformer';

export interface iTaskCondition {
  parentId: string;
  name: string;
}

export class TaskCondition {
  parentId: string = '';
  name: string = '';

  constructor(taskCond: iTaskCondition) {
    Object.assign(this, taskCond);
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): TaskCondition {
    return plainToInstance(
      TaskCondition,
      JSON.parse(json) as Record<string, unknown>
    );
  }
}
