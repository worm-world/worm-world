import { Allele } from 'models/frontend/Allele';

export default interface Strain {
  name: String;
  alleles: Allele[];
  notes: String;
}
