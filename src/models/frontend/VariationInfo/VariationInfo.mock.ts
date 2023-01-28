import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';
import GeneticLocation from '../GeneticLocation';

export const chromUnknownVariation1 = new VariationInfo({
  name: 'chromUnknownVariation1',
  chromosome: undefined,
});

export const chromEcaVariation1 = new VariationInfo({
  name: 'chromExVariation1',
  chromosome: 'Ex',
});

export const chrom1Variation1 = new VariationInfo({
  name: 'chrom1Variation1',
  chromosome: 'I',
});

export const oxIs644 = new VariationInfo({
  name: 'oxIs644',
  chromosome: undefined,
  physLoc: undefined,
  geneticLoc: undefined,
});
export const oxIs12 = new VariationInfo({
  name: 'oxIs12',
  chromosome: 'X',
  physLoc: undefined,
  geneticLoc: undefined,
});
export const oxTi302 = new VariationInfo({
  name: 'oxTi302',
  chromosome: 'I',
  physLoc: new GeneticLocation(10166146),
  geneticLoc: new GeneticLocation(4.72),
});
export const oxTi75 = new VariationInfo({
  name: 'oxTi75',
  chromosome: 'II',
  physLoc: undefined,
  geneticLoc: new GeneticLocation(-1.46),
});
export const tmC5 = new VariationInfo({
  name: 'tmC5',
  chromosome: 'IV',
  physLoc: undefined,
  geneticLoc: undefined,
});
export const tmC5ALT = new VariationInfo({
  name: 'tmC5[F36H1.3(tmIs1220)]',
  chromosome: 'IV',
  physLoc: undefined,
  geneticLoc: undefined,
});
export const oxEx2254 = new VariationInfo({
  name: 'oxEx2254',
  chromosome: undefined,
  physLoc: undefined,
  geneticLoc: undefined,
});
export const oxSi1168 = new VariationInfo({
  name: 'oxSi1168',
  chromosome: 'II',
  physLoc: new GeneticLocation(8420158),
  geneticLoc: new GeneticLocation(0.77),
});
export const oxEx219999 = new VariationInfo({
  name: 'oxEx219999',
  chromosome: undefined,
  physLoc: undefined,
  geneticLoc: undefined,
});
export const oxEx12345 = new VariationInfo({
  name: 'oxEx12345',
  chromosome: undefined,
  physLoc: undefined,
  geneticLoc: undefined,
});

export const jsSi1949 = new VariationInfo({
  name: 'jsSi1949',
  chromosome: 'I',
  physLoc: new GeneticLocation(6503678),
  geneticLoc: new GeneticLocation(1.17),
});
export const eT1V = new VariationInfo({
  name: 'eT1(V)',
  chromosome: 'V',
  physLoc: undefined,
  geneticLoc: undefined,
});
export const eT1III = new VariationInfo({
  name: 'eT1(III)',
  chromosome: 'III',
  physLoc: new GeneticLocation(8193843),
  geneticLoc: new GeneticLocation(-0.37),
});
export const ox1111 = new VariationInfo({
  name: 'ox1111',
  chromosome: undefined,
  physLoc: undefined,
  geneticLoc: undefined,
});
