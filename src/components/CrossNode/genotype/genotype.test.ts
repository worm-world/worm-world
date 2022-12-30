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

describe('CrossNode data with no alleles is transformed correctly', () => {
  test('Genotype, given CrossNode model with no alleles or mutations, is empty', () => {
    const crossNode = crossNodeMock.empty;
    const genotype = getGenotype(crossNode);
    expect(genotype.size).toBe(0);
  });

  test('Genotype, given CrossNode model with genes and variations, has only empty alleles', () => {
    const crossNode = crossNodeMock.wild;
    const genotype = getGenotype(crossNode);

    expect(genotype.size).toBe(4);

    expect(genotype.get('I')).toBeDefined();
    expect(genotype.get('I')?.size).toBe(1);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toHaveLength(2);

    expect(genotype.get('II')).toBeDefined();
    expect(genotype.get('II')?.size).toBe(2);
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene1)).toHaveLength(2);
    expect(genotype.get('II')?.get(mockGenes.chrom2Gene2)).toHaveLength(2);

    expect(genotype.get('III')).toBeDefined();
    expect(genotype.get('III')?.size).toBe(1);
    expect(genotype.get('III')?.get(mockGenes.chrom3Gene1)).toHaveLength(2);

    expect(genotype.get('ECA')).toBeDefined();
    expect(genotype.get('ECA')?.size).toBe(1);
    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toHaveLength(1);
  });
});

describe('CrossNode data with alleles is transformed correctly', () => {
  test('Genotype, given CrossNode model with alleles, is transformed correctly', () => {
    const crossNode = crossNodeMock.mutated;
    const genotype = getGenotype(crossNode);

    expect(genotype.size).toBe(6);

    // Chromosome I
    expect(genotype.get('I')).toBeDefined();
    expect(genotype.get('I')?.size).toBe(1);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toHaveLength(2);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toContain(
      mockAlleles.chrom1Gene1Allele1
    );
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toContain(
      WILD_ALLELE
    );

    // Chromosome II
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

    // Chromosome X
    expect(genotype.get('X')).toBeDefined();
    expect(genotype.get('X')?.size).toBe(1);

    expect(genotype.get('X')?.get(mockGenes.chromXGene1)).toHaveLength(1); // X0 sex determination
    expect(genotype.get('X')?.get(mockGenes.chromXGene1)).toContain(
      mockAlleles.chromXGene1Allele1
    );

    // ECA
    expect(genotype.get('ECA')).toBeDefined();
    expect(genotype.get('ECA')?.size).toBe(1);

    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toHaveLength(1); // X0 sex determination
    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toContain(mockAlleles.chromEcaVariation1Allele1);

    // Unknown chromosome ?
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

describe('CrossNode model recovers from incomplete data.', () => {
  const original = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = original;
  });

  test('Genotype, given allele referencing genes and variations not given, recovers and gives error message.', () => {
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

  test('CrossNode, given alleles with no referenced gene or variation, recovers with dummy variation and gives error message.', () => {
    const crossNode = crossNodeMock.badAllele;
    const genotype = getGenotype(crossNode);

    expect(genotype.get(UNKNOWN_CHROM)).toBeDefined();
    expect(genotype.get(UNKNOWN_CHROM)).toHaveLength(1);

    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

describe('Mutations which can come in one copy (monoid) or two (diploid) are formatted correctly.', () => {
  test('Monoid allele list has only one entry', () => {
    const crossNode = crossNodeMock.monoid;
    const genotype = getGenotype(crossNode);
    expect(
      genotype.get('ECA')?.get(mockVariations.chromEcaVariation1)
    ).toHaveLength(1);
  });

  test('Diploid allele list has exactly two entries. ()', () => {
    const crossNode = crossNodeMock.diploid;
    const genotype = getGenotype(crossNode);
    expect(genotype.get('I')?.get(mockGenes.chrom1Gene1)).toHaveLength(2);
  });
});
