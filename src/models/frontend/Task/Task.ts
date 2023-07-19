import { type Action } from 'models/db/task/Action';
import { type db_Task } from 'models/db/task/db_Task';
import { Type, plainToInstance, instanceToPlain } from 'class-transformer';
import { type Condition } from 'models/frontend/Condition/Condition';
import { Strain } from 'models/frontend/Strain/Strain';

export interface iTask {
  id: string;
  dueDate?: Date;
  action: Action;

  strain1: Strain;
  strain2?: Strain;
  result?: Strain;

  notes?: string;
  completed: boolean;
  crossDesignId: string;
}

export class Task {
  id: string;
  @Type(() => Date)
  dueDate?: Date;

  action: Action;
  @Type(() => Strain)
  strain1: Strain;

  @Type(() => Strain)
  strain2?: Strain;

  @Type(() => Strain)
  result?: Strain;

  notes?: string;
  completed: boolean;
  crossDesignId: string;

  constructor(task: db_Task) {
    if (task === null || task === undefined) {
      this.id = '';
      this.action = 'SelfCross';
      this.strain1 = new Strain();
      this.completed = false;
      this.crossDesignId = '';
    } else {
      this.id = task.id;
      this.dueDate = task.dueDate !== null ? new Date(task.dueDate) : undefined;
      this.action = task.action;
      this.strain1 = Strain.fromJSON(task.strain1);
      this.strain2 =
        task.strain2 !== null ? Strain.fromJSON(task.strain2) : undefined;
      this.result =
        task.result !== null ? Strain.fromJSON(task.result) : undefined;
      this.notes = task.notes ?? undefined;
      this.completed = task.completed;
      this.crossDesignId = task.crossDesignId;
    }
  }

  public generateRecord(): db_Task {
    return {
      id: this.id,
      dueDate: this.dueDate?.toISOString() ?? null,
      action: this.action,
      strain1: this.strain1.toJSON(),
      strain2: this.strain2?.toJSON() ?? null,
      result: this.result?.toJSON() ?? null,
      notes: this.notes ?? null,
      completed: this.completed,
      crossDesignId: this.crossDesignId,
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
  strain1: Strain,
  strain2?: Strain
): Map<string, Condition> => {
  const conditions = new Map<string, Condition>();

  [
    ...strain1.chromPairMap.values(),
    ...(strain2?.chromPairMap.values() ?? []),
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
