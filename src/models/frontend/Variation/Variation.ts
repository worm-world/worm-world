import { Exclude, instanceToPlain, plainToInstance } from 'class-transformer';
import { type db_Variation } from 'models/db/db_Variation';
import { type ChromosomeName } from 'models/db/filter/db_ChromosomeName';

interface iVariation {
  name: string;
  chromosome?: ChromosomeName;
  physLoc?: number; // Physical location of the gene on a chromosome
  geneticLoc?: number; // Gene's genetic distance from the middle of a chromosome
  recombination?: [number, number];
}

export class Variation {
  name: string = ''; // Will be, by convention, same as allele name
  chromosome?: ChromosomeName;
  physLoc?: number; // Physical location of the gene on a chromosome
  geneticLoc?: number; // Gene's genetic distance from the middle of a chromosome
  recombination?: [number, number];

  constructor(fields: iVariation) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Variation): Variation {
    return new Variation({
      name: record.alleleName,
      physLoc: record.physLoc ?? undefined,
      geneticLoc: record.geneticLoc ?? undefined,
      chromosome: record.chromosome ?? undefined,
      recombination: record.recombSuppressor ?? undefined,
    });
  }

  @Exclude()
  public generateRecord(): db_Variation {
    return {
      alleleName: this.name,
      physLoc: this.physLoc ?? null,
      geneticLoc: this.geneticLoc ?? null,
      chromosome: this.chromosome ?? null,
      recombSuppressor: this.recombination ?? null,
    };
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Variation {
    return plainToInstance(
      Variation,
      JSON.parse(json) as Record<string, unknown>
    );
  }
}
