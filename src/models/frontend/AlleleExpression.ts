import { getAlteringConditions } from 'api/condition';
import { getAlteringPhenotypes, getPhenotype } from 'api/phenotype';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { Dominance } from 'models/enums';
import { isDbError } from 'models/error';
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
  expressingPhenotype: Phenotype;
  /** Phenotypes that need to be present for the expressing phenotype to be visible */
  requiredPhenotypes: Phenotype[] = [];
  /** Phenotypes that "cover up" the visibility of the expressing phenotype */
  suppressingPhenotypes: Phenotype[] = [];
  /** Environmental conditions that need to be present for expressing phenotype to be visible */
  requiredConditions: Condition[] = [];
  /** Environmental that "cover up" the visibility of the expressing phenotype */
  suppressingConditions: Condition[] = [];
  /** Recessive, SemiDominant, or Dominant */
  dominance?: Dominance;

  constructor(fields: IAlleleExpression) {
    this.expressingPhenotype = new Phenotype({
      name: '',
      shortName: '',
      wild: true,
    });
    this.alleleName = fields.alleleName;
    this.dominance = fields.dominance;
    this.setExpressingPhenotype(
      fields.phenotypeName,
      fields.phenotypeWild
    ).catch((err) => console.error('error setting expressing phenotype', err));

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

  private readonly setExpressingPhenotype = async (
    name: string,
    wild: boolean
  ): Promise<void> => {
    const res = await getPhenotype(name, wild);
    if (!isDbError(res))
      this.expressingPhenotype = Phenotype.createFromRecord(res);
  };

  private readonly setRequiredPhenotypes = async (
    fields: IAlleleExpression
  ): Promise<void> => {
    const res = await getAlteringPhenotypes(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    if (!isDbError(res))
      this.requiredPhenotypes = res.map((record) =>
        Phenotype.createFromRecord(record)
      );
  };

  private readonly setSuppressingPhenotypes = async (
    fields: IAlleleExpression
  ): Promise<void> => {
    const res = await getAlteringPhenotypes(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );
    if (!isDbError(res))
      this.suppressingPhenotypes = res.map((record) =>
        Phenotype.createFromRecord(record)
      );
  };

  private readonly setRequiredConditions = async (
    fields: IAlleleExpression
  ): Promise<void> => {
    const res = await getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    if (!isDbError(res))
      this.requiredConditions = res.map((record) =>
        Condition.createFromRecord(record)
      );
  };

  private readonly setSuppressingConditions = async (
    fields: IAlleleExpression
  ): Promise<void> => {
    const res = await getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );
    if (!isDbError(res))
      this.suppressingConditions = res.map((record) =>
        Condition.createFromRecord(record)
      );
  };

  static createFromRecord(record: db_AlleleExpression): AlleleExpression {
    return new AlleleExpression({
      alleleName: record.alleleName,
      phenotypeName: record.expressingPhenotypeName,
      phenotypeWild: record.expressingPhenotypeWild,
      dominance: record.dominance ?? undefined,
    });
  }

  generateRecord = (): db_AlleleExpression => {
    return {
      alleleName: this.alleleName,
      expressingPhenotypeName: this.expressingPhenotype.name,
      expressingPhenotypeWild: this.expressingPhenotype.wild,
      dominance: this.dominance ?? null,
    };
  };
}
