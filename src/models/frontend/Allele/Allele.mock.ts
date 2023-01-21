import { Allele } from 'models/frontend/Allele/Allele';
import * as geneMock from 'models/frontend/Gene/Gene.mock';
import * as variationMock from 'models/frontend/VariationInfo/VariationInfo.mock';
import { Gene } from '../Gene/Gene';
import { VariationInfo } from '../VariationInfo/VariationInfo';

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

export const ed3 = new Allele({
  name: 'ed3',
  gene: new Gene({ sysName: 'M142.1' }),
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const n764 = new Allele({
  name: 'n765',
  gene: new Gene({ sysName: 'ZK662.4' }),
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const md299 = new Allele({
  name: 'md299',
  gene: new Gene({ sysName: 'F27D9.1' }),
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const cn64 = new Allele({
  name: 'cn64',
  gene: new Gene({ sysName: 'T14B4.7' }),
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const ox1059 = new Allele({
  name: 'ox1059',
  gene: new Gene({ sysName: 'C10C6.1' }),
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const oxIs644 = new Allele({
  name: 'oxIs644',
  gene: undefined,
  variation: new VariationInfo({ name: 'oxIs644' }),
  alleleExpressions: undefined,
  contents: '[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]',
});
export const oxIs12 = new Allele({
  name: 'oxIs12',
  gene: undefined,
  variation: new VariationInfo({ name: 'oxIs12' }),
  alleleExpressions: undefined,
  contents: '[Punc-47::GFP; lin-15(+)]',
});
export const oxTi302 = new Allele({
  name: 'oxTi302',
  gene: undefined,
  variation: new VariationInfo({ name: 'oxTi302' }),
  alleleExpressions: undefined,
  contents: '[Peft-3::mCherry; cbr-unc-119(+)]',
});
export const oxTi75 = new Allele({
  name: 'oxTi75',
  gene: undefined,
  variation: new VariationInfo({ name: 'oxTi75' }),
  alleleExpressions: undefined,
  contents: '[Peft-3::GFP-NLS; unc-18(+)]',
});
export const tmC5 = new Allele({
  name: 'tmC5',
  gene: undefined,
  variation: new VariationInfo({ name: 'tmC5' }),
  alleleExpressions: undefined,
  contents: '[Pmyo-2::YFP]',
});
export const oxEx2254 = new Allele({
  name: 'oxEx2254',
  gene: undefined,
  variation: new VariationInfo({ name: 'oxEx2254' }),
  alleleExpressions: undefined,
  contents: '[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]',
});
export const oxSi1168 = new Allele({
  name: 'oxSi1168',
  gene: undefined,
  variation: new VariationInfo({ name: 'oxSi1168' }),
  alleleExpressions: undefined,
  contents: '[Psnt-1:Flp, *ttTi5605]',
});
export const oxEx219999 = new Allele({
  name: 'oxEx219999',
  gene: undefined,
  variation: new VariationInfo({ name: 'oxEx219999' }),
  alleleExpressions: undefined,
  contents: '[Primb-1::HisCl1::SL2::GFP]',
});
