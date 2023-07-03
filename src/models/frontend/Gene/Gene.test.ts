import { describe, expect, test } from 'vitest';
import { Gene } from 'models/frontend/Gene/Gene';
import * as mockGenes from 'models/frontend/Gene/Gene.mock';

describe('Gene', () => {
  test('(De)serializes', () => {
    const str = mockGenes.unc119.toJSON();
    const unc119Back = Gene.fromJSON(str);
    expect(unc119Back).toEqual(mockGenes.unc119);
    expect(unc119Back.equals).toBeDefined();
  });
});
