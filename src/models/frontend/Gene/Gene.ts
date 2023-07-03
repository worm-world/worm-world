import { Exclude, instanceToPlain, plainToInstance } from 'class-transformer';
import { type db_Gene } from 'models/db/db_Gene';
import { type ChromosomeName } from 'models/db/filter/db_ChromosomeName';

interface iGene {
  sysName: string;
  descName?: string;
  chromosome?: ChromosomeName;
  physLoc?: number; // Physical location of the gene on a chromosome
  geneticLoc?: number; // Gene's genetic distance from the middle of a chromosome
  recombination?: [number, number];
}

export class Gene {
  sysName: string = '';
  descName?: string;
  chromosome?: ChromosomeName;
  physLoc?: number;

  geneticLoc?: number;
  recombination?: [number, number];

  constructor(fields: iGene) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Gene): Gene {
    return new Gene({
      sysName: record.sysName,
      descName: record.descName ?? undefined,
      physLoc: record.physLoc ?? undefined,
      geneticLoc: record.geneticLoc ?? undefined,
      chromosome: record.chromosome ?? undefined,
      recombination: record.recombSuppressor ?? undefined,
    });
  }

  @Exclude()
  generateRecord(): db_Gene {
    return {
      sysName: this.sysName,
      descName: this.descName ?? null,
      physLoc: this.physLoc ?? null,
      geneticLoc: this.geneticLoc ?? null,
      chromosome: this.chromosome ?? null,
      recombSuppressor: this.recombination ?? null,
    };
  }

  public equals(gene: Gene): boolean {
    return this.sysName === gene.sysName;
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Gene {
    return plainToInstance(Gene, JSON.parse(json) as Record<string, unknown>);
  }
}
