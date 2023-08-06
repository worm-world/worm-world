import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrainFilter } from 'models/frontend/StrainFilter/StrainFilter';
import { StrainFilterModal } from 'components/StrainFilterModal/StrainFilterModal';
import * as alleles from 'models/frontend/Allele/Allele.mock';
import * as crossDesigns from 'models/frontend/CrossDesign/CrossDesign.mock';
import { Strain } from 'models/frontend/Strain/Strain';
import { type Node } from 'reactflow';
import { vi, expect, test, describe } from 'vitest';

const renderComponent = ({
  childNodes = new Array<Node<Strain>>(),
  invisibleSet = new Set<string>(),
  toggleVisible = vi.fn(),
  filter = new StrainFilter({
    alleleNames: new Set(),
    exprPhenotypes: new Set(),
    reqConditions: new Set(),
    supConditions: new Set(),
    hidden: new Set(),
  }),
  updateFilter = vi.fn(),
}): void => {
  render(
    <StrainFilterModal
      childNodes={childNodes}
      filter={filter}
      updateFilter={updateFilter}
      filterId={''}
    />
  );
};

const createFilter = ({
  alleleNames = new Set(),
  exprPhenotypes = new Set(),
  reqConditions = new Set(),
  supConditions = new Set(),
  hidden = new Set(),
}: {
  alleleNames?: Set<string>;
  exprPhenotypes?: Set<string>;
  reqConditions?: Set<string>;
  supConditions?: Set<string>;
  hidden?: Set<string>;
}): StrainFilter => {
  return new StrainFilter({
    alleleNames,
    exprPhenotypes,
    reqConditions,
    supConditions,
    hidden,
  });
};

describe('StrainFilterModal', () => {
  test('modal displays all nodes in map', () => {
    const childNodes = [
      crossDesigns.ed3HeteroHerm,
      crossDesigns.ed3HeteroMale,
      crossDesigns.ed3HomoHerm,
    ];
    renderComponent({ childNodes });

    const definedTestIds = [
      'strain-filter-collapse-alleleNames',
      'strain-filter-collapse-exprPhenotypes',
      'strain-filter-collapse-outputted-strains',
    ];
    const undefinedTestIds = [
      'strain-filter-collapse-reqConditions',
      'strain-filter-collapse-supConditions',
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
      const chromPairs = [...node.data.chromPairMap.values()];
      chromPairs.forEach((pair) => {
        if (pair.allelePairs.length > 0) {
          const pairText = pair.allelePairs[0].top.name;
          const pairElements = screen.getAllByText(pairText);
          expect(pairElements.length).toBeGreaterThan(0);
        }
      });
    });
  });

  test('modal displays limited strain options with set filters', () => {
    const childNodes = [crossDesigns.n765AsChild, crossDesigns.ed3AsChild];
    const filter = createFilter({ alleleNames: new Set(['ed3']) });

    renderComponent({ childNodes, filter });

    [
      'strain-filter-collapse-exprPhenotypes',
      'strain-filter-collapse-reqConditions',
    ].forEach((testId) => {
      const noFilterSec = screen.getByTestId(testId);
      const noFilterCheckboxes = within(noFilterSec).getAllByRole('checkbox');
      expect(noFilterCheckboxes.length).toBeGreaterThan(1);
      expect(noFilterCheckboxes[0]).toBeChecked();
      expect(noFilterCheckboxes[1]).not.toBeChecked();
    });

    const filterSec = screen.getByTestId('strain-filter-collapse-alleleNames');
    const filterCheckboxes = within(filterSec).getAllByRole('checkbox');
    expect(filterCheckboxes).toHaveLength(3); // 2 child nodes plus no filter checkbox
    expect(filterCheckboxes[0]).not.toBeChecked();
    expect(filterCheckboxes[1]).not.toBeChecked();
    expect(filterCheckboxes[2]).toBeChecked();

    const strainSec = screen.getByTestId(
      'strain-filter-collapse-outputted-strains'
    );
    const checkboxes = within(strainSec).getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(1 + 1);

    expect(checkboxes[1]).toBeChecked(); // node 0
  });

  test('modal unchecks nodes marked invisible', () => {
    const childNodes = [
      crossDesigns.ed3HeteroHerm,
      crossDesigns.ed3HeteroMale,
      crossDesigns.ed3HomoHerm,
    ];
    const invisibleSet = new Set<string>(crossDesigns.ed3HeteroHerm.id);
    renderComponent({ childNodes, invisibleSet });

    const strainSec = screen.getByTestId(
      'strain-filter-collapse-outputted-strains'
    );
    const checkboxes = within(strainSec).getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(childNodes.length + 1);

    expect(checkboxes[1]).not.toBeChecked(); // node 0
    expect(checkboxes[2]).toBeChecked(); // node 1
    expect(checkboxes[3]).toBeChecked(); // node 2
  });

  test('clicking a strain checkbox triggers callback function', async () => {
    const childNodes = [
      crossDesigns.ed3HeteroHerm,
      crossDesigns.ed3HeteroMale,
      crossDesigns.ed3HomoHerm,
    ];
    const toggleVisible = vi.fn();
    const user = userEvent.setup();
    renderComponent({ childNodes, toggleVisible });

    const strainSec = screen.getByTestId(
      'strain-filter-collapse-outputted-strains'
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
    const childNodes = [crossDesigns.n765AsChild, crossDesigns.ed3AsChild];
    const updateFilter = vi.fn();
    renderComponent({ childNodes, updateFilter });

    const filterSec = screen.getByTestId('strain-filter-collapse-alleleNames');
    const filterCheckboxes = within(filterSec).getAllByRole('checkbox');
    expect(updateFilter).not.toHaveBeenCalled();

    await user.click(filterCheckboxes[1]);
    expect(updateFilter).toHaveBeenCalledOnce();

    await user.click(filterCheckboxes[2]);
    expect(updateFilter).toBeCalledTimes(2);
  });
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

  test('.getStrainFilterOptionSets() pulls info from multiple strains', () => {
    const node1 = {
      data: new Strain({
        allelePairs: [alleles.n765.toTopHet()],
      }),
      id: '',
      position: { x: 0, y: 0 },
    };
    const node2 = {
      data: new Strain({
        allelePairs: [alleles.ed3.toHomo(), alleles.n765.toTopHet()],
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
});
