import Gene from 'models/db/db_Gene';
import { VariationInfo } from 'models/frontend/Gene';
import { Condition, Phenotype } from 'models/frontend/Phenotype';
import { Dominance } from '../enums';

export interface Allele {
  name: String;
  gene?: Gene;
  variationInfo?: VariationInfo;
  phenotypeExpressions: ExpressionRelation[];
  contents?: String;
}

/**
 * @summary Relationship between an allele and the phenotypes it is able to exhibit
 */
export interface ExpressionRelation {
  /** Phenotype attached to the allele that will be expressed */
  expressingPhenotype: Phenotype;
  /** Phenotypes that need to be present for the expressing phenotype to be visible */
  requiredPhenotypes: Phenotype[];
  /** Phenotypes that "cover up" the visibility of the expressing phenotype */
  suppressingPhenotypes: Phenotype[];
  /** Environmental conditions that may affect the traits of a worm (i.e. fertility, maturationDays, etc) */
  alteringConditions: Condition[];
  /** Recessive, SemiDominant, or Dominant */
  dominance: Dominance;
}
