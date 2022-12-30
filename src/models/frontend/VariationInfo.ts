import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { MutationLocation } from 'models/frontend/Mutation';

interface IVariationInfo {
  name: string;
  physLoc?: MutationLocation;
  geneticLoc?: MutationLocation;
  chromosome?: string;
}

export class VariationInfo {
  name: string = ''; // Same as allele name (but 'name' allows type intersection with Gene)
  /** Physical location of the variation on a chromosome */
  physLoc?: MutationLocation;
  /** Variation's genetic distance from the middle of a chromosome */
  geneticLoc?: MutationLocation;
  chromosome?: string;

  constructor(fields: IVariationInfo) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_VariationInfo): VariationInfo {
    return new VariationInfo({
      name: record.alleleName,
      physLoc: new MutationLocation(record.physLoc),
      geneticLoc: new MutationLocation(record.geneticLoc),
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
