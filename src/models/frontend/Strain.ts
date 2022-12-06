import { AlleleExpression } from 'models/frontend/AlleleExpression';

export default interface Strain {
  name: String;
  alleles: AlleleExpression[];
  notes: String;
}
