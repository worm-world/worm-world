import { Variation } from 'models/frontend/Variation/Variation';
import { expect, test, describe } from 'vitest';
describe('Variation', () => {
  test('should be able to serialize and deserialize', () => {
    const vi = new Variation({
      name: 'myVI',
      chromosome: 'I',
      physLoc: 0,
      geneticLoc: 3,
    });
    const str = vi.toJSON();
    const viBack = Variation.fromJSON(str);
    expect(viBack).toEqual(vi);
  });
});
