import { Allele } from 'models/frontend/Allele/Allele';
import * as geneMock from 'models/frontend/Gene/Gene.mock';
import * as variationMock from 'models/frontend/VariationInfo/VariationInfo.mock';

export const chrom1Gene1Allele1 = new Allele({
  name: 'chrom1Gene1Allele1',
  gene: geneMock.chrom1Gene1,
});

export const chrom1Gene2Allele1 = new Allele({
  name: 'chrom1Gene2Allele1',
  gene: geneMock.chrom1Gene2,
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
  gene: geneMock.unc119,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const n765 = new Allele({
  name: 'n765',
  gene: geneMock.lin15B,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const md299 = new Allele({
  name: 'md299',
  gene: geneMock.unc18,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const cn64 = new Allele({
  name: 'cn64',
  gene: geneMock.dpy10,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const ox1059 = new Allele({
  name: 'ox1059',
  gene: geneMock.kin4,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const oxIs644 = new Allele({
  name: 'oxIs644',
  gene: undefined,
  variation: variationMock.oxIs644,
  alleleExpressions: undefined,
  contents: '[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]',
});
export const oxIs12 = new Allele({
  name: 'oxIs12',
  gene: undefined,
  variation: variationMock.oxIs12,
  alleleExpressions: undefined,
  contents: '[Punc-47::GFP; lin-15(+)]',
});
export const oxTi302 = new Allele({
  name: 'oxTi302',
  gene: undefined,
  variation: variationMock.oxTi302,
  alleleExpressions: undefined,
  contents: '[Peft-3::mCherry; cbr-unc-119(+)]',
});
export const oxTi75 = new Allele({
  name: 'oxTi75',
  gene: undefined,
  variation: variationMock.oxTi75,
  alleleExpressions: undefined,
  contents: '[Peft-3::GFP-NLS; unc-18(+)]',
});
export const tmC5 = new Allele({
  name: 'tmC5',
  gene: undefined,
  variation: variationMock.tmC5,
  alleleExpressions: undefined,
  contents: undefined,
});
export const tmC5ALT = new Allele({
  name: 'tmC5',
  gene: undefined,
  variation: variationMock.tmC5ALT,
  alleleExpressions: undefined,
  contents: '[Pmyo-2::YFP]',
});
export const oxEx2254 = new Allele({
  name: 'oxEx2254',
  gene: undefined,
  variation: variationMock.oxEx2254,
  alleleExpressions: undefined,
  contents: '[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]',
});
export const oxSi1168 = new Allele({
  name: 'oxSi1168',
  gene: undefined,
  variation: variationMock.oxSi1168,
  alleleExpressions: undefined,
  contents: '[Psnt-1:Flp, *ttTi5605]',
});
export const oxEx219999 = new Allele({
  name: 'oxEx219999',
  gene: undefined,
  variation: variationMock.oxEx219999,
  alleleExpressions: undefined,
  contents: '[Primb-1::HisCl1::SL2::GFP]',
});
export const oxEx12345 = new Allele({
  name: 'oxEx219999',
  gene: undefined,
  variation: variationMock.oxEx12345,
  alleleExpressions: undefined,
  contents: '[Psnt-1::GFP, unc-119(+), FRT]',
});
export const ox750 = new Allele({
  name: 'ox750',
  gene: geneMock.unc44,
  variation: undefined,
  alleleExpressions: undefined,
  contents: '[skylan-s; loxP Cbr-unc-119 loxP]',
});
export const ox802 = new Allele({
  name: 'ox802',
  gene: geneMock.unc44,
  variation: undefined,
  alleleExpressions: undefined,
  contents: '[skylan-s; loxP]',
});
export const ox11000 = new Allele({
  name: 'ox11000',
  gene: geneMock.unc119,
  variation: undefined,
  alleleExpressions: undefined,
  contents:
    '[unc-119::FRT::UTR::FRT::mScarlet, loxN HygR sqt-1(e1350) Phsp::Cre loxN]',
});
export const ox11001 = new Allele({
  name: 'ox11001',
  gene: geneMock.unc119,
  variation: undefined,
  alleleExpressions: undefined,
  contents: '[unc-119::FRT::UTR::FRT::mScarlet, loxN]',
});
export const jsSi1949 = new Allele({
  name: 'jsSi1949',
  gene: undefined,
  variation: variationMock.jsSi1949,
  alleleExpressions: undefined,
  contents: '[Pmex-5::Cre, Pmyo-2::GFP, HygR]',
});
export const e1489 = new Allele({
  name: 'e1489',
  gene: geneMock.him8,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const e53 = new Allele({
  name: 'e53',
  gene: geneMock.unc5,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const e1282 = new Allele({
  name: 'e1282',
  gene: geneMock.dpy20,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const eT1V = new Allele({
  name: 'eT1(V)',
  gene: undefined,
  variation: variationMock.eT1V,
  alleleExpressions: undefined,
  contents: undefined,
});
export const eT1III = new Allele({
  name: 'eT1(III)',
  gene: undefined,
  variation: variationMock.eT1III,
  alleleExpressions: undefined,
  contents: '[unc-36(e873)]',
});
export const e873 = new Allele({
  name: 'e873',
  gene: geneMock.unc36,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const ox1111 = new Allele({
  name: 'ox1111',
  gene: undefined,
  variation: variationMock.ox1111,
  alleleExpressions: undefined,
  contents: undefined,
});
export const e362 = new Allele({
  name: 'e362',
  gene: geneMock.unc44,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const e204 = new Allele({
  name: 'e204',
  gene: geneMock.unc33,
  variation: undefined,
  alleleExpressions: undefined,
  contents: undefined,
});
export const ox992 = new Allele({
  name: 'ox992',
  gene: geneMock.unc44,
  variation: undefined,
  alleleExpressions: undefined,
  contents: '[SL2::YFP-NLS]',
});
