import { getAlteringConditions } from 'api/condition';
import { getAlteringPhenotypes, getPhenotype } from 'api/phenotype';
import {
  Exclude,
  instanceToPlain,
  plainToInstance,
  Type,
} from 'class-transformer';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { Dominance } from 'models/enums';
import { Condition } from 'models/frontend/Condition/Condition';
import { Phenotype } from 'models/frontend/Phenotype/Phenotype';

/**
 * @summary Relationship between an allele and the phenotypes it is able to exhibit
 */
interface IAlleleExpression {
  alleleName: string;
  phenotypeName: string;
  phenotypeWild: boolean;
  dominance?: Dominance;
}

export interface AlleleExpressionState {
  alleleName: string;
  expressingPhenotype: Phenotype;
  requiredPhenotypes: Phenotype[];
  suppressingPhenotypes: Phenotype[];
  requiredConditions: Condition[];
  suppressingConditions: Condition[];
  dominance?: Dominance;
}

export class AlleleExpression {
  alleleName: string;
  /** Phenotype attached to the allele that will be expressed */
  @Type(() => Phenotype)
  expressingPhenotype: Phenotype;

  /** Phenotypes that need to be present for the expressing phenotype to be visible */
  @Type(() => Phenotype)
  requiredPhenotypes: Phenotype[] = [];

  /** Phenotypes that "cover up" the visibility of the expressing phenotype */
  @Type(() => Phenotype)
  suppressingPhenotypes: Phenotype[] = [];

  /** Environmental conditions that need to be present for expressing phenotype to be visible */
  @Type(() => Condition)
  requiredConditions: Condition[] = [];

  /** Environmental that "cover up" the visibility of the expressing phenotype */
  @Type(() => Condition)
  suppressingConditions: Condition[] = [];

  /** Recessive, SemiDominant, or Dominant */
  dominance?: Dominance;

  constructor(fields: AlleleExpressionState) {
    if (fields === null || fields === undefined) {
      this.expressingPhenotype = new Phenotype({
        name: '',
        shortName: '',
        wild: true,
      });
      this.alleleName = '';
      this.dominance = undefined;
      this.requiredPhenotypes = [];
      this.suppressingPhenotypes = [];
      this.requiredConditions = [];
      this.suppressingConditions = [];
    } else {
      this.expressingPhenotype = fields.expressingPhenotype;
      this.alleleName = fields.alleleName;
      this.dominance = fields.dominance;
      this.requiredPhenotypes = fields.requiredPhenotypes;
      this.suppressingPhenotypes = fields.suppressingPhenotypes;
      this.requiredConditions = fields.requiredConditions;
      this.suppressingConditions = fields.suppressingConditions;
    }
  }

  /**
   * @param fields Name-based representation of allele, including geneName or variationName
   * @returns Full, rich AlleleExpression with object references for a phenotypes, conditions, etc.
   */
  static async build(fields: IAlleleExpression): Promise<AlleleExpression> {
    const newAlleleExprState: AlleleExpressionState = {
      alleleName: fields.alleleName,
      expressingPhenotype: new Phenotype({
        name: fields.phenotypeName,
        wild: fields.phenotypeWild,
        shortName: '',
      }),
      requiredPhenotypes: [],
      suppressingPhenotypes: [],
      requiredConditions: [],
      suppressingConditions: [],
      dominance: fields.dominance,
    };

    await AlleleExpression.setExpressingPhenotype(
      newAlleleExprState,
      fields
    ).catch((err) => console.error('error setting expressing phenotype', err));

    await AlleleExpression.setRequiredPhenotypes(
      newAlleleExprState,
      fields
    ).catch((err) => console.error('error setting required phenotypes', err));

    await AlleleExpression.setSuppressingPhenotypes(
      newAlleleExprState,
      fields
    ).catch((err) =>
      console.error('error setting suppressing phenotypes', err)
    );

    await AlleleExpression.setRequiredConditions(
      newAlleleExprState,
      fields
    ).catch((err) => console.error('error setting required conditions', err));

    await AlleleExpression.setSuppressingConditions(
      newAlleleExprState,
      fields
    ).catch((err) => console.error('error setting suppressing phenotype', err));

    return new AlleleExpression(newAlleleExprState);
  }

  private static async setExpressingPhenotype(
    partialAlleleExpr: AlleleExpressionState,
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getPhenotype(fields.phenotypeName, fields.phenotypeWild);
    partialAlleleExpr.expressingPhenotype = Phenotype.createFromRecord(res);
  }

  private static async setRequiredPhenotypes(
    partialAlleleExpr: AlleleExpressionState,
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringPhenotypes(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    partialAlleleExpr.requiredPhenotypes = res.map((record) =>
      Phenotype.createFromRecord(record)
    );
  }

  private static async setSuppressingPhenotypes(
    partialAlleleExpr: AlleleExpressionState,
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringPhenotypes(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );
    partialAlleleExpr.suppressingPhenotypes = res.map((record) =>
      Phenotype.createFromRecord(record)
    );
  }

  private static async setRequiredConditions(
    partialAlleleExpr: AlleleExpressionState,
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    partialAlleleExpr.requiredConditions = res.map((record) =>
      Condition.createFromRecord(record)
    );
  }

  private static async setSuppressingConditions(
    partialAlleleExpr: AlleleExpressionState,
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );
    partialAlleleExpr.suppressingConditions = res.map((record) =>
      Condition.createFromRecord(record)
    );
  }

  public static async createFromRecord(
    record: db_AlleleExpression
  ): Promise<AlleleExpression> {
    return await AlleleExpression.build({
      alleleName: record.alleleName,
      phenotypeName: record.expressingPhenotypeName,
      phenotypeWild: record.expressingPhenotypeWild,
      dominance: record.dominance ?? undefined,
    });
  }

  @Exclude()
  public generateRecord(): db_AlleleExpression {
    return {
      alleleName: this.alleleName,
      expressingPhenotypeName: this.expressingPhenotype.name,
      expressingPhenotypeWild: this.expressingPhenotype.wild,
      dominance: this.dominance ?? null,
    };
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): AlleleExpression {
    return [plainToInstance(AlleleExpression, JSON.parse(json))].flat()[0];
  }
}
