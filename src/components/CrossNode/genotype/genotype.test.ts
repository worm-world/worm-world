import '@testing-library/jest-dom';
import * as mockGenes from 'models/frontend/Gene/Gene.mock';
import * as mockVariations from 'models/frontend/VariationInfo/VariationInfo.mock';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import getGenotype, {
  WILD_ALLELE,
} from 'components/CrossNode/genotype/genotype';
import Mutation, { UNKNOWN_CHROM } from 'models/frontend/Mutation';
import { vi } from 'vitest';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';

describe('Genotype with no alleles', () => {
  test('Genotype with no mutations', () => {
    const crossNode = crossNodeMock.empty;
    const genotype = getGenotype(crossNode);
    expect(genotype.size).toBe(0);
  });

  test('Size with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.size).toBe(4);
  });

  test('Chromsome I with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('I')).toBeDefined();
    expect(genotype.get('I')?.size).toBe(1);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toHaveLength(2);
  });

  test('Chromosome II with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('II')).toBeDefined();
    expect(genotype.get('II')?.size).toBe(2);
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene1)).toHaveLength(2);
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene2)).toHaveLength(2);
  });

  test('Chromosome III with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('III')).toBeDefined();
    expect(genotype.get('III')?.size).toBe(1);
    expect(genotype.get('III')?.get(mockGenes.chrom3Gene1)).toHaveLength(2);
  });

  test('Chromosome ECA with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('ECA')).toBeDefined();
    expect(genotype.get('ECA')?.size).toBe(1);
    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toHaveLength(1);
  });
});

describe('Genotype with complete input data', () => {
  test('Genotype is of the correct size', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.size).toBe(6);
  });

  test('Chromosome I', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('I')).toBeDefined();
    expect(genotype.get('I')?.size).toBe(1);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toHaveLength(2);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toContain(
      mockAlleles.chrom1Gene1Allele1
    );
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toContain(
      WILD_ALLELE
    );
  });

  test('Chromosome II', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('II')).toBeDefined();
    expect(genotype.get('II')?.size).toBe(2);

    expect(genotype.get('II')?.get(mockGenes.chrom2Gene1)).toHaveLength(2);
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene1)).toContain(
      mockAlleles.chrom2Gene1Allele1
    );
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene1)).toContain(
      mockAlleles.chrom2Gene1Allele2
    );

    expect(genotype.get('II')?.get(mockGenes.chrom2Gene2)).toHaveLength(2);
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene2)).toContain(
      mockAlleles.chrom2Gene2Allele1
    );
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene2)).toContain(
      WILD_ALLELE
    );
  });

  test('Chromosome III', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('III')).toBeDefined();
    expect(genotype.get('III')?.size).toBe(1);
  });

  test('Chromosome X', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('X')).toBeDefined();
    expect(genotype.get('X')?.size).toBe(1);

    // X0 sex determination
    expect(genotype.get('X')?.get(mockGenes.chromXGene1)).toHaveLength(1);
    expect(genotype.get('X')?.get(mockGenes.chromXGene1)).toContain(
      mockAlleles.chromXGene1Allele1
    );
  });

  test('Chromosome ECA', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.get('ECA')).toBeDefined();
    expect(genotype.get('ECA')?.size).toBe(1);

    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toHaveLength(1);
    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toContain(mockAlleles.chromEcaVariation1Allele1);
  });

  test('Unknown chromosome', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.get(UNKNOWN_CHROM)).toBeDefined();
    expect(genotype.get(UNKNOWN_CHROM)?.size).toBe(1);

    expect(
      genotype.get(UNKNOWN_CHROM)?.get(mockVariations.chromUnknownVariation1)
    ).toHaveLength(1);
    expect(
      genotype.get(UNKNOWN_CHROM)?.get(mockVariations.chromUnknownVariation1)
    ).toContain(mockAlleles.chromUnknownVariation1Allele1);
  });
});

describe('Genotype with incomplete input data.', () => {
  // "Spy on" console.error to count calls
  const originalFunction = console.error;

  beforeEach(() => {
    // Reassign console.error temporarily
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original console.error
    console.error = originalFunction;
  });

  test('Alleles reference genes and variations not given.', () => {
    const crossNode = crossNodeMock.badMutationLists;
    const genotype = getGenotype(crossNode);

    expect(
      genotype.get('I')?.get(mockAlleles.chrom1Gene1Allele1.gene as Mutation)
    ).toEqual([
      mockAlleles.chrom1Gene1Allele1,
      mockGenes.chrom1Gene1.ploidy === 2 ? WILD_ALLELE : undefined,
    ]);
    expect(
      genotype
        .get('ECA')
        ?.get(mockAlleles.chromEcaVariation1Allele1.variation as Mutation)
    ).toEqual([mockAlleles.chromEcaVariation1Allele1]);

    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('Alleles lack mutations', () => {
    const crossNode = crossNodeMock.badAllele;
    const genotype = getGenotype(crossNode);

    // Assign it to ? chromosome
    expect(genotype.get(UNKNOWN_CHROM)).toBeDefined();
    expect(genotype.get(UNKNOWN_CHROM)).toHaveLength(1);

    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

describe('Mutations displayed with or without partners.', () => {
  test('Non-partnered (monoid) allele "fraction" has only one entry', () => {
    const crossNode = crossNodeMock.monoid;
    const genotype = getGenotype(crossNode);
    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toHaveLength(1);
  });

  test('Partnered (diploid) allele fraction has exactly two entries. ()', () => {
    const crossNode = crossNodeMock.diploid;
    const genotype = getGenotype(crossNode);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toHaveLength(2);
  });
});
