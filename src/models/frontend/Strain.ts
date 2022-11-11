import { AlleleExpression } from './Allele';

export default interface Strain {
  name: String;
  alleles: AlleleExpression[];
  notes: String;
}
