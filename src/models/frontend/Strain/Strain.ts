import { getAllele } from 'api/allele';
import { getFilteredStrainAlleles, insertStrainAllele } from 'api/strainAllele';
import {
  Exclude,
  Transform,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { type db_Strain } from 'models/db/db_Strain';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { type Chromosome } from 'models/db/filter/db_ChromosomeEnum';
import { type StrainAlleleFieldName } from 'models/db/filter/db_StrainAlleleFieldName';
import { Sex } from 'models/enums';
import { Allele } from 'models/frontend/Allele/Allele';
import { type AlleleExpression } from 'models/frontend/AlleleExpression/AlleleExpression';
import { AllelePair } from 'models/frontend/AllelePair/AllelePair';
import { type Condition } from 'models/frontend/Condition/Condition';
import { type Phenotype } from 'models/frontend/Phenotype/Phenotype';
import { StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import { getStrain, insertStrain } from 'api/strain';
import { StrainAllele } from 'models/frontend/StrainAllele/StrainAllele';
import * as Chrom from 'models/frontend/Chrom/Chrom';

export interface StrainOption {
  strain: Strain;
  prob: number;
}

interface ChromatidOption {
  alleles: Allele[];
  prob: number;
  isEca: boolean;
}

interface ChromosomeOption {
  pairs: AllelePair[];
  prob: number;
}

interface IStrain {
  name?: string;
  allelePairs: AllelePair[];
  genotype?: string;
  description?: string;
}

/**
 * A (possibly named) genetic profile consisting of an ordered sequence of any non-wild allele pairs.
 */
export class Strain {
  /* #region initializers */
  @Transform(
    (data: { obj: any }) => {
      // The way class-transformer works, it will call this function with an Object where key is "chromPairMap" and
      // .obj is an object dictionary with the contents of chromPairMap, but it is not a Map.
      // This means the object will have no functions like .keys() or .values() and will not be iterable.
      // This function will then convert the object dictionary into a Map so we can use it as normal.
      const d = data?.obj?.chromPairMap ?? {};
      // undefined is written into the JSON as a string "undefined", so we need to convert it back to the literal undefined
      return new Map(
        Object.keys(d).map((k) => {
          const pairs = d[k];
          const restoredPairs = pairs.map((pair: unknown) =>
            AllelePair.fromJSON(JSON.stringify(pair))
          );
          return [k === 'undefined' ? undefined : k, restoredPairs];
        }) ?? null
      );
    },
    { toClassOnly: true }
  )
  public chromPairMap = new Map<Chromosome | undefined, AllelePair[]>();

  public name?: string;

  public genotype = '';

  public description?: string;

  constructor(params: IStrain) {
    if (params !== undefined && params !== null) {
      this.name = params.name;
      this.description = params.description;
      this.addPairsToStrain(params.allelePairs);
      this.syncGenotype();
      this.name = params.name;
    }
  }

  // Constructs new object, along with fetching name
  public static async buildWithSync(params: IStrain): Promise<Strain> {
    const strain = new Strain(params);
    await strain.syncFromDb();
    return strain;
  }

  private async syncFromDb(): Promise<void> {
    if (this.getNonWildAlleles().length === 0) return undefined;
    const sAFilter: FilterGroup<StrainAlleleFieldName> = {
      filters: [
        this.getNonWildAlleles().map((allele) => [
          'AlleleName',
          { Equal: allele.name },
        ]),
      ],
      orderBy: [],
    };
    const matchCandidates = await Promise.all(
      (await getFilteredStrainAlleles(sAFilter))
        .map(async (sa) => await getStrain(sa.strain_name))
        .map(async (strain) => await Strain.createFromRecord(await strain))
    );
    for (const candidate of matchCandidates) {
      if (this.equals(candidate)) {
        this.name = candidate.name;
        this.description = candidate.description;
        break;
      }
    }
  }

  /**
   * Update genotype string to reflect current genetic contents
   */
  private syncGenotype(): void {
    this.genotype =
      Array.from(this.chromPairMap.entries())
        .sort((a, b) => cmpChromosomes(a[0], b[0]))
        .map(([chrom, pairs]) => {
          if (pairs.every((pair) => pair.isHomo())) {
            return (
              pairs.map((pair) => pair.top.getQualifiedName()).join(' ') +
              ' ' +
              (chrom ?? '?')
            );
          }
          const top = AllelePair.getTopChrom(pairs)
            .map((allele) =>
              allele.isWild() ? allele.name : allele.getQualifiedName()
            )
            .join(' ');
          const bot = AllelePair.getBotChrom(pairs)
            .map((allele) =>
              allele.isWild() ? allele.name : allele.getQualifiedName()
            )
            .join(' ');
          return top + '/' + bot + ' ' + (chrom ?? '?');
        })
        .join('; ') + '.';
  }

  static async createFromRecord(record: db_Strain): Promise<Strain> {
    const strainAlleleFilter: FilterGroup<StrainAlleleFieldName> = {
      filters: [[['StrainName', { Equal: record.name }]]],
      orderBy: [],
    };

    const strainAlleles = await getFilteredStrainAlleles(strainAlleleFilter);
    const allelePairs = await Promise.all(
      strainAlleles.map(async (strainAllele) => {
        const allele = await Allele.createFromRecord(
          await getAllele(strainAllele.allele_name)
        );
        return new AllelePair({
          top: strainAllele.is_on_top ? allele : allele.getWild(),
          bot: strainAllele.is_on_bot ? allele : allele.getWild(),
        });
      })
    );

    return new Strain({
      name: record.name ?? undefined,
      description: record.description ?? undefined,
      genotype: record.genotype,
      allelePairs: await Promise.all(allelePairs),
    });
  }

  public async save(): Promise<void> {
    if (this.name === undefined)
      throw new Error('Tried to save strain without name.');
    await insertStrain(this);
    this.getAllelePairs().forEach((pair) => {
      if (pair.isWild()) return;
      if (pair.isHomo()) {
        insertStrainAllele(
          new StrainAllele({
            strainName: this.name ?? '',
            alleleName: pair.top.name,
            isOnTop: true,
            isOnBot: true,
          })
        ).catch(console.error);
        return;
      }
      if (!pair.top.isWild()) {
        insertStrainAllele(
          new StrainAllele({
            strainName: this.name ?? '',
            alleleName: pair.top.name,
            isOnTop: true,
            isOnBot: false,
          })
        ).catch(console.error);
        return;
      }
      if (!pair.bot.isWild()) {
        insertStrainAllele(
          new StrainAllele({
            strainName: this.name ?? '',
            alleleName: pair.bot.name,
            isOnTop: true,
            isOnBot: false,
          })
        ).catch(console.error);
      }
    });
  }

  static getGenotype(allelePairs: AllelePair[]): string {
    return 'todo: getGenotype';
  }

  public toMaleModel(): StrainNodeModel {
    return new StrainNodeModel({ sex: Sex.Male, strain: this });
  }

  public toHermModel(): StrainNodeModel {
    return new StrainNodeModel({ sex: Sex.Hermaphrodite, strain: this });
  }

  public getHomoAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => !allelePair.isEca && allelePair.isHomo())
      .map((allelePair) => allelePair.top);
  }

  public getHetAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => !allelePair.isEca && !allelePair.isHomo())
      .map((allelePair) =>
        allelePair.top.isWild() ? allelePair.top : allelePair.bot
      );
  }

  public getExAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => allelePair.isEca)
      .map((allelePair) => allelePair.top);
  }

  /**
   * Checks if both strains represent the same genetic profile
   * @param other strain to compare against
   */
  public equals(other: Strain): boolean {
    const keys = Array.from(this.chromPairMap.entries())
      .filter((chromPair) => !Chrom.isWild(chromPair[1]))
      .map((chromPair) => chromPair[0]);
    const otherKeys = Array.from(other.chromPairMap.entries())
      .filter((chromPair) => !Chrom.isWild(chromPair[1]))
      .map((chromPair) => chromPair[0]);
    if (keys.length !== otherKeys.length) return false;

    let allPairsMatch = true;
    keys.forEach((key) => {
      const chromPairs = this.chromPairMap.get(key) ?? [];
      const otherChromPairs = other.chromPairMap.get(key) ?? [];

      if (!AllelePair.chromosomesMatch(chromPairs, otherChromPairs))
        allPairsMatch = false;
    });
    return allPairsMatch;
  }

  /**
   * Returns a new strain with identical data to this
   */
  public clone(): Strain {
    const allelePairs: AllelePair[] = [];
    this.chromPairMap.forEach((pairs) => {
      pairs.forEach((pair) => allelePairs.push(pair.clone()));
    });
    return new Strain({
      name: this.name,
      description: this.description,
      genotype: this.genotype,
      allelePairs,
    });
  }

  /**
   * Crosses this strain with itself
   * @returns Permuted list of all possible strains and their respective probabilities
   */
  public async selfCross(): Promise<StrainOption[]> {
    return await this.crossWith(this);
  }

  /**
   * Crosses this strain with {other}
   * @param other strain to cross against
   * @returns Permuted list of all possible strains and their respective probabilities
   */
  public async crossWith(other: Strain): Promise<StrainOption[]> {
    if (this.chromPairMap.size === 0 && other.chromPairMap.size === 0)
      return [
        {
          strain: await Strain.buildWithSync({ allelePairs: [] }),
          prob: 1.0,
        },
      ];

    this.prepWithWilds(other);
    other.prepWithWilds(this);

    const lStrain = this.clone();
    const rStrain = other.clone();

    const multiChromOptions: ChromosomeOption[][] = [];

    // get chromosomal allele probabilities
    lStrain.chromPairMap.forEach((lPairs, chromosome) => {
      const rPairs = rStrain.chromPairMap.get(chromosome) ?? [];
      multiChromOptions.push(
        chromosome === 'Ex'
          ? this.crossExChromosome(lPairs, rPairs)
          : this.crossChromosome(lPairs, rPairs)
      );
    });

    // Permute strains for each chromosome
    const strainOptions = await this.cartesianCross(multiChromOptions);
    this.reduceStrainOptions(strainOptions);
    return strainOptions;
  }

  // Assumed equal probabilities of all possible sets
  private crossExChromosome(
    leftChrom: AllelePair[],
    rightChrom: AllelePair[]
  ): ChromosomeOption[] {
    const allelePairs: AllelePair[] = [];
    [...rightChrom, ...leftChrom].forEach((pair) => {
      const notYetInList = !allelePairs.some((inListPair) =>
        inListPair.strictEquals(pair)
      );
      if (notYetInList && !pair.isWild()) allelePairs.push(pair);
    });

    const noPairs: AllelePair[][] = [[]];
    const allSubsets = allelePairs.reduce(
      (subsets, value) => subsets.concat(subsets.map((set) => [value, ...set])),
      noPairs
    );
    const chromOptions = allSubsets.map((allelePairs) => {
      return { pairs: allelePairs, prob: 1 / allSubsets.length };
    });

    return chromOptions;
  }

  public getAllelePairs(): AllelePair[] {
    return [...this.chromPairMap.values()].flat();
  }

  /**
   * @returns flattened array combining all allele expressions for each allele in the strain
   */
  public getAlleleExpressions(): AlleleExpression[] {
    return this.getNonWildAlleles().flatMap(
      (allele) => allele.alleleExpressions
    );
  }

  public getNonWildAlleles(): Allele[] {
    return this.getAlleles().filter((allele) => !allele.isWild());
  }

  public getAlleles(): Allele[] {
    return this.getAllelePairs()
      .map((pair) => [pair.top, pair.bot])
      .flat();
  }

  public getExprPhenotypes(): Phenotype[] {
    return this.getAlleleExpressions().map((expr) => expr.expressingPhenotype);
  }

  public getReqConditions(): Condition[] {
    return this.getAlleleExpressions().flatMap(
      (expr) => expr.requiredConditions
    );
  }

  public getSupConditions(): Condition[] {
    return this.getAlleleExpressions().flatMap(
      (expr) => expr.suppressingConditions
    );
  }

  public getMaturationDays(): number {
    const maturationDays = this.getExprPhenotypes().flatMap(
      (phen) => phen.maturationDays ?? []
    );
    if (maturationDays.length === 0) maturationDays.push(3); // default

    return Math.max(...maturationDays);
  }

  /**
   * Permutes all possible strain combinations due to each chromosome
   * @param multiChromOptions Outer list represents a unique Chromosomes, inner list is the possible PairChains for that chromosome
   * @returns Complete permuted strains from all the different chromosomes
   */
  private async cartesianCross(
    multiChromOptions: ChromosomeOption[][]
  ): Promise<StrainOption[]> {
    if (multiChromOptions.length === 0) return [];

    // Set strains initially with 1st available chromosome (and its allele options)
    let strainOptions = await Promise.all(
      multiChromOptions[0].map(async (chromOption) => {
        const allelePairs = chromOption.pairs;
        const strain = new Strain({ allelePairs });
        return {
          strain,
          prob: chromOption.prob,
        };
      })
    );

    // Build out the strain permutations for each successive chromosome
    for (let i = 1; i < multiChromOptions.length; i++)
      strainOptions = this.cartesianProduct(
        strainOptions,
        multiChromOptions[i]
      );

    // Update strain details now that they are done changing
    for (const so of strainOptions) {
      await so.strain.syncFromDb().catch(console.error);
      so.strain.syncGenotype();
    }

    return strainOptions;
  }

  /**
   * Permutes new strains based on current permutation {strainOptions} and the provided {chromOptions}
   *
   * Should ONLY be used by cartesianCross
   * @param strainOptions base list to permute against
   * @param chromOptions
   * @returns new strain list containing the added permutations from {chromOptions}
   */
  private cartesianProduct(
    strainOptions: StrainOption[],
    chromOptions: ChromosomeOption[]
  ): StrainOption[] {
    const newStrainOptions = new Array<StrainOption>();

    strainOptions.forEach((strainOption) => {
      chromOptions.forEach((chromOption) => {
        const strain = strainOption.strain.clone();
        strain.addPairsToStrain(chromOption.pairs);
        const prob = strainOption.prob * chromOption.prob;
        newStrainOptions.push({ strain, prob });
      });
    });

    return newStrainOptions;
  }

  /**
   * Populates {this} with any missing alleles from other (represented as wild strains)
   * @param other Strain to compare against and look for any missing alleles
   */
  public prepWithWilds(other: Strain, defaultToLeftSide = true): void {
    other.chromPairMap.forEach((otherChromPairs, chromosome) => {
      const chromosomePairs = this.chromPairMap.get(chromosome) ?? [];

      // Add chromosome to strain, if missing
      if (!this.chromPairMap.has(chromosome)) {
        this.chromPairMap.set(chromosome, chromosomePairs);
      }

      otherChromPairs.forEach((otherPair) => {
        const alreadyHasAllele = chromosomePairs.some((pair) =>
          pair.isOfSameGeneOrVariation(otherPair)
        );

        // Add wild pair to pair list to match other strain
        if (!alreadyHasAllele)
          this.insertWildPair(chromosomePairs, otherPair, defaultToLeftSide);
      });
    });
  }

  /**
   * Inserts a wild pair into {chromosomePairs} based on the genetic location of {otherPair}
   * @param chromosomePairs Current strain pairs to insert wild pair into
   * @param otherPair Pair from other strain that will be represented as wild pair
   * @param defaultLeft If genetic location can't be determined, place wild on left side (or right side)
   */
  private insertWildPair(
    chromosomePairs: AllelePair[],
    otherPair: AllelePair,
    defaultLeft: boolean
  ): void {
    const wildPair = new AllelePair({
      top: otherPair.top.getWild(),
      bot: otherPair.top.getWild(),
      isEca: otherPair.isEca,
    });

    chromosomePairs.push(wildPair);
    chromosomePairs.sort((pair1, pair2) => {
      const p1 = pair1.top.getGenPosition() ?? (defaultLeft ? -50 : 50);
      const p2 = pair2.top.getGenPosition() ?? (defaultLeft ? -50 : 50);
      return p1 < p2 ? -1 : 1;
    });
  }

  /**
   * Computes all possible permutations when crossing a chromosome between 2 strains
   */
  private crossChromosome(
    leftChrom: AllelePair[],
    rightChrom: AllelePair[]
  ): ChromosomeOption[] {
    const chromosomeOptions: ChromosomeOption[] = [];
    const leftOptions = this.getRecombOptions(leftChrom);
    const rightOptions = this.getRecombOptions(rightChrom);

    // Permute all possible chrom combinations
    leftOptions.forEach((left) => {
      rightOptions.forEach((right) => {
        chromosomeOptions.push({
          pairs: this.combineChroms(left.alleles, right.alleles, left.isEca),
          prob: left.prob * right.prob,
        });
      });
    });
    this.reduceChromosomeOptions(chromosomeOptions);
    return chromosomeOptions;
  }

  /**
   * Permutes all of the possible chroms due to a recombination event (or no recombination event)
   * @param chromosome All allele pairs belonging to a strain's chromosomes
   */
  private getRecombOptions(chromosome: AllelePair[]): ChromatidOption[] {
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
  }

  /**
   * Combines probabilities of duplicate chroms such that the resulting list has unique chroms
   */
  private reduceChromatidOptions(chroms: ChromatidOption[]): void {
    // Check each option against every other option
    for (let i = 0; i < chroms.length; i++) {
      const currChromatid = chroms[i];

      // Check for duplicates and combine probabilities
      for (let j = i + 1; j < chroms.length; ) {
        const nextChromatid = chroms[j];
        const duplicateChromatids: boolean =
          this.getTopChromString(currChromatid) ===
          this.getTopChromString(nextChromatid);

        if (duplicateChromatids) {
          currChromatid.prob += nextChromatid.prob;
          chroms.splice(j, 1);
        } else {
          j++;
        }
      }
    }
  }

  /**
   * Combines probabilities of duplicate chromosomes such that the resulting list has unique chromosomes
   */
  private reduceChromosomeOptions(chromosomes: ChromosomeOption[]): void {
    // Check each option against every other option
    for (let i = 0; i < chromosomes.length; i++) {
      const currChrom = chromosomes[i];

      // Check for duplicates and combine probabilities
      for (let j = i + 1; j < chromosomes.length; ) {
        const nextChrom = chromosomes[j];
        if (AllelePair.chromosomesMatch(currChrom.pairs, nextChrom.pairs)) {
          currChrom.prob += nextChrom.prob;
          chromosomes.splice(j, 1);
        } else {
          j++;
        }
      }
    }
  }

  /**
   * Combines probabilities of duplicate StrainOptions such that the resulting list has unique strains
   */
  private reduceStrainOptions(strains: StrainOption[]): void {
    // Check each strain against every other strain
    for (let i = 0; i < strains.length; i++) {
      const currStrain = strains[i];

      // Check for duplicates and combine probabilities
      for (let j = i + 1; j < strains.length; ) {
        const nextStrain = strains[j];
        const duplicate = currStrain.strain.equals(nextStrain.strain);

        if (duplicate) {
          currStrain.prob += nextStrain.prob;
          strains.splice(j, 1);
        } else {
          j++;
        }
      }
    }
  }

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
    const chroms: ChromatidOption[] = [];

    // first iteration accounts for NO recombination at all
    for (let i = 0; i < chromosome.length; i++) {
      let chrom: Allele[] = [];
      let probability = 0.5;
      chrom.push(startingChromatid[0]);

      for (let j = 1; j < chromosome.length; j++) {
        const recombinationProb = this.getRecombProb(
          chromosome[j - 1],
          chromosome[j]
        );

        // recombination event
        if (j === i) {
          chrom = chrom.concat(flippedChromatid.slice(j)); // add remainder of alleles of other chrom
          probability = recombinationProb;
          break;
        }

        // no recombination, continue along starting side
        probability -= recombinationProb;
        chrom.push(startingChromatid[j]);
      }
      chroms.push({
        alleles: chrom,
        prob: probability,
        isEca: chromosome.length > 0 && chromosome[0].isEca,
      });
    }

    return chroms;
  }

  /**
   * @returns absolute value of the genetic difference of 2 allele pairs (or 0 if a pair doesn't have a genetic location)
   */
  private getRecombProb(pair1: AllelePair, pair2: AllelePair): number {
    const genPos1 = pair1.top.getGenPosition();
    const genPos2 = pair2.top.getGenPosition();
    if (genPos1 === undefined || genPos2 === undefined) return 0;

    const halfDistance = Math.abs(genPos1 - genPos2) / 2;
    return halfDistance / 100; // convert to decimal form
  }

  /**
   * Combine 2 chroms into a single chromosome of allele pairs
   * @param top list of alleles that will be the top chrom
   * @param bot list of alleles that will be the bottom chrom
   */
  private combineChroms(
    top: Allele[],
    bot: Allele[],
    isEca: boolean
  ): AllelePair[] {
    const chromosome: AllelePair[] = [];
    for (let i = 0; i < top.length && i < bot.length; i++)
      chromosome.push(new AllelePair({ top: top[i], bot: bot[i], isEca }));
    return chromosome;
  }

  /**
   * Adds a provided Allele Pair to this strain. Throws an error if this fails (pair already exists).
   */
  private addPairToStrain(pair: AllelePair): void {
    // Clear name and description, since these follow from strain identity
    this.name = undefined;
    this.description = undefined;

    const chromName = pair.isEca ? 'Ex' : pair.top.getChromosome();
    let chromosome = this.chromPairMap.get(chromName);
    if (chromosome === undefined) {
      chromosome = [];
      this.chromPairMap.set(chromName, chromosome);
    }

    // Don't allow duplicated genes
    if (chromosome.some((oldPair) => oldPair.isOfSameGeneOrVariation(pair))) {
      console.error(pair);
      throw new Error(
        'Cannot add multiple allele pairs of the same gene or variation.'
      );
    }

    // Insert according to genetic location
    chromosome.push(pair);
    chromosome.sort((pair1, pair2) => {
      const pair1Pos = pair1.top.getGenPosition() ?? 50; // gen pos never greater than 25
      const pair2Pos = pair2.top.getGenPosition() ?? 50; // gen pos never greater than 25
      return pair1Pos < pair2Pos ? -1 : 1;
    });
  }

  /**
   * Adds a list of AllelePairs to this strain
   */
  private addPairsToStrain(pairs: AllelePair[]): void {
    pairs.forEach((pair) => {
      this.addPairToStrain(pair);
    });
  }

  /**
   * Converts a chrom into a string of allele names (to be used for equality checks)
   */
  private getTopChromString(chrom: ChromatidOption): string {
    return chrom.alleles.map((allele) => allele.name).join('');
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Strain {
    return [plainToInstance(Strain, JSON.parse(json))].flat()[0];
  }

  @Exclude()
  generateRecord(): db_Strain {
    if (this.name === undefined) {
      throw Error('Attempted to generate a record for a strain without a name');
    }
    return {
      name: this.name,
      genotype: this.genotype,
      description: this.description ?? null,
    };
  }
}

export const cmpChromosomes = (
  chromA?: Chromosome,
  chromB?: Chromosome
): number => {
  if (chromA === undefined) {
    return 1;
  } else if (chromB === undefined) {
    return -1;
  } else {
    const order: Chromosome[] = ['I', 'II', 'III', 'IV', 'V', 'X', 'Ex'];
    const posA = order.indexOf(chromA);
    const posB = order.indexOf(chromB);
    return posA - posB;
  }
};
