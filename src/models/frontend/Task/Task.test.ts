import { TaskCondition } from './TaskCondition';
import { TaskDependency } from './TaskDependency';

describe('TaskDependency', () => {
  it('should be able to serialize and deserialize', () => {
    const taskDep = new TaskDependency({
      parentId: 'abcdefg',
      childId: 'djdhsjsj',
    });
    const str = taskDep.toJSON();
    const taskDepBack = TaskDependency.fromJSON(str);
    expect(taskDepBack).toEqual(taskDep);
  });
});

describe('TaskCondition', () => {
  it('should be able to serialize and deserialize', () => {
    const taskCond = new TaskCondition({
      parentId: 'abcdefg',
      name: 'name',
    });
    const str = taskCond.toJSON();
    const taskCondBack = TaskCondition.fromJSON(str);
    expect(taskCondBack).toEqual(taskCond);
  });
});
