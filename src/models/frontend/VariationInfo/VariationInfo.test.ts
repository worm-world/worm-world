import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import { expect, test, describe } from 'vitest';
describe('VariationInfo', () => {
  test('should be able to serialize and deserialize', () => {
    const vi = new VariationInfo({
      name: 'myVI',
      chromosome: 'I',
      physLoc: 0,
      geneticLoc: 3,
    });
    const str = vi.toJSON();
    const viBack = VariationInfo.fromJSON(str);
    expect(viBack).toEqual(vi);
  });
});
