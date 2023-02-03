import { getAlteringConditions } from 'api/condition';
import { getAlteringPhenotypes, getPhenotype } from 'api/phenotype';
import { Type } from 'class-transformer';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { Dominance } from 'models/enums';
import { Condition } from 'models/frontend/Condition';
import { Phenotype } from 'models/frontend/Phenotype';

/**
 * @summary Relationship between an allele and the phenotypes it is able to exhibit
 */
interface IAlleleExpression {
  alleleName: string;
  phenotypeName: string;
  phenotypeWild: boolean;
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

  constructor(fields: IAlleleExpression) {
    this.expressingPhenotype = new Phenotype({
      name: '',
      shortName: '',
      wild: true,
    });
    if (fields === null || fields === undefined) {
      this.alleleName = '';
      this.dominance = undefined;
    } else {
      this.alleleName = fields.alleleName;
      this.dominance = fields.dominance;
      this.setExpressingPhenotype(
        fields.phenotypeName,
        fields.phenotypeWild
      ).catch((err) =>
        console.error('error setting expressing phenotype', err)
      );

      this.setRequiredPhenotypes(fields).catch((err) =>
        console.error('error setting required phenotypes', err)
      );
      this.setSuppressingPhenotypes(fields).catch((err) =>
        console.error('error setting suppressing phenotypes', err)
      );
      this.setRequiredConditions(fields).catch((err) =>
        console.error('error setting required conditions', err)
      );
      this.setSuppressingConditions(fields).catch((err) =>
        console.error('error setting suppressing phenotype', err)
      );
    }
  }

  private async setExpressingPhenotype(
    name: string,
    wild: boolean
  ): Promise<void> {
    const res = await getPhenotype(name, wild);
    this.expressingPhenotype = Phenotype.createFromRecord(res);
  }

  private async setRequiredPhenotypes(
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringPhenotypes(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    this.requiredPhenotypes = res.map((record) =>
      Phenotype.createFromRecord(record)
    );
  }

  private async setSuppressingPhenotypes(
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringPhenotypes(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );
    this.suppressingPhenotypes = res.map((record) =>
      Phenotype.createFromRecord(record)
    );
  }

  private async setRequiredConditions(
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    this.requiredConditions = res.map((record) =>
      Condition.createFromRecord(record)
    );
  }

  private async setSuppressingConditions(
    fields: IAlleleExpression
  ): Promise<void> {
    const res = await getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );
    this.suppressingConditions = res.map((record) =>
      Condition.createFromRecord(record)
    );
  }

  static createFromRecord(record: db_AlleleExpression): AlleleExpression {
    return new AlleleExpression({
      alleleName: record.alleleName,
      phenotypeName: record.expressingPhenotypeName,
      phenotypeWild: record.expressingPhenotypeWild,
      dominance: record.dominance ?? undefined,
    });
  }

  generateRecord(): db_AlleleExpression {
    return {
      alleleName: this.alleleName,
      expressingPhenotypeName: this.expressingPhenotype.name,
      expressingPhenotypeWild: this.expressingPhenotype.wild,
      dominance: this.dominance ?? null,
    };
  }
}
