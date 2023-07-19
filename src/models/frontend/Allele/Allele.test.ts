import { describe, expect, test } from 'vitest';
import { Allele } from 'models/frontend/Allele/Allele';
import * as alleles from 'models/frontend/Allele/Allele.mock';

describe('Allele', () => {
  test('(De)serializes', () => {
    const str = alleles.ed3.toJSON();
    const ed3Back = Allele.fromJSON(str);
    expect(ed3Back).toEqual(alleles.ed3);
    expect(ed3Back.toJSON).toBeDefined();

    // Check nested objects
    expect(ed3Back.gene?.toJSON).toBeDefined();
  });
});
