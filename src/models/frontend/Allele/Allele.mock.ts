import { Allele } from 'models/frontend/Allele/Allele';
import * as geneMock from 'models/frontend/Gene/Gene.mock';
import * as variationMock from 'models/frontend/VariationInfo/VariationInfo.mock';

export const chrom1Gene1Allele1 = new Allele({
  name: 'chrom1Gene1Allele1',
  gene: geneMock.chrom1Gene1,
});

export const chrom2Gene1Allele1 = new Allele({
  name: 'chrom2Gene1Allele1',
  gene: geneMock.chrom2Gene1,
});

export const chrom2Gene1Allele2 = new Allele({
  name: 'chrom2Gene1Allele1',
  gene: geneMock.chrom2Gene1,
});

export const chrom2Gene2Allele1 = new Allele({
  name: 'chrom2Gene2Allele1',
  gene: geneMock.chrom2Gene2,
});

export const chrom2Gene2Allele2 = new Allele({
  name: 'chrom2Gene2Allele2',
  gene: geneMock.chrom2Gene2,
});

export const chrom3Gene1Allele1 = new Allele({
  name: 'chrom3Gene1Allele1',
  gene: geneMock.chrom3Gene1,
});

export const chrom3Gene1Allele2 = new Allele({
  name: 'chrom3Gene1Allele2',
  gene: geneMock.chrom3Gene1,
});

export const chrom3Gene1Allele3 = new Allele({
  name: 'chrom3Gene1Allele3',
  gene: geneMock.chrom3Gene1,
});

export const chromXGene1Allele1 = new Allele({
  name: 'chromXGene1Allele1',
  gene: geneMock.chromXGene1,
});

export const chromEcaVariation1Allele1 = new Allele({
  name: 'chromEcaVariation1Allele1',
  variation: variationMock.chromEcaVariation1,
});

export const chromUnknownVariation1Allele1 = new Allele({
  name: 'chromUnknownVariation1Allele1',
  variation: variationMock.chromUnknownVariation1,
});

export const chrom1Variation1Allele1 = new Allele({
  name: 'chrom1Variation1Allele1',
  variation: variationMock.chrom1Variation1,
});
