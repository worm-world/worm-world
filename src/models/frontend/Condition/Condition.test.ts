import { Condition } from 'models/frontend/Condition/Condition';
import { expect, test, describe } from 'vitest';
import * as conditions from 'models/frontend/Condition/Condition.mock';

describe('Condition', () => {
  test('(De)serializes', () => {
    const str = conditions.cond25C.toJSON();
    const condBack = Condition.fromJSON(str);
    expect(condBack).toEqual(conditions.cond25C);
  });
});
