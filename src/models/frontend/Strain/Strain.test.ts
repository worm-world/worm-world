import { clearMocks, mockIPC } from '@tauri-apps/api/mocks';
import * as alleles from 'models/frontend/Allele/Allele.mock';
import { type AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain, type Gamete } from 'models/frontend/Strain/Strain';
import * as strains from 'models/frontend/Strain/Strain.mock';
import { expect, test, describe } from 'vitest';
import {
  ChromosomePair,
  chromsEqual,
} from 'models/frontend/ChromosomePair/ChromosomePair';

const PRECISION = 6;

function testGametes(actuals: Gamete[], expecteds: Gamete[]): void {
  expect(actuals).toHaveLength(expecteds.length);

  for (let i = 0; i < actuals.length; i++) {
    const expected = expecteds[i];
    const actual = actuals[i];
    expect(
      actual.chromosomes.every((actualChrom, idx) => {
        return chromsEqual(actualChrom, expected.chromosomes[idx]);
      })
    ).toBe(true);
    expect(actual.prob).toBeCloseTo(expected.prob, PRECISION);
  }
}

function testStrains(actualStrains: Strain[], expectedStrains: Strain[]): void {
  expect(actualStrains).toHaveLength(expectedStrains.length);

  for (let i = 0; i < actualStrains.length; i++) {
    const expected = expectedStrains[i];
    const actual = actualStrains[i];
    expect(actual.equals(expected)).toBe(true);
    expect(actual.probability).toBeCloseTo(expected.probability, PRECISION);
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
  test('ctor creates correct genotype', () => {
    const strain1 = new Strain({
      allelePairs: [
        alleles.ed3.toWild().toHomo(), // irrelevant to genotype
        alleles.e138.toBotHet(), // Physically first
        alleles.e1282.toTopHet(),
      ],
    });

    expect(strain1.genotype).toEqual('unc-24(e138) +/+ dpy-10(e1282) IV.');
  });

  test('.equals() returns true for strains with homozygous pairs', () => {
    const allelePairs: AllelePair[] = [alleles.e204.toHomo()];
    const strain1 = new Strain({ allelePairs });
    const strain2 = new Strain({ allelePairs });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns true for strains with heterozygous pairs', () => {
    const pairs1: AllelePair[] = [alleles.e204.toTopHet()];
    const pairs2: AllelePair[] = [alleles.e204.toBotHet()];
    const strain1 = new Strain({ allelePairs: pairs1 });
    const strain2 = new Strain({ allelePairs: pairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns true for complex, multi-chromosomal strains', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      alleles.oxTi302.toHomo(),
      alleles.jsSi1949.toBotHet(),
      // Chromosome II
      alleles.oxTi75.toHomo(),
      alleles.cn64.toBotHet(),
      alleles.oxSi1168.toBotHet(),
      // Chromosome III
      alleles.ox802.toTopHet(),
      alleles.e873.toTopHet(),
      alleles.ed3.toHomo(),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: [...strainPairs1] });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns true for complex strains with flipped chroms', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      alleles.oxTi302.toHomo(),
      alleles.jsSi1949.toBotHet(),
      // Chromosome II
      alleles.oxTi75.toHomo(),
      alleles.cn64.toBotHet(),
      alleles.oxSi1168.toBotHet(),
      // Chromosome III
      alleles.ox802.toTopHet(),
      alleles.e873.toTopHet(),
      alleles.ed3.toHomo(),
    ];

    const strainPairs2: AllelePair[] = [
      // Chromosome I
      alleles.oxTi302.toHomo(),
      alleles.jsSi1949.toTopHet(), // note the flip here
      // Chromosome II
      alleles.oxTi75.toHomo(),
      alleles.cn64.toTopHet(),
      alleles.oxSi1168.toTopHet(),
      // Chromosome III
      alleles.ox802.toBotHet(),
      alleles.e873.toBotHet(),
      alleles.ed3.toHomo(),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });

  test('.equals() returns false for strains with different homozygous pairs', () => {
    const strain1Pairs: AllelePair[] = [alleles.e204.toHomo()];
    const strain2Pairs: AllelePair[] = [alleles.ox802.toHomo()];
    const strain1 = new Strain({ allelePairs: strain1Pairs });
    const strain2 = new Strain({ allelePairs: strain2Pairs });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });

  test('.equals() returns false for strains with inconsistently flipped pairs in same chromosome', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      alleles.oxTi302.toHomo(),
      alleles.jsSi1949.toBotHet(),
      // Chromosome II
      alleles.oxTi75.toHomo(),
      alleles.cn64.toBotHet(),
      alleles.oxSi1168.toBotHet(),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      alleles.oxTi302.toHomo(),
      alleles.jsSi1949.toBotHet(),
      // Chromosome II
      alleles.oxTi75.toHomo(),
      alleles.cn64.toTopHet(), // flipped this pair, without flipping the next pair
      alleles.oxSi1168.toBotHet(),
    ];

    const strain1 = new Strain({ allelePairs: strainPairs1 });
    const strain2 = new Strain({ allelePairs: strainPairs2 });

    expect(strain1.equals(strain2)).toBe(false);
    expect(strain2.equals(strain1)).toBe(false);
  });

  test('.clone() creates new instance', () => {
    const strain = new Strain({ allelePairs: [alleles.e204.toHomo()] });
    const clone = strain.clone();

    expect(strain).not.toBe(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });

  test('.clone() creates new instance from complex strain', () => {
    const pairs: AllelePair[] = [
      // Chromosome I
      alleles.oxTi302.toHomo(),
      alleles.jsSi1949.toBotHet(),
      // Chromosome II
      alleles.oxTi75.toHomo(),
      alleles.cn64.toBotHet(),
      alleles.oxSi1168.toBotHet(),
      // Chromosome III
      alleles.ox802.toTopHet(),
      alleles.e873.toTopHet(),
      alleles.ed3.toHomo(),
    ];
    const strain = new Strain({ allelePairs: pairs });
    const clone = strain.clone();

    expect(strain).not.toBe(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });

  test('fillWildsFrom() fills nothing when appropriate', () => {
    const before = new Strain({
      allelePairs: [alleles.ed3.toTopHet()],
    });

    const after = before.clone();
    after.fillWildsFrom(before);

    expect(after).toEqual(before);
  });

  test('fillWildsFrom() is idempotent', () => {
    const strain = new Strain({
      allelePairs: [alleles.ed3.toTopHet(), alleles.md299.toWild().toHomo()],
    });

    const before = strain.clone();
    strain.fillWildsFrom(strain);
    expect(before.equals(strain));
  });

  test('fillWildsFrom() fills gaps', () => {
    const strain1 = new Strain({
      allelePairs: [alleles.ed3.toTopHet()],
    });

    const strain2 = new Strain({
      allelePairs: [alleles.md299.toTopHet()],
    });

    strain1.fillWildsFrom(strain2);

    const expected = new Strain({
      allelePairs: [alleles.ed3.toTopHet(), alleles.md299.toWild().toHomo()],
    });

    expect(strain1.equals(expected)).toBe(true);
  });

  test('(De)serializes', () => {
    const strain = new Strain({
      allelePairs: [
        // chrom II
        alleles.oxTi75.toTopHet(),
        alleles.cn64.toHomo(),
        // chrom IV
        alleles.ox802.toTopHet(),
      ],
    });
    const str = strain.toJSON();
    const strainBack = Strain.fromJSON(str);
    expect(strainBack).toEqual(strain);
    expect(strainBack.toJSON).toBeDefined();
    expect(strainBack.chromPairMap).toBeInstanceOf(Map);

    const chromPair = strainBack.chromPairMap?.get('IV');
    expect(chromPair).toEqual(new ChromosomePair([alleles.ox802.toTopHet()]));
    expect(chromPair?.toJSON).toBeDefined();
  });
});

