import { WildAllele, WILD_ALLELE } from 'models/frontend/Allele/Allele';
import {
  e204,
  ed3,
  ox1059,
  ox802,
  oxTi302,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { expect, test, describe } from 'vitest';

describe('allele pair', () => {
  test('.looseEquals() for duplicate allele pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, e204);
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);

    const pair3 = new AllelePair(e204, WILD_ALLELE);
    const pair4 = new AllelePair(e204, WILD_ALLELE);
    expect(pair3.looseEquals(pair4)).toBe(true);
    expect(pair3.looseEquals(pair4)).toBe(true);
  });
  test('.looseEquals() for flipped allele pairs', () => {
    const pair1 = new AllelePair(e204, WILD_ALLELE);
    const pair2 = new AllelePair(WILD_ALLELE, e204);
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);
  });
  test('.looseEquals() returns false for different allele pairs', () => {
    const pair1 = new AllelePair(e204, WILD_ALLELE);
    const pair2 = new AllelePair(ox802, WILD_ALLELE);
    expect(pair1.looseEquals(pair2)).toBe(false);
    expect(pair2.looseEquals(pair1)).toBe(false);

    const pair3 = new AllelePair(WILD_ALLELE, e204);
    expect(pair2.looseEquals(pair3)).toBe(false);
    expect(pair3.looseEquals(pair2)).toBe(false);
  });
  test('.looseEquals() returns false for homozygous vs heterozygous pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, WILD_ALLELE);
    const pair3 = new AllelePair(WILD_ALLELE, e204);
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

    const pair3 = new AllelePair(e204, WILD_ALLELE);
    const pair4 = new AllelePair(e204, WILD_ALLELE);
    expect(pair3.strictEquals(pair4)).toBe(true);
    expect(pair3.strictEquals(pair4)).toBe(true);
  });
  test('.strictEquals() returns false for flipped allele pairs', () => {
    const pair1 = new AllelePair(ox802, WILD_ALLELE);
    const pair2 = new AllelePair(WILD_ALLELE, ox802);
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
    const pair1 = new AllelePair(e204, WILD_ALLELE);
    const pair2 = new AllelePair(WILD_ALLELE, e204);
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });

  test('.getAllele() returns base allele from homozygous pair', () => {
    const pair1 = new AllelePair(oxTi302, oxTi302);
    expect(pair1.getAllele().name).toEqual(oxTi302.name);
  });
  test('.getAllele() returns base allele from heterozygous pair', () => {
    const pair1 = new AllelePair(oxTi302, WILD_ALLELE);
    const pair2 = new AllelePair(WILD_ALLELE, oxTi302);
    expect(pair1.getAllele().name).toEqual(oxTi302.name);
    expect(pair2.getAllele().name).toEqual(oxTi302.name);
  });
  test('.getAllele() returns wild allele from wild pair', () => {
    const pair1 = new AllelePair(WILD_ALLELE, WILD_ALLELE);
    const pair2 = new AllelePair(new WildAllele(ed3), new WildAllele(ed3));
    expect(pair1.getAllele().name).toEqual(WILD_ALLELE.name);
    expect(pair2.getAllele().name).toEqual(WILD_ALLELE.name);
  });

  test('.hasSameBaseAllele() returns true on homozygous pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, e204);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(true);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(true);
  });
  test('.hasSameBaseAllele() returns true on heterozygous pairs', () => {
    const pair1 = new AllelePair(e204, WILD_ALLELE);
    const pair2 = new AllelePair(e204, WILD_ALLELE);
    const pair3 = new AllelePair(WILD_ALLELE, e204);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(true);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(true);
    expect(pair1.hasSameBaseAllele(pair3)).toBe(true);
    expect(pair3.hasSameBaseAllele(pair1)).toBe(true);
  });
  test('.hasSameBaseAllele() returns true on homo <--> het pairs', () => {
    const pair1 = new AllelePair(e204, e204);
    const pair2 = new AllelePair(e204, WILD_ALLELE);
    const pair3 = new AllelePair(WILD_ALLELE, e204);
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
    const pair1 = new AllelePair(e204, WILD_ALLELE);
    const pair2 = new AllelePair(ox802, WILD_ALLELE);
    const pair3 = new AllelePair(WILD_ALLELE, ox802);
    expect(pair1.hasSameBaseAllele(pair2)).toBe(false);
    expect(pair2.hasSameBaseAllele(pair1)).toBe(false);
    expect(pair1.hasSameBaseAllele(pair3)).toBe(false);
    expect(pair3.hasSameBaseAllele(pair1)).toBe(false);
  });
  test('.hasSameBaseAllele() returns false on differing homo <--> het pairs', () => {
    const homoE204 = new AllelePair(e204, e204);
    const homoOx802 = new AllelePair(ox802, ox802);
    const hetE204 = new AllelePair(WILD_ALLELE, e204);
    const hetOx802 = new AllelePair(ox802, WILD_ALLELE);
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
    const pair1 = new AllelePair(e204, WILD_ALLELE);
    const pair2 = new AllelePair(WILD_ALLELE, e204);
    const flipped1 = pair1.getFlippedPair();
    const flipped2 = pair2.getFlippedPair();

    expect(pair1).not.toEqual(flipped1); // different instantiations
    expect(pair2).not.toEqual(flipped2); // different instantiations
    expect(pair1.top.name).toEqual(flipped1.bot.name);
    expect(pair1.bot.name).toEqual(flipped1.top.name);
    expect(pair2.top.name).toEqual(flipped2.bot.name);
    expect(pair2.bot.name).toEqual(flipped2.top.name);
  });

  test('.clone() on homozygous pair', () => {
    const pair = new AllelePair(e204, e204);
    const clone = pair.clone();
    expect(pair).not.toEqual(clone); // different instantiations
    expect(pair.top.name).toEqual(clone.top.name);
    expect(pair.bot.name).toEqual(clone.bot.name);
  });
  test('.clone() on heterozygous pair', () => {
    const pair1 = new AllelePair(e204, WILD_ALLELE);
    const pair2 = new AllelePair(WILD_ALLELE, e204);
    const clone1 = pair1.clone();
    const clone2 = pair2.clone();

    expect(pair1).not.toEqual(clone1); // different instantiations
    expect(pair2).not.toEqual(clone2); // different instantiations
    expect(pair1.top.name).toEqual(clone1.top.name);
    expect(pair1.bot.name).toEqual(clone1.bot.name);
    expect(pair2.top.name).toEqual(clone2.top.name);
    expect(pair2.bot.name).toEqual(clone2.bot.name);
  });

  test('.getChromatid() returns top chromatid', () => {
    const chromosome = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, oxTi302),
    ];

    const topChromatid = [e204, ox802, WILD_ALLELE];
    const chromatidResult = AllelePair.getChromatid(chromosome, 'top');

    expect(chromatidResult).toHaveLength(topChromatid.length);
    for (let i = 0; i < chromatidResult.length; i++)
      expect(chromatidResult[i].name).toBe(topChromatid[i].name);
  });
  test('.getChromatid() returns bottom chromatid', () => {
    const chromosome = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, oxTi302),
    ];

    const topChromatid = [WILD_ALLELE, ox802, oxTi302];
    const chromatidResult = AllelePair.getChromatid(chromosome, 'bot');

    expect(chromatidResult).toHaveLength(topChromatid.length);
    for (let i = 0; i < chromatidResult.length; i++)
      expect(chromatidResult[i].name).toBe(topChromatid[i].name);
  });

  test('.chromosomesMatch() for duplicate chromosomes', () => {
    const chrom1 = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, oxTi302),
    ];
    const chrom2 = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, oxTi302),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(true);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(true);
  });
  test('.chromosomesMatch() for flipped chromosomes', () => {
    const chrom1 = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, oxTi302),
    ];
    const chrom2 = [
      new AllelePair(WILD_ALLELE, e204),
      new AllelePair(ox802, ox802),
      new AllelePair(oxTi302, WILD_ALLELE),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(true);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(true);
  });
  test('.chromosomesMatch() returns false for different chromosomes', () => {
    const chrom1 = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, oxTi302),
    ];
    const chrom2 = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, ox1059),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(false);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(false);
  });
  test('.chromosomesMatch() returns false for different chromosome with wild allele', () => {
    const chrom1 = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, oxTi302),
    ];
    const chrom2 = [
      new AllelePair(e204, WILD_ALLELE),
      new AllelePair(ox802, ox802),
      new AllelePair(WILD_ALLELE, WILD_ALLELE),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(false);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(false);
  });
});
