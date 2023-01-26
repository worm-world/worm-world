import { getFilteredAlleleExpressions } from 'api/alleleExpressions';
import { getGene } from 'api/gene';
import { getVariation } from 'api/variationInfo';
import { db_Allele } from 'models/db/db_Allele';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { Filter } from 'models/db/filter/Filter';
import { AlleleExpression } from 'models/frontend/AlleleExpression';
import { Gene } from 'models/frontend/Gene/Gene';
import GeneticLocation from 'models/frontend/GeneticLocation';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';

interface IAllele {
  name: string;
  sysGeneName?: string;
  variationName?: string;
  contents?: string;
  alleleExpressions?: AlleleExpression[];
}

interface AlleleState {
  name: string;
  gene?: Gene;
  variation?: VariationInfo;
  alleleExpressions?: AlleleExpression[];
  contents?: string;
}

// Allele should always have exactly one of (1) gene or (2) variationInfo
export class Allele {
  name: string = '';
  gene?: Gene;
  variation?: VariationInfo;
  alleleExpressions: AlleleExpression[] = [];
  contents?: string;

  constructor(fields: AlleleState) {
    Object.assign(this, fields);
  }

  /**
   * @param fields Name-based representation of allele, including geneName or variationName
   * @returns Full, rich allele with object references for a gene or variation, etc.
   */
  static async build(fields: IAllele): Promise<Allele> {
    const newAlleleState = {
      name: fields.name,
      gene: undefined,
      variation: undefined,
    };

    await Allele.setGeneOrVariation(newAlleleState, fields).catch((err) =>
      console.error('error generating gene / variation', err)
    );

    await Allele.setAlleleExpressions(newAlleleState, fields.name).catch(
      (err) => console.error('error generating allele expressions: ', err)
    );

    const allele = new Allele(newAlleleState);
    return allele;
  }

  private static readonly setGeneOrVariation = async (
    partialAllele: AlleleState,
    fields: IAllele
  ): Promise<void> => {
    if (fields.sysGeneName !== undefined) {
      await Allele.setGene(partialAllele, fields.sysGeneName);
    } else if (fields.variationName !== undefined) {
      await Allele.setVariation(partialAllele, fields.variationName);
    } else {
      console.error(
        `Neither geneName nor variationName was provided for allele "${fields.name}"`
      );
    }
  };

  private static readonly setGene = async (
    partialAllele: { name: string; gene?: Gene },
    geneName: string
  ): Promise<void> => {
    const res = await getGene(geneName);
    partialAllele.gene = Gene.createFromRecord(res);
  };

  private static readonly setVariation = async (
    partialAllele: { name: string; variation?: VariationInfo },
    variationName: string
  ): Promise<void> => {
    const res = await getVariation(variationName);
    partialAllele.variation = VariationInfo.createFromRecord(res);
  };

  private static readonly setAlleleExpressions = async (
    partialAllele: AlleleState,
    alleleName: string
  ): Promise<void> => {
    const filter = Allele.setAlleleExpressionsFilter(alleleName);
    const res = await getFilteredAlleleExpressions(filter);
    partialAllele.alleleExpressions = res.map((record) =>
      AlleleExpression.createFromRecord(record)
    );
  };

  private static readonly setAlleleExpressionsFilter = (
    alleleName: string
  ): Filter<AlleleExpressionFieldName> => {
    const filter: Filter<AlleleExpressionFieldName> = {
      filters: [[['AlleleName', { Equal: alleleName }]]],
      orderBy: [],
    };
    return filter;
  };

  static async createFromRecord(record: db_Allele): Promise<Allele> {
    return await Allele.build({
      name: record.name,
      sysGeneName: record.sysGeneName ?? undefined,
      variationName: record.variationName ?? undefined,
      contents: record.contents ?? undefined,
    });
  }

  public generateRecord = (): db_Allele => {
    return {
      name: this.name,
      sysGeneName: this.gene?.sysName ?? null,
      variationName: this.variation?.name ?? null,
      contents: this.contents ?? null,
    };
  };

  public getChromosome = (): Chromosome | undefined =>
    this.gene?.chromosome ?? this.variation?.chromosome;

  public getGenPosition = (): number | undefined =>
    this.gene?.geneticLoc?.getLoc() ?? this.variation?.geneticLoc?.getLoc();
}

export class WildAllele extends Allele {
  constructor(refAllele?: Allele) {
    let variation: VariationInfo | undefined;
    if (refAllele !== undefined) {
      variation = new VariationInfo({
        name: '+',
        chromosome: refAllele.getChromosome(),
        geneticLoc: new GeneticLocation(refAllele.getGenPosition() ?? null),
      });
    }
    super({ name: '+', variation });
  }
}

export const WILD_ALLELE = new Allele({
  name: '+',
});
