import { Variation } from 'models/frontend/Variation/Variation';
import { expect, test, describe } from 'vitest';
import * as variations from 'models/frontend/Variation/Variation.mock';

describe('Variation', () => {
  test('(De)serializes', () => {
    const str = variations.oxIs12.toJSON();
    const oxIs12Back = Variation.fromJSON(str);
    expect(oxIs12Back).toEqual(variations.oxIs12);
    expect(oxIs12Back.toJSON).toBeDefined();
  });
});
