import { describe, expect } from 'vitest';
import { Gene } from './Gene';
import { unc119 } from './Gene.mock';

describe('Gene', () => {
  it('should be able to serialize and deserialize', () => {
    const str = unc119.toJSON();
    const unc119Back = Gene.fromJSON(str);
    expect(unc119Back.generateRecord()).toEqual(unc119.generateRecord());
  });
});
