import { getFilteredAlleleExpressions } from 'api/alleleExpression';
import { getGene } from 'api/gene';
import { getVariation } from 'api/variation';
import { instanceToPlain, plainToInstance, Type } from 'class-transformer';
import { type db_Allele } from 'models/db/db_Allele';
import { type AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { type ChromosomeName } from 'models/db/filter/db_ChromosomeName';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { AlleleExpression } from 'models/frontend/AlleleExpression/AlleleExpression';
import { Gene } from 'models/frontend/Gene/Gene';
import { Variation } from 'models/frontend/Variation/Variation';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';

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
  variation?: Variation;
  alleleExpressions?: AlleleExpression[];
  contents?: string;
}

// Allele should always have exactly one of (1) gene or (2) variation
export class Allele {
  name: string = '';

  @Type(() => Gene)
  gene?: Gene;

  @Type(() => Variation)
  variation?: Variation;

  @Type(() => AlleleExpression)
  alleleExpressions: AlleleExpression[] = [];

  contents?: string;

  constructor(fields: AlleleState) {
    Object.assign(this, fields);
  }

  public equals(other: Allele): boolean {
    return this.name === other.name;
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

    await Allele.setGeneOrVariation(newAlleleState, fields).catch((err) => {
      console.error('error generating gene or variation', err);
    });

    await Allele.setAlleleExpressions(newAlleleState, fields.name).catch(
      (err) => {
        console.error('error generating allele expressions: ', err);
      }
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
    partialAllele.variation = Variation.createFromRecord(res);
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

  /** For alleles of genes, return a string of the form 'genename(allelename)'; for other alleles, returns 'allelename' */
  public getQualifiedName(excludeWilds = false): string {
    if (this.gene === undefined)
      return this.isWild()
        ? `${this.variation?.name}(${this.name})`
        : this.name;
    else return `${this.gene.descName}(${this.name})`;
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

  public toHomo(): AllelePair {
    return new AllelePair({ top: this, bot: this });
  }

  public toTopHet(): AllelePair {
    return new AllelePair({ top: this, bot: this.toWild() });
  }

  public toBotHet(): AllelePair {
    return new AllelePair({ top: this.toWild(), bot: this });
  }

  public isEca(): boolean {
    return this.getChromName() === 'Ex';
  }

  public isX(): boolean {
    return this.getChromName() === 'X';
  }

  public generateRecord(): db_Allele {
    return {
      name: this.name,
      sysGeneName: this.gene?.sysName ?? null,
      variationName: this.variation?.name ?? null,
      contents: this.contents ?? null,
    };
  }

  public getChromName(): ChromosomeName | undefined {
    return this.gene?.chromosome ?? this.variation?.chromosome;
  }

  public getGenPosition(): number | undefined {
    return this.gene?.geneticLoc ?? this.variation?.geneticLoc;
  }

  public toWild(): Allele {
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
    return plainToInstance(Allele, JSON.parse(json) as Record<string, unknown>);
  }
}

export function isEcaAlleleName(name: string): boolean {
  const ecaRegex = /^[a-z]{1,3}Ex/;
  return ecaRegex.test(name);
}
