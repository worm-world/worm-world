import { getFilteredAlleleExpressions } from 'api/alleleExpressions';
import { getGene } from 'api/gene';
import { getVariation } from 'api/variationInfo';
import { instanceToPlain, plainToInstance, Type } from 'class-transformer';
import { db_Allele } from 'models/db/db_Allele';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { FilterGroup } from 'models/db/filter/FilterGroup';
import { AlleleExpression } from 'models/frontend/AlleleExpression/AlleleExpression';
import { Gene } from 'models/frontend/Gene/Gene';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';

export const WILD_ALLELE_NAME = '+';

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

  @Type(() => Gene)
  gene?: Gene;

  @Type(() => VariationInfo)
  variation?: VariationInfo;

  @Type(() => AlleleExpression)
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
    const newAlleleState: AlleleState = {
      name: fields.name,
      gene: undefined,
      variation: undefined,
      alleleExpressions: [],
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

  private static async setGeneOrVariation(
    partialAllele: AlleleState,
    fields: IAllele
  ): Promise<void> {
    if (fields.sysGeneName !== undefined) {
      await Allele.setGene(partialAllele, fields.sysGeneName);
    } else if (fields.variationName !== undefined) {
      await Allele.setVariation(partialAllele, fields.variationName);
    } else {
      console.error(
        `Neither geneName nor variationName was provided for allele "${fields.name}"`
      );
    }
  }

  private static async setGene(
    partialAllele: AlleleState,
    geneName: string
  ): Promise<void> {
    const res = await getGene(geneName);
    partialAllele.gene = Gene.createFromRecord(res);
  }

  private static async setVariation(
    partialAllele: AlleleState,
    variationName: string
  ): Promise<void> {
    const res = await getVariation(variationName);
    partialAllele.variation = VariationInfo.createFromRecord(res);
  }

  private static async setAlleleExpressions(
    partialAllele: AlleleState,
    alleleName: string
  ): Promise<void> {
    const filter = Allele.setAlleleExpressionsFilter(alleleName);
    const res = await getFilteredAlleleExpressions(filter);
    partialAllele.alleleExpressions = await Promise.all(
      res.map(async (record) => await AlleleExpression.createFromRecord(record))
    );
  }

  private static setAlleleExpressionsFilter(
    alleleName: string
  ): FilterGroup<AlleleExpressionFieldName> {
    const filter: FilterGroup<AlleleExpressionFieldName> = {
      filters: [[['AlleleName', { Equal: alleleName }]]],
      orderBy: [],
    };
    return filter;
  }

  static async createFromRecord(record: db_Allele): Promise<Allele> {
    return await Allele.build({
      name: record.name,
      sysGeneName: record.sysGeneName ?? undefined,
      variationName: record.variationName ?? undefined,
      contents: record.contents ?? undefined,
    });
  }

  public generateRecord(): db_Allele {
    return {
      name: this.name,
      sysGeneName: this.gene?.sysName ?? null,
      variationName: this.variation?.name ?? null,
      contents: this.contents ?? null,
    };
  }

  public getChromosome(): Chromosome | undefined {
    return this.gene?.chromosome ?? this.variation?.chromosome;
  }

  public getGenPosition(): number | undefined {
    return this.gene?.geneticLoc ?? this.variation?.geneticLoc;
  }

  public getWildCopy(): Allele {
    return new Allele({
      name: WILD_ALLELE_NAME,
      variation: this.variation,
      gene: this.gene,
    });
  }

  public isWild(): boolean {
    return this.name === WILD_ALLELE_NAME;
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Allele {
    return [plainToInstance(Allele, JSON.parse(json))].flat()[0];
  }
}

export function isEcaAlleleName(name: string): boolean {
  const ecaRegex = /^[a-z]{1,3}Ex/;
  return ecaRegex.test(name);
}
