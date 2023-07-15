import { expect, test, describe } from 'vitest';
import {
  e204,
  ox802,
  ox1059,
  oxIs363,
  md299,
} from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import {
  ChromosomePair,
  chromsEqual,
} from 'models/frontend/ChromosomePair/ChromosomePair';
import { type ChromosomeName } from 'models/db/filter/db_ChromosomeName';
import { cmpChromName } from 'models/frontend/Strain/Strain';

describe('ChromosomePair', () => {
  test('Constructor sorts alleles', () => {
    const chromosomePair = new ChromosomePair([
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: e204, bot: e204.toWild() }),
    ]);

    // Notice sorted order
    expect(chromosomePair.allelePairs).toEqual([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
    ]);
  });

  test('Constructor throws error when alleles are on different chromosomes', () => {
    expect(
      () =>
        new ChromosomePair([
          new AllelePair({ top: ox802, bot: ox802 }),
          new AllelePair({ top: md299, bot: md299.toWild() }),
        ])
    ).toThrow();
  });

  test('.getTop() returns top chrom', () => {
    const chromosomePair = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363.toWild(), bot: oxIs363 }),
    ]);

    const expected = [e204, ox802, oxIs363.toWild()];
    const topChrom = chromosomePair.getTop();

    expect(topChrom).toHaveLength(expected.length);
    topChrom.every((allele, idx) => allele.equals(expected[idx]));
  });

  test('.getBot() returns bot chrom', () => {
    const chromosomePair = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363.toWild(), bot: oxIs363 }),
    ]);

    const expected = [e204.toWild(), ox802, oxIs363];
    const botChrom = chromosomePair.getBot();

    expect(botChrom).toHaveLength(expected.length);
    botChrom.every((allele, idx) => allele.equals(expected[idx]));
  });

  test('.equals() true for equivalent same-side chromosome pairs', () => {
    const chromPair1 = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363.toWild(), bot: oxIs363 }),
    ]);
    const chromPair2 = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363.toWild(), bot: oxIs363 }),
    ]);

    expect(chromPair1.equals(chromPair2)).toBe(true);
    expect(chromPair2.equals(chromPair1)).toBe(true);
  });

  test('.equals() true for for equivalent flipped chromosome pairs', () => {
    const chromPair1 = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363.toWild(), bot: oxIs363 }),
    ]);
    const chromPair2 = new ChromosomePair([
      new AllelePair({ top: e204.toWild(), bot: e204 }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363, bot: oxIs363.toWild() }),
    ]);

    expect(chromPair1.equals(chromPair2)).toBe(true);
    expect(chromPair2.equals(chromPair1)).toBe(true);
  });

  test('.equals() false for different chromosome pairs (allele mismatch)', () => {
    const chromPair1 = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363.toWild(), bot: oxIs363 }),
    ]);
    const chromPair2 = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: ox1059.toWild(), bot: ox1059 }),
    ]);

    expect(chromPair1.equals(chromPair2)).toBe(false);
    expect(chromPair2.equals(chromPair1)).toBe(false);
  });

  test('.equals() false for different chromosome pairs (wildness mismatch)', () => {
    const chromPair1 = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({ top: oxIs363.toWild(), bot: oxIs363 }),
    ]);
    const chromPair2 = new ChromosomePair([
      new AllelePair({ top: e204, bot: e204.toWild() }),
      new AllelePair({ top: ox802, bot: ox802 }),
      new AllelePair({
        top: oxIs363.toWild(),
        bot: oxIs363.toWild(),
      }),
    ]);

    expect(chromPair1.equals(chromPair2)).toBe(false);
    expect(chromPair2.equals(chromPair1)).toBe(false);
  });

  test('chromsEqual() true when equal', () => {
    const chrom1 = [e204, ox802, oxIs363.toWild()];
    const chrom2 = [...chrom1];

    expect(chromsEqual(chrom1, chrom2));
    expect(chromsEqual(chrom2, chrom1));
  });

  test('chromsEqual() false when unequal', () => {
    const chrom1 = [e204, ox802, oxIs363.toWild()];
    const chrom2 = [e204, ox802, oxIs363];

    expect(chromsEqual(chrom1, chrom2));
    expect(chromsEqual(chrom2, chrom1));
  });

  test('cmpChromName() correctly orders chromosomes', () => {
    const expected: Array<ChromosomeName | undefined> = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'X',
      'Ex',
      undefined,
    ];
    const beforeSort: Array<ChromosomeName | undefined> = [
      'II',
      'I',
      'X',
      undefined,
      'Ex',
      'V',
      'IV',
      'III',
    ];
    const afterSort = beforeSort.sort(cmpChromName);
    afterSort.forEach((chrom, idx) => {
      expect(chrom).toEqual(expected[idx]);
    });
  });

  test('cmpChromName() puts undefined at end', () => {
    const beforeSort: Array<ChromosomeName | undefined> = [
      'II',
      undefined,
      'I',
    ];
    const expected: Array<ChromosomeName | undefined> = ['I', 'II', undefined];
    const afterSort = beforeSort.sort(cmpChromName);
    afterSort.forEach((chrom, idx) => {
      expect(chrom).toEqual(expected[idx]);
    });
  });

  test('(De)serializes', () => {
    const chromPair = new ChromosomePair([
      e204.toTopHet(),
      ox802.toHomo(),
      oxIs363.toBotHet(),
    ]);
    const str = chromPair.toJSON();
    const chromPairBack = ChromosomePair.fromJSON(str);
    expect(chromPairBack).toEqual(chromPair);
    expect(chromPairBack.allelePairs).toBeDefined();
    expect(chromPairBack.toJSON).toBeDefined();
  });
});
