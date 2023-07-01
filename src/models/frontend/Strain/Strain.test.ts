import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import {
  Strain,
  type GameteOption,
  type StrainOption,
} from 'models/frontend/Strain/Strain';
import * as mockStrains from 'models/frontend/Strain/Strain.mock';
import { expect, test, describe } from 'vitest';
import { chromsEqual } from 'models/frontend/ChromosomePair/ChromosomePair';

const PRECISION = 6;

function testGameteOptions(
  actualOpts: GameteOption[],
  expectedOpts: GameteOption[]
): void {
  expect(actualOpts).toHaveLength(expectedOpts.length);

  for (let i = 0; i < actualOpts.length; i++) {
    const expected = expectedOpts[i];
    const actual = actualOpts[i];
    expect(
      actual.chromosomes.every((actualChrom, idx) => {
        return chromsEqual(actualChrom, expected.chromosomes[idx]);
      })
    ).toBe(true);
    expect(actual.prob).toBeCloseTo(expected.prob, PRECISION);
  }
}

function testStrainOptions(
  actualOpts: StrainOption[],
  expectedOpts: StrainOption[]
): void {
  expect(actualOpts).toHaveLength(expectedOpts.length);

  for (let i = 0; i < actualOpts.length; i++) {
    const expected = expectedOpts[i];
    const actual = actualOpts[i];
    expect(actual.strain.equals(expected.strain)).toBe(true);
    expect(actual.prob).toBeCloseTo(expected.prob, PRECISION);
  }
}

beforeEach(() => {
  mockIPC((cmd, _) => {
    if (cmd === 'get_filtered_strain_alleles') return [];
  });
});

afterAll(() => {
  clearMocks();
});

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
      mockAlleles.e873.toTopHetPair(),
      mockAlleles.ed3.toHomoPair(),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: [...strainPairs1] });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns true for complex strains with flipped chroms', () => {
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
    const strain = new Strain({ allelePairs: [mockAlleles.e204.toHomoPair()] });
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
      mockAlleles.e873.toTopHetPair(),
      mockAlleles.ed3.toHomoPair(),
    ];
    const strain = new Strain({ allelePairs: pairs });
    const clone = strain.clone();

    expect(strain).not.toBe(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });

  test('fillWildsFrom() fills nothing when appropriate', () => {
    const before = new Strain({
      allelePairs: [mockAlleles.ed3.toTopHetPair()],
    });

    const after = before.clone();
    after.fillWildsFrom(before);

    expect(before).toEqual(after);
  });

  test('fillsWildsFrom() is idempotent', () => {
    const strain = new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.md299.toWild().toHomoPair(),
      ],
    });

    const before = strain.clone();
    strain.fillWildsFrom(strain);
    expect(before.equals(strain));
  });

  test('fillWildsFrom() fills gaps', () => {
    const strain1 = new Strain({
      allelePairs: [mockAlleles.ed3.toTopHetPair()],
    });

    const strain2 = new Strain({
      allelePairs: [mockAlleles.md299.toTopHetPair()],
    });

    strain1.fillWildsFrom(strain2);

    const expected = new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.md299.toWild().toHomoPair(),
      ],
    });

    expect(strain1.equals(expected)).toBe(true);
  });
});

