import { Condition } from 'models/frontend/Condition/Condition';
import { expect, test, describe } from 'vitest';
describe('Condition', () => {
  test('should be able to serialize and deserialize', () => {
    const cond = new Condition({
      name: 'cond',
      description: 'sample desc',
      maleMating: 3,
      lethal: false,
      femaleSterile: true,
      arrested: false,
      maturationDays: 2,
    });
    const str = cond.toJSON();
    const condBack = Condition.fromJSON(str);
    expect(condBack).toEqual(cond);
  });
});
