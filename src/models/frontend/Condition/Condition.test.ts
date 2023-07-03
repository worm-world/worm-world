import { Condition } from 'models/frontend/Condition/Condition';
import { expect, test, describe } from 'vitest';
import * as mockConditions from 'models/frontend/Condition/Condition.mock';

describe('Condition', () => {
  test('(De)serializes', () => {
    const str = mockConditions.cond25C.toJSON();
    const condBack = Condition.fromJSON(str);
    expect(condBack).toEqual(mockConditions.cond25C);
  });
});
