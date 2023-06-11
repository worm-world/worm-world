import { describe, expect, test } from 'vitest';
import { Allele } from 'models/frontend/Allele/Allele';
import { ed3 } from 'models/frontend/Allele/Allele.mock';

describe('Allele', () => {
  test('should be able to (de)serialize', () => {
    const str = ed3.toJSON();
    const ed3Back = Allele.fromJSON(str);
    expect(ed3Back).toEqual(ed3);
  });
});
