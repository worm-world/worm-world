import { Variation } from 'models/frontend/Variation/Variation';
import { expect, test, describe } from 'vitest';
import * as mockVariations from 'models/frontend/Variation/Variation.mock';

describe('Variation', () => {
  test('(De)serializes', () => {
    const str = mockVariations.oxIs12.toJSON();
    const oxIs12Back = Variation.fromJSON(str);
    expect(oxIs12Back).toEqual(mockVariations.oxIs12);
    expect(oxIs12Back.toJSON).toBeDefined();
  });
});
