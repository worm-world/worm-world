import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { Allele, WildAllele } from 'models/frontend/Allele/Allele';
import { AllelePair } from 'models/frontend/Strain/AllelePair';

export interface StrainOption {
  strain: Strain;
  prob: number;
}

interface ChromatidOption {
  alleles: Allele[];
  prob: number;
}

interface ChromosomeOption {
  pairs: AllelePair[];
  prob: number;
}

interface iStrain {
  name?: string;
  allelePairs: AllelePair[];
  notes?: string;
}
export class Strain {
  /* #region initializers */
  public chromPairMap: Map<Chromosome | undefined, AllelePair[]>;
  public name?: string;
  public notes?: string;

  constructor(props: iStrain) {
    this.name = props.name;
    this.notes = props.notes;
    this.chromPairMap = new Map<Chromosome | undefined, AllelePair[]>();
    this.addPairsToStrain(props.allelePairs);
  }
  /* #endregion initializers */

  /* #region public methods */
  /**
   * Checks if both strains contain the same chromosomal information
   * @param other strain to compare against
   */
  public equals = (other: Strain): boolean => {
    const thisKeys = Array.from(this.chromPairMap.keys());
    const otherKeys = Array.from(other.chromPairMap.keys());
    if (thisKeys.length !== otherKeys.length) return false;

    let allPairsMatch = true;
    thisKeys.forEach((key) => {
      if (!other.chromPairMap.has(key)) allPairsMatch = false;

      const chromPairs = this.chromPairMap.get(key) ?? [];
      const otherChromPairs = other.chromPairMap.get(key) ?? [];
      if (!AllelePair.chromosomesMatch(chromPairs, otherChromPairs))
        allPairsMatch = false;
    });
    return allPairsMatch;
  };

  /**
   * Mostly for debugging, string representation of strain
   */
  public toString = (): string => {
    let res = '';
    Array.from(this.chromPairMap.keys()).forEach((key) => {
      res += (key?.toString() ?? '?') + ': ';
      res +=
        this.chromPairMap
          .get(key)
          ?.map((pair) => `${pair.top.name}/${pair.bot.name}`)
          .join(' ') ?? '';
      res += '\n';
    });
    return res;
  };

  /**
   * Returns a new strain with identical data to this
   */
  public clone = (): Strain => {
    const allelePairs: AllelePair[] = [];
    this.chromPairMap.forEach((pairs) =>
      pairs.forEach((pair) => allelePairs.push(pair.clone()))
    );
    return new Strain({
      name: this.name,
      notes: this.notes,
      allelePairs,
    });
  };

  /**
   * Crosses this strain with itself
   * @returns Permuted list of all possible strains and their respective probabilities
   */
  public selfCross = (): StrainOption[] => {
    return this.crossWith(this.clone());
  };

  /**
   * Crosses this strain with {other}
   * @param other strain to cross against
   * @returns Permuted list of all possible strains and their respective probabilities
   */
  public crossWith = (other: Strain): StrainOption[] => {
    const lStrain = this.clone();
    const rStrain = other.clone();

    lStrain.prepWithWilds(rStrain);
    rStrain.prepWithWilds(this);

    const multiChromOptions: ChromosomeOption[][] = [];

    // get chromosomal allele probabilities
    lStrain.chromPairMap.forEach((pairs, chromosome) => {
      const chromChainList = this.crossChromosome(
        pairs,
        rStrain.chromPairMap.get(chromosome) ?? []
      );
      multiChromOptions.push(chromChainList);
    });

    // permute strains for each chromosome
    const strains = this.cartesianCross(multiChromOptions);
    this.reduceStrainOptions(strains);
    return strains;
  };
  /* #endregion public methods */

  /* #region private methods */
  /**
   * Permutes all possible strain combinations due to each chromosome
   * @param multiChromOptions Outer list represents a unique Chromosomes, inner list is the possible PairChains for that chromosome
   * @returns Complete permuted strains from all the different chromosomes
   */
  private readonly cartesianCross = (
    multiChromOptions: ChromosomeOption[][]
  ): StrainOption[] => {
    if (multiChromOptions.length === 0) return [];

    // Set strains initially with 1st available chromosome (and its allele options)
    let strainOptions = multiChromOptions[0].map((chromOption) => {
      const allelePairs = chromOption.pairs;
      const strain = new Strain({ allelePairs });
      return {
        strain,
        prob: chromOption.prob,
      };
    });

    // Build out the strain permutations for each successive chromosome
    for (let i = 1; i < multiChromOptions.length; i++)
      strainOptions = this.cartesianProduct(
        strainOptions,
        multiChromOptions[i]
      );

    return strainOptions;
  };

