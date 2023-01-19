import '@testing-library/jest-dom';
import * as mockGenes from 'models/frontend/Gene/Gene.mock';
import * as mockVariations from 'models/frontend/VariationInfo/VariationInfo.mock';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import {
  getGenotype,
  WILD_ALLELE,
} from 'components/CrossNode/genotype/genotype';
import { vi } from 'vitest';
import * as crossNodeMock from 'models/frontend/CrossNode/CrossNode.mock';

describe('Genotype with no alleles', () => {
  test('Genotype with no mutations', () => {
    const crossNode = crossNodeMock.empty;
    const genotype = getGenotype(crossNode);
    expect(genotype.genes.size + genotype.variations.size).toBe(0);
  });

  test('Size with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.size + genotype.variations.size).toBe(4);
  });

  test('Chromsome I with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('I')).toBeDefined();
    expect(genotype.genes.get('I')?.size).toBe(1);
    expect(
      genotype.genes.get('I')?.get(mockGenes.chrom1Gene1.sysName)
    ).toHaveLength(2);
  });

  test('Chromosome II with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('II')).toBeDefined();
    expect(genotype.genes.get('II')?.size).toBe(2);
    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene1.sysName)
    ).toHaveLength(2);
    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene2.sysName)
    ).toHaveLength(2);
  });

  test('Chromosome III with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('III')).toBeDefined();
    expect(genotype.genes.get('III')?.size).toBe(1);
    expect(
      genotype.genes.get('III')?.get(mockGenes.chrom3Gene1.sysName)
    ).toHaveLength(2);
  });

  test('Chromosome Ex with mutations', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.variations.get('Ex')).toBeDefined();
    expect(genotype.variations.get('Ex')?.size).toBe(1);
    expect(
      genotype.variations.get('Ex')?.get(mockVariations.chromEcaVariation1.name)
    ).toHaveLength(1);
  });
});

describe('Genotype with complete input data', () => {
  test('Genotype is of the correct size', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.size + genotype.variations.size).toBe(7);
  });

  test('Chromosome I', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('I')).toBeDefined();
    expect(genotype.genes.get('I')?.size).toBe(1);
    expect(
      genotype.genes.get('I')?.get(mockGenes.chrom1Gene1.sysName)
    ).toHaveLength(2);
    expect(
      genotype.genes.get('I')?.get(mockGenes.chrom1Gene1.sysName)
    ).toContain(mockAlleles.chrom1Gene1Allele1);
    expect(
      genotype.genes.get('I')?.get(mockGenes.chrom1Gene1.sysName)
    ).toContain(WILD_ALLELE);
  });

  test('Chromosome II', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('II')).toBeDefined();
    expect(genotype.genes.get('II')?.size).toBe(2);

    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene1.sysName)
    ).toHaveLength(2);
    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene1.sysName)
    ).toContain(mockAlleles.chrom2Gene1Allele1);
    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene1.sysName)
    ).toContain(mockAlleles.chrom2Gene1Allele2);

    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene2.sysName)
    ).toHaveLength(2);
    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene2.sysName)
    ).toContain(mockAlleles.chrom2Gene2Allele1);
    expect(
      genotype.genes.get('II')?.get(mockGenes.chrom2Gene2.sysName)
    ).toContain(WILD_ALLELE);
  });

  test('Chromosome III', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('III')).toBeDefined();
    expect(genotype.genes.get('III')?.size).toBe(1);
  });

  test('Chromosome X', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('X')).toBeDefined();
    expect(genotype.genes.get('X')?.size).toBe(1);

    // X0 sex determination
    expect(
      genotype.genes.get('X')?.get(mockGenes.chromXGene1.sysName)
    ).toHaveLength(2);
    expect(
      genotype.genes.get('X')?.get(mockGenes.chromXGene1.sysName)
    ).toContain(mockAlleles.chromXGene1Allele1);
  });

  test('Chromosome Ex', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.variations.get('Ex')).toBeDefined();
    expect(genotype.variations.get('Ex')?.size).toBe(1);

    expect(
      genotype.variations.get('Ex')?.get(mockVariations.chromEcaVariation1.name)
    ).toHaveLength(1);
    expect(
      genotype.variations.get('Ex')?.get(mockVariations.chromEcaVariation1.name)
    ).toContain(mockAlleles.chromEcaVariation1Allele1);
  });

  test('Unknown chromosome', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.variations.get(undefined)).toBeDefined();
    expect(genotype.variations.get(undefined)?.size).toBe(1);

    expect(
      genotype.variations
        .get(undefined)
        ?.get(mockVariations.chromUnknownVariation1.name)
    ).toHaveLength(1);
    expect(
      genotype.variations
        .get(undefined)
        ?.get(mockVariations.chromUnknownVariation1.name)
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

  afterAll(() => {
    // Restore original console.error
    console.error = originalFunction;
  });

  test('Alleles reference genes and variations not given.', () => {
    const crossNode = crossNodeMock.badMutationLists;
    const genotype = getGenotype(crossNode);

    expect(genotype.genes.get('I')?.get(mockGenes.chrom1Gene1.sysName)).toEqual(
      [mockAlleles.chrom1Gene1Allele1, WILD_ALLELE]
    );
    expect(
      genotype.variations.get('Ex')?.get(mockVariations.chromEcaVariation1.name)
    ).toEqual([mockAlleles.chromEcaVariation1Allele1]);

    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('Alleles lack mutations', () => {
    const crossNode = crossNodeMock.badAllele;
    const genotype = getGenotype(crossNode);

    // Assign it to ? chromosome
    expect(genotype.variations.get(undefined)).toBeDefined();
    expect(genotype.variations.get(undefined)).toHaveLength(1);

    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

describe('Mutations displayed with or without partners.', () => {
  test('Non-partnered (monoid) allele "fraction" has only one entry', () => {
    const crossNode = crossNodeMock.monoid;
    const genotype = getGenotype(crossNode);
    expect(
      genotype.variations.get('Ex')?.get(mockVariations.chromEcaVariation1.name)
    ).toHaveLength(1);
  });

  test('Partnered (diploid) allele fraction has exactly two entries. ()', () => {
    const crossNode = crossNodeMock.diploid;
    const genotype = getGenotype(crossNode);
    expect(
      genotype.genes.get('I')?.get(mockGenes.chrom1Gene1.sysName)
    ).toHaveLength(2);
  });
});

describe('genotype handles genes with different identities', () => {
  test('different identities of Gene, common sysName', () => {
    const crossNode = crossNodeMock.smallMutated;
    const genotype = getGenotype(crossNode);
    expect(
      genotype.genes.get('I')?.get(crossNodeMock.geneCopy1.sysName)
    ).toEqual(genotype.genes.get('I')?.get(crossNodeMock.geneCopy2.sysName));
  });
});
