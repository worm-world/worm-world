import { Allele, WildAllele, WILD_ALLELE } from 'models/frontend/Allele/Allele';

export interface iAllelePair {
  top: Allele;
  bot?: Allele;
  isECA?: boolean;
}
export class AllelePair {
  public readonly top: Allele;
  public readonly bot: Allele;
  public readonly isECA: boolean;
  constructor({ top, bot = top, isECA = false }: iAllelePair) {
    const topIsWild = top.name === WILD_ALLELE.name;
    const botIsWild = bot.name === WILD_ALLELE.name;

    // assign wild alleles to a real allele (for genetic/chrom locations)
    this.top = topIsWild ? new WildAllele(bot) : top;
    this.bot = botIsWild ? new WildAllele(top) : bot;
    this.isECA = isECA;
  }

  /**
   * Attempt to get distinguishing (non-wild) allele from the pair
   * If both alleles are wild, returns wild allele
   */
  public getAllele = (): Allele => {
    return this.top.name === WILD_ALLELE.name ? this.bot : this.top;
  };

  /**
   * Checks if the other pair's top and bottom match perfectly to this pair's top/bot
   * @param other Other pair to compare against
   */
  public strictEquals = (other: AllelePair): boolean => {
    return this.top.name === other.top.name && this.bot.name === other.bot.name;
  };

  /**
   * Checks if the other pair matches this (as is, or if it were flipped)
   * @param other Other pair to compare against
   */
  public looseEquals = (other: AllelePair): boolean => {
    return (
      this.strictEquals(other) ||
      (this.bot.name === other.top.name && this.top.name === other.bot.name)
    );
  };

  /**
   * Checks if the other pair has the same base allele as this pair
   *
   * "base allele" is the defining allele in a homo / heterozygous pair
   * @param other Other pair to compare against
   */
  public hasSameBaseAllele = (other: AllelePair): boolean => {
    return other.getAllele().name === this.getAllele().name;
  };

  /**
   * Checks if the other pair has the same base genetic location as this pair
   *
   * Note: if either pair has an undefined genetic position it will return false (since we
   * have no way of knowing they have the same location)
   * @param other Other pair to compare against
   */
  public hasSameGenLoc = (other: AllelePair): boolean => {
    const thisPos = this.getAllele().getGenPosition();
    const otherPos = other.getAllele().getGenPosition();

    if (thisPos === undefined || otherPos === undefined) return false;
    else return thisPos === otherPos;
  };

  /**
   * Checks if this pair is only made up of wild alleles
   */
  public isWild = (): boolean => {
    return this.getAllele().name === WILD_ALLELE.name;
  };

  /**
   * Given an allele pair, flips it so the top is now on the bottom and vice versa
   */
  public getFlippedPair = (): AllelePair => {
    return new AllelePair({ top: this.bot, bot: this.top });
  };

  /**
   * Creates a new copy of this allele pair
   */
  public clone = (): AllelePair => {
    return new AllelePair({ top: this.top, bot: this.bot });
  };

  /**
   * Given a list of allele pairs, extract the top/bot chromatid
   * @param chromosome list of allele pairs that all belong to the SAME chromosome
   * @param side state whether you want the top or bottom chromatid
   */
  public static getChromatid = (
    chromosome: AllelePair[],
    side: 'top' | 'bot'
  ): Allele[] => chromosome.map((pair) => pair[side]);

  /**
   * Converts an allele pair to a string representation (for debugging)
   */
  public toString = (): string => {
    return `${this.top.name}/${this.bot.name}`;
  };

  /**
   * Checks if the content of 2 chromatids are equal
   * A "chromatid" is a list of alleles that all belong to the SAME chromosome number
   */
  private static readonly chromatidsMatch = (
    chromatid1: Allele[],
    chromatid2: Allele[]
  ): boolean => {
    let chromatidsMatch = chromatid1.length === chromatid2.length;
    chromatid1.forEach((allele, idx) => {
      if (allele.name !== chromatid2[idx].name) chromatidsMatch = false;
    });
    return chromatidsMatch;
  };

  /**
   * Checks if the content of 2 chromosomes match
   * A "chromosome" is a list of allele pairs that all belong to the SAME chromosome number
   */
  public static chromosomesMatch = (
    chromosome1: AllelePair[],
    chromosome2: AllelePair[]
  ): boolean => {
    if (chromosome1.length !== chromosome2.length) return false;

    const topTid1 = this.getChromatid(chromosome1, 'top');
    const botTid1 = this.getChromatid(chromosome1, 'bot');
    const topTid2 = this.getChromatid(chromosome2, 'top');
    const botTid2 = this.getChromatid(chromosome2, 'bot');

    const topTidsMatch = this.chromatidsMatch(topTid1, topTid2);
    if (topTidsMatch) return this.chromatidsMatch(botTid1, botTid2);

    return (
      this.chromatidsMatch(topTid1, botTid2) &&
      this.chromatidsMatch(botTid1, topTid2)
    );
  };
}
