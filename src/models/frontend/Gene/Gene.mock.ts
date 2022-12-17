import { Gene } from 'models/frontend/Gene/Gene';

export const chrom1Gene1 = new Gene({
  name: 'chromIgene1',
  chromosome: 'I',
  ploidy: 2,
});

export const chrom2Gene1 = new Gene({
  name: 'chromIIgene1',
  chromosome: 'II',
  ploidy: 2,
});

export const chrom2Gene2 = new Gene({
  name: 'chromIIgene2',
  chromosome: 'II',
  ploidy: 2,
});

export const chrom3Gene1 = new Gene({
  name: 'chromIIIgene1',
  chromosome: 'III',
  ploidy: 2,
});

export const chrom4Gene1 = new Gene({
  name: 'chromIVgene1',
  chromosome: 'IV',
  ploidy: 2,
});

export const chrom5Gene1 = new Gene({
  name: 'chrom5gene1',
  chromosome: 'V',
  ploidy: 2,
});

export const chromXGene1 = new Gene({
  name: 'chromXgene1',
  chromosome: 'X',
  ploidy: 1, // Only one X
});
