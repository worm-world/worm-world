import { db_VariationInfo } from 'models/db/db_VariationInfo';
import Mutation, { MutationLocation } from 'models/frontend/Mutation';

export class VariationInfo implements Mutation {
  name: string = ''; // Will be, by convention, same as allele name
  chromosome?: string;
  physLoc?: MutationLocation;
  geneticLoc?: MutationLocation;
  ploidy: number = 1;

  constructor(fields: Mutation) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_VariationInfo): VariationInfo {
    return new VariationInfo({
      name: record.alleleName,
      physLoc: new MutationLocation(record.physLoc),
      geneticLoc: new MutationLocation(record.geneticLoc),
      chromosome: record.chromosome ?? undefined,
      ploidy: 1,
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
