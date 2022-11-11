import { Dominance } from '../enums';
import Phenotype from './Phenotype';

export interface Allele {
  name: String;
  geneName: String;
  contents: String;
}

/**
 * @summary Relationship between an allele and the phenotypes it is able to exhibit
 */
export interface AlleleExpression {
  allele: Allele;
  /** Phenotype attached to the allele that will be expressed */
  expressingPhenotype: Phenotype;
  /** Phenotypes that need to be present for the expressing phenotype to be visible */
  expressionRequirements: Phenotype[];
  /** Phenotypes that "cover up" the visibility of the expressing phenotype */
  suppressingPhenotypes: Phenotype[];
  dominance: Dominance;
}
