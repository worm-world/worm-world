import { WildAllele, WILD_ALLELE } from 'models/frontend/Allele/Allele';
import {
  cn64,
  e204,
  e53,
  e873,
  ed3,
  jsSi1949,
  md299,
  ox11000,
  ox802,
  oxSi1168,
  oxTi302,
  oxTi75,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain, StrainOption } from 'models/frontend/Strain/Strain';
import {
  DifChromSimpleSelfCross,
  HeterozygousCross,
  HomoHetCross,
  HomoHetSelfCross,
  HomoWildCross,
  HomozygousCross,
  PartialAdvancedSelfCross,
  ItermediateSelfCross,
  IntermediateCross,
} from 'models/frontend/Strain/Strain.mock';
import { expect, test, describe } from 'vitest';

const PRECISION = 6;

describe('strain', () => {
  test('.equals() returns true for strains with homozygous pairs', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: e204 }),
    ];
    const strain1 = new Strain({ allelePairs });
    const strain2 = new Strain({ allelePairs });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for strains with heterozygous pairs', () => {
    const pairs1: AllelePair[] = [
      new AllelePair({ top: e204, bot: WILD_ALLELE }),
    ];
    const pairs2: AllelePair[] = [
      new AllelePair({ top: WILD_ALLELE, bot: e204 }),
    ];
    const strain1 = new Strain({ allelePairs: pairs1 });
    const strain2 = new Strain({ allelePairs: pairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for complex, multi-chromosomal strains', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      new AllelePair({ top: oxTi302, bot: oxTi302 }),
      new AllelePair({ top: WILD_ALLELE, bot: jsSi1949 }),
      // Chromosome II
      new AllelePair({ top: oxTi75, bot: oxTi75 }),
      new AllelePair({ top: WILD_ALLELE, bot: cn64 }),
      new AllelePair({ top: WILD_ALLELE, bot: oxSi1168 }),
      // Chromosome III
      new AllelePair({ top: ox802, bot: WILD_ALLELE }),
      new AllelePair({ top: ox11000, bot: ox11000 }),
      new AllelePair({ top: e873, bot: WILD_ALLELE }),
      new AllelePair({ top: ed3, bot: ed3 }),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: [...strainPairs1] });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for complex strains with flipped chromatids', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      new AllelePair({ top: oxTi302, bot: oxTi302 }),
      new AllelePair({ top: WILD_ALLELE, bot: jsSi1949 }),
      // Chromosome II
      new AllelePair({ top: oxTi75, bot: oxTi75 }),
      new AllelePair({ top: WILD_ALLELE, bot: cn64 }),
      new AllelePair({ top: WILD_ALLELE, bot: oxSi1168 }),
      // Chromosome III
      new AllelePair({ top: ox802, bot: WILD_ALLELE }),
      new AllelePair({ top: ox11000, bot: ox11000 }),
      new AllelePair({ top: e873, bot: WILD_ALLELE }),
      new AllelePair({ top: ed3, bot: ed3 }),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      new AllelePair({ top: oxTi302, bot: oxTi302 }),
      new AllelePair({ top: jsSi1949, bot: WILD_ALLELE }), // note the flip here
      // Chromosome II
      new AllelePair({ top: oxTi75, bot: oxTi75 }),
      new AllelePair({ top: cn64, bot: WILD_ALLELE }),
      new AllelePair({ top: oxSi1168, bot: WILD_ALLELE }),
      // Chromosome III
      new AllelePair({ top: WILD_ALLELE, bot: ox802 }),
      new AllelePair({ top: ox11000, bot: ox11000 }),
      new AllelePair({ top: WILD_ALLELE, bot: e873 }),
      new AllelePair({ top: ed3, bot: ed3 }),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns false for strains with different homozygous pairs', () => {
    const strain1Pairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: e204 }),
    ];
    const strain2Pairs: AllelePair[] = [
      new AllelePair({ top: ox802, bot: ox802 }),
    ];
    const strain1 = new Strain({ allelePairs: strain1Pairs });
    const strain2 = new Strain({ allelePairs: strain2Pairs });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });
  test('.equals() returns false for strains with inconsistently flipped pairs in same chromosome', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      new AllelePair({ top: oxTi302, bot: oxTi302 }),
      new AllelePair({ top: WILD_ALLELE, bot: jsSi1949 }),
      // Chromosome II
      new AllelePair({ top: oxTi75, bot: oxTi75 }),
      new AllelePair({ top: WILD_ALLELE, bot: cn64 }),
      new AllelePair({ top: WILD_ALLELE, bot: oxSi1168 }),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      new AllelePair({ top: oxTi302, bot: oxTi302 }),
      new AllelePair({ top: WILD_ALLELE, bot: jsSi1949 }),
      // Chromosome II
      new AllelePair({ top: oxTi75, bot: oxTi75 }),
      new AllelePair({ top: cn64, bot: WILD_ALLELE }), // flipped this pair, without flipping the next pair
      new AllelePair({ top: WILD_ALLELE, bot: oxSi1168 }),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });

  test('.clone() creates new instance', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: e204 }),
    ];
    const strain = new Strain({ allelePairs });
    const clone = strain.clone();

    expect(strain).not.toEqual(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });
  test('.clone() creates new instance from complex strain', () => {
    const pairs: AllelePair[] = [
      // Chromosome I
      new AllelePair({ top: oxTi302, bot: oxTi302 }),
      new AllelePair({ top: WILD_ALLELE, bot: jsSi1949 }),
      // Chromosome II
      new AllelePair({ top: oxTi75, bot: oxTi75 }),
      new AllelePair({ top: WILD_ALLELE, bot: cn64 }),
      new AllelePair({ top: WILD_ALLELE, bot: oxSi1168 }),
      // Chromosome III
      new AllelePair({ top: ox802, bot: WILD_ALLELE }),
      new AllelePair({ top: ox11000, bot: ox11000 }),
      new AllelePair({ top: e873, bot: WILD_ALLELE }),
      new AllelePair({ top: ed3, bot: ed3 }),
    ];
    const strain = new Strain({ allelePairs: pairs });
    const clone = strain.clone();

    expect(strain).not.toEqual(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });
});

