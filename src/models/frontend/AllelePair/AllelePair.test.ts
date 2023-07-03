import {
  e204,
  ed3,
  md299,
  n765,
  ox750,
  ox802,
  oxEx12345,
  oxEx219999,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { expect, test, describe } from 'vitest';
import { WILD_ALLELE_NAME } from 'models/frontend/Allele/Allele';

describe('allele pair', () => {
  test('constructs homozygous pair', () => {
    const pair1 = ed3.toHomoPair();
    const pair2 = md299.toHomoPair();

    expect(pair1.top.name).toBe(ed3.name);
    expect(pair1.bot.name).toBe(ed3.name);

    expect(pair2.top.name).toBe(md299.name);
    expect(pair2.bot.name).toBe(md299.name);
  });

  test('constructs heterozygous pair', () => {
    const pair1 = ed3.toBotHetPair();
    const pair2 = md299.toTopHetPair();

    expect(pair1.top.name).toBe(WILD_ALLELE_NAME);
    expect(pair1.bot.name).toBe(ed3.name);

    expect(pair2.top.name).toBe(md299.name);
    expect(pair2.bot.name).toBe(WILD_ALLELE_NAME);
  });

  test('auto assigns empty wild to an allele', () => {
    const pair1 = ed3.toBotHetPair();
    const pair2 = md299.toTopHetPair();

    expect(pair1.top.name).toBe(WILD_ALLELE_NAME);
    expect(pair1.top.getChromName()).toBe(ed3.getChromName());
    expect(pair1.top.getGenPosition()).toBe(ed3.getGenPosition());

    expect(pair2.bot.name).toBe(WILD_ALLELE_NAME);
    expect(pair2.bot.getChromName()).toBe(md299.getChromName());
    expect(pair2.bot.getGenPosition()).toBe(md299.getGenPosition());
  });

  test('.looseEquals() for duplicate allele pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = e204.toHomoPair();
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);

    const pair3 = e204.toTopHetPair();
    const pair4 = e204.toTopHetPair();
    expect(pair3.looseEquals(pair4)).toBe(true);
    expect(pair3.looseEquals(pair4)).toBe(true);
  });
  test('.looseEquals() for flipped allele pairs', () => {
    const pair1 = e204.toTopHetPair();
    const pair2 = e204.toBotHetPair();
    expect(pair1.looseEquals(pair2)).toBe(true);
    expect(pair2.looseEquals(pair1)).toBe(true);
  });
  test('.looseEquals() returns false for different allele pairs', () => {
    const pair1 = e204.toTopHetPair();
    const pair2 = ox802.toTopHetPair();
    expect(pair1.looseEquals(pair2)).toBe(false);
    expect(pair2.looseEquals(pair1)).toBe(false);

    const pair3 = e204.toBotHetPair();
    expect(pair2.looseEquals(pair3)).toBe(false);
    expect(pair3.looseEquals(pair2)).toBe(false);
  });
  test('.looseEquals() returns false for homozygous vs heterozygous pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = e204.toTopHetPair();
    const pair3 = e204.toBotHetPair();
    expect(pair1.looseEquals(pair2)).toBe(false);
    expect(pair2.looseEquals(pair1)).toBe(false);
    expect(pair1.looseEquals(pair3)).toBe(false);
    expect(pair3.looseEquals(pair1)).toBe(false);
  });
  test('.strictEquals() for duplicate allele pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = e204.toHomoPair();
    expect(pair1.strictEquals(pair2)).toBe(true);
    expect(pair2.strictEquals(pair1)).toBe(true);

    const pair3 = e204.toTopHetPair();
    const pair4 = e204.toTopHetPair();
    expect(pair3.strictEquals(pair4)).toBe(true);
    expect(pair3.strictEquals(pair4)).toBe(true);
  });
  test('.strictEquals() returns false for flipped allele pairs', () => {
    const pair1 = ox802.toTopHetPair();
    const pair2 = ox802.toBotHetPair();
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });
  test('.strictEquals() returns false for different allele pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = ox802.toHomoPair();
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });
  test('.strictEquals() returns false for homozygous vs heterozygous pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = e204.toBotHetPair();
    expect(pair1.strictEquals(pair2)).toBe(false);
    expect(pair2.strictEquals(pair1)).toBe(false);
  });

  test('.isOfSameGeneOrVariation() returns true on homozygous pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = e204.toHomoPair();
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(true);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(true);
  });
  test('.isOfSameGeneOrVariation() returns true on heterozygous pairs', () => {
    const pair1 = e204.toTopHetPair();
    const pair2 = e204.toTopHetPair();
    const pair3 = e204.toBotHetPair();
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(true);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(true);
    expect(pair1.isOfSameGeneOrVariation(pair3)).toBe(true);
    expect(pair3.isOfSameGeneOrVariation(pair1)).toBe(true);
  });
  test('.isOfSameGeneOrVariation() returns true on homo <--> het pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = e204.toTopHetPair();
    const pair3 = e204.toBotHetPair();
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(true);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(true);
    expect(pair1.isOfSameGeneOrVariation(pair3)).toBe(true);
    expect(pair3.isOfSameGeneOrVariation(pair1)).toBe(true);
  });
  test('.isOfSameGeneOrVariation() returns false on differing homozygous pairs', () => {
    const pair1 = e204.toHomoPair();
    const pair2 = ox802.toHomoPair();
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(false);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(false);
  });
  test('.isOfSameGeneOrVariation() returns false on differing heterozygous pairs', () => {
    const pair1 = e204.toTopHetPair();
    const pair2 = ox802.toTopHetPair();
    const pair3 = ox802.toBotHetPair();
    expect(pair1.isOfSameGeneOrVariation(pair2)).toBe(false);
    expect(pair2.isOfSameGeneOrVariation(pair1)).toBe(false);
    expect(pair1.isOfSameGeneOrVariation(pair3)).toBe(false);
    expect(pair3.isOfSameGeneOrVariation(pair1)).toBe(false);
  });
  test('.isOfSameGeneOrVariation() returns false on differing homo <--> het pairs', () => {
    const homoE204 = e204.toHomoPair();
    const homoOx802 = ox802.toHomoPair();
    const hetE204 = e204.toBotHetPair();
    const hetOx802 = ox802.toTopHetPair();
    expect(homoE204.isOfSameGeneOrVariation(hetOx802)).toBe(false);
    expect(hetOx802.isOfSameGeneOrVariation(homoE204)).toBe(false);
    expect(homoOx802.isOfSameGeneOrVariation(hetE204)).toBe(false);
    expect(hetE204.isOfSameGeneOrVariation(homoOx802)).toBe(false);
  });

  test('.hasSameGenLoc() returns true on homo <--> homo pairs', () => {
    // both alleles belong to unc-44 gene --> same gen loc
    const homoOx750 = ox750.toHomoPair();
    const homoOx802 = ox802.toHomoPair();

    expect(homoOx750.hasSameGenLoc(homoOx750)).toBe(true);
    expect(homoOx750.hasSameGenLoc(homoOx802)).toBe(true);
    expect(homoOx802.hasSameGenLoc(homoOx802)).toBe(true);
    expect(homoOx802.hasSameGenLoc(homoOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on homo <--> het pairs', () => {
    // both alleles belong to unc-44 gen, have same gen loc
    const homoOx750 = ox750.toHomoPair();
    const hetOx802 = ox802.toTopHetPair();

    expect(homoOx750.hasSameGenLoc(hetOx802)).toBe(true);
    expect(hetOx802.hasSameGenLoc(homoOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on het <--> het pairs', () => {
    // both alleles belong to unc-44 gene, have same gen loc
    const hetOx750 = ox750.toTopHetPair();
    const hetOx802 = ox802.toBotHetPair();

    expect(hetOx750.hasSameGenLoc(hetOx802)).toBe(true);
    expect(hetOx802.hasSameGenLoc(hetOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on homo <--> wild pairs', () => {
    // both alleles belong to unc-44 gene, have same gen loc
    const homoOx750 = ox750.toHomoPair();
    const wildOx750 = new AllelePair({
      top: ox750.toWild(),
      bot: ox750.toWild(),
    });

    expect(homoOx750.hasSameGenLoc(wildOx750)).toBe(true);
    expect(wildOx750.hasSameGenLoc(homoOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns true on het <--> wild pairs', () => {
    // both alleles belong to unc-44 gene --> same gen loc
    const hetOx750 = ox750.toTopHetPair();
    const wildOx750 = ox750.toWild().toHomoPair();

    expect(hetOx750.hasSameGenLoc(wildOx750)).toBe(true);
    expect(wildOx750.hasSameGenLoc(hetOx750)).toBe(true);
  });
  test('.hasSameGenLoc() returns false on pairs with different locations', () => {
    // both alleles are variations with unknown genetic locations
    const homoEd3 = ed3.toHomoPair();
    const hetEd3 = ed3.toTopHetPair();
    const wildEd3 = ed3.toWild().toHomoPair();

    const homoN765 = n765.toHomoPair();
    const hetN765 = n765.toTopHetPair();
    const wildn765 = n765.toWild().toHomoPair();

    expect(homoEd3.hasSameGenLoc(homoN765)).toBe(false);
    expect(homoEd3.hasSameGenLoc(hetN765)).toBe(false);
    expect(homoEd3.hasSameGenLoc(wildn765)).toBe(false);
    expect(hetEd3.hasSameGenLoc(hetN765)).toBe(false);
    expect(hetEd3.hasSameGenLoc(wildn765)).toBe(false);
    expect(wildEd3.hasSameGenLoc(wildn765)).toBe(false);
  });

  test('.hasSameGenLoc() returns false on pairs with undefined loc', () => {
    // both alleles are variations with unknown genetic locations
    const homoOxEx12345 = oxEx12345.toHomoPair();
    const hetOxEx12345 = oxEx12345.toTopHetPair();
    const wildOxEx12345 = oxEx12345.toWild().toHomoPair();
    const homoOxEx219999 = oxEx219999.toHomoPair();
    const hetOxEx219999 = oxEx219999.toTopHetPair();
    const wildOxEx219999 = oxEx219999.toWild().toHomoPair();

    expect(homoOxEx12345.hasSameGenLoc(homoOxEx12345)).toBe(false);
    expect(homoOxEx12345.hasSameGenLoc(homoOxEx219999)).toBe(false);
    expect(homoOxEx12345.hasSameGenLoc(hetOxEx219999)).toBe(false);
    expect(homoOxEx12345.hasSameGenLoc(wildOxEx219999)).toBe(false);
    expect(hetOxEx12345.hasSameGenLoc(hetOxEx219999)).toBe(false);
    expect(hetOxEx12345.hasSameGenLoc(wildOxEx219999)).toBe(false);
    expect(wildOxEx12345.hasSameGenLoc(wildOxEx219999)).toBe(false);
  });

  test('.isWild() returns true on wild pairs', () => {
    const wildEd3 = ed3.toWild().toHomoPair();
    const wildStrain = md299.toWild().toHomoPair();
    expect(wildEd3.isWild()).toBe(true);
    expect(wildStrain.isWild()).toBe(true);
  });

  test('.isWild() returns false on wild het pairs', () => {
    const hetEd3 = ed3.toBotHetPair();
    const hetOx750 = ox750.toTopHetPair();
    expect(hetEd3.isWild()).toBe(false);
    expect(hetOx750.isWild()).toBe(false);
  });

  test('.isWild() returns false on wild homo pairs', () => {
    const homoEd3 = ed3.toHomoPair();
    expect(homoEd3.isWild()).toBe(false);
  });

  test('.isHomo() returns false on het pairs', () => {
    const hetEd3 = ed3.toTopHetPair();
    const hetOx802 = ox802.toBotHetPair();
    expect(hetEd3.isHomo()).toBe(false);
    expect(hetOx802.isHomo()).toBe(false);
  });

  test('.isHomo() returns true on homo pairs', () => {
    const homoEd3 = ed3.toHomoPair();
    expect(homoEd3.isHomo()).toBe(true);
  });

  test('.flip() on homozygous pair', () => {
    const pair = e204.toHomoPair();
    const flipped = pair.flip();
    expect(pair).not.toBe(flipped); // different instantiations
    expect(pair.top.name).toEqual(flipped.bot.name);
    expect(pair.bot.name).toEqual(flipped.top.name);
  });

  test('.flip() on heterozygous pair', () => {
    const pair1 = e204.toTopHetPair();
    const pair2 = e204.toBotHetPair();
    const flipped1 = pair1.flip();
    const flipped2 = pair2.flip();

    expect(pair1).not.toEqual(flipped1); // different instantiations
    expect(pair2).not.toEqual(flipped2); // different instantiations
    expect(pair1.top.name).toEqual(flipped1.bot.name);
    expect(pair1.bot.name).toEqual(flipped1.top.name);
    expect(pair2.top.name).toEqual(flipped2.bot.name);
    expect(pair2.bot.name).toEqual(flipped2.top.name);
  });

  test('.clone() on homozygous pair', () => {
    const pair = e204.toHomoPair();
    const clone = pair.clone();
    expect(pair).not.toBe(clone); // different instantiations
    expect(pair.top.name).toEqual(clone.top.name);
    expect(pair.bot.name).toEqual(clone.bot.name);
    expect(pair).toEqual(clone);
  });

  test('.clone() on heterozygous pair', () => {
    const pair1 = e204.toTopHetPair();
    const pair2 = e204.toBotHetPair();
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

  test('(De)serializes', () => {
    const pair = e204.toTopHetPair();
    const str = pair.toJSON();
    const pairBack = AllelePair.fromJSON(str);
    expect(pairBack).toEqual(pair);
    expect(pairBack.toJSON).toBeDefined();
  });
});
