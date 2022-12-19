import '@testing-library/jest-dom';
import { Sex } from 'models/enums';
import Strain from 'models/frontend/Strain';
import CrossNodeModel from 'models/frontend/CrossNode';
import * as mockGenes from 'models/frontend/Gene/Gene.mock';
import * as mockVariations from 'models/frontend/VariationInfo/VariationInfo.mock';
import * as mockAlleles from 'models/frontend/Allele/Allele.mock';
import getGenotype, {
  WILD_ALLELE,
} from 'components/CrossNode/genotype/genotype';
import Mutation, { UNKNOWN_CHROM } from 'models/frontend/Mutation';
import { Allele } from 'models/frontend/Allele/Allele';
import { vi } from 'vitest';

describe('CrossNode data with no alleles is transformed correctly', () => {
  test('Genotype, given CrossNode model with no alleles or mutations, is empty', () => {
    const emptyStrain: Strain = { name: 'emptyStrain', notes: '', alleles: [] };
    const emptyCrossNode: CrossNodeModel = {
      sex: Sex.Hermaphrodite,
      strain: emptyStrain,
      genes: [],
      variations: [],
      isSelected: false,
      parents: [],
    };

    const genotype = getGenotype(emptyCrossNode);

    expect(genotype.size).toBe(0);
  });

  test('Genotype, given CrossNode model with genes and variations, has only empty alleles', () => {
    const emptyStrain: Strain = { name: 'emptyStrain', notes: '', alleles: [] };

    const emptyCrossNode: CrossNodeModel = {
      sex: Sex.Hermaphrodite,
      strain: emptyStrain,
      genes: [
        mockGenes.chrom1Gene1,
        mockGenes.chrom2Gene1,
        mockGenes.chrom2Gene2,
        mockGenes.chrom3Gene1,
      ],
      variations: [mockVariations.chromEcaVariation1],
      isSelected: false,
      parents: [],
    };

    // Should be maps nested as {I: {chrom1Gene1: [], chrom2Gene1: [], ..., mockGenes.chromEcaVariation1: []}}
    const genotype = getGenotype(emptyCrossNode);

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
    const strain: Strain = {
      name: 'strain',
      alleles: [
        mockAlleles.chrom1Gene1Allele1,
        mockAlleles.chrom2Gene1Allele1,
        mockAlleles.chrom2Gene1Allele2,
        mockAlleles.chrom2Gene2Allele1,
        mockAlleles.chromXGene1Allele1,
        mockAlleles.chromEcaVariation1Allele1,
        mockAlleles.chromUnknownVariation1Allele1,
      ],
      notes: '',
    };

    // We need to at least include mutations belonging to the above alleles
    const crossNode: CrossNodeModel = {
      sex: Sex.Hermaphrodite,
      strain,
      genes: [
        mockGenes.chrom1Gene1,
        mockGenes.chrom2Gene1,
        mockGenes.chrom2Gene2,
        mockGenes.chrom3Gene1,
        mockGenes.chromXGene1,
      ],
      variations: [
        mockVariations.chromEcaVariation1,
        mockVariations.chromUnknownVariation1,
      ],
      isSelected: false,
      parents: [],
    };

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

describe('CrossNode model with incomplete information is handled.', () => {
  const original = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = original;
  });

  test('Genotype, given alleles referencing nonexistent genes and variations, recovers and gives error message.', () => {
    const crossNode: CrossNodeModel = {
      sex: Sex.Hermaphrodite,
      strain: {
        name: 'strain with mutation refs',
        alleles: [
          mockAlleles.chrom1Gene1Allele1,
          mockAlleles.chromEcaVariation1Allele1,
        ],
        notes: '',
      },
      // No genes to display or variations to display
      genes: [],
      variations: [],
      isSelected: false,
      parents: [],
    };

    const genotype = getGenotype(crossNode);

    expect(
      genotype.get('I')?.get(mockAlleles.chrom1Gene1Allele1.gene as Mutation)
    ).toEqual([
      mockAlleles.chrom1Gene1Allele1,
      mockGenes.chrom1Gene1.ploidy == 2 ? WILD_ALLELE : undefined,
    ]);
    expect(
      genotype
        .get('ECA')
        ?.get(mockAlleles.chromEcaVariation1Allele1.variation as Mutation)
    ).toEqual([mockAlleles.chromEcaVariation1Allele1]);

    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test('CrossNode, given alleles with no referenced gene or variation, recovers with dummy variation and gives error message.', () => {
    console.log('test2');
    
    const incompleteAllele: Allele = new Allele({
      name: 'incompleteAllele',
    });

    const crossNode: CrossNodeModel = {
      sex: Sex.Hermaphrodite,
      strain: {
        name: 'incompleteStrain',
        alleles: [incompleteAllele],
        notes: '',
      },
      // No genes to display or variations to display
      genes: [],
      variations: [],
      isSelected: false,
      parents: [],
    };

    const genotype = getGenotype(crossNode);

    expect(genotype.get(UNKNOWN_CHROM)).toBeDefined();
    expect(genotype.get(UNKNOWN_CHROM)).toHaveLength(1);

    expect(console.error).toHaveBeenCalledTimes(2);
  });
});
