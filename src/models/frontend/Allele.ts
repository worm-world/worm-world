import { getFilteredAlleleExpressionsFromDB } from 'api/alleleExpressions';
import { getAlteringConditions } from 'api/condition';
import { getGeneFromDB } from 'api/gene';
import { getAlteringPhenotypesFromDB, getPhenotypeFromDB } from 'api/phenotype';
import { getVariationInfoFromDB } from 'api/variationInfo';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import db_Gene from 'models/db/db_Gene';
import db_Phenotype from 'models/db/db_Phenotype';
import db_VariationInfo from 'models/db/db_VariationInfo';
import { Gene, VariationInfo } from 'models/frontend/Gene';
import { Condition, Phenotype } from 'models/frontend/Phenotype';
import { Dominance } from '../enums';

interface IAllele {
  name: String;
  geneName?: String;
  contents?: String;
}

export class Allele {
  name: String;
  gene?: Gene;
  variationInfo?: VariationInfo;
  alleleExpressions: AlleleExpression[] = [];
  contents?: String;

  constructor(fields: IAllele) {
    this.name = fields.name;
    fields.geneName != null // Sets gene or variationInfo
      ? (this.gene = this.getGene(fields.geneName))
      : (this.variationInfo = this.getVariationInfo(fields.name));
    this.contents = fields.contents;
    this.alleleExpressions = this.getAlleleExpressions(fields.name);
  }

  private readonly getGene = (geneName: String): Gene => {
    const dbGene: db_Gene = getGeneFromDB(geneName) as db_Gene;
    return Gene.createFromRecord(dbGene);
  };

  private readonly getVariationInfo = (alleleName: String): VariationInfo => {
    const dbVariation: db_VariationInfo = getVariationInfoFromDB(
      alleleName
    ) as db_VariationInfo;
    return VariationInfo.createFromRecord(dbVariation);
  };

  private readonly getAlleleExpressions = (
    alleleName: String
  ): AlleleExpression[] => {
    const dbAlleleExpressions: db_AlleleExpression[] =
      getFilteredAlleleExpressionsFromDB(alleleName);
    return dbAlleleExpressions.map((record) =>
      AlleleExpression.createFromRecord(record)
    );
  };
}

/**
 * @summary Relationship between an allele and the phenotypes it is able to exhibit
 */
interface IAlleleExpression {
  alleleName: String;
  phenotypeName: String;
  phenotypeWild: Boolean;
  dominance: Dominance;
}

export class AlleleExpression {
  alleleName: String;
  /** Phenotype attached to the allele that will be expressed */
  expressingPhenotype: Phenotype;
  /** Phenotypes that need to be present for the expressing phenotype to be visible */
  requiredPhenotypes: Phenotype[];
  /** Phenotypes that "cover up" the visibility of the expressing phenotype */
  suppressingPhenotypes: Phenotype[];
  /** Environmental conditions that need to be present for expressing phenotype to be visible */
  requiredConditions: Condition[];
  /** Environmental that "cover up" the visibility of the expressing phenotype */
  suppressingConditions: Condition[];
  /** Recessive, SemiDominant, or Dominant */
  dominance: Dominance;

  constructor(fields: IAlleleExpression) {
    this.alleleName = fields.alleleName;
    this.dominance = fields.dominance;
    const expressingPhenotypeDB = getPhenotypeFromDB(
      fields.phenotypeName,
      fields.phenotypeWild
    ) as db_Phenotype;
    const requiredPhenotypesDB = getAlteringPhenotypesFromDB(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    const suppressingPhenotypesDB = getAlteringPhenotypesFromDB(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );
    const requiredConditionsDB = getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      false
    );
    const suppressingConditionsDB = getAlteringConditions(
      fields.alleleName,
      fields.phenotypeName,
      fields.phenotypeWild,
      true
    );

    this.expressingPhenotype = Phenotype.createFromRecord(
      expressingPhenotypeDB
    );
    this.requiredPhenotypes = requiredPhenotypesDB.map((el) =>
      Phenotype.createFromRecord(el)
    );
    this.suppressingPhenotypes = suppressingPhenotypesDB.map((el) =>
      Phenotype.createFromRecord(el)
    );
    this.requiredConditions = requiredConditionsDB.map((el) =>
      Condition.createFromRecord(el)
    );
    this.suppressingConditions = suppressingConditionsDB.map((el) =>
      Condition.createFromRecord(el)
    );
  }

  static createFromRecord(record: db_AlleleExpression): AlleleExpression {
    return new AlleleExpression({
      alleleName: record.alleleName,
      phenotypeName: record.expressingPhenotypeName,
      phenotypeWild: record.expressingPhenotypeWild,
      dominance: record.dominance,
    });
  }

  generateRecord = (): db_AlleleExpression => {
    return {
      alleleName: this.alleleName,
      expressingPhenotypeName: this.expressingPhenotype.name,
      expressingPhenotypeWild: this.expressingPhenotype.wild,
      dominance: this.dominance,
    };
  };
}
