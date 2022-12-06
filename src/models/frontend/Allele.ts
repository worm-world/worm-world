import { getFilteredAlleleExpressions } from 'api/alleleExpressions';
import { getGene } from 'api/gene';
import { getVariation } from 'api/variationInfo';
import { db_Allele } from 'models/db/db_Allele';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { Filter } from 'models/db/filter/filter';
import { AlleleExpression } from 'models/frontend/AlleleExpression';
import { Gene } from 'models/frontend/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo';

interface IAllele {
  name: string;
  geneName?: string;
  contents?: string;
}

export class Allele {
  name: string;
  gene?: Gene;
  variationInfo?: VariationInfo;
  alleleExpressions: AlleleExpression[] = [];
  contents?: string;

  constructor(fields: IAllele) {
    this.name = fields.name;
    this.contents = fields.contents;
    this.setGeneOrVariation(fields).catch((err) =>
      console.error('error generating gene / variation', err)
    );

    this.setAlleleExpressions(fields.name).catch((err) =>
      console.error('error generating allele expressions: ', err)
    );
  }

  private readonly setGene = async (geneName: string): Promise<void> => {
    const dbGene = await getGene(geneName);
    if (dbGene != null) this.gene = Gene.createFromRecord(dbGene);
  };

  private readonly setVariation = async (alleleName: string): Promise<void> => {
    const dbVariation = await getVariation(alleleName);
    if (dbVariation != null)
      this.variationInfo = VariationInfo.createFromRecord(dbVariation);
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
    const dbAlleleExprs = await getFilteredAlleleExpressions(filter);
    this.alleleExpressions = dbAlleleExprs.map((record) =>
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
      variationName: this.variationInfo?.alleleName ?? null,
      contents: this.contents ?? null,
    };
  };
}
