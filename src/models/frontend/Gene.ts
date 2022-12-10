import { db_Gene } from 'models/db/db_Gene';

/**
 * @summary Locations for a gene can be represented as a single number OR as a range between two numbers
 * @param start Start of range
 * @param end End of range. Leave blank if location is not a range
 */
export class GeneLocation {
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

// I to V are five somatic chromosomes, X is sex chromosome, and ECA is extra-chromosomal array 
export const chromosomeOptions = ['I', 'II', 'III', 'IV', 'V', 'VI', 'X', 'ECA']; 

interface IGene {
  name: string;
  chromosome?: string;
  /** Physical location of the gene on a chromosome */
  physLoc?: GeneLocation;
  /** Gene's genetic distance from the middle of a chromosome */
  geneticLoc?: GeneLocation;
}

export class Gene {
  name: string = '';
  chromosome?: string;
  /** Physical location of the gene on a chromosome */
  physLoc?: GeneLocation;
  /** Gene's genetic distance from the middle of a chromosome */
  geneticLoc?: GeneLocation;

  constructor(fields: IGene) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Gene): Gene {
    return new Gene({
      name: record.name,
      physLoc: new GeneLocation(record.physLoc),
      geneticLoc: new GeneLocation(record.geneticLoc),
      chromosome: record.chromosome ?? undefined,
    });
  }

  generateRecord = (): db_Gene => {
    const phys = this.physLoc?.getLoc();
    return {
      name: this.name,
      physLoc: phys !== undefined ? BigInt(phys) : null,
      geneticLoc: this.geneticLoc?.getLoc() ?? null,
      chromosome: this.chromosome ?? null,
    };
  };
}