describe('cross algorithm', () => {
  // const printCrossResults = (crossResult: StrainOption[]): void => {
  //   crossResult.forEach((strain, idx) =>
  //     console.log(
  //       `Strain ${idx}  --  Prob: ${strain.prob}\n${strain.strain.toString()}\n`
  //     )
  //   );
  // };

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
    const homoPairs: AllelePair[] = [new AllelePair({ top: e204, bot: e204 })];
    const wildPairs: AllelePair[] = [
      new AllelePair({ top: new WildAllele(e204), bot: new WildAllele(e204) }),
    ];

    const homoStrain = new Strain({ allelePairs: homoPairs });
    const wildStrain = new Strain({ allelePairs: wildPairs });
    const crossStrains = homoStrain.crossWith(wildStrain);
    testStrainResults(crossStrains, HomoWildCross);
  });

  test('cross of homozygous and heterozygous strains', () => {
    const hetPairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: WILD_ALLELE }),
    ];
    const homoPairs: AllelePair[] = [
      new AllelePair({ top: ox802, bot: ox802 }),
    ];

    const hetStrain = new Strain({ allelePairs: hetPairs });
    const homoStrain = new Strain({ allelePairs: homoPairs });
    const crossStrains = homoStrain.crossWith(hetStrain);
    testStrainResults(crossStrains, HomoHetCross);
  });

  test('self cross of homozygous pair returns same child strain', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: e204 }),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, HomozygousCross);
  });

  test('self cross of heterozygous pair returns correct strains', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: WILD_ALLELE }),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, HeterozygousCross);
  });

  test('self cross of chromosome with homozygous and heterozygous pairs', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: e204 }),
      new AllelePair({ top: WILD_ALLELE, bot: ox802 }),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, HomoHetSelfCross);
  });

  test('intermediate self cross on single chromosome', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair({ top: e204, bot: WILD_ALLELE }),
      new AllelePair({ top: WILD_ALLELE, bot: ox802 }),
    ];

    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, ItermediateSelfCross);
  });

  test('simple self cross of het alleles on different chromosomes', () => {
    const allelePairs: AllelePair[] = [
      new AllelePair({ top: ed3, bot: new WildAllele(ed3) }), // chrom III
      new AllelePair({ top: md299, bot: new WildAllele(md299) }), // chrom X
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, DifChromSimpleSelfCross);
  });

  test('advanced self cross on multiple chromosomes', () => {
    const allelePairs: AllelePair[] = [
      // chrom II
      new AllelePair({ top: cn64, bot: WILD_ALLELE }),
      new AllelePair({ top: oxTi75, bot: WILD_ALLELE }),
      // chrom III
      new AllelePair({ top: ed3, bot: WILD_ALLELE }),
      // chrom IV
      new AllelePair({ top: e53, bot: e53 }),
      new AllelePair({ top: e204, bot: WILD_ALLELE }),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();

    expect(crossStrains.length).toBe(90);

    const probSum = crossStrains.reduce((prev, curr) => prev + curr.prob, 0);
    expect(probSum).toBeCloseTo(1.0);

    // test first 28 strains for correctness
    testStrainResults(
      crossStrains.slice(0, PartialAdvancedSelfCross.length),
      PartialAdvancedSelfCross
    );
  });

  test('cross on multiple chromosomes', () => {
    const allelePairs1: AllelePair[] = [
      // chrom II
      new AllelePair({ top: oxTi75, bot: new WildAllele(oxTi75) }),
      new AllelePair({ top: cn64, bot: new WildAllele(cn64) }),
      // chrom IV
      new AllelePair({ top: ox802, bot: new WildAllele(ox802) }),
    ];
    const allelePairs2: AllelePair[] = [
      // chrom III
      new AllelePair({ top: ox11000, bot: ox11000 }),
      // chrom IV
      new AllelePair({ top: e53, bot: e53 }),
      new AllelePair({ top: e204, bot: new WildAllele(e204) }),
    ];
    const strain1 = new Strain({ allelePairs: allelePairs1 });
    const strain2 = new Strain({ allelePairs: allelePairs2 });
    const crossStrains = strain1.crossWith(strain2);

    testStrainResults(crossStrains, IntermediateCross);
  });
});