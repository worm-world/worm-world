import { expect, test, describe } from 'vitest';
import { ed3, n765 } from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/Strain/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { CrossEditorFilter } from 'components/CrossFilterModal/CrossEditorFilter';
import { ed3HomoHerm } from 'models/frontend/CrossTree/CrossTree.mock';

describe('CrossEditorFilter', () => {
  test('correctly instantiates', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
    });
    expect(filter.alleleNames).toHaveLength(3);
    expect(filter.alleleNames.has('a')).toBe(true);
    expect(filter.exprPhenotypes).toHaveLength(2);
    expect(filter.exprPhenotypes.has('2')).toBe(true);
    expect(filter.reqConditions).toHaveLength(1);
    expect(filter.has('cond1')).toBe(true);
    expect(filter.supConditions).toHaveLength(0);
  });

  test('.clone() creates a identical copy', () => {
    const alleleNames = new Set(['a', 'b', 'c']);
    const exprPhenotypes = new Set(['1', '2']);
    const reqConditions = new Set(['cond1']);
    const supConditions = new Set<string>();
    const filter = new CrossEditorFilter({
      alleleNames,
      exprPhenotypes,
      reqConditions,
      supConditions,
    });
    const clone = filter.clone();

    expect(clone).not.toBe(filter); // not same reference
    expect(clone.alleleNames).toEqual(alleleNames);
    expect(clone.exprPhenotypes).toEqual(exprPhenotypes);
    expect(clone.reqConditions).toEqual(reqConditions);
    expect(clone.supConditions).toEqual(supConditions);
  });

  test('.has() returns true if the filter contains the query', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
    });
    expect(filter.has('a')).toBe(true);
    expect(filter.has('b')).toBe(true);
    expect(filter.has('c')).toBe(true);
    expect(filter.has('1')).toBe(true);
    expect(filter.has('2')).toBe(true);
    expect(filter.has('cond1')).toBe(true);
  });
  test('.has() returns false if the filter does not contain the query', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
    });

    expect(filter.has('')).toBe(false);
    expect(filter.has('random')).toBe(false);
    expect(filter.has('not a value')).toBe(false);
    expect(filter.has('idk')).toBe(false);
  });

  test('.isEmpty() to return true on an empty filter', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(),
      exprPhenotypes: new Set(),
      reqConditions: new Set(),
      supConditions: new Set(),
    });
    expect(filter.isEmpty()).toBe(true);
  });
  test('.isEmpty() to return false on an set filter', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(),
      exprPhenotypes: new Set(),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
    });
    expect(filter.isEmpty()).toBe(false);
  });

  test('.extractCrossFilterNames() to pull info from strain', () => {
    const strain = new Strain({
      allelePairs: [
        new AllelePair({ top: n765, bot: n765.getWildCopy() }),
        new AllelePair({ top: ed3, bot: ed3 }),
      ],
    });
    const names = CrossEditorFilter.extractCrossFilterNames(strain);

    expect(names.alleleNames).toEqual(new Set(['n765', 'ed3']));
    expect(names.exprPhenotypes).toEqual(new Set(['unc-119', 'lin-15B']));
    expect(names.reqConditions).toEqual(new Set(['25C']));
    expect(names.supConditions).toEqual(new Set<string>());
  });

  test('.condenseCrossFilterNames() pulls info from multiple strains', () => {
    const strain1 = new Strain({
      allelePairs: [new AllelePair({ top: n765, bot: n765.getWildCopy() })],
    });
    const strain2 = new Strain({
      allelePairs: [
        new AllelePair({ top: ed3, bot: ed3 }),
        new AllelePair({ top: n765, bot: n765.getWildCopy() }),
      ],
    });
    const names = CrossEditorFilter.condenseCrossFilterNames([
      strain1,
      strain2,
    ]);

    expect(names.alleleNames).toEqual(new Set(['n765', 'ed3']));
    expect(names.exprPhenotypes).toEqual(new Set(['unc-119', 'lin-15B']));
    expect(names.reqConditions).toEqual(new Set(['25C']));
    expect(names.supConditions).toEqual(new Set<string>());
  });

  test('includedInFilter() correctly includes a node', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(['ed3']),
      exprPhenotypes: new Set(['unc-119']),
      reqConditions: new Set(),
      supConditions: new Set(),
    });
    expect(CrossEditorFilter.includedInFilter(ed3HomoHerm, filter)).toBe(true);
  });
  test('includedInFilter() correctly excludes a node', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(),
      exprPhenotypes: new Set(),
      reqConditions: new Set(['badCondition']),
      supConditions: new Set(),
    });
    expect(CrossEditorFilter.includedInFilter(ed3HomoHerm, filter)).toBe(false);
  });

  test('correctly (de)serializes', () => {
    const filter = new CrossEditorFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
    });
    const filterStr = filter.toJSON();
    const filterBack = CrossEditorFilter.fromJSON(filterStr);
    expect(filterBack).toEqual(filter);
  });
});
