import { type Chromosome } from 'models/db/filter/db_ChromosomeEnum';

/**
 * Specific to C. Elegans:
 * I to V are five somatic chromosomes,
 * X is sex chromosome,
 * Ex is extra-chromosomal array (not technically chromosome, but treated as one)
 */
export const chromosomes: Chromosome[] = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'X',
  'Ex',
];
