import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain, type StrainOption } from 'models/frontend/Strain/Strain';
import * as mockStrains from 'models/frontend/Strain/Strain.mock';
import { expect, test, describe } from 'vitest';

const PRECISION = 6;

describe('strain', () => {
  test('.equals() returns true for strains with homozygous pairs', () => {
    const allelePairs: AllelePair[] = [mockAlleles.e204.toHomoPair()];
    const strain1 = new Strain({ allelePairs });
    const strain2 = new Strain({ allelePairs });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns true for strains with heterozygous pairs', () => {
    const pairs1: AllelePair[] = [mockAlleles.e204.toTopHetPair()];
    const pairs2: AllelePair[] = [mockAlleles.e204.toBotHetPair()];
    const strain1 = new Strain({ allelePairs: pairs1 });
    const strain2 = new Strain({ allelePairs: pairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns true for complex, multi-chromosomal strains', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      mockAlleles.oxTi302.toHomoPair(),
      mockAlleles.jsSi1949.toBotHetPair(),
      // Chromosome II
      mockAlleles.oxTi75.toHomoPair(),
      mockAlleles.cn64.toBotHetPair(),
      mockAlleles.oxSi1168.toBotHetPair(),
      // Chromosome III
      mockAlleles.ox802.toTopHetPair(),
      mockAlleles.ox11000.toHomoPair(),
      mockAlleles.e873.toTopHetPair(),
      mockAlleles.ed3.toHomoPair(),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: [...strainPairs1] });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns true for complex strains with flipped chromatids', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      mockAlleles.oxTi302.toHomoPair(),
      mockAlleles.jsSi1949.toBotHetPair(),
      // Chromosome II
      mockAlleles.oxTi75.toHomoPair(),
      mockAlleles.cn64.toBotHetPair(),
      mockAlleles.oxSi1168.toBotHetPair(),
      // Chromosome III
      mockAlleles.ox802.toTopHetPair(),
      mockAlleles.ox11000.toHomoPair(),
      mockAlleles.e873.toTopHetPair(),
      mockAlleles.ed3.toHomoPair(),
    ];

    const strainPairs2: AllelePair[] = [
      // Chromosome I
      mockAlleles.oxTi302.toHomoPair(),
      mockAlleles.jsSi1949.toTopHetPair(), // note the flip here
      // Chromosome II
      mockAlleles.oxTi75.toHomoPair(),
      mockAlleles.cn64.toTopHetPair(),
      mockAlleles.oxSi1168.toTopHetPair(),
      // Chromosome III
      mockAlleles.ox802.toBotHetPair(),
      mockAlleles.ox11000.toHomoPair(),
      mockAlleles.e873.toBotHetPair(),
      mockAlleles.ed3.toHomoPair(),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns false for strains with different homozygous pairs', () => {
    const strain1Pairs: AllelePair[] = [mockAlleles.e204.toHomoPair()];
    const strain2Pairs: AllelePair[] = [mockAlleles.ox802.toHomoPair()];
    const strain1 = new Strain({ allelePairs: strain1Pairs });
    const strain2 = new Strain({ allelePairs: strain2Pairs });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });

  test('.equals() returns false for strains with inconsistently flipped pairs in same chromosome', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      mockAlleles.oxTi302.toHomoPair(),
      mockAlleles.jsSi1949.toBotHetPair(),
      // Chromosome II
      mockAlleles.oxTi75.toHomoPair(),
      mockAlleles.cn64.toBotHetPair(),
      mockAlleles.oxSi1168.toBotHetPair(),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      mockAlleles.oxTi302.toHomoPair(),
      mockAlleles.jsSi1949.toBotHetPair(),
      // Chromosome II
      mockAlleles.oxTi75.toHomoPair(),
      mockAlleles.cn64.toTopHetPair(), // flipped this pair, without flipping the next pair
      mockAlleles.oxSi1168.toBotHetPair(),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });

  test('.clone() creates new instance', () => {
    const allelePairs: AllelePair[] = [mockAlleles.e204.toHomoPair()];
    const strain = new Strain({ allelePairs });
    const clone = strain.clone();

    expect(strain).not.toBe(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });

  test('.clone() creates new instance from complex strain', () => {
    const pairs: AllelePair[] = [
      // Chromosome I
      mockAlleles.oxTi302.toHomoPair(),
      mockAlleles.jsSi1949.toBotHetPair(),
      // Chromosome II
      mockAlleles.oxTi75.toHomoPair(),
      mockAlleles.cn64.toBotHetPair(),
      mockAlleles.oxSi1168.toBotHetPair(),
      // Chromosome III
      mockAlleles.ox802.toTopHetPair(),
      mockAlleles.ox11000.toHomoPair(),
      mockAlleles.e873.toTopHetPair(),
      mockAlleles.ed3.toHomoPair(),
    ];
    const strain = new Strain({ allelePairs: pairs });
    const clone = strain.clone();

    expect(strain).not.toBe(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });

  test('prepWithWilds() fills nothing when appropriate', () => {
    const before = new Strain({
      allelePairs: [mockAlleles.ed3.toTopHetPair()],
    });

    const after = before.clone();
    after.prepWithWilds(before);

    expect(before).toEqual(after);
  });

  test('prepWithWilds() fills gaps', () => {
    const strain1 = new Strain({
      allelePairs: [mockAlleles.ed3.toTopHetPair()],
    });

    const strain2 = new Strain({
      allelePairs: [mockAlleles.md299.toTopHetPair()],
    });

    strain1.prepWithWilds(strain2);

    const expected = new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.md299.getWild().toHomoPair(),
      ],
    });

    expect(strain1.equals(expected)).toBe(true);
  });
});