  /**
   * Permutes new strains based on current permutation {strainOptions} and the provided {chromOptions}
   *
   * Should ONLY be used by cartesianCross
   * @param strainOptions base list to permute against
   * @param chromOptions
   * @returns new strain list containing the added permutations from {chromOptions}
   */
  private readonly cartesianProduct = (
    strainOptions: StrainOption[],
    chromOptions: ChromosomeOption[]
  ): StrainOption[] => {
    const newStrainOptions = new Array<StrainOption>();

    strainOptions.forEach((strainOption) => {
      chromOptions.forEach((chromOption) => {
        const strain = strainOption.strain.clone();
        strain.addPairsToStrain(chromOption.pairs);
        const prob = strainOption.prob * chromOption.prob;
        newStrainOptions.push({ strain, prob });
      });
    });

    return strainOptions;
  };

  /**
   * Populates {this} with any missing alleles from other (represented as wild strains)
   * @param other Strain to compare against and look for any missing alleles
   */
  private readonly prepWithWilds = (
    other: Strain,
    defaultToLeftSide = true
  ): void => {
    other.chromPairMap.forEach((otherChromPairs, chromosome) => {
      const chromosomePairs = this.chromPairMap.get(chromosome) ?? [];

      // Add chromosome to strain, if missing
      if (!this.chromPairMap.has(chromosome))
        this.chromPairMap.set(chromosome, chromosomePairs);

      otherChromPairs.forEach((otherPair) => {
        const alreadyHasAllele: boolean =
          chromosomePairs.findIndex((pair) =>
            pair.hasSameBaseAllele(otherPair)
          ) >= 0;

        // Add wild pair to pairList to match other strain
        if (!alreadyHasAllele)
          this.insertWildPair(chromosomePairs, otherPair, defaultToLeftSide);
      });
    });
  };

  /**
   * Inserts a wild pair into {chromosomePairs} based on the genetic location of {otherPair}
   * @param chromosomePairs Current strain pairs to insert wild pair into
   * @param otherPair Pair from other strain that will be represented as wild pair
   * @param defaultLeft If genetic location can't be determined, place wild on left side (or right side)
   */
  private readonly insertWildPair = (
    chromosomePairs: AllelePair[],
    otherPair: AllelePair,
    defaultLeft: boolean
  ): void => {
    const wildPair = new AllelePair({
      top: new WildAllele(otherPair.getAllele()),
      bot: new WildAllele(otherPair.getAllele()),
    });

    chromosomePairs.push(wildPair);
    chromosomePairs.sort((pair1, pair2) => {
      const p1 = pair1.getAllele().getGenPosition() ?? (defaultLeft ? -50 : 50);
      const p2 = pair2.getAllele().getGenPosition() ?? (defaultLeft ? -50 : 50);
      return p1 < p2 ? -1 : 1;
    });
  };

  /**
   * Computes all possible permutations when crossing a chromosome between 2 strains
   */
  private readonly crossChromosome = (
    leftChrom: AllelePair[],
    rightChrom: AllelePair[]
  ): ChromosomeOption[] => {
    const chromosomeOptions: ChromosomeOption[] = [];
    const leftOptions = this.getRecombOptions(leftChrom);
    const rightOptions = this.getRecombOptions(rightChrom);

    // Permute all possible chromatid combinations
    leftOptions.forEach((left) => {
      rightOptions.forEach((right) => {
        chromosomeOptions.push({
          pairs: this.combineChromatids(left.alleles, right.alleles),
          prob: left.prob * right.prob,
        });
      });
    });
    return chromosomeOptions;
  };

  /**
   * Permutes all of the possible chromatids due to a recombination event (or no recombination event)
   * @param chromosome All allele pairs belonging to a strain's chromosomes
   */
  private readonly getRecombOptions = (
    chromosome: AllelePair[]
  ): ChromatidOption[] => {
    const topAlleles = new Array<Allele>();
    const botAlleles = new Array<Allele>();

    // Load arrays sorted by genPosition
    chromosome.forEach((pair) => {
      topAlleles.push(pair.top);
      botAlleles.push(pair.bot);
    });

    // Permute possible recombinations starting on both top and bottom
    const topRecombOptions = this.permuteRecombOptions(
      topAlleles,
      botAlleles,
      chromosome
    );

    const botRecombOptions = this.permuteRecombOptions(
      botAlleles,
      topAlleles,
      chromosome
    );

    const totalRecombOptions = topRecombOptions.concat(botRecombOptions);
    this.reduceChromatidOptions(totalRecombOptions);

    return totalRecombOptions;
  };

