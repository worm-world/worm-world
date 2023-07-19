import { expect, test, describe } from 'vitest';
import { Task } from 'models/frontend/Task/Task';
import { TaskCondition } from 'models/frontend/Task/TaskCondition';
import { TaskDependency } from 'models/frontend/Task/TaskDependency';
import * as strains from 'models/frontend/Strain/Strain.mock';

describe('Task', () => {
  test('(De)serializes', () => {
    const task = new Task({
      id: '0',
      dueDate: null,
      action: 'SelfCross',
      strain1: strains.wildManyPairs.toMale().toJSON(),
      strain2: null,
      result: null,
      notes: null,
      completed: false,
      crossDesignId: '3',
    });
    const str = task.toJSON();
    const taskBack = Task.fromJSON(str);
    expect(taskBack).toEqual(task);
    expect(taskBack.toJSON).toBeDefined();
  });
});

describe('TaskDependency', () => {
  test('should be able to serialize and deserialize', () => {
    const taskDep = new TaskDependency({
      parentId: '0',
      childId: '1',
    });
    const str = taskDep.toJSON();
    const taskDepBack = TaskDependency.fromJSON(str);
    expect(taskDepBack).toEqual(taskDep);
  });
});

describe('TaskCondition', () => {
  test('should be able to serialize and deserialize', () => {
    const taskCond = new TaskCondition({
      parentId: '0',
      name: '1',
    });
    const str = taskCond.toJSON();
    const taskCondBack = TaskCondition.fromJSON(str);
    expect(taskCondBack).toEqual(taskCond);
  });
});
