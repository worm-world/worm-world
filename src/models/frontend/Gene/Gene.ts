import { db_Gene } from 'models/db/db_Gene';
import Mutation, { MutationLocation } from 'models/frontend/Mutation';

export class Gene implements Mutation {
  name: string = '';
  chromosome?: string;
  physLoc?: MutationLocation;
  geneticLoc?: MutationLocation;
  ploidy: number = 2;

  constructor(fields: Mutation) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Gene): Gene {
    return new Gene({
      name: record.name,
      physLoc: new MutationLocation(record.physLoc),
      geneticLoc: new MutationLocation(record.geneticLoc),
      chromosome: record.chromosome ?? 'undefined',
      ploidy: 2,
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
