import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { GeneLocation } from 'models/frontend/Gene';

interface IVariationInfo {
  name: string;
  physLoc?: GeneLocation;
  geneticLoc?: GeneLocation;
  chromosome?: string;
}

export class VariationInfo {
  name: string = ''; // Same as allele name (but 'name' allows type intersection with Gene)
  /** Physical location of the variation on a chromosome */
  physLoc?: GeneLocation;
  /** Variation's genetic distance from the middle of a chromosome */
  geneticLoc?: GeneLocation;
  chromosome?: string;

  constructor(fields: IVariationInfo) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_VariationInfo): VariationInfo {
    return new VariationInfo({
      name: record.alleleName,
      physLoc: new GeneLocation(record.physLoc),
      geneticLoc: new GeneLocation(record.geneticLoc),
      chromosome: record.chromosome ?? undefined,
    });
  }

  generateRecord = (): db_VariationInfo => {
    const phys = this.physLoc?.getLoc();
    return {
      alleleName: this.name,
      physLoc: phys !== undefined ? BigInt(phys) : null,
      geneticLoc: this.geneticLoc?.getLoc() ?? null,
      chromosome: this.chromosome ?? null,
    };
  };
}
