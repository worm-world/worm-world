import { expect, test, describe } from 'vitest';
import { ed3, n765 } from 'models/frontend/Allele/Allele.mock';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { Strain } from 'models/frontend/Strain/Strain';
import { StrainFilter } from 'models/frontend/StrainFilter/StrainFilter';
import { mockIPC, clearMocks } from '@tauri-apps/api/mocks';

beforeEach(() => {
  mockIPC((cmd, _) => {
    if (cmd === 'get_filtered_strain_alleles') return [];
  });
});

afterAll(() => {
  clearMocks();
});

describe('StrainFilter', () => {
  test('correctly instantiates', () => {
    const filter = new StrainFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
      hidden: new Set(),
    });
    expect(filter.alleleNames).toHaveLength(3);
    expect(filter.alleleNames.has('a')).toBe(true);
    expect(filter.exprPhenotypes).toHaveLength(2);
    expect(filter.exprPhenotypes.has('2')).toBe(true);
    expect(filter.reqConditions).toHaveLength(1);
    expect(filter.reqConditions.has('cond1')).toBe(true);
    expect(filter.supConditions).toHaveLength(0);
  });

  test('.clone() creates a identical copy', () => {
    const alleleNames = new Set(['a', 'b', 'c']);
    const exprPhenotypes = new Set(['1', '2']);
    const reqConditions = new Set(['cond1']);
    const supConditions = new Set<string>();
    const hidden = new Set<string>();
    const filter = new StrainFilter({
      alleleNames,
      exprPhenotypes,
      reqConditions,
      supConditions,
      hidden,
    });
    const clone = filter.clone();

    expect(clone).not.toBe(filter); // not same reference
    expect(clone.alleleNames).toEqual(alleleNames);
    expect(clone.exprPhenotypes).toEqual(exprPhenotypes);
    expect(clone.reqConditions).toEqual(reqConditions);
    expect(clone.supConditions).toEqual(supConditions);
  });

  test('.has() returns true if the filter contains the query', () => {
    const filter = new StrainFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
      hidden: new Set(),
    });
    expect(filter.alleleNames.has('a')).toBe(true);
    expect(filter.alleleNames.has('b')).toBe(true);
    expect(filter.alleleNames.has('c')).toBe(true);
    expect(filter.exprPhenotypes.has('1')).toBe(true);
    expect(filter.exprPhenotypes.has('2')).toBe(true);
    expect(filter.reqConditions.has('cond1')).toBe(true);
  });

  test('.has() returns false if the filter does not contain the query', () => {
    const filter = new StrainFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
      hidden: new Set(),
    });

    expect(filter.alleleNames.has('')).toBe(false);
    expect(filter.alleleNames.has('random')).toBe(false);
    expect(filter.alleleNames.has('not a value')).toBe(false);
    expect(filter.alleleNames.has('idk')).toBe(false);
  });

  test('.extractEditorFilterNames() to pull info from strain', async () => {
    const node = {
      data: await Strain.build({
        allelePairs: [n765.toTopHet(), ed3.toHomo()],
      }),
      id: '',
      position: { x: 0, y: 0 },
    };
    const options = StrainFilter.getFilterOptions([node]);

    expect(options.alleleNames).toEqual(new Set(['n765', '+', 'ed3']));
    expect(options.exprPhenotypes).toEqual(new Set(['unc-119', 'lin-15B']));
    expect(options.reqConditions).toEqual(new Set(['25C']));
    expect(options.supConditions).toEqual(new Set<string>());
  });

  test('.condenseEditorFilterNames() pulls info from multiple strains', async () => {
    const node1 = {
      data: await Strain.build({
        allelePairs: [new AllelePair({ top: n765, bot: n765.toWild() })],
      }),
      id: '',
      position: { x: 0, y: 0 },
    };
    const node2 = {
      data: await Strain.build({
        allelePairs: [ed3.toHomo(), n765.toTopHet()],
      }),
      id: '',
      position: { x: 0, y: 0 },
    };
    const options = StrainFilter.getFilterOptions([node1, node2]);

    expect(options.alleleNames).toEqual(new Set(['n765', '+', 'ed3']));
    expect(options.exprPhenotypes).toEqual(new Set(['unc-119', 'lin-15B']));
    expect(options.reqConditions).toEqual(new Set(['25C']));
    expect(options.supConditions).toEqual(new Set<string>());
  });

  test('correctly (de)serializes', () => {
    const filter = new StrainFilter({
      alleleNames: new Set(['a', 'b', 'c']),
      exprPhenotypes: new Set(['1', '2']),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
      hidden: new Set(),
    });
    const filterStr = filter.toJSON();
    const filterBack = StrainFilter.fromJSON(filterStr);
    expect(filterBack).toEqual(filter);
  });
});
