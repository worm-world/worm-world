import { Dominance } from '../enums';

/**
 * @summary Relationship between alleles and the phenotypes they create
 * @PrimaryKey {alleleName, expressingPhenotype}
 * @ForeignKeys {alleleName: Allele.name}, {expressingPhenotype: Phenotype.shortName}
 */
export interface db_AlleleExpression {
  alleleName: String;
  expressingPhenotype: String;
  dominance: Dominance;
}

/**
 * @summary Required phenotypes for the AlleleExpression to exhibit it's phenotype
 * @PrimaryKey {alleleName, expressingPhenotype, requiredPhenotype}
 * @ForeignKeys {alleleName: Allele.name}, {expressingPhenotype: Phenotype.shortName}, {requiredPhenotype: Phenotype.shortName}
 */
export interface db_ExpressionReqs {
  alleleName: String;
  expressingPhenotype: String;
  requiredPhenotype: String;
}

/**
 * @summary Suppressing phenotypes that block a phenotype from expressing
 * @PrimaryKey {alleleName, expressingPhenotype, requiredPhenotype}
 * @ForeignKeys {alleleName: Allele.name}, {expressingPhenotype: Phenotype.shortName}, {suppressingPhenotype: Phenotype.shortName}
 */
export interface db_ExpressionSups {
  alleleName: String; // composite FK, composite PK
  expressingPhenotype: String; // composite FK, composite PK
  suppressingPhenotype: String; // composite PK
}
