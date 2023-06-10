import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OffspringFilter } from 'components/OffspringFilter/OffspringFilter';
import { OffspringFilterModal } from 'components/OffspringFilterModal/OffspringFilterModal';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import { type StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import * as mockTrees from 'models/frontend/CrossTree/CrossTree.mock';
import { Strain } from 'models/frontend/Strain/Strain';
import { type Node } from 'reactflow';
import { vi, expect, test, describe } from 'vitest';

const renderComponent = ({
  childNodes = new Array<Node<StrainNodeModel>>(),
  invisibleSet = new Set<string>(),
  toggleVisible = vi.fn(),
  filter = new OffspringFilter({
    alleleNames: new Set(),
    exprPhenotypes: new Set(),
    reqConditions: new Set(),
    supConditions: new Set(),
  }),
  updateFilter = vi.fn(),
}): void => {
  render(
    <OffspringFilterModal
      childNodes={childNodes}
      invisibleSet={invisibleSet}
      toggleVisible={toggleVisible}
      filter={filter}
      updateFilter={updateFilter}
    />
  );
};

const createFilter = ({
  alleleNames = new Set(),
  exprPhenotypes = new Set(),
  reqConditions = new Set(),
  supConditions = new Set(),
}: {
  alleleNames?: Set<string>;
  exprPhenotypes?: Set<string>;
  reqConditions?: Set<string>;
  supConditions?: Set<string>;
}): OffspringFilter => {
  return new OffspringFilter({
    alleleNames,
    exprPhenotypes,
    reqConditions,
    supConditions,
  });
};

describe('OffspringFilterModal', () => {
  test('modal displays all nodes in map', () => {
    const childNodes = [
      mockTrees.ed3HeteroHerm,
      mockTrees.ed3HeteroMale,
      mockTrees.ed3HomoHerm,
    ];
    renderComponent({ childNodes });

    const definedTestIds = [
      'cross-filter-collapse-alleleNames',
      'cross-filter-collapse-exprPhenotypes',
      'cross-filter-collapse-outputted-strains',
    ];
    const undefinedTestIds = [
      'cross-filter-collapse-reqConditions',
      'cross-filter-collapse-supConditions',
    ];

    // make sure correct filter sections show
    definedTestIds.forEach((testId) => {
      const collapseSec = screen.getByTestId(testId);
      expect(collapseSec).toBeDefined();
      const checkboxes = within(collapseSec).getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    undefinedTestIds.forEach((testId) => {
      expect(screen.queryByTestId(testId)).toBeNull();
    });

    // check if node models rendered
    childNodes.forEach((node) => {
      const chromPairs = [...node.data.strain.chromPairMap.values()];
      chromPairs.forEach((pair) => {
        if (pair.length > 0) {
          const pairText = pair[0].getAllele().name;
          const pairElements = screen.getAllByText(pairText);
          expect(pairElements.length).toBeGreaterThan(0);
        }
      });
    });
  });

  test('modal displays limited strain options with set filters', () => {
    const childNodes = [mockTrees.n765AsChild, mockTrees.ed3AsChild];
    const filter = createFilter({ alleleNames: new Set(['ed3']) });

    renderComponent({ childNodes, filter });

    [
      'cross-filter-collapse-exprPhenotypes',
      'cross-filter-collapse-reqConditions',
    ].forEach((testId) => {
      const noFilterSec = screen.getByTestId(testId);
      const noFilterCheckboxes = within(noFilterSec).getAllByRole('checkbox');
      expect(noFilterCheckboxes.length).toBeGreaterThan(1);
      expect(noFilterCheckboxes[0]).toBeChecked();
      expect(noFilterCheckboxes[1]).not.toBeChecked();
    });

    const filterSec = screen.getByTestId('cross-filter-collapse-alleleNames');
    const filterCheckboxes = within(filterSec).getAllByRole('checkbox');
    expect(filterCheckboxes).toHaveLength(3); // 2 child nodes plus no filter checkbox
    expect(filterCheckboxes[0]).not.toBeChecked();
    expect(filterCheckboxes[1]).not.toBeChecked();
    expect(filterCheckboxes[2]).toBeChecked();

    const strainSec = screen.getByTestId(
      'cross-filter-collapse-outputted-strains'
    );
    const checkboxes = within(strainSec).getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(1 + 1);

    expect(checkboxes[1]).toBeChecked(); // node 0
  });

  test('modal unchecks nodes marked invisible', () => {
    const childNodes = [
      mockTrees.ed3HeteroHerm,
      mockTrees.ed3HeteroMale,
      mockTrees.ed3HomoHerm,
    ];
    const invisibleSet = new Set<string>(mockTrees.ed3HeteroHerm.id);
    renderComponent({ childNodes, invisibleSet });

    const strainSec = screen.getByTestId(
      'cross-filter-collapse-outputted-strains'
    );
    const checkboxes = within(strainSec).getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(childNodes.length + 1);

    expect(checkboxes[1]).not.toBeChecked(); // node 0
    expect(checkboxes[2]).toBeChecked(); // node 1
    expect(checkboxes[3]).toBeChecked(); // node 2
  });

  test('clicking a strain checkbox triggers callback function', async () => {
    const childNodes = [
      mockTrees.ed3HeteroHerm,
      mockTrees.ed3HeteroMale,
      mockTrees.ed3HomoHerm,
    ];
    const toggleVisible = vi.fn();
    const user = userEvent.setup();
    renderComponent({ childNodes, toggleVisible });

    const strainSec = screen.getByTestId(
      'cross-filter-collapse-outputted-strains'
    );
    const checkboxes = within(strainSec).getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(childNodes.length + 1);

    expect(toggleVisible).not.toHaveBeenCalled();
    await user.click(checkboxes[1]);
    expect(toggleVisible).toHaveBeenCalledTimes(1);

    await user.click(checkboxes[2]);
    await user.click(checkboxes[3]);
    expect(toggleVisible).toHaveBeenCalledTimes(3);
  });

  test('clicking a filter checkbox triggers callback function', async () => {
    const user = userEvent.setup();
    const childNodes = [mockTrees.n765AsChild, mockTrees.ed3AsChild];
    const updateFilter = vi.fn();
    renderComponent({ childNodes, updateFilter });

    const filterSec = screen.getByTestId('cross-filter-collapse-alleleNames');
    const filterCheckboxes = within(filterSec).getAllByRole('checkbox');
    expect(updateFilter).not.toHaveBeenCalled();

    await user.click(filterCheckboxes[1]);
    expect(updateFilter).toHaveBeenCalledOnce();

    await user.click(filterCheckboxes[2]);
    expect(updateFilter).toBeCalledTimes(2);
  });
});

describe('OffspringFilter', () => {
  test('correctly instantiates', () => {
    const filter = new OffspringFilter({
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
    const filter = new OffspringFilter({
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
    const filter = new OffspringFilter({
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
    const filter = new OffspringFilter({
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
    const filter = new OffspringFilter({
      alleleNames: new Set(),
      exprPhenotypes: new Set(),
      reqConditions: new Set(),
      supConditions: new Set(),
    });
    expect(filter.isEmpty()).toBe(true);
  });
  test('.isEmpty() to return false on an set filter', () => {
    const filter = new OffspringFilter({
      alleleNames: new Set(),
      exprPhenotypes: new Set(),
      reqConditions: new Set(['cond1']),
      supConditions: new Set(),
    });
    expect(filter.isEmpty()).toBe(false);
  });

  test('.extractOffspringFilterNames() to pull info from strain', () => {
    const strain = new Strain({
      allelePairs: [
        mockAlleles.n765.toTopHetPair(),
        mockAlleles.ed3.toHomoPair(),
      ],
    });
    const names = OffspringFilter.extractOffspringFilterNames(strain);

    expect(names.alleleNames).toEqual(new Set(['n765', 'ed3']));
    expect(names.exprPhenotypes).toEqual(new Set(['unc-119', 'lin-15B']));
    expect(names.reqConditions).toEqual(new Set(['25C']));
    expect(names.supConditions).toEqual(new Set<string>());
  });

  test('.condenseOffspringFilterNames() pulls info from multiple strains', () => {
    const strain1 = new Strain({
      allelePairs: [mockAlleles.n765.toTopHetPair()],
    });
    const strain2 = new Strain({
      allelePairs: [
        mockAlleles.ed3.toHomoPair(),
        mockAlleles.n765.toTopHetPair(),
      ],
    });
    const names = OffspringFilter.condenseOffspringFilterNames([
      strain1,
      strain2,
    ]);

    expect(names.alleleNames).toEqual(new Set(['n765', 'ed3']));
    expect(names.exprPhenotypes).toEqual(new Set(['unc-119', 'lin-15B']));
    expect(names.reqConditions).toEqual(new Set(['25C']));
    expect(names.supConditions).toEqual(new Set<string>());
  });

  test('includedInFilter() correctly includes a node', () => {
    const filter = new OffspringFilter({
      alleleNames: new Set(['ed3']),
      exprPhenotypes: new Set(['unc-119']),
      reqConditions: new Set(),
      supConditions: new Set(),
    });
    expect(
      OffspringFilter.includedInFilter(mockTrees.ed3HomoHerm, filter)
    ).toBe(true);
  });
  test('includedInFilter() correctly excludes a node', () => {
    const filter = new OffspringFilter({
      alleleNames: new Set(),
      exprPhenotypes: new Set(),
      reqConditions: new Set(['badCondition']),
      supConditions: new Set(),
    });
    expect(
      OffspringFilter.includedInFilter(mockTrees.ed3HomoHerm, filter)
    ).toBe(false);
  });
});
