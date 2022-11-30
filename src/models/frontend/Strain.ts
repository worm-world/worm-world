import { AlleleExpression } from 'models/frontend/AlleleExpression';
import { Allele } from './Allele';

export default interface Strain {
  name: String;
  // alleles: AlleleExpression[]
  alleles: Allele[];
  notes: String;
}
