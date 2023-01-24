import { alleleCreateDoesNotMatter } from 'components/CrossNodeForm/CrossNodeForm.mock';
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
  chromAlleleMap: Map<Chromosome | undefined, AllelePair[]>;
  name?: string;
  notes?: string;

  constructor(props: iStrain) {
    this.name = props.name;
    this.notes = props.notes;
    this.chromAlleleMap = new Map<Chromosome | undefined, AllelePair[]>();
    props.allelePairs?.forEach((pair) => this.addPairToChromAlleleMap(pair));
  }

  private readonly addPairsToChromAlleleMap = (pairs: AllelePair[]): void => {
    pairs.forEach((pair) => this.addPairToChromAlleleMap(pair));
  };

  private readonly addPairToChromAlleleMap = (pair: AllelePair): void => {
    const chrom = pair.getAllele().getChromosome();
    let chromPairs = this.chromAlleleMap.get(chrom);
    if (chromPairs === undefined) {
      chromPairs = new Array<AllelePair>();
      this.chromAlleleMap.set(chrom, chromPairs);
    }
    chromPairs.push(pair);
  };

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

  public selfCross = (): StrainOption[] => {
    return this.crossWith(this.clone());
  };

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

  private readonly cartesianCross = (
    chromOptions: PairChainOption[][]
  ): StrainOption[] => {
    if (chromOptions.length === 0) return [];

    // Set strain initially with 1st chromosome allele options
    let strainOptions = chromOptions[0].map((chromOption) => {
      const allelePairs = new Set(chromOption.pairs);
      const strain = new Strain({ allelePairs });
      return {
        strain,
        prob: chromOption.prob,
      };
    });

    for (let i = 1; i < chromOptions.length; i++)
      strainOptions = this.cartesianProduct(strainOptions, chromOptions[i]);

    return strainOptions;
  };

  private readonly cartesianProduct = (
    strainOptions: StrainOption[],
    chromOptions: PairChainOption[]
  ): StrainOption[] => {
    const newStrainOptions = new Array<StrainOption>();

    strainOptions.forEach((strainOption) => {
      chromOptions.forEach((chromOption) => {
        const strain = strainOption.strain.clone();
        strain.addPairsToChromAlleleMap(chromOption.pairs);
        const prob = strainOption.prob * chromOption.prob;
        newStrainOptions.push({ strain, prob });
      });
    });

    return strainOptions;
  };

  private readonly prepWithWilds = (other: Strain): void => {
    other.chromAlleleMap.forEach((otherPairs, chromosome) => {
      const currAlleles = this.chromAlleleMap.get(chromosome) ?? [];

      // Add chromosome to strain, if missing
      if (!this.chromAlleleMap.has(chromosome))
        this.chromAlleleMap.set(chromosome, currAlleles);

      otherPairs.forEach((otherPair) => {
        const alreadyHasAllele: boolean =
          currAlleles.findIndex((pair) => pair.hasSameBaseAllele(otherPair)) >=
          0;

        // Add wild pair to genotype to match other strain
        if (!alreadyHasAllele) this.insertWildPair(currAlleles, otherPair);
      });
    });
  };

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

  private readonly crossChromosome = (
    strain1Alleles: AllelePair[],
    strain2Alleles: AllelePair[]
  ): PairChainOption[] => {
    const chromAlleleOptions = new Array<PairChainOption>();
    const leftOptions = this.getRecombOptions(strain1Alleles);
    const rightOptions = this.getRecombOptions(strain2Alleles);

    // Permute all possible allele chain combinations
    leftOptions.forEach((left) => {
      rightOptions.forEach((right) => {
        chromAlleleOptions.push({
          pairs: this.generatePairs(left.alleles, right.alleles),
          prob: left.prob * right.prob,
        });
      });
    });
    return chromAlleleOptions;
  };

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

  private readonly reduceRecombOptions = (
    recombOptions: AlleleChainOption[]
  ): void => {
    if (recombOptions.length === 0) return;
    recombOptions.sort((chainOptionA, chainOptionB) => {
      const nameA: string = this.getChainString(chainOptionA);
      const nameB: string = this.getChainString(chainOptionB);
      return nameA < nameB ? -1 : 1;
    });

    let currOption = recombOptions[0];
    let i = 0;
    while (i < recombOptions.length) {
      const nextOption = recombOptions[i];
      if (this.getChainString(currOption) === this.getChainString(nextOption)) {
        currOption.prob += nextOption.prob;
        recombOptions.splice(i, 1);
        continue;
      }
      currOption = nextOption;
      i++;
    }
  };

  private readonly getChainString = (
    chainOption: AlleleChainOption
  ): string => {
    return chainOption.alleles.map((allele) => allele.name).join('');
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
}
