/**
 * @summary Locations for a gene can be represented as a single number OR as a range between two numbers
 * @param start Start of range
 * @param end End of range. Leave blank if location is not a range
 */
export default class GeneticLocation {
  private readonly start?: number;
  private readonly end?: number;

  public constructor(
    start: number | bigint | null,
    end?: number | bigint | null
  ) {
    this.start = start !== null ? Number(start) : undefined;
    this.end = end !== null ? Number(end) : undefined;
  }

  isRange = (): boolean => this.end !== undefined;
  getRange = (): [number, number] => [Number(this.start), Number(this.end)];
  getBigRange = (): [bigint, bigint] | undefined => {
    if (this.start !== undefined && this.end !== undefined)
      return [BigInt(this.start), BigInt(this.end)];
  };

  getLoc = (): number | undefined => this.start;

  static createFromTuple = (
    recordTup: [bigint, bigint] | null
  ): GeneticLocation | undefined => {
    const [start, end] = [recordTup?.[0], recordTup?.[1]];
    const location =
      start !== undefined && end !== undefined
        ? new GeneticLocation(start, end)
        : undefined;
    return location;
  };
}
