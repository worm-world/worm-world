import {
  e204,
  ed3,
  md299,
  n765,
  ox1059,
  ox750,
  ox802,
  oxEx12345,
  oxEx219999,
  oxTi302,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { expect, test, describe } from 'vitest';
import { WILD_ALLELE_NAME } from 'models/frontend/Allele/Allele';

describe('allele pair', () => {
  test('constructs homozygous pair', () => {
    const pair1 = new AllelePair({ top: ed3, bot: ed3 });
    const pair2 = new AllelePair({ top: md299, bot: md299 });

    expect(pair1.top.name).toBe(ed3.name);
    expect(pair1.bot.name).toBe(ed3.name);

    expect(pair2.top.name).toBe(md299.name);
    expect(pair2.bot.name).toBe(md299.name);
  });

  test('constructs heterozygous pair', () => {
    const pair1 = new AllelePair({ top: ed3.getWildCopy(), bot: ed3 });
    const pair2 = new AllelePair({ top: md299, bot: md299.getWildCopy() });

    expect(pair1.top.name).toBe(WILD_ALLELE_NAME);
    expect(pair1.bot.name).toBe(ed3.name);

    expect(pair2.top.name).toBe(md299.name);
    expect(pair2.bot.name).toBe(WILD_ALLELE_NAME);
  });

  test('auto assigns empty wild to an allele', () => {
    const pair1 = new AllelePair({ top: ed3.getWildCopy(), bot: ed3 });
    const pair2 = new AllelePair({ top: md299, bot: md299.getWildCopy() });

    expect(pair1.top.name).toBe(WILD_ALLELE_NAME);
    expect(pair1.top.getChromosome()).toBe(ed3.getChromosome());
    expect(pair1.top.getGenPosition()).toBe(ed3.getGenPosition());

    expect(pair2.bot.name).toBe(WILD_ALLELE_NAME);
    expect(pair2.bot.getChromosome()).toBe(md299.getChromosome());
    expect(pair2.bot.getGenPosition()).toBe(md299.getGenPosition());
  });

  test('.looseEquals() for duplicate allele pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: e204, bot: e204 });
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);

    const pair3 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair4 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    expect(pair3.looseEquals(pair4)).toBe(true);
    expect(pair3.looseEquals(pair4)).toBe(true);
  });
  test('.looseEquals() for flipped allele pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair2 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);
  });
  test('.looseEquals() returns false for different allele pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair2 = new AllelePair({ top: ox802, bot: ox802.getWildCopy() });
    expect(pair1.looseEquals(pair2)).toBe(false);
    expect(pair2.looseEquals(pair1)).toBe(false);

    const pair3 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    expect(pair2.looseEquals(pair3)).toBe(false);
    expect(pair3.looseEquals(pair2)).toBe(false);
  });
  test('.looseEquals() returns false for homozygous vs heterozygous pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair3 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    expect(pair1.looseEquals(pair2)).toBe(false);
    expect(pair2.looseEquals(pair1)).toBe(false);
    expect(pair1.looseEquals(pair3)).toBe(false);
    expect(pair3.looseEquals(pair1)).toBe(false);
  });
  test('.strictEquals() for duplicate allele pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: e204, bot: e204 });
    expect(pair1.strictEquals(pair2)).toBe(true);
    expect(pair2.strictEquals(pair1)).toBe(true);

    const pair3 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair4 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    expect(pair3.strictEquals(pair4)).toBe(true);
    expect(pair3.strictEquals(pair4)).toBe(true);
  });
  test('.strictEquals() returns false for flipped allele pairs', () => {
    const pair1 = new AllelePair({ top: ox802, bot: ox802.getWildCopy() });
    const pair2 = new AllelePair({ top: ox802.getWildCopy(), bot: ox802 });
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });
  test('.strictEquals() returns false for different allele pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: ox802, bot: ox802 });
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });
  test('.strictEquals() returns false for homozygous vs heterozygous pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });

  test('.getAllele() returns base allele from homozygous pair', () => {
    const pair1 = new AllelePair({ top: oxTi302, bot: oxTi302 });
    expect(pair1.getAllele().name).toEqual(oxTi302.name);
  });
  test('.getAllele() returns base allele from heterozygous pair', () => {
    const pair1 = new AllelePair({ top: oxTi302, bot: oxTi302.getWildCopy() });
    const pair2 = new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 });
    expect(pair1.getAllele().name).toEqual(oxTi302.name);
    expect(pair2.getAllele().name).toEqual(oxTi302.name);
  });
  test('.getAllele() returns wild allele from wild pair', () => {
    const pair1 = new AllelePair({
      top: ed3.getWildCopy(),
      bot: ed3.getWildCopy(),
    });
    const pair2 = new AllelePair({
      top: ed3.getWildCopy(),
      bot: ed3.getWildCopy(),
    });
    expect(pair1.getAllele().name).toEqual(WILD_ALLELE_NAME);
    expect(pair2.getAllele().name).toEqual(WILD_ALLELE_NAME);
  });

  test('.isOfSameGeneOrVariation() returns true on homozygous pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: e204, bot: e204 });
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(true);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(true);
  });
  test('.isOfSameGeneOrVariation() returns true on heterozygous pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair2 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair3 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(true);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(true);
    expect(pair1.isOfSameGeneOrVariation(pair3)).toBe(true);
    expect(pair3.isOfSameGeneOrVariation(pair1)).toBe(true);
  });
  test('.isOfSameGeneOrVariation() returns true on homo <--> het pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair3 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(true);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(true);
    expect(pair1.isOfSameGeneOrVariation(pair3)).toBe(true);
    expect(pair3.isOfSameGeneOrVariation(pair1)).toBe(true);
  });
  test('.isOfSameGeneOrVariation() returns false on differing homozygous pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204 });
    const pair2 = new AllelePair({ top: ox802, bot: ox802 });
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(false);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(false);
  });
  test('.isOfSameGeneOrVariation() returns false on differing heterozygous pairs', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair2 = new AllelePair({ top: ox802, bot: ox802.getWildCopy() });
    const pair3 = new AllelePair({ top: ox802.getWildCopy(), bot: ox802 });
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(false);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(false);
    expect(pair1.isOfSameGeneOrVariation(pair3)).toBe(false);
    expect(pair3.isOfSameGeneOrVariation(pair1)).toBe(false);
  });
  test('.isOfSameGeneOrVariation() returns false on differing homo <--> het pairs', () => {
    const homoE204 = new AllelePair({ top: e204, bot: e204 });
    const homoOx802 = new AllelePair({ top: ox802, bot: ox802 });
    const hetE204 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    const hetOx802 = new AllelePair({ top: ox802, bot: ox802.getWildCopy() });
    expect(homoE204.isOfSameGeneOrVariation(hetOx802)).toBe(false);
    expect(hetOx802.isOfSameGeneOrVariation(homoE204)).toBe(false);
    expect(homoOx802.isOfSameGeneOrVariation(hetE204)).toBe(false);
    expect(hetE204.isOfSameGeneOrVariation(homoOx802)).toBe(false);
  });

  test('.hasSameGenLoc() returns true on homo <--> homo pairs', () => {
    // both alleles belong to unc-44 gene --> same gen loc
    const homoOx750 = new AllelePair({ top: ox750, bot: ox750 });
    const homoOx802 = new AllelePair({ top: ox802, bot: ox802 });

    expect(homoOx750.hasSameGenLoc(homoOx750)).toBe(true);
    expect(homoOx750.hasSameGenLoc(homoOx802)).toBe(true);
    expect(homoOx802.hasSameGenLoc(homoOx802)).toBe(true);
    expect(homoOx802.hasSameGenLoc(homoOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on homo <--> het pairs', () => {
    // both alleles belong to unc-44 gene --> same gen loc
    const homoOx750 = new AllelePair({ top: ox750, bot: ox750 });
    const hetOx802 = new AllelePair({ top: ox802, bot: ox802.getWildCopy() });

    expect(homoOx750.hasSameGenLoc(hetOx802)).toBe(true);
    expect(hetOx802.hasSameGenLoc(homoOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on het <--> het pairs', () => {
    // both alleles belong to unc-44 gene --> same gen loc
    const hetOx750 = new AllelePair({ top: ox750, bot: ox750.getWildCopy() });
    const hetOx802 = new AllelePair({ top: ox802.getWildCopy(), bot: ox802 });

    expect(hetOx750.hasSameGenLoc(hetOx802)).toBe(true);
    expect(hetOx802.hasSameGenLoc(hetOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on homo <--> wild pairs', () => {
    // both alleles belong to unc-44 gene --> same gen loc
    const homoOx750 = new AllelePair({ top: ox750, bot: ox750 });
    const wildOx750 = new AllelePair({
      top: ox750.getWildCopy(),
      bot: ox750.getWildCopy(),
    });

    expect(homoOx750.hasSameGenLoc(wildOx750)).toBe(true);
    expect(wildOx750.hasSameGenLoc(homoOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on het <--> wild pairs', () => {
    // both alleles belong to unc-44 gene --> same gen loc
    const hetOx750 = new AllelePair({ top: ox750, bot: ox750.getWildCopy() });
    const wildOx750 = new AllelePair({
      top: ox750.getWildCopy(),
      bot: ox750.getWildCopy(),
    });

    expect(hetOx750.hasSameGenLoc(wildOx750)).toBe(true);
    expect(wildOx750.hasSameGenLoc(hetOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns false on pairs with different locations', () => {
    // both alleles are variations with unknown genetic locations
    const homoEd3 = new AllelePair({ top: ed3, bot: ed3 });
    const hetEd3 = new AllelePair({ top: ed3, bot: ed3.getWildCopy() });
    const wildEd3 = new AllelePair({
      top: ed3.getWildCopy(),
      bot: ed3.getWildCopy(),
    });

    const homoN765 = new AllelePair({ top: n765, bot: n765 });
    const hetN765 = new AllelePair({ top: n765, bot: n765.getWildCopy() });
    const wildn765 = new AllelePair({
      top: n765.getWildCopy(),
      bot: n765.getWildCopy(),
    });

    expect(homoEd3.hasSameGenLoc(homoN765)).toBe(false);
    expect(homoEd3.hasSameGenLoc(hetN765)).toBe(false);
    expect(homoEd3.hasSameGenLoc(wildn765)).toBe(false);
    expect(hetEd3.hasSameGenLoc(hetN765)).toBe(false);
    expect(hetEd3.hasSameGenLoc(wildn765)).toBe(false);
    expect(wildEd3.hasSameGenLoc(wildn765)).toBe(false);
  });
  test('.hasSameGenLoc() returns false on pairs with undefined loc', () => {
    // both alleles are variations with unknown genetic locations
    const homoOxEx12345 = new AllelePair({ top: oxEx12345, bot: oxEx12345 });
    const hetOxEx12345 = new AllelePair({
      top: oxEx12345,
      bot: oxEx12345.getWildCopy(),
    });
    const wildOxEx12345 = new AllelePair({
      top: oxEx12345.getWildCopy(),
      bot: oxEx12345.getWildCopy(),
    });

    const homoOxEx219999 = new AllelePair({ top: oxEx219999, bot: oxEx219999 });
    const hetOxEx219999 = new AllelePair({
      top: oxEx219999,
      bot: oxEx219999.getWildCopy(),
    });
    const wildOxEx219999 = new AllelePair({
      top: oxEx219999.getWildCopy(),
      bot: oxEx219999.getWildCopy(),
    });

    expect(homoOxEx12345.hasSameGenLoc(homoOxEx12345)).toBe(false);
    expect(homoOxEx12345.hasSameGenLoc(homoOxEx219999)).toBe(false);
    expect(homoOxEx12345.hasSameGenLoc(hetOxEx219999)).toBe(false);
    expect(homoOxEx12345.hasSameGenLoc(wildOxEx219999)).toBe(false);
    expect(hetOxEx12345.hasSameGenLoc(hetOxEx219999)).toBe(false);
    expect(hetOxEx12345.hasSameGenLoc(wildOxEx219999)).toBe(false);
    expect(wildOxEx12345.hasSameGenLoc(wildOxEx219999)).toBe(false);
  });

  test('.isWild() returns true on wild pairs', () => {
    const wildEd3 = new AllelePair({
      top: ed3.getWildCopy(),
      bot: ed3.getWildCopy(),
    });
    const wildStrain = new AllelePair({
      top: md299.getWildCopy(),
      bot: md299.getWildCopy(),
    });
    expect(wildEd3.isWild()).toBe(true);
    expect(wildStrain.isWild()).toBe(true);
  });
  test('.isWild() returns false on wild het pairs', () => {
    const hetEd3 = new AllelePair({ top: ed3.getWildCopy(), bot: ed3 });
    const hetOx750 = new AllelePair({ top: ox750, bot: ox750.getWildCopy() });
    expect(hetEd3.isWild()).toBe(false);
    expect(hetOx750.isWild()).toBe(false);
  });
  test('.isWild() returns false on wild homo pairs', () => {
    const homoEd3 = new AllelePair({ top: ed3, bot: ed3 });
    expect(homoEd3.isWild()).toBe(false);
  });

  test('.isHomo() returns false on het pairs', () => {
    const hetEd3 = new AllelePair({ top: ed3, bot: ed3.getWildCopy() });
    const hetOx802 = new AllelePair({ top: ox802.getWildCopy(), bot: ox802 });
    expect(hetEd3.isHomo()).toBe(false);
    expect(hetOx802.isHomo()).toBe(false);
  });
  test('.isHomo() returns true on homo pairs', () => {
    const homoEd3 = new AllelePair({ top: ed3, bot: ed3 });
    expect(homoEd3.isHomo()).toBe(true);
  });

  test('.getFlippedPair() on homozygous pair', () => {
    const pair = new AllelePair({ top: e204, bot: e204 });
    const flipped = pair.getFlippedPair();
    expect(pair).not.toBe(flipped); // different instantiations
    expect(pair.top.name).toEqual(flipped.bot.name);
    expect(pair.bot.name).toEqual(flipped.top.name);
  });
  test('.getFlippedPair() on heterozygous pair', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair2 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    const flipped1 = pair1.getFlippedPair();
    const flipped2 = pair2.getFlippedPair();

    expect(pair1).not.toEqual(flipped1); // different instantiations
    expect(pair2).not.toEqual(flipped2); // different instantiations
    expect(pair1.top.name).toEqual(flipped1.bot.name);
    expect(pair1.bot.name).toEqual(flipped1.top.name);
    expect(pair2.top.name).toEqual(flipped2.bot.name);
    expect(pair2.bot.name).toEqual(flipped2.top.name);
  });

  test('.flip() mutates current pair', () => {
    const pair = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const oldTop = pair.top;
    const oldBot = pair.bot;

    pair.flip();
    expect(pair.top).toBe(oldBot);
    expect(pair.bot).toBe(oldTop);

    pair.flip();
    expect(pair.top).toBe(oldTop);
    expect(pair.bot).toBe(oldBot);
  });

  test('.clone() on homozygous pair', () => {
    const pair = new AllelePair({ top: e204, bot: e204 });
    const clone = pair.clone();
    expect(pair).not.toBe(clone); // different instantiations
    expect(pair.top.name).toEqual(clone.top.name);
    expect(pair.bot.name).toEqual(clone.bot.name);
    expect(pair).toEqual(clone);
  });
  test('.clone() on heterozygous pair', () => {
    const pair1 = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const pair2 = new AllelePair({ top: e204.getWildCopy(), bot: e204 });
    const clone1 = pair1.clone();
    const clone2 = pair2.clone();

    expect(pair1).not.toBe(clone1); // different instantiations
    expect(pair2).not.toBe(clone2); // different instantiations
    expect(pair1.top.name).toEqual(clone1.top.name);
    expect(pair1.bot.name).toEqual(clone1.bot.name);
    expect(pair2.top.name).toEqual(clone2.top.name);
    expect(pair2.bot.name).toEqual(clone2.bot.name);
    expect(pair1).toEqual(clone1);
    expect(pair2).toEqual(clone2);
  });

  test('.getChromatid() returns top chromatid', () => {
    const chromosome = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 }),
    ];

    const topChromatid = [e204, ox802, oxTi302.getWildCopy()];
    const chromatidResult = AllelePair.getChromatid(chromosome, 'top');

    expect(chromatidResult).toHaveLength(topChromatid.length);
    for (let i = 0; i < chromatidResult.length; i++)
      expect(chromatidResult[i].name).toBe(topChromatid[i].name);
  });
  test('.getChromatid() returns bottom chromatid', () => {
    const chromosome = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 }),
    ];

    const botChromatid = [e204.getWildCopy(), ox802, oxTi302];
    const chromatidResult = AllelePair.getChromatid(chromosome, 'bot');

    expect(chromatidResult).toHaveLength(botChromatid.length);
    for (let i = 0; i < chromatidResult.length; i++)
      expect(chromatidResult[i].name).toBe(botChromatid[i].name);
  });

  test('.chromosomesMatch() for duplicate chromosomes', () => {
    const chrom1 = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 }),
    ];
    const chrom2 = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 }),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(true);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(true);
  });
  test('.chromosomesMatch() for flipped chromosomes', () => {
    const chrom1 = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 }),
    ];
    const chrom2 = [
      new AllelePair({ top: e204.getWildCopy(), bot: e204 }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302, bot: oxTi302.getWildCopy() }),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(true);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(true);
  });
  test('.chromosomesMatch() returns false for different chromosomes', () => {
    const chrom1 = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 }),
    ];
    const chrom2 = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: ox1059.getWildCopy(), bot: ox1059 }),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(false);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(false);
  });

  test('.chromosomesMatch() returns false for different chromosome with wild allele', () => {
    const chrom1 = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxTi302.getWildCopy(), bot: oxTi302 }),
    ];
    const chrom2 = [
      new AllelePair({ top: e204, bot: e204.getWildCopy() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({
        top: oxTi302.getWildCopy(),
        bot: oxTi302.getWildCopy(),
      }),
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(false);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(false);
  });

  test('.chromosomesMatch() ignores order, top/bottom-ness in ECA', () => {
    const chrom1 = [
      new AllelePair({
        top: oxEx12345,
        bot: oxEx12345.getWildCopy(),
        isECA: true,
      }), // A
      new AllelePair({
        top: oxEx12345.getWildCopy(),
        bot: oxEx12345,
        isECA: true,
      }), // B
      new AllelePair({
        top: oxEx219999.getWildCopy(),
        bot: oxEx219999,
        isECA: true,
      }), // C
    ];
    const chrom2 = [
      new AllelePair({
        top: oxEx219999.getWildCopy(),
        bot: oxEx219999,
        isECA: true,
      }), // C
      new AllelePair({
        top: oxEx12345.getWildCopy(),
        bot: oxEx12345,
        isECA: true,
      }), // A (flipped)
      new AllelePair({
        top: oxEx12345.getWildCopy(),
        bot: oxEx12345,
        isECA: true,
      }), // B
    ];
    expect(AllelePair.chromosomesMatch(chrom1, chrom2)).toBe(true);
    expect(AllelePair.chromosomesMatch(chrom2, chrom1)).toBe(true);
  });

  it('should be able to serialize and deserialize', () => {
    const pair = new AllelePair({ top: e204, bot: e204.getWildCopy() });
    const str = pair.toJSON();
    const pairBack = AllelePair.fromJSON(str);
    expect(pair.strictEquals(pairBack)).toBe(true);
    expect(pair).toEqual(pairBack);
  });
});
