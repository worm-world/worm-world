/**
 * A mutation is the (common) state of a Gene or VariationInfo
 */
export default class Mutation {
  name: string = '';
  chromosome?: string;
  physLoc?: MutationLocation; // Physical location of the gene on a chromosome
  geneticLoc?: MutationLocation; // Variation's genetic distance from the middle of a chromosome
  ploidy: number = 2; // C. Elegans are diploid => 2 copies of all genes; variations can be solo (but needn't be?)
}

export type Chromosome = string;
export const UNKNOWN_CHROM = '?';

/**
 * Specific to C. Elegans:
 * I to V are five somatic chromosomes,
 * X is sex chromosome,
 * ECA is extra-chromosomal array,
 * ? is unknown
 */
export const chromosomes = ['I', 'II', 'III', 'IV', 'V', 'X', 'ECA'];

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
