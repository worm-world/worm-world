import { describe, expect, test } from 'vitest';
import { Allele } from 'models/frontend/Allele/Allele';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';

describe('Allele', () => {
  test('(De)serializes', () => {
    const str = mockAlleles.ed3.toJSON();
    const ed3Back = Allele.fromJSON(str);
    expect(ed3Back).toEqual(mockAlleles.ed3);
    expect(ed3Back.toJSON).toBeDefined();

    // Check nested objects
    expect(ed3Back.gene?.toJSON).toBeDefined();
  });
});
