import { instanceToPlain, plainToInstance, Type } from 'class-transformer';
import { Allele } from 'models/frontend/Allele/Allele';

export interface IAllelePair {
  top: Allele;
  bot: Allele;
  isEca?: boolean;
}

export class AllelePair implements IAllelePair {
  @Type(() => Allele)
  public top: Allele;

  @Type(() => Allele)
  public bot: Allele;

  public isEca: boolean;

  constructor(args: IAllelePair) {
    if (args === undefined) {
      // Temporary case during deserialization
      this.top = undefined as any;
      this.bot = undefined as any;
      this.isEca = false;
    } else {
      this.top = args.top;
      this.bot = args.bot;
      this.isEca = args.isEca ?? false;
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

  /**
   * Given an allele pair, flips it so the top is now on the bottom and vice versa
   */
  public getFlippedPair(): AllelePair {
    const newPair = this.clone();
    newPair.flip();
    return newPair;
  }

  /**
   * Flips this pair's top and bottom alleles
   */
  public flip(): void {
    const temp = this.top;
    this.top = this.bot;
    this.bot = temp;
  }

  /**
   * Creates a new copy of this allele pair
   */
  public clone(): AllelePair {
    return new AllelePair({ top: this.top, bot: this.bot, isEca: this.isEca });
  }

  public static getTopChrom(chromosome: AllelePair[]): Allele[] {
    return chromosome.map((pair) => pair.top);
  }

  public static getBotChrom(chromosome: AllelePair[]): Allele[] {
    return chromosome.map((pair) => pair.bot);
  }

  /**
   * Converts an allele pair to a string representation (for debugging)
   */
  public toString(): string {
    return `${this.top.name}/${this.bot.name}`;
  }

  // Ignore explicitly represented wilds since they do not determine genetic identity
  private static chromsEqual(chrom1: Allele[], chrom2: Allele[]): boolean {
    const chrom1NoWilds = chrom1.filter((allele) => !allele.isWild());
    const chrom2NoWilds = chrom2.filter((allele) => !allele.isWild());

    return (
      chrom1NoWilds.length === chrom2NoWilds.length &&
      chrom1NoWilds.every((allele, idx) => allele.equals(chrom2NoWilds[idx]))
    );
  }

  /**
   * Checks if the content of 2 chromosomes match
   * A "chromosome" is a list of allele pairs that all belong to the SAME chromosome number
   */
  public static chromosomesMatch(
    chromosome1: AllelePair[],
    chromosome2: AllelePair[]
  ): boolean {
    const chromosome1Copy = chromosome1.map((allelePair) => allelePair.clone());
    const chromosome2Copy = chromosome2.map((allelePair) => allelePair.clone());

    // Allele pair order doesn't matter for ECA alleles
    // So look at canonical form for comparison. It is assumed that ECA alleles are top-heterozygous
    [chromosome1Copy, chromosome2Copy].forEach((chromosome) => {
      if (chromosome.length > 0 && chromosome[0].isEca)
        chromosome.sort((a, b) => a.top.name.localeCompare(b.top.name));
    });

    if (chromosome1Copy.length !== chromosome2Copy.length) return false;

    const topChrom1 = AllelePair.getTopChrom(chromosome1Copy);
    const botChrom1 = AllelePair.getBotChrom(chromosome1Copy);
    const topChrom2 = AllelePair.getTopChrom(chromosome2Copy);
    const botChrom2 = AllelePair.getBotChrom(chromosome2Copy);

    const topChromsMatch = AllelePair.chromsEqual(topChrom1, topChrom2);
    if (topChromsMatch) return AllelePair.chromsEqual(botChrom1, botChrom2);

    return (
      AllelePair.chromsEqual(topChrom1, botChrom2) &&
      AllelePair.chromsEqual(botChrom1, topChrom2)
    );
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): AllelePair {
    return [plainToInstance(AllelePair, JSON.parse(json))].flat()[0];
  }
}
