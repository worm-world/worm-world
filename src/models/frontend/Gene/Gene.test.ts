import { describe, expect, test } from 'vitest';
import { Gene } from './Gene';
import { unc119 } from './Gene.mock';

describe('Gene', () => {
  test('should be able to serialize and deserialize', () => {
    const str = unc119.toJSON();
    const unc119Back = Gene.fromJSON(str);
    expect(unc119Back).toEqual(unc119);
  });
});
