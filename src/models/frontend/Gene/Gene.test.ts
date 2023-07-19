import { describe, expect, test } from 'vitest';
import { Gene } from 'models/frontend/Gene/Gene';
import * as genes from 'models/frontend/Gene/Gene.mock';

describe('Gene', () => {
  test('(De)serializes', () => {
    const str = genes.unc119.toJSON();
    const unc119Back = Gene.fromJSON(str);
    expect(unc119Back).toEqual(genes.unc119);
    expect(unc119Back.equals).toBeDefined();
  });
});
