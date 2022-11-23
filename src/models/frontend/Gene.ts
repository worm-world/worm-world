import db_Gene from 'models/db/db_Gene';
import db_VariationInfo from 'models/db/db_VariationInfo';

/**
 * @summary Locations for a gene can be represented as a single number OR as a range between two numbers
 * @param start Start of range
 * @param end End of range. Leave blank if location is not a range
 */
export class Location {
  private readonly start: Number;
  private readonly end?: Number;

  public constructor(start: Number, end?: Number) {
    this.start = start;
    this.end = end;
  }

  isRange = (): boolean => this.end !== undefined;
  getRange = (): [Number, Number] => [this.start, Number(this.end)];
  getLoc = (): Number => this.start;
}

interface IGene {
  name: String;
  chromosome?: String;
  /** Physical location of the gene on a chromosome */
  physLoc: Location;
  /** Gene's genetic distance from the middle of a chromosome */
  geneticLoc: Location;
}
export class Gene {
  name: String = '';
  chromosome?: String;
  /** Physical location of the gene on a chromosome */
  physLoc: Location = new Location(0);
  /** Gene's genetic distance from the middle of a chromosome */
  geneticLoc: Location = new Location(0);

  constructor(fields: IGene) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_Gene): Gene {
    return new Gene({
      name: record.name,
      physLoc: new Location(record.physLoc),
      geneticLoc: new Location(record.geneticLoc),
      chromosome: record.chromosome,
    });
  }

  generateRecord = (): db_Gene => {
    return {
      name: this.name,
      physLoc: this.physLoc.getLoc(),
      geneticLoc: this.geneticLoc.getLoc(),
      chromosome: this.chromosome,
    };
  };
}

interface IVariationInfo {
  alleleName: String;
  physLoc?: Location;
  geneticLoc?: Location;
  chromosome?: String;
}

export class VariationInfo {
  alleleName: String = '';
  /** Physical location of the variation on a chromosome */
  physLoc?: Location;
  /** Variation's genetic distance from the middle of a chromosome */
  geneticLoc?: Location;
  chromosome?: String;

  constructor(fields: IVariationInfo) {
    Object.assign(this, fields);
  }

  static createFromRecord(record: db_VariationInfo): VariationInfo {
    return new VariationInfo({
      alleleName: record.alleleName,
      physLoc:
        record.physLoc != null ? new Location(record.physLoc) : undefined,
      geneticLoc:
        record.geneticLoc != null ? new Location(record.geneticLoc) : undefined,
      chromosome: record.chromosome,
    });
  }

  generateRecord = (): db_VariationInfo => {
    return {
      alleleName: this.alleleName,
      physLoc: this.physLoc?.getLoc(),
      geneticLoc: this.geneticLoc?.getLoc(),
      chromosome: this.chromosome,
    };
  };
}
