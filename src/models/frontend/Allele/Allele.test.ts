import { describe, expect, test } from 'vitest';
import { Allele } from './Allele';
import { ed3 } from './Allele.mock';

describe('Allele', () => {
  test('should be able to (de)serialize', () => {
    const str = ed3.toJSON();
    const ed3Back = Allele.fromJSON(str);
    expect(ed3Back.generateRecord()).toEqual(ed3.generateRecord());
  });
});
