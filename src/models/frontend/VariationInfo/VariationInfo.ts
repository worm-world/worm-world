import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import GeneticLocation from 'models/frontend/GeneticLocation';

interface iVariation {
  name: string;
  chromosome?: Chromosome;
  physLoc?: GeneticLocation; // Physical location of the gene on a chromosome
  geneticLoc?: GeneticLocation; // Genetic distance from the middle of a chromosome
}

export class VariationInfo {
  name: string = ''; // Will be, by convention, same as allele name
  chromosome?: Chromosome;
  physLoc?: GeneticLocation;
  geneticLoc?: GeneticLocation;

  constructor(fields: iVariation) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_VariationInfo): VariationInfo {
    return new VariationInfo({
      name: record.alleleName,
      physLoc: new GeneticLocation(record.physLoc),
      geneticLoc: new GeneticLocation(record.geneticLoc),
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
