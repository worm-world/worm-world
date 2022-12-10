import { getFilteredAlleleExpressions } from 'api/alleleExpressions';
import { getGene } from 'api/gene';
import { getVariation } from 'api/variationInfo';
import { db_Allele } from 'models/db/db_Allele';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { Filter } from 'models/db/filter/Filter';
import { AlleleExpression } from 'models/frontend/AlleleExpression';
import { Gene } from 'models/frontend/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo';

interface IAllele {
  name: string;
  geneName?: string;
  contents?: string;
}

// Useful in testing (avoids api calls)
export interface FullAllele {
  name: string;
  gene?: Gene;
  variationInfo?: VariationInfo;
  alleleExpressions?: AlleleExpression[];
  contents?: string;
}

// Allele should always have exactly one of (1) gene or (2) variationInfo
export class Allele {
  name: string;
  gene?: Gene;
  variationInfo?: VariationInfo;
  alleleExpressions: AlleleExpression[] = [];
  contents?: string;

  constructor(fields: IAllele | FullAllele) {
    this.name = fields.name;
    this.contents = fields.contents;

    // Type guard
    if (
      (fields as FullAllele).gene != null ||
      (fields as FullAllele).variationInfo != null
    ) {
      this.gene = (fields as FullAllele).gene;
      this.variationInfo = (fields as FullAllele).variationInfo;
      return;
    }

    this.setGeneOrVariation(fields).catch((err) =>
      console.error('error generating gene / variation', err)
    );

    this.setAlleleExpressions(fields.name).catch((err) =>
      console.error('error generating allele expressions: ', err)
    );
  }

  private readonly setGene = async (geneName: string): Promise<void> => {
    const res = await getGene(geneName);
    this.gene = Gene.createFromRecord(res);
  };

  private readonly setVariation = async (alleleName: string): Promise<void> => {
    const res = await getVariation(alleleName);
    this.variationInfo = VariationInfo.createFromRecord(res);
  };

  private readonly setGeneOrVariation = async (
    fields: IAllele
  ): Promise<void> => {
    fields.geneName !== undefined
      ? await this.setGene(fields.geneName)
      : await this.setVariation(fields.name);
  };

  private readonly setAlleleExpressions = async (
    alleleName: string
  ): Promise<void> => {
    const filter = this.getAlleleExpressionsFilter(alleleName);
    const res = await getFilteredAlleleExpressions(filter);
    this.alleleExpressions = res.map((record) =>
      AlleleExpression.createFromRecord(record)
    );
  };

  private readonly getAlleleExpressionsFilter = (
    alleleName: string
  ): Filter<AlleleExpressionFieldName> => {
    const filter: Filter<AlleleExpressionFieldName> = {
      filters: [[['AlleleName', { Equal: alleleName }]]],
      orderBy: [],
    };
    return filter;
  };

  static createFromRecord(record: db_Allele): Allele {
    return new Allele({
      name: record.name,
      geneName: record.geneName ?? undefined,
      contents: record.contents ?? undefined,
    });
  }

  generateRecord = (): db_Allele => {
    return {
      name: this.name,
      geneName: this.gene?.name ?? null,
      variationName: this.variationInfo?.name ?? null,
      contents: this.contents ?? null,
    };
  };
}
