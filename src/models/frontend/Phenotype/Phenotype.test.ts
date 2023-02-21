import { Phenotype } from 'models/frontend/Phenotype/Phenotype';
import { expect, test, describe } from 'vitest';
describe('Phenotype', () => {
  test('should be able to serialize and deserialize', async () => {
    const phenotype = new Phenotype({
      name: 'phen1',
      shortName: '1',
      wild: false,
      description: 'sample desc',
      maleMating: 9,
      lethal: false,
      femaleSterile: true,
      arrested: false,
      maturationDays: 4,
    });
    const str = phenotype.toJSON();
    const phenotypeBack = Phenotype.fromJSON(str);

    expect(phenotypeBack.toJSON()).toEqual(str);
  });
});
