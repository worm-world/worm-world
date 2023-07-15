import { type Action } from 'models/db/task/Action';
import { type db_Task } from 'models/db/task/db_Task';
import { StrainData } from 'models/frontend/StrainData/StrainData';
import { Type, plainToInstance, instanceToPlain } from 'class-transformer';
import { hermWild } from 'models/frontend/StrainData/StrainData.stories';
import { type Condition } from 'models/frontend/Condition/Condition';

export interface iTask {
  id: string;
  dueDate?: Date;

  action: Action;
  strain1: StrainData;

  strain2?: StrainData;
  result?: StrainData;

  notes?: string;
  completed: boolean;
  treeId: string;
}

export class Task {
  id: string;
  @Type(() => Date)
  dueDate?: Date;

  action: Action;
  @Type(() => StrainData)
  strain1: StrainData;

  @Type(() => StrainData)
  strain2?: StrainData;

  @Type(() => StrainData)
  result?: StrainData;

  notes?: string;
  completed: boolean;
  treeId: string;

  constructor(task: db_Task) {
    if (task === null || task === undefined) {
      this.id = '';
      this.action = 'SelfCross';
      this.strain1 = hermWild;
      this.completed = false;
      this.treeId = '';
    } else {
      this.id = task.id;
      this.dueDate =
        task.due_date !== null ? new Date(task.due_date) : undefined;
      this.action = task.action;
      this.strain1 = StrainData.fromJSON(task.strain1);
      this.strain2 =
        task.strain2 !== null
          ? StrainData.fromJSON(task.strain2)
          : undefined;
      this.result =
        task.result !== null ? StrainData.fromJSON(task.result) : undefined;
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
      result: this.result?.toJSON() ?? null,
      notes: this.notes ?? null,
      completed: this.completed,
      tree_id: this.treeId,
    };
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Task {
    return plainToInstance(Task, JSON.parse(json) as Record<string, unknown>);
  }
}

export const getConditionsFromTask = (
  worm1: StrainData,
  worm2?: StrainData
): Map<string, Condition> => {
  const conditions = new Map<string, Condition>();

  [
    ...worm1.strain.chromPairMap.values(),
    ...(worm2?.strain.chromPairMap.values() ?? []),
  ].forEach((chromPair) => {
    chromPair.allelePairs.forEach((allelePair) => {
      [
        ...allelePair.bot.alleleExpressions,
        ...allelePair.top.alleleExpressions,
      ].forEach((ae) => {
        [...ae.suppressingConditions, ...ae.requiredConditions].forEach((c) =>
          conditions.set(c.name, c)
        );
      });
    });
  });
  return conditions;
};
