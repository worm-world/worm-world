import { Allele } from 'models/frontend/Allele/Allele';
import {
  ed3PhenUnc119,
  n765PhenLin15B,
} from 'models/frontend/AlleleExpression/AlleleExpression.mock';
import * as geneMock from 'models/frontend/Gene/Gene.mock';
import * as variationMock from 'models/frontend/Variation/Variation.mock';

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

export const chromExVariation1Allele1 = new Allele({
  name: 'chromExVariation1Allele1',
  variation: variationMock.chromExVariation1,
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
  alleleExpressions: [ed3PhenUnc119],
});

export const n765 = new Allele({
  name: 'n765',
  gene: geneMock.lin15B,
  alleleExpressions: [n765PhenLin15B],
});

export const md299 = new Allele({
  name: 'md299',
  gene: geneMock.unc18,
});
export const cn64 = new Allele({
  name: 'cn64',
  gene: geneMock.dpy10,
});
export const ox1059 = new Allele({
  name: 'ox1059',
  gene: geneMock.kin4,
});
export const oxIs644 = new Allele({
  name: 'oxIs644',
  variation: variationMock.oxIs644,
  contents: '[Peft-3::FRT-UTR-FRT::mYFP::unc-54UTR; lin-15(+)]',
});
export const oxIs12 = new Allele({
  name: 'oxIs12',
  variation: variationMock.oxIs12,
  contents: '[Punc-47::GFP; lin-15(+)]',
});
export const oxTi302 = new Allele({
  name: 'oxTi302',
  variation: variationMock.oxTi302,
  contents: '[Peft-3::mCherry; cbr-unc-119(+)]',
});
export const oxTi75 = new Allele({
  name: 'oxTi75',
  variation: variationMock.oxTi75,
  contents: '[Peft-3::GFP-NLS; unc-18(+)]',
});
export const tmC5 = new Allele({
  name: 'tmC5',
  variation: variationMock.tmC5,
});
export const tmC5ALT = new Allele({
  name: 'tmC5',
  variation: variationMock.tmC5ALT,
  contents: '[Pmyo-2::YFP]',
});
export const oxEx2254 = new Allele({
  name: 'oxEx2254',
  variation: variationMock.oxEx2254,
  contents: '[Psnt-1::Flp, Punc-122::GAP-43::mScarlet, cbr-unc-119(+), NeoR]',
});
export const oxSi1168 = new Allele({
  name: 'oxSi1168',
  variation: variationMock.oxSi1168,
  contents: '[Psnt-1:Flp, *ttTi5605]',
});
export const oxEx219999 = new Allele({
  name: 'oxEx219999',
  variation: variationMock.oxEx219999,
  contents: '[Primb-1::HisCl1::SL2::GFP]',
});
export const oxEx12345 = new Allele({
  name: 'oxEx12345',
  variation: variationMock.oxEx12345,
  contents: '[Psnt-1::GFP, unc-119(+), FRT]',
});
export const ox750 = new Allele({
  name: 'ox750',
  gene: geneMock.unc44,
  contents: '[skylan-s; loxP Cbr-unc-119 loxP]',
});
export const ox802 = new Allele({
  name: 'ox802',
  gene: geneMock.unc44,
  contents: '[skylan-s; loxP]',
});
export const ox11000 = new Allele({
  name: 'ox11000',
  gene: geneMock.unc119,
  contents:
    '[unc-119::FRT::UTR::FRT::mScarlet, loxN HygR sqt-1(e1350) Phsp::Cre loxN]',
});
export const ox11001 = new Allele({
  name: 'ox11001',
  gene: geneMock.unc119,
  contents: '[unc-119::FRT::UTR::FRT::mScarlet, loxN]',
});
export const jsSi1949 = new Allele({
  name: 'jsSi1949',
  variation: variationMock.jsSi1949,
  contents: '[Pmex-5::Cre, Pmyo-2::GFP, HygR]',
});
export const e1489 = new Allele({
  name: 'e1489',
  gene: geneMock.him8,
});
export const e53 = new Allele({
  name: 'e53',
  gene: geneMock.unc5,
});
export const e1282 = new Allele({
  name: 'e1282',
  gene: geneMock.dpy20,
});
export const eT1V = new Allele({
  name: 'eT1(V)',
  variation: variationMock.eT1V,
});
export const eT1III = new Allele({
  name: 'eT1(III)',
  variation: variationMock.eT1III,
  contents: '[unc-36(e873)]',
});
export const e873 = new Allele({
  name: 'e873',
  gene: geneMock.unc36,
});
export const ox1111 = new Allele({
  name: 'ox1111',
  variation: variationMock.ox1111,
});
export const e362 = new Allele({
  name: 'e362',
  gene: geneMock.unc44,
});
export const e204 = new Allele({
  name: 'e204',
  gene: geneMock.unc33,
});
export const ox992 = new Allele({
  name: 'ox992',
  gene: geneMock.unc44,
  contents: '[SL2::YFP-NLS]',
});

export const n744 = new Allele({
  name: 'n744', 
  gene: geneMock.lin15B,
});

export const e128 = new Allele({
  name: 'e128',
  gene: geneMock.dpy10,
});

export const e138 = new Allele({
  name: 'e138',
  gene: geneMock.un24,
});

export const oxIs363 = new Allele({
  name: 'oxIs363',
  variation: variationMock.oxIs363,
  content: '[unc-122p::GFP + unc-119(+)]',
});

export const hd43 = new Allele({
  name: 'hd43',
  gene: geneMock.fbl1,
});
