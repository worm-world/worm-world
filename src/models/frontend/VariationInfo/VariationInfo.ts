import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';

interface iVariationInfo {
  name: string;
  chromosome?: Chromosome;
  physLoc?: number; // Physical location of the gene on a chromosome
  geneticLoc?: number; // Gene's genetic distance from the middle of a chromosome
  recombination?: [number, number];
}

export class VariationInfo {
  name: string = ''; // Will be, by convention, same as allele name
  chromosome?: Chromosome;
  physLoc?: number; // Physical location of the gene on a chromosome
  geneticLoc?: number; // Gene's genetic distance from the middle of a chromosome
  recombination?: [number, number];

  constructor(fields: iVariationInfo) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_VariationInfo): VariationInfo {
    return new VariationInfo({
      name: record.alleleName,
      physLoc: record.physLoc ?? undefined,
      geneticLoc: record.geneticLoc ?? undefined,
      chromosome: record.chromosome ?? undefined,
      recombination: record.recombSuppressor ?? undefined,
    });
  }

  generateRecord(): db_VariationInfo {
    return {
      alleleName: this.name,
      physLoc: this.physLoc ?? null,
      geneticLoc: this.geneticLoc ?? null,
      chromosome: this.chromosome ?? null,
      recombSuppressor: this.recombination ?? null,
    };
  }
}