  /**
   * Combines probabilities of duplicate chromatids such that the resulting list has unique chromatids
   */
  private readonly reduceChromatidOptions = (
    chromatids: ChromatidOption[]
  ): void => {
    // Check each option against every other option
    for (let i = 0; i < chromatids.length; i++) {
      const currChromatid = chromatids[i];

      // Check for duplicates and combine probabilities
      for (let j = i + 1; j < chromatids.length; j++) {
        const nextChromatid = chromatids[j];
        const duplicateChainOption: boolean =
          this.getChainString(currChromatid) ===
          this.getChainString(nextChromatid);

        if (duplicateChainOption) {
          currChromatid.prob += nextChromatid.prob;
          chromatids.splice(j, 1);
        }
      }
    }
  };

  /**
   * Combines probabilities of duplicate StrainOptions such that the resulting list has unique strains
   */
  private readonly reduceStrainOptions = (strains: StrainOption[]): void => {
    // Check each strain against every other strain
    for (let i = 0; i < strains.length; i++) {
      const currStrain = strains[i];

      // Check for duplicates and combine probabilities
      for (let j = i + 1; j < strains.length; j++) {
        const nextStrain = strains[j];
        const duplicate = currStrain.strain.equals(nextStrain.strain);

        if (duplicate) {
          currStrain.prob += nextStrain.prob;
          strains.splice(j, 1);
        }
      }
    }
  };

  /**
   * Computes the possible combinations (for a single chromosome) that can result due to genetic recombination
   * @param startingChromatid Alleles used before a recombination event
   * @param flippedChromatid Alleles used after a recombination event
   * @param chromosome List of allele pairs that represent the combined starting/flipped sides
   * @returns list of allele chains and their respective probabilities
   */
  private permuteRecombOptions(
    startingChromatid: Allele[],
    flippedChromatid: Allele[],
    chromosome: AllelePair[]
  ): ChromatidOption[] {
    const chromatids: ChromatidOption[] = [];

    // first iteration accounts for NO recombination at all
    for (let i = 0; i < chromosome.length; i++) {
      let chromatid: Allele[] = [];
      let probability = 0.5;
      chromatid.push(startingChromatid[0]);

      for (let j = 1; j < chromosome.length; j++) {
        const recombinationProb = this.getRecombProb(
          chromosome[j - 1],
          chromosome[j]
        );

        // recombination event
        if (j === i) {
          chromatid = chromatid.concat(flippedChromatid.slice(j)); // add remainder of alleles of other chromatid
          probability = recombinationProb;
          break;
        }

        // no recombination, continue along starting side
        probability -= recombinationProb;
        chromatid.push(startingChromatid[j]);
      }
      chromatids.push({ alleles: chromatid, prob: probability });
    }

    return chromatids;
  }

  /**
   * @returns absolute value of the genetic difference of 2 allele pairs (or 0 if a pair doesn't have a genetic location)
   */
  private readonly getRecombProb = (
    pair1: AllelePair,
    pair2: AllelePair
  ): number => {
    const genPos1 = pair1.getAllele().getGenPosition();
    const genPos2 = pair2.getAllele().getGenPosition();
    if (genPos1 === undefined || genPos2 === undefined) return 0;

    const halfDistance = Math.abs(genPos1 - genPos2) / 2;
    return halfDistance / 100; // convert to decimal form
  };

  /**
   * Combine 2 chromatids into a single chromosome of allele pairs
   * @param top list of alleles that will be the top chromatid
   * @param bot list of alleles that will be the bottom chromatid
   */
  private readonly combineChromatids = (
    top: Allele[],
    bot: Allele[]
  ): AllelePair[] => {
    const chromosome: AllelePair[] = [];
    for (let i = 0; i < top.length && i < bot.length; i++)
      chromosome.push(new AllelePair({ top: top[i], bot: bot[i] }));
    return chromosome;
  };

  /**
   * Adds a provided Allele Pair to this strain
   */
  private readonly addPairToStrain = (pairToAdd: AllelePair): void => {
    const chromName = pairToAdd.getAllele().getChromosome();
    let chromosome = this.chromPairMap.get(chromName);
    if (chromosome === undefined) {
      chromosome = [];
      this.chromPairMap.set(chromName, chromosome);
    }

    // insert according to genetic location
    chromosome.push(pairToAdd);
    chromosome.sort((pair1, pair2) => {
      const pair1Pos = pair1.getAllele().getGenPosition() ?? 50; // gen pos never greater than 25
      const pair2Pos = pair2.getAllele().getGenPosition() ?? 50; // gen pos never greater than 25
      return pair1Pos < pair2Pos ? -1 : 1;
    });
  };

  /**
   * Adds a list of AllelePairs to this strain
   */
  private readonly addPairsToStrain = (pairs: AllelePair[]): void => {
    pairs.forEach((pair) => this.addPairToStrain(pair));
  };

  /**
   * Converts an AlleleChainOption into a string of allele names (to be used for equality checks)
   */
  private readonly getChainString = (chainOption: ChromatidOption): string =>
    chainOption.alleles.map((allele) => allele.name).join('');

  /* #endregion private methods */
}