describe('Cross algorithm', () => {
  test('.meiosis() on empty.', () => {
    const gametesEmptyWild = mockStrains.emptyWild.meiosis();
    const expected: GameteOption[] = [{ chromosomes: [], prob: 1.0 }];
    expect(gametesEmptyWild).toEqual(expected);
  });

  test('.meiosis() on homozygous.', () => {
    const gametesTN64 = mockStrains.TN64.meiosis();
    const expected: GameteOption[] = [
      { chromosomes: [[mockAlleles.cn64]], prob: 1.0 },
    ];
    expect(gametesTN64).toEqual(expected);
  });

  test('.meiosis() on heterozygous.', () => {
    const gametes = new Strain({
      allelePairs: [
        mockAlleles.ed3.toTopHetPair(),
        mockAlleles.md299.toTopHetPair(),
      ],
    }).meiosis();
    const expected: GameteOption[] = [
      { chromosomes: [[mockAlleles.ed3], [mockAlleles.md299]], prob: 0.25 },
      {
        chromosomes: [[mockAlleles.ed3], [mockAlleles.md299.toWild()]],
        prob: 0.25,
      },
      {
        chromosomes: [[mockAlleles.ed3.toWild()], [mockAlleles.md299]],
        prob: 0.25,
      },
      {
        chromosomes: [[mockAlleles.ed3.toWild()], [mockAlleles.md299.toWild()]],
        prob: 0.25,
      },
    ];
    testGameteOptions(gametes, expected);
  });

  test('fertilize() empty case', async () => {
    const gameteOpts1: GameteOption[] = [{ chromosomes: [], prob: 1.0 }];
    const gameteOpts2: GameteOption[] = [{ chromosomes: [], prob: 1.0 }];
    const zygotes = await Strain.fertilize(gameteOpts1, gameteOpts2);
    const expected: StrainOption[] = [
      { strain: new Strain({ allelePairs: [] }), prob: 1 },
    ];

    testStrainOptions(zygotes, expected);
  });

  test('fertilize() homozygous', async () => {
    const gameteOpts: GameteOption[] = [
      { chromosomes: [[mockAlleles.cn64]], prob: 1.0 },
    ];
    const zygotes = await Strain.fertilize(gameteOpts);
    const expected: StrainOption[] = [{ strain: mockStrains.TN64, prob: 1 }];

    testStrainOptions(zygotes, expected);
  });

  test('cross between homozygous and wild strain', async () => {
    const homoPairs: AllelePair[] = [mockAlleles.e204.toHomoPair()];
    const wildPairs: AllelePair[] = [mockAlleles.e204.toWild().toHomoPair()];

    const homoStrain = new Strain({ allelePairs: homoPairs });
    const wildStrain = new Strain({ allelePairs: wildPairs });
    const crossStrains = await homoStrain.crossWith(wildStrain);
    testStrainOptions(crossStrains, mockStrains.homoWildCross);
  });

  test('cross of homozygous and heterozygous strains', async () => {
    const hetPairs: AllelePair[] = [mockAlleles.e204.toTopHetPair()];
    const homoPairs: AllelePair[] = [mockAlleles.ox802.toHomoPair()];

    const hetStrain = new Strain({ allelePairs: hetPairs });
    const homoStrain = new Strain({ allelePairs: homoPairs });
    const crossStrains = await homoStrain.crossWith(hetStrain);
    testStrainOptions(crossStrains, mockStrains.homoHetCross);
  });

  test('self-cross of homozygous pair returns same child strain', async () => {
    const allelePairs: AllelePair[] = [mockAlleles.e204.toHomoPair()];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrainOptions(crossStrains, mockStrains.homozygousCross);
  });

  test('self-cross of heterozygous pair returns correct strains', async () => {
    const allelePairs: AllelePair[] = [mockAlleles.e204.toTopHetPair()];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrainOptions(crossStrains, mockStrains.heterozygousCross);
  });

  test('self-cross of chromosome with homozygous and heterozygous pairs', async () => {
    const allelePairs: AllelePair[] = [
      mockAlleles.e204.toHomoPair(),
      mockAlleles.ox802.toBotHetPair(),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrainOptions(crossStrains, mockStrains.homoHetSelfCross);
  });

  test('intermediate self-cross on single chromosome', async () => {
    const allelePairs: AllelePair[] = [
      mockAlleles.e204.toTopHetPair(),
      mockAlleles.ox802.toBotHetPair(),
    ];

    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrainOptions(crossStrains, mockStrains.intermediateSelfCross);
  });

  test('simple self-cross of het alleles on different chromosomes', async () => {
    const allelePairs: AllelePair[] = [
      mockAlleles.ed3.toTopHetPair(), // chrom III
      mockAlleles.md299.toTopHetPair(), // chrom X
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrainOptions(crossStrains, mockStrains.difChromSimpleSelfCross);
  });

  test('advanced self-cross on multiple chromosomes', async () => {
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
    const crossStrains = await strain.selfCross();

    expect(crossStrains.length).toBe(90);

    const probSum = crossStrains.reduce((prev, curr) => prev + curr.prob, 0);
    expect(probSum).toBeCloseTo(1.0);

    // test first 30 strains for correctness
    testStrainOptions(
      crossStrains.slice(0, mockStrains.partialAdvancedSelfCross.length),
      mockStrains.partialAdvancedSelfCross
    );
  });

  test('cross on multiple chromosomes', async () => {
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
    const crossStrains = await strain1.crossWith(strain2);

    testStrainOptions(crossStrains, mockStrains.intermediateCross);
  });

  test('ECA cross', async () => {
    const strain1 = new Strain({
      allelePairs: [
        mockAlleles.oxEx2254.toTopHetPair(),
        mockAlleles.oxEx219999.toTopHetPair(),
      ],
    });
    const strain2 = new Strain({
      allelePairs: [mockAlleles.oxEx2254.toTopHetPair()],
    });
    const crossStrains = await strain1.crossWith(strain2);
    testStrainOptions(crossStrains, mockStrains.ecaCross);
  });

  test('should output a single child for wild-wild crosses', async () => {
    const wildStrain1 = new Strain({ allelePairs: [] });
    const wildStrain2 = wildStrain1.clone();
    const selfCrossStrains = await wildStrain1.selfCross();
    const wildToWildCrossStrains = await wildStrain1.crossWith(wildStrain2);

    testStrainOptions(selfCrossStrains, mockStrains.wildToWildCross);
    testStrainOptions(wildToWildCrossStrains, mockStrains.wildToWildCross);
  });

  test('should be able to serialize and deserialize', () => {
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
    expect(strain1Back.getAllelePairs).toBeDefined();
  });
});
