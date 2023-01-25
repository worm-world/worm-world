import { Allele, WildAllele } from 'models/frontend/Allele/Allele';
import {
  cn64,
  e204,
  e873,
  ed3,
  jsSi1949,
  md299,
  n765,
  ox1059,
  ox11000,
  ox802,
  oxSi1168,
  oxTi302,
  oxTi75,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair, Strain } from 'models/frontend/Strain/Strain';
import {
  HeterozygousCross,
  HomozygousCross,
  SelfCross2,
} from 'models/frontend/Strain/Strain.mock';
import { expect, test, describe } from 'vitest';

const DIGIT_PRECISION = 6;

describe('allele pair', () => {
  test('.looseEquals() for duplicate allele pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, e204);
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);

    const pair3 = new AllelePair(e204, new WildAllele());
    const pair4 = new AllelePair(e204, new WildAllele());
    expect(pair3.looseEquals(pair4)).toBe(true);
    expect(pair3.looseEquals(pair4)).toBe(true);
  });
  test('.looseEquals() for flipped allele pairs', () => {
    const pair1 = new AllelePair(e204, new WildAllele());
    const pair2 = new AllelePair(new WildAllele(), e204);
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);
  });
  test('.looseEquals() returns false for different allele pairs', () => {
    const pair1 = new AllelePair(e204, new WildAllele());
    const pair2 = new AllelePair(ox802, new WildAllele());
    expect(pair1.looseEquals(pair2)).toBe(false);
    expect(pair2.looseEquals(pair1)).toBe(false);

    const pair3 = new AllelePair(new WildAllele(), e204);
    expect(pair2.looseEquals(pair3)).toBe(false);
    expect(pair3.looseEquals(pair2)).toBe(false);
  });
  test('.looseEquals() returns false for homozygous vs heterozygous pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, new WildAllele());
    const pair3 = new AllelePair(new WildAllele(), e204);
    expect(pair1.looseEquals(pair2)).toBe(false);
    expect(pair2.looseEquals(pair1)).toBe(false);
    expect(pair1.looseEquals(pair3)).toBe(false);
    expect(pair3.looseEquals(pair1)).toBe(false);
  });
  test('.strictEquals() for duplicate allele pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, e204);
    expect(pair1.strictEquals(pair2)).toBe(true);
    expect(pair2.strictEquals(pair1)).toBe(true);

    const pair3 = new AllelePair(e204, new WildAllele());
    const pair4 = new AllelePair(e204, new WildAllele());
    expect(pair3.strictEquals(pair4)).toBe(true);
    expect(pair3.strictEquals(pair4)).toBe(true);
  });
  test('.strictEquals() returns false for flipped allele pairs', () => {
    const pair1 = new AllelePair(ox802, new WildAllele());
    const pair2 = new AllelePair(new WildAllele(), ox802);
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });
  test('.strictEquals() returns false for different allele pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(ox802, ox802);
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });
  test('.strictEquals() returns false for homozygous vs heterozygous pairs', () => {
    const pair1 = new AllelePair(e204, new WildAllele());
    const pair2 = new AllelePair(new WildAllele(), e204);
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });

  test('.getAllele() returns base allele from homozygous pair', () => {
    const pair1 = new AllelePair(oxTi302, oxTi302);
    expect(pair1.getAllele().name).toEqual(oxTi302.name);
  });
  test('.getAllele() returns base allele from heterozygous pair', () => {
    const pair1 = new AllelePair(oxTi302, new WildAllele());
    const pair2 = new AllelePair(new WildAllele(), oxTi302);
    expect(pair1.getAllele().name).toEqual(oxTi302.name);
    expect(pair2.getAllele().name).toEqual(oxTi302.name);
  });
  test('.getAllele() returns wild allele from wild pair', () => {
    const pair1 = new AllelePair(new WildAllele(), new WildAllele());
    const pair2 = new AllelePair(
      new WildAllele(ed3.getGenPosition()),
      new WildAllele(ed3.getGenPosition())
    );
    expect(pair1.getAllele().name).toEqual(new WildAllele().name);
    expect(pair2.getAllele().name).toEqual(new WildAllele().name);
  });

  test('.hasSameBaseAllele() returns true on homozygous pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, e204);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(true);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(true);
  });
  test('.hasSameBaseAllele() returns true on heterozygous pairs', () => {
    const pair1 = new AllelePair(e204, new WildAllele());
    const pair2 = new AllelePair(e204, new WildAllele());
    const pair3 = new AllelePair(new WildAllele(), e204);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(true);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(true);
    expect(pair1.hasSameBaseAllele(pair3)).toBe(true);
    expect(pair3.hasSameBaseAllele(pair1)).toBe(true);
  });
  test('.hasSameBaseAllele() returns true on homo <--> het pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, new WildAllele());
    const pair3 = new AllelePair(new WildAllele(), e204);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(true);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(true);
    expect(pair1.hasSameBaseAllele(pair3)).toBe(true);
    expect(pair3.hasSameBaseAllele(pair1)).toBe(true);
  });
  test('.hasSameBaseAllele() returns false on differing homozygous pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(ox802, ox802);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(false);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(false);
  });
  test('.hasSameBaseAllele() returns false on differing heterozygous pairs', () => {
    const pair1 = new AllelePair(e204, new WildAllele());
    const pair2 = new AllelePair(ox802, new WildAllele());
    const pair3 = new AllelePair(new WildAllele(), ox802);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(false);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(false);
    expect(pair1.hasSameBaseAllele(pair3)).toBe(false);
    expect(pair3.hasSameBaseAllele(pair1)).toBe(false);
  });
  test('.hasSameBaseAllele() returns false on differing homo <--> het pairs', () => {
    const homoE204 = new AllelePair(e204, e204);
    const homoOx802 = new AllelePair(ox802, ox802);
    const hetE204 = new AllelePair(new WildAllele(), e204);
    const hetOx802 = new AllelePair(ox802, new WildAllele());
    expect(homoE204.hasSameBaseAllele(hetOx802)).toBe(false);
    expect(hetOx802.hasSameBaseAllele(homoE204)).toBe(false);
    expect(homoOx802.hasSameBaseAllele(hetE204)).toBe(false);
    expect(hetE204.hasSameBaseAllele(homoOx802)).toBe(false);
  });

  test('.getFlippedPair() on homozygous pair', () => {
    const pair = new AllelePair(e204, e204);
    const flipped = pair.getFlippedPair();
    expect(pair).not.toEqual(flipped); // different instantiations
    expect(pair.top.name).toEqual(flipped.bot.name);
    expect(pair.bot.name).toEqual(flipped.top.name);
  });
  test('.getFlippedPair() on heterozygous pair', () => {
    const pair1 = new AllelePair(e204, new WildAllele());
    const pair2 = new AllelePair(new WildAllele(), e204);
    const flipped1 = pair1.getFlippedPair();
    const flipped2 = pair2.getFlippedPair();

    expect(pair1).not.toEqual(flipped1); // different instantiations
    expect(pair2).not.toEqual(flipped2); // different instantiations
    expect(pair1.top.name).toEqual(flipped1.bot.name);
    expect(pair1.bot.name).toEqual(flipped1.top.name);
    expect(pair2.top.name).toEqual(flipped2.bot.name);
    expect(pair2.bot.name).toEqual(flipped2.top.name);
  });

  test('.getChromatid() returns top chromatid', () => {
    const chromosome = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), oxTi302),
    ];

    const topChromatid = [e204, ox802, new WildAllele()];
    const chromatidResult = AllelePair.getChromatid(chromosome, 'top');

    expect(chromatidResult).toHaveLength(topChromatid.length);
    for (let i = 0; i < chromatidResult.length; i++)
      expect(chromatidResult[i].name).toBe(topChromatid[i].name);
  });
  test('.getChromatid() returns bottom chromatid', () => {
    const chromosome = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), oxTi302),
    ];

    const topChromatid = [new WildAllele(), ox802, oxTi302];
    const chromatidResult = AllelePair.getChromatid(chromosome, 'bot');

    expect(chromatidResult).toHaveLength(topChromatid.length);
    for (let i = 0; i < chromatidResult.length; i++)
      expect(chromatidResult[i].name).toBe(topChromatid[i].name);
  });

  test('.chromosomesMatch() for duplicate chromosomes', () => {
    const chrom1 = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), oxTi302),
    ];
    const chrom2 = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), oxTi302),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(true);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(true);
  });
  test('.chromosomesMatch() for flipped chromosomes', () => {
    const chrom1 = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), oxTi302),
    ];
    const chrom2 = [
      new AllelePair(new WildAllele(), e204),
      new AllelePair(ox802, ox802),
      new AllelePair(oxTi302, new WildAllele()),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(true);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(true);
  });
  test('.chromosomesMatch() returns false for different chromosomes', () => {
    const chrom1 = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), oxTi302),
    ];
    const chrom2 = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), ox1059),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(false);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(false);
  });
  test('.chromosomesMatch() returns false for different chromosome with wild allele', () => {
    const chrom1 = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), oxTi302),
    ];
    const chrom2 = [
      new AllelePair(e204, new WildAllele()),
      new AllelePair(ox802, ox802),
      new AllelePair(new WildAllele(), new WildAllele()),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(false);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(false);
  });
});

