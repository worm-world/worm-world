import { instanceToPlain, plainToInstance, Type } from 'class-transformer';
import { type ChromosomeName } from 'models/db/filter/db_ChromosomeName';
import { Allele } from 'models/frontend/Allele/Allele';

export interface IAllelePair {
  top: Allele;
  bot: Allele;
}

export class AllelePair implements IAllelePair {
  @Type(() => Allele)
  public top: Allele;

  @Type(() => Allele)
  public bot: Allele;

  constructor(args: IAllelePair) {
    if (args === undefined) {
      // Temporary case during deserialization
      this.top = undefined as any;
      this.bot = undefined as any;
    } else {
      this.top = args.top;
      this.bot = args.bot;
    }
  }

  /**
   * Checks if the other pair's top and bottom match perfectly to this pair's top/bot
   * @param other Other pair to compare against
   */
  public strictEquals(other: AllelePair): boolean {
    return this.top.equals(other.top) && this.bot.equals(other.bot);
  }

  /**
   * Checks if the other pair matches this (as is, or if it were flipped)
   * @param other Other pair to compare against
   */
  public looseEquals(other: AllelePair): boolean {
    return (
      this.strictEquals(other) ||
      (this.bot.equals(other.top) && this.top.equals(other.bot))
    );
  }

  public static sortByPos(allelePairs: AllelePair[]): void {
    allelePairs.sort((pair1, pair2) => {
      const pair1Pos = pair1.top.getGenPosition() ?? 50; // gen pos never greater than 25
      const pair2Pos = pair2.top.getGenPosition() ?? 50; // gen pos never greater than 25
      return pair1Pos < pair2Pos ? -1 : 1;
    });
  }

  /** Checks if two allele pairs are on the same "variation" or the same gene. */
  public isOfSameGeneOrVariation(other: AllelePair): boolean {
    const thisAllele = this.top;
    const otherAllele = other.top;
    if (thisAllele.gene !== undefined && otherAllele.gene !== undefined) {
      return thisAllele.gene.sysName === otherAllele.gene.sysName;
    } else if (
      thisAllele.variation !== undefined &&
      otherAllele.variation !== undefined
    ) {
      return thisAllele.variation.name === otherAllele.variation.name;
    } else return false;
  }

  /**
   * Checks if the other pair has the same base genetic location as this pair
   *
   * Note: if either pair has an undefined genetic position it will return false (since we
   * have no way of knowing they have the same location)
   * @param other Other pair to compare against
   */
  public hasSameGenLoc(other: AllelePair): boolean {
    const thisPos = this.top.getGenPosition();
    const otherPos = other.bot.getGenPosition();

    if (thisPos === undefined || otherPos === undefined) return false;
    else return thisPos === otherPos;
  }

  public getChromName(): ChromosomeName | undefined {
    return this.top.getChromName();
  }

  /**
   * Checks if this pair is only made up of wild alleles
   */
  public isWild(): boolean {
    return this.top.isWild() && this.bot.isWild();
  }

  /** Returns true if pair is homozygous (false for heterozygous) */
  public isHomo(): boolean {
    return this.top.name === this.bot.name;
  }

  public isEca(): boolean {
    return this.top.getChromName() === 'Ex';
  }

  /**
   * Returns a flipped pair
   */
  public flip(): AllelePair {
    const newPair = this.clone();
    const temp = this.top;
    newPair.top = this.bot;
    newPair.bot = temp;
    return newPair;
  }

  /**
   * Creates a new copy of this allele pair
   */
  public clone(): AllelePair {
    return new AllelePair({ top: this.top, bot: this.bot });
  }

  /**
   * Converts an allele pair to a string representation (for debugging)
   */
  public toString(): string {
    return `${this.top.name}/${this.bot.name}`;
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): AllelePair {
    return plainToInstance(
      AllelePair,
      JSON.parse(json) as Record<string, unknown>
    );
  }
}
