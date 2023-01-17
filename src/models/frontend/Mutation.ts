import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';

/**
 * Specific to C. Elegans:
 * I to V are five somatic chromosomes,
 * X is sex chromosome,
 * ECA is extra-chromosomal array (not technically chromosome, but treated as one)
 */
export const chromosomes: Chromosome[] = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'X',
  'ECA',
];

/**
 * @summary Locations for a gene can be represented as a single number OR as a range between two numbers
 * @param start Start of range
 * @param end End of range. Leave blank if location is not a range
 */
export class MutationLocation {
  private readonly start?: number;
  private readonly end?: number;

  public constructor(
    start: number | bigint | null,
    end?: number | bigint | null
  ) {
    this.start = start !== null ? Number(start) : undefined;
    this.end = end !== null ? Number(end) : undefined;
  }

  isRange = (): boolean => this.end !== undefined;
  getRange = (): [number, number] => [Number(this.start), Number(this.end)];
  getLoc = (): number | undefined => this.start;
}
