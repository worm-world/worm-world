import { Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { Allele, WildAllele } from 'models/frontend/Allele/Allele';

interface StrainOption {
  strain: Strain;
  prob: number;
}

interface AlleleChainOption {
  alleles: Allele[];
  prob: number;
}

interface PairChainOption {
  pairs: AllelePair[];
  prob: number;
}

class AllelePair {
  public top: Allele;
  public bot: Allele;
  constructor(topAllele: Allele, bottomAllele = topAllele) {
    this.top = topAllele;
    this.bot = bottomAllele;
  }

  /**
   * Attempt to get distinguishing (non-wild) allele from the pair
   * If both alleles are wild, returns wild allele
   */
  public getAllele = (): Allele => {
    return this.top.name === new WildAllele().name ? this.bot : this.top;
  };

  public equals = (other: AllelePair): boolean => {
    return (
      (this.top.name === other.top.name && this.bot.name === other.bot.name) ||
      (this.bot.name === other.top.name && this.top.name === other.bot.name)
    );
  };

  public hasSameBaseAllele = (other: AllelePair): boolean => {
    return other.getAllele().name === this.getAllele().name;
  };

  public getFlippedPair = (): AllelePair => {
    return new AllelePair(this.bot, this.top);
  };
}
interface iStrain {
  name?: string;
  allelePairs?: Set<AllelePair>;
  notes?: string;
}
export class Strain {
  /* #region initializers */
  public chromAlleleMap: Map<Chromosome | undefined, AllelePair[]>;
  public name?: string;
  public notes?: string;

  constructor(props: iStrain) {
    this.name = props.name;
    this.notes = props.notes;
    this.chromAlleleMap = new Map<Chromosome | undefined, AllelePair[]>();
    props.allelePairs?.forEach((pair) => this.addPairToStrain(pair));
  }
  /* #endregion initializers */

  /* #region public methods */
  /**
   * Returns a new strain with identical data to this
   */
  public clone = (): Strain => {
    const allelePairs = new Set<AllelePair>();
    this.chromAlleleMap.forEach((pairSet, _) =>
      pairSet.forEach((pair) => allelePairs.add(pair))
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
   * @param other Other strain to cross against
   * @returns Permuted list of all possible strains and their respective probabilities
   */
  public crossWith = (other: Strain): StrainOption[] => {
    const lStrain = this.clone();
    const rStrain = other.clone();

    lStrain.prepWithWilds(rStrain);
    rStrain.prepWithWilds(this);

    const chromOptions: PairChainOption[][] = [];

    // get chromsomomal allele probabilities
    lStrain.chromAlleleMap.forEach((pairs, chromosome) => {
      const chromChainList = this.crossChromosome(
        pairs,
        rStrain.chromAlleleMap.get(chromosome) ?? []
      );
      chromOptions.push(chromChainList);
    });

    // permute strains for each chromosome
    return this.cartesianCross(chromOptions);
  };
  /* #endregion public methods */

  /* #region private methods */
  /**
   * Permutes all possible strain combinations due to each chromosome
   * @param chromOptions Outer list represents a unique Chromosomes, inner list is the possible PairChains for that chromosome
   * @returns Complete permuted strains from all the different chromosomes
   */
  private readonly cartesianCross = (
    chromOptions: PairChainOption[][]
  ): StrainOption[] => {
    if (chromOptions.length === 0) return [];

    // Set strains initially with 1st available chromosome (and its allele options)
    let strainOptions = chromOptions[0].map((chromOption) => {
      const allelePairs = new Set(chromOption.pairs);
      const strain = new Strain({ allelePairs });
      return {
        strain,
        prob: chromOption.prob,
      };
    });

    // Build out the strain permutations for each successive chromosome
    for (let i = 1; i < chromOptions.length; i++)
      strainOptions = this.cartesianProduct(strainOptions, chromOptions[i]);

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
    chromOptions: PairChainOption[]
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
  private readonly prepWithWilds = (other: Strain): void => {
    other.chromAlleleMap.forEach((otherPairs, chromosome) => {
      const currAllelePairs = this.chromAlleleMap.get(chromosome) ?? [];

      // Add chromosome to strain, if missing
      if (!this.chromAlleleMap.has(chromosome))
        this.chromAlleleMap.set(chromosome, currAllelePairs);

      otherPairs.forEach((otherPair) => {
        const alreadyHasAllele: boolean =
          currAllelePairs.findIndex((pair) =>
            pair.hasSameBaseAllele(otherPair)
          ) >= 0;

        // Add wild pair to pairList to match other strain
        if (!alreadyHasAllele) this.insertWildPair(currAllelePairs, otherPair);
      });
    });
  };

  /**
   * Inserts a wild pair into {currPairs} based on the genetic location of {otherPair}
   * @param currPairs Current strain pairs to insert wild pair into
   * @param otherPair Pair from other strain that will be represented as wild pair
   */
  private readonly insertWildPair = (
    currPairs: AllelePair[],
    otherPair: AllelePair
  ): void => {
    const otherGenLoc = otherPair.getAllele().getGenPosition() ?? 100; // gen pos never greater than 25
    const wildPair = new AllelePair(
      new WildAllele(otherGenLoc),
      new WildAllele(otherGenLoc)
    );

    let insertionIndex = currPairs.length - 1;
    currPairs.forEach((pair, idx) => {
      const pairGenLoc = pair.getAllele().getGenPosition() ?? 50; // gen pos never greater than 25
      if (pairGenLoc > otherGenLoc) insertionIndex = idx;
    });

    currPairs.splice(insertionIndex, 0, wildPair);
  };

  /**
   * Computes all possible permutations when crossing a chromosome between 2 strains
   */
  private readonly crossChromosome = (
    strain1Pairs: AllelePair[],
    strain2Pairs: AllelePair[]
  ): PairChainOption[] => {
    const chromPairChainOptions = new Array<PairChainOption>();
    const leftOptions = this.getRecombOptions(strain1Pairs);
    const rightOptions = this.getRecombOptions(strain2Pairs);

    // Permute all possible allele pair chain combinations
    leftOptions.forEach((left) => {
      rightOptions.forEach((right) => {
        chromPairChainOptions.push({
          pairs: this.generatePairs(left.alleles, right.alleles),
          prob: left.prob * right.prob,
        });
      });
    });
    return chromPairChainOptions;
  };

  /**
   * Permutes all of the possible Allele pairs due to a recombination event (or no recombination event)
   * @param chromAlleles All allele pairs belonging to a strain's chromosomes
   */
  private readonly getRecombOptions = (
    chromAlleles: AllelePair[]
  ): AlleleChainOption[] => {
    const topAlleles = new Array<Allele>();
    const botAlleles = new Array<Allele>();

    // Load arrays sorted by genPosition
    const pairs = Array.from(chromAlleles);
    pairs.sort((pair) => pair.getAllele().getGenPosition() ?? 100); // genPosition will never be greater than 25, this pushes undefined genPositions to end of list
    pairs.forEach((pair) => {
      topAlleles.push(pair.top);
      botAlleles.push(pair.bot);
    });

    // Permute possible recombinations starting on both top and bottom
    const topRecombOptions = this.permuteCombinations(
      topAlleles,
      botAlleles,
      pairs
    );

    const botRecombOptions = this.permuteCombinations(
      botAlleles,
      topAlleles,
      pairs
    );

    const totalRecombOptions = topRecombOptions.concat(botRecombOptions);
    this.reduceRecombOptions(totalRecombOptions);

    return totalRecombOptions;
  };

  /**
   * Combines probabilities of duplicate AlleleChainOptions such that the resulting list has unique AlleleChainOptions
   */
  private readonly reduceRecombOptions = (
    recombOptions: AlleleChainOption[]
  ): void => {
    // Check each option against every other option
    for (let i = 0; i < recombOptions.length; i++) {
      let currOption = recombOptions[i];

      // Check for duplicates and combine probabilities
      for (let j = i + 1; j < recombOptions.length; j++) {
        let nextOption = recombOptions[j];
        const duplicateChainOption: boolean =
          this.getChainString(currOption) === this.getChainString(nextOption);

        if (duplicateChainOption) {
          currOption.prob += nextOption.prob;
          recombOptions.splice(j, 1);
        }
      }
    }
  };

  /**
   * Computes the possible combinations (for a single chromosome) that can result due to genetic recombination
   * @param startingSide Alleles used before a recombination event
   * @param flippedSide Alleles used after a recombination event
   * @param pairs List of allele pairs that represent the combined starting/flipped sides
   * @returns list of allele chains and their respective probabilities
   */
  private permuteCombinations(
    startingSide: Allele[],
    flippedSide: Allele[],
    pairs: AllelePair[]
  ): AlleleChainOption[] {
    const recombOptions: AlleleChainOption[] = [];

    // first iteration accounts for NO recombination at all
    for (let i = 0; i < pairs.length; i++) {
      const option = new Array<Allele>();
      let probability = 0.5;
      option.push(startingSide[0]);

      for (let j = 1; j < pairs.length; j++) {
        const geneticProb = this.getGeneticDif(pairs[j - 1], pairs[j]) / 2;

        // recombination event
        if (j === i) {
          option.concat(flippedSide.slice(j)); // add remainder of alleles on flipped side
          probability = geneticProb;
          break;
        }

        // no recombination, continue along starting side
        probability -= geneticProb;
        option.push(startingSide[j]);
      }
      recombOptions.push({ alleles: option, prob: probability });
    }

    return recombOptions;
  }

  /**
   * @returns absolute value of the genetic difference of 2 allele pairs (or 0 if a pair doesn't have a genetic location)
   */
  private readonly getGeneticDif = (
    pair1: AllelePair,
    pair2: AllelePair
  ): number => {
    const genPos1 = pair1.getAllele().getGenPosition();
    const genPos2 = pair2.getAllele().getGenPosition();
    if (genPos1 === undefined || genPos2 === undefined) return 0;

    return Math.abs(genPos1 - genPos2);
  };

  /**
   * Combine 2 allele lists into a single list of allele pairs
   * @param top list of alleles that will be the top of a pair
   * @param bot list of alleles that will be the top of a pair
   */
  private readonly generatePairs = (
    top: Allele[],
    bot: Allele[]
  ): AllelePair[] => {
    const pairs = new Array<AllelePair>();
    for (let i = 0; i < top.length && i < bot.length; i++)
      pairs.push(new AllelePair(top[i], bot[i]));
    return pairs;
  };

  /**
   * Adds a provided Allele Pair to this strain
   */
  private readonly addPairToStrain = (pair: AllelePair): void => {
    const chrom = pair.getAllele().getChromosome();
    let chromPairs = this.chromAlleleMap.get(chrom);
    if (chromPairs === undefined) {
      chromPairs = new Array<AllelePair>();
      this.chromAlleleMap.set(chrom, chromPairs);
    }
    chromPairs.push(pair);
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
  private readonly getChainString = (chainOption: AlleleChainOption): string =>
    chainOption.alleles.map((allele) => allele.name).join('');

  /* #endregion private methods */
}