describe('Cross algorithm', () => {
  test('.meiosis() on empty.', () => {
    const gametesEmptyWild = strains.emptyWild.meiosis();
    const expected: Gamete[] = [{ chromosomes: [], prob: 1.0 }];
    expect(gametesEmptyWild).toEqual(expected);
  });

  test('.meiosis() on homozygous.', () => {
    const gametesTN64 = strains.TN64.meiosis();
    const expected: Gamete[] = [{ chromosomes: [[alleles.cn64]], prob: 1.0 }];
    expect(gametesTN64).toEqual(expected);
  });

  test('.meiosis() on heterozygous.', () => {
    const gametes = new Strain({
      allelePairs: [alleles.ed3.toTopHet(), alleles.md299.toTopHet()],
    }).meiosis();
    const expected: Gamete[] = [
      { chromosomes: [[alleles.ed3], [alleles.md299]], prob: 0.25 },
      {
        chromosomes: [[alleles.ed3], [alleles.md299.toWild()]],
        prob: 0.25,
      },
      {
        chromosomes: [[alleles.ed3.toWild()], [alleles.md299]],
        prob: 0.25,
      },
      {
        chromosomes: [[alleles.ed3.toWild()], [alleles.md299.toWild()]],
        prob: 0.25,
      },
    ];
    testGametes(gametes, expected);
  });

  test('fertilize() empty case', async () => {
    const gametes1: Gamete[] = [{ chromosomes: [], prob: 1.0 }];
    const gametes2: Gamete[] = [{ chromosomes: [], prob: 1.0 }];
    const zygotes = await Strain.fertilize(gametes1, gametes2);
    const expected = [new Strain({ allelePairs: [] })];

    testStrains(zygotes, expected);
  });

  test('fertilize() homozygous', async () => {
    const gametes: Gamete[] = [{ chromosomes: [[alleles.cn64]], prob: 1.0 }];
    const zygotes = await Strain.fertilize(gametes);
    const expected: Strain[] = [strains.TN64];

    testStrains(zygotes, expected);
  });

  test('cross between homozygous and wild strain', async () => {
    const homoPairs: AllelePair[] = [alleles.e204.toHomo()];
    const wildPairs: AllelePair[] = [alleles.e204.toWild().toHomo()];

    const homoStrain = new Strain({ allelePairs: homoPairs });
    const wildStrain = new Strain({ allelePairs: wildPairs });
    const crossStrains = await homoStrain.crossWith(wildStrain);
    testStrains(crossStrains, strains.homoWildCross);
  });

  test('cross of homozygous and heterozygous strains', async () => {
    const hetPairs: AllelePair[] = [alleles.e204.toTopHet()];
    const homoPairs: AllelePair[] = [alleles.ox802.toHomo()];

    const hetStrain = new Strain({ allelePairs: hetPairs });
    const homoStrain = new Strain({ allelePairs: homoPairs });
    const crossStrains = await homoStrain.crossWith(hetStrain);
    testStrains(crossStrains, strains.homoHetCross);
  });

  test('self-cross of homozygous pair returns same child strain', async () => {
    const allelePairs: AllelePair[] = [alleles.e204.toHomo()];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrains(crossStrains, strains.homozygousCross);
  });

  test('self-cross of heterozygous pair returns correct strains', async () => {
    const allelePairs: AllelePair[] = [alleles.e204.toTopHet()];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrains(crossStrains, strains.heterozygousCross);
  });

  test('self-cross of chromosome with homozygous and heterozygous pairs', async () => {
    const allelePairs: AllelePair[] = [
      alleles.e204.toHomo(),
      alleles.ox802.toBotHet(),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrains(crossStrains, strains.homoHetSelfCross);
  });

  test('intermediate self-cross on single chromosome', async () => {
    const allelePairs: AllelePair[] = [
      alleles.e204.toTopHet(),
      alleles.ox802.toBotHet(),
    ];

    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrains(crossStrains, strains.intermediateSelfCross);
  });

  test('simple self-cross of het alleles on different chromosomes', async () => {
    const allelePairs: AllelePair[] = [
      alleles.ed3.toTopHet(), // chrom III
      alleles.md299.toTopHet(), // chrom X
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();
    testStrains(crossStrains, strains.difChromSimpleSelfCross);
  });

  test('advanced self-cross on multiple chromosomes', async () => {
    const allelePairs: AllelePair[] = [
      // chrom II
      alleles.cn64.toTopHet(),
      alleles.oxTi75.toTopHet(),
      // chrom III
      alleles.ed3.toTopHet(),
      // chrom IV
      alleles.e53.toHomo(),
      alleles.e204.toTopHet(),
    ];
    const strain = new Strain({ allelePairs });
    const crossStrains = await strain.selfCross();

    expect(crossStrains.length).toBe(90);

    const probSum = crossStrains.reduce(
      (prev, curr) => prev + curr.probability,
      0
    );
    expect(probSum).toBeCloseTo(1.0);

    // test all strains >= 0.1%
    testStrains(
      crossStrains.filter((strain) => strain.probability >= 0.001),
      strains.partialAdvancedSelfCross
    );
  });

  test('cross on multiple chromosomes', async () => {
    const allelePairs1: AllelePair[] = [
      // chrom II
      alleles.oxTi75.toTopHet(),
      alleles.cn64.toTopHet(),
      // chrom IV
      alleles.ox802.toTopHet(),
    ];
    const allelePairs2: AllelePair[] = [
      // chrom III
      alleles.ox11000.toHomo(),
      // chrom IV
      alleles.e53.toHomo(),
      alleles.e204.toTopHet(),
    ];
    const strain1 = new Strain({ allelePairs: allelePairs1 });
    const strain2 = new Strain({ allelePairs: allelePairs2 });
    const crossStrains = await strain1.crossWith(strain2);

    testStrains(crossStrains, strains.intermediateCross);
  });

  test('ECA cross', async () => {
    const strain1 = new Strain({
      allelePairs: [alleles.oxEx2254.toTopHet(), alleles.oxEx219999.toTopHet()],
    });
    const strain2 = new Strain({
      allelePairs: [alleles.oxEx2254.toTopHet()],
    });
    const crossStrains = await strain1.crossWith(strain2);
    testStrains(crossStrains, strains.ecaCross);
  });

  test('should output a single child for wild-wild crosses', async () => {
    const wildStrain1 = new Strain({ allelePairs: [] });
    const wildStrain2 = wildStrain1.clone();
    const selfCrossStrains = await wildStrain1.selfCross();
    const wildToWildCrossStrains = await wildStrain1.crossWith(wildStrain2);

    testStrains(selfCrossStrains, strains.wildToWildCross);
    testStrains(wildToWildCrossStrains, strains.wildToWildCross);
  });
});
