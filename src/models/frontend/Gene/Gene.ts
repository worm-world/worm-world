import { db_Gene } from 'models/db/db_Gene';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import GeneticLocation from 'models/frontend/GeneticLocation';

interface iGene {
  sysName: string;
  descName?: string;
  chromosome?: Chromosome;
  physLoc?: GeneticLocation; // Physical location of the gene on a chromosome
  geneticLoc?: GeneticLocation; // Gene's genetic distance from the middle of a chromosome
  recombination?: GeneticLocation;
}

export class Gene {
  sysName: string = '';
  descName?: string;
  chromosome?: Chromosome;
  physLoc?: GeneticLocation;
  geneticLoc?: GeneticLocation;
  recombination?: GeneticLocation;

  constructor(fields: iGene) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Gene): Gene {
    return new Gene({
      sysName: record.sysName,
      descName: record.descName ?? undefined,
      physLoc: new GeneticLocation(record.physLoc),
      geneticLoc: new GeneticLocation(record.geneticLoc),
      chromosome: record.chromosome ?? undefined,
      recombination: GeneticLocation.createFromTuple(record.recombSuppressor),
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
      recombSuppressor: this.recombination?.getBigRange() ?? null,
    };
  };
}
