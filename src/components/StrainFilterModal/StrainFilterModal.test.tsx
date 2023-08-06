import { render, screen } from '@testing-library/react';
import { StrainFilter } from 'models/frontend/StrainFilter/StrainFilter';
import { StrainFilterModal } from 'components/StrainFilterModal/StrainFilterModal';
import * as alleles from 'models/frontend/Allele/Allele.mock';
import * as crossDesigns from 'models/frontend/CrossDesign/CrossDesign.mock';
import { Strain } from 'models/frontend/Strain/Strain';
import { type Node } from 'reactflow';
import { vi, expect, test, describe } from 'vitest';

const renderModal = ({
  childNodes = new Array<Node<Strain>>(),
  filter = new StrainFilter(),
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

describe('StrainFilterModal', () => {
  test('modal displays all nodes in map', () => {
    const childNodes = [
      crossDesigns.ed3HeteroHerm,
      crossDesigns.ed3HeteroMale,
      crossDesigns.ed3HomoHerm,
    ];
    renderModal({ childNodes });

    const present = [/alleles/i, /phenotypes/i, /strains/i];
    const notPresent = [/required/i, /suppressing/i];

    // make sure correct filter sections show
    present.forEach((p) => {
      const collapseSec = screen.getByText(p);
      expect(collapseSec).toBeDefined();
    });

    notPresent.forEach((np) => {
      expect(screen.queryByText(np)).toBeNull();
    });

    // check if nodes rendered
    childNodes.forEach((node) => {
      const chromPairs = [...node.data.chromPairMap.values()];
      chromPairs.forEach((pair) => {
        if (pair.allelePairs.length > 0) {
          const pairText = pair.allelePairs[0].top.getQualifiedName();
          const pairElements = screen.getAllByText(pairText);
          expect(pairElements.length).toBeGreaterThan(0);
        }
      });
    });
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

    expect(options.alleleNames).toEqual(
      new Set(['lin-15B(n765)', 'lin-15B(+)', 'unc-119(ed3)'])
    );
    expect(options.exprPhenotypes).toEqual(new Set(['unc-119', 'lin-15B']));
    expect(options.reqConditions).toEqual(new Set(['25C']));
    expect(options.supConditions).toEqual(new Set<string>());
  });
});
