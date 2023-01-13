import { db_Gene } from 'models/db/db_Gene';
import Mutation, { MutationLocation } from 'models/frontend/Mutation';

interface iGene extends Mutation {
  sysName: string;
  descName?: string;
}

export class Gene implements Mutation {
  sysName: string = '';
  descName?: string;
  chromosome?: string;
  physLoc?: MutationLocation;
  geneticLoc?: MutationLocation;
  ploidy: number = 2;

  constructor(fields: iGene) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Gene): Gene {
    return new Gene({
      sysName: record.sysName,
      descName: record.descName ?? undefined,
      physLoc: new MutationLocation(record.physLoc),
      geneticLoc: new MutationLocation(record.geneticLoc),
      chromosome: record.chromosome ?? undefined,
      ploidy: 2,
    });
  }

  generateRecord = (): db_Gene => {
    const phys = this.physLoc?.getLoc();
    return {
      sysName: this.sysName,
      descName: this.descName ?? null,
      physLoc: phys !== undefined ? BigInt(phys) : null,
      geneticLoc: this.geneticLoc?.getLoc() ?? null,
      chromosome: this.chromosome ?? null,
    };
  };
}