describe('strain', () => {
  test('.equals() returns true for strains with homozygous pairs', () => {
    const allelePairs: AllelePair[] = [new AllelePair(e204, e204)];
    const strain1 = new Strain({ allelePairs });
    const strain2 = new Strain({ allelePairs });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for strains with heterozygous pairs', () => {
    const pairs1: AllelePair[] = [new AllelePair(e204, new WildAllele())];
    const pairs2: AllelePair[] = [new AllelePair(new WildAllele(), e204)];
    const strain1 = new Strain({ allelePairs: pairs1 });
    const strain2 = new Strain({ allelePairs: pairs2 });

    expect(strain1.equals(strain2)).toBe(true);
    expect(strain2.equals(strain1)).toBe(true);
  });
  test('.equals() returns true for complex, multi-chromosomal strains', () => {
    const strainPairs1: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(new WildAllele(), jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(new WildAllele(), cn64),
      new AllelePair(new WildAllele(), oxSi1168),
      // Chromosome III
      new AllelePair(ox802, new WildAllele()),
      new AllelePair(ox11000, ox11000),
      new AllelePair(e873, new WildAllele()),
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
      new AllelePair(new WildAllele(), jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(new WildAllele(), cn64),
      new AllelePair(new WildAllele(), oxSi1168),
      // Chromosome III
      new AllelePair(ox802, new WildAllele()),
      new AllelePair(ox11000, ox11000),
      new AllelePair(e873, new WildAllele()),
      new AllelePair(ed3, ed3),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(jsSi1949, new WildAllele()), // note the flip here
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(cn64, new WildAllele()),
      new AllelePair(oxSi1168, new WildAllele()),
      // Chromosome III
      new AllelePair(new WildAllele(), ox802),
      new AllelePair(ox11000, ox11000),
      new AllelePair(new WildAllele(), e873),
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
      new AllelePair(new WildAllele(), jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(new WildAllele(), cn64),
      new AllelePair(new WildAllele(), oxSi1168),
    ];
    const strainPairs2: AllelePair[] = [
      // Chromosome I
      new AllelePair(oxTi302, oxTi302),
      new AllelePair(new WildAllele(), jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(cn64, new WildAllele()), // flipped this pair, without flipping the next pair
      new AllelePair(new WildAllele(), oxSi1168),
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
      new AllelePair(new WildAllele(), jsSi1949),
      // Chromosome II
      new AllelePair(oxTi75, oxTi75),
      new AllelePair(new WildAllele(), cn64),
      new AllelePair(new WildAllele(), oxSi1168),
      // Chromosome III
      new AllelePair(ox802, new WildAllele()),
      new AllelePair(ox11000, ox11000),
      new AllelePair(e873, new WildAllele()),
      new AllelePair(ed3, ed3),
    ];
    const strain = new Strain({ allelePairs: pairs });
    const clone = strain.clone();

    expect(strain).not.toEqual(clone); // distinct objects
    expect(strain.equals(clone)).toBe(true); // data remains the same
  });
});

describe('cross algorithm', () => {
  test('self cross of homozygous pair returns same child strain', () => {
    const allelePairs: AllelePair[] = [new AllelePair(e204, e204)];
    const strain = new Strain({ allelePairs });
    const crossResults = strain.selfCross();
    const expectedStrain = HomozygousCross;

    expect(crossResults).toHaveLength(1);
    expect(expectedStrain.strain.equals(crossResults[0].strain)).toBe(true);
    expect(crossResults[0].prob).toBeCloseTo(
      expectedStrain.prob,
      DIGIT_PRECISION
    );
  });

  // test('self cross of heterozygous pair returns correct strains', () => {
  //   const allelePairs: AllelePair[] = [new AllelePair(e204, new WildAllele())];
  //   const strain = new Strain({ allelePairs: allelePairs });
  //   const crossStrains = strain.selfCross();
  //   const expectedStrains = HeterozygousCross;

  //   expect(crossStrains).toHaveLength(expectedStrains.length);

  //   for (let i = 0; i < crossStrains.length; i++) {
  //     expect(
  //       expectedStrains[i].strain.equals(crossStrains[i].strain)
  //     ).toBeTruthy();
  //   }
  //   // console.log(crossStrains[0].prob);
  //   // expect(crossStrains[0].prob).toBeCloseTo(expectedStrains.prob);
  // });

  // test('performs simple self cross', () => {
  //   const allelePairs: AllelePair[] = [
  //     new AllelePair(e204, new WildAllele()),
  //     new AllelePair(new WildAllele(), ox802),
  //   ];

  //   const strain = new Strain({ allelePairs: allelePairs });
  //   const crossResults = strain.selfCross();
  //   const expectedResults = SelfCross2;

  //   crossResults.forEach((crossRes, idx) =>
  //     console.log(`Strain ${idx}\n${crossRes.strain.toString()}\n`)
  //   );

  //   expect(crossResults).toHaveLength(expectedResults.length);

  //   // for (let i = 0; i < crossResults.length; i++) {
  //   //   expect(
  //   //     expectedResults[i].strain.equals(crossResults[i].strain)
  //   //   ).toBeTruthy();

  //   // expect(crossResults[i].prob).toBe(expectedResults[i]);
  //   // }
  // });
});
