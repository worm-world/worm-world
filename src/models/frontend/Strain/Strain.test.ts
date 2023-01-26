import { WILD_ALLELE } from 'models/frontend/Allele/Allele';
import {
  cn64,
  e204,
  e873,
  ed3,
  jsSi1949,
  ox11000,
  ox802,
  oxSi1168,
  oxTi302,
  oxTi75,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain, StrainOption } from 'models/frontend/Strain/Strain';
import {
  HeterozygousCross,
  HomoHetCross,
  HomoHetSelfCross,
  HomoWildCross,
  HomozygousCross,
  SelfCross2,
} from 'models/frontend/Strain/Strain.mock';
import { expect, test, describe } from 'vitest';

const PRECISION = 6;

describe('strain', () => {
  test('.equals() returns true for strains with homozygous pairs', () => {
    const allelePairs: AllelePair[] = [new AllelePair(e204, e204)];
    const strain1 = new Strain({ allelePairs });
    const strain2 = new Strain({ allelePairs });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for strains with heterozygous pairs', () => {
    const pairs1: AllelePair[] = [new AllelePair(e204, WILD_ALLELE)];
    const pairs2: AllelePair[] = [new AllelePair(WILD_ALLELE, e204)];
    const strain1 = new Strain({ allelePairs: pairs1 });
    const strain2 = new Strain({ allelePairs: pairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for complex, multi-chromosomal strains', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(WILD_ALLELE, jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(WILD_ALLELE, cn64),
      new AllelePair(WILD_ALLELE, oxSi1168),
      // Chromosome III
      new AllelePair(ox802, WILD_ALLELE),
      new AllelePair(ox11000, ox11000),
      new AllelePair(e873, WILD_ALLELE),
      new AllelePair(ed3, ed3),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: [...strainPairs1] });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for complex strains with flipped chromatids', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(WILD_ALLELE, jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(WILD_ALLELE, cn64),
      new AllelePair(WILD_ALLELE, oxSi1168),
      // Chromosome III
      new AllelePair(ox802, WILD_ALLELE),
      new AllelePair(ox11000, ox11000),
      new AllelePair(e873, WILD_ALLELE),
      new AllelePair(ed3, ed3),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(jsSi1949, WILD_ALLELE), // note the flip here
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(cn64, WILD_ALLELE),
      new AllelePair(oxSi1168, WILD_ALLELE),
      // Chromosome III
      new AllelePair(WILD_ALLELE, ox802),
      new AllelePair(ox11000, ox11000),
      new AllelePair(WILD_ALLELE, e873),
      new AllelePair(ed3, ed3),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns false for strains with different homozygous pairs', () => {
    const strain1Pairs: AllelePair[] = [new AllelePair(e204, e204)];
    const strain2Pairs: AllelePair[] = [new AllelePair(ox802, ox802)];
    const strain1 = new Strain({ allelePairs: strain1Pairs });
    const strain2 = new Strain({ allelePairs: strain2Pairs });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });
  test('.equals() returns false for strains with inconsistently flipped pairs in same chromosome', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(WILD_ALLELE, jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(WILD_ALLELE, cn64),
      new AllelePair(WILD_ALLELE, oxSi1168),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(WILD_ALLELE, jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(cn64, WILD_ALLELE), // flipped this pair, without flipping the next pair
      new AllelePair(WILD_ALLELE, oxSi1168),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });

  test('.clone() creates new instance', () => {
    const allelePairs: AllelePair[] = [new AllelePair(e204, e204)];
    const strain = new Strain({ allelePairs });
    const clone = strain.clone();

    expect(strain).not.toEqual(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });
  test('.clone() creates new instance from complex strain', () => {
    const pairs: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(WILD_ALLELE, jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(WILD_ALLELE, cn64),
      new AllelePair(WILD_ALLELE, oxSi1168),
      // Chromosome III
      new AllelePair(ox802, WILD_ALLELE),
      new AllelePair(ox11000, ox11000),
      new AllelePair(e873, WILD_ALLELE),
      new AllelePair(ed3, ed3),
    ];
    const strain = new Strain({ allelePairs: pairs });
    const clone = strain.clone();

    expect(strain).not.toEqual(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });
});

describe('cross algorithm', () => {
  const printCrossResults = (crossResult: StrainOption[]): void => {
    crossResult.forEach((strain, idx) =>
      console.log(
        `Strain ${idx}  --  Prob: ${strain.prob}\n${strain.strain.toString()}\n`
      )
    );
  };

  const testStrainResults = (
    crossStrains: StrainOption[],
    expectedStrains: StrainOption[]
  ): void => {
    expect(crossStrains).toHaveLength(expectedStrains.length);

    for (let i = 0; i < crossStrains.length; i++) {
      const expected = expectedStrains[i];
      const result = crossStrains[i];
      expect(expected.strain.equals(result.strain)).toBe(true);
      expect(result.prob).toBeCloseTo(expected.prob, PRECISION);
    }
  };

  test('cross between homozygous and wild strain', () => {
    const homoPairs: AllelePair[] = [new AllelePair(e204, e204)];
    const wildPairs: AllelePair[] = [new AllelePair(WILD_ALLELE, WILD_ALLELE)];

    const homoStrain = new Strain({ allelePairs: homoPairs });
    const wildStrain = new Strain({ allelePairs: wildPairs });
    const crossStrains = homoStrain.crossWith(wildStrain);
    testStrainResults(crossStrains, HomoWildCross);
  });

  test('cross of homozygous and heterozygous strains', () => {
    const hetPairs: AllelePair[] = [new AllelePair(e204, WILD_ALLELE)];
    const homoPairs: AllelePair[] = [new AllelePair(ox802, ox802)];

    const hetStrain = new Strain({ allelePairs: hetPairs });
    const homoStrain = new Strain({ allelePairs: homoPairs });
    const crossStrains = homoStrain.crossWith(hetStrain);
    testStrainResults(crossStrains, HomoHetCross);
  });

  test('self cross of homozygous pair returns same child strain', () => {
    const allelePairs: AllelePair[] = [new AllelePair(e204, e204)];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, HomozygousCross);
  });

  test('self cross of heterozygous pair returns correct strains', () => {
    const allelePairs: AllelePair[] = [new AllelePair(e204, WILD_ALLELE)];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, HeterozygousCross);
  });

  test('self cross of chromosome with homozygous and heterozygous pairs', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair(e204, e204),
      new AllelePair(WILD_ALLELE, ox802),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, HomoHetSelfCross);
  });

  test('intermediate self cross', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(WILD_ALLELE, ox802),
    ];

    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, SelfCross2);
  });
});
