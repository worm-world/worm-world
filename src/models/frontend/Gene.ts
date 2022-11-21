/**
 * @summary Locations for a gene can be represented as a single number OR as a range between two numbers
 * @param start Start of range
 * @param end End of range. Leave blank if location is not a range
 */
export class Location {
  private readonly start: Number;
  private readonly end: Number | undefined;

  constructor(start: Number, end: Number | undefined) {
    this.start = start;
    this.end = end;
  }

  isRange = (): boolean => this.end !== undefined;
  getRange = (): [Number, Number] => [this.start, Number(this.end)];
  getLoc = (): Number => this.start;
}

export interface Gene {
  name: String;
  chromosome?: String;
  /** Physical location of the gene on a chromosome */
  physLoc: Location;
  /** Gene's genetic distance from the middle of a chromosome */
  geneticLoc: Location;
}

export interface VariationInfo {
  name: String;
  chromosome?: String;
  /** Physical location of the gene on a chromosome */
  physLoc?: Location;
  /** Gene's genetic distance from the middle of a chromosome */
  geneticLoc?: Location;
}