describe('cross algorithm', () => {
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
    const homoPairs: AllelePair[] = [mockAlleles.e204.toHomoPair()];
    const wildPairs: AllelePair[] = [mockAlleles.e204.getWild().toHomoPair()];

    const homoStrain = new Strain({ allelePairs: homoPairs });
    const wildStrain = new Strain({ allelePairs: wildPairs });
    const crossStrains = homoStrain.crossWith(wildStrain);
    testStrainResults(crossStrains, mockStrains.homoWildCross);
  });

  test('cross of homozygous and heterozygous strains', () => {
    const hetPairs: AllelePair[] = [mockAlleles.e204.toTopHetPair()];
    const homoPairs: AllelePair[] = [mockAlleles.ox802.toHomoPair()];

    const hetStrain = new Strain({ allelePairs: hetPairs });
    const homoStrain = new Strain({ allelePairs: homoPairs });
    const crossStrains = homoStrain.crossWith(hetStrain);
    testStrainResults(crossStrains, mockStrains.homoHetCross);
  });

  test('self cross of homozygous pair returns same child strain', () => {
    const allelePairs: AllelePair[] = [mockAlleles.e204.toHomoPair()];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, mockStrains.homozygousCross);
  });

  test('self cross of heterozygous pair returns correct strains', () => {
    const allelePairs: AllelePair[] = [mockAlleles.e204.toTopHetPair()];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, mockStrains.heterozygousCross);
  });

  test('self cross of chromosome with homozygous and heterozygous pairs', () => {
    const allelePairs: AllelePair[] = [
      mockAlleles.e204.toHomoPair(),
      mockAlleles.ox802.toBotHetPair(),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, mockStrains.homoHetSelfCross);
  });

  test('intermediate self cross on single chromosome', () => {
    const allelePairs: AllelePair[] = [
      mockAlleles.e204.toTopHetPair(),
      mockAlleles.ox802.toBotHetPair(),
    ];

    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, mockStrains.intermediateSelfCross);
  });

  test('simple self cross of het alleles on different chromosomes', () => {
    const allelePairs: AllelePair[] = [
      mockAlleles.ed3.toTopHetPair(), // chrom III
      mockAlleles.md299.toTopHetPair(), // chrom X
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();
    testStrainResults(crossStrains, mockStrains.difChromSimpleSelfCross);
  });

  test('advanced self-cross on multiple chromosomes', () => {
    const allelePairs: AllelePair[] = [
      // chrom II
      mockAlleles.cn64.toTopHetPair(),
      mockAlleles.oxTi75.toTopHetPair(),
      // chrom III
      mockAlleles.ed3.toTopHetPair(),
      // chrom IV
      mockAlleles.e53.toHomoPair(),
      mockAlleles.e204.toTopHetPair(),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = strain.selfCross();

    expect(crossStrains.length).toBe(90);

    const probSum = crossStrains.reduce((prev, curr) => prev + curr.prob, 0);
    expect(probSum).toBeCloseTo(1.0);

    // test first 28 strains for correctness
    testStrainResults(
      crossStrains.slice(0, mockStrains.partialAdvancedSelfCross.length),
      mockStrains.partialAdvancedSelfCross
    );
  });

  test('cross on multiple chromosomes', () => {
    const allelePairs1: AllelePair[] = [
      // chrom II
      mockAlleles.oxTi75.toTopHetPair(),
      mockAlleles.cn64.toTopHetPair(),
      // chrom IV
      mockAlleles.ox802.toTopHetPair(),
    ];
    const allelePairs2: AllelePair[] = [
      // chrom III
      mockAlleles.ox11000.toHomoPair(),
      // chrom IV
      mockAlleles.e53.toHomoPair(),
      mockAlleles.e204.toTopHetPair(),
    ];
    const strain1 = new Strain({ allelePairs: allelePairs1 });
    const strain2 = new Strain({ allelePairs: allelePairs2 });
    const crossStrains = strain1.crossWith(strain2);

    testStrainResults(crossStrains, mockStrains.intermediateCross);
  });

  test('ECA cross', () => {
    const allelePairs1: AllelePair[] = [
      new AllelePair({
        top: mockAlleles.oxEx2254,
        bot: mockAlleles.oxEx2254.getWild(),
        isEca: true,
      }),
      new AllelePair({
        top: mockAlleles.oxEx219999,
        bot: mockAlleles.oxEx219999.getWild(),
        isEca: true,
      }),
    ];
    const allelePairs2: AllelePair[] = [
      new AllelePair({
        top: mockAlleles.oxEx2254,
        bot: mockAlleles.oxEx2254.getWild(),
        isEca: true,
      }),
    ];
    const strain1 = new Strain({ allelePairs: allelePairs1 });
    const strain2 = new Strain({ allelePairs: allelePairs2 });
    const crossStrains = strain1.crossWith(strain2);

    testStrainResults(crossStrains, mockStrains.ecaCross);
  });

  it('should output a single child for wild-wild crosses', () => {
    const wildStrain1 = new Strain({ allelePairs: [] });
    const wildStrain2 = wildStrain1.clone();
    const selfCrossStrains = wildStrain1.selfCross();
    const wildToWildCrossStrains = wildStrain1.crossWith(wildStrain2);

    testStrainResults(selfCrossStrains, mockStrains.wildToWildCross);
    testStrainResults(wildToWildCrossStrains, mockStrains.wildToWildCross);
  });

  it('should be able to serialize and deserialize', () => {
    const allelePairs1: AllelePair[] = [
      // chrom II
      mockAlleles.oxTi75.toTopHetPair(),
      mockAlleles.cn64.toTopHetPair(),
      // chrom IV
      mockAlleles.ox802.toTopHetPair(),
    ];
    const strain1 = new Strain({ allelePairs: allelePairs1 });
    const str = strain1.toJSON();
    const strain1Back = Strain.fromJSON(str);
    expect(strain1Back).toEqual(strain1);
  });
});
