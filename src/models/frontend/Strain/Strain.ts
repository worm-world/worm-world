import { getAllele } from 'api/allele';
import { getFilteredStrainAlleles, insertStrainAllele } from 'api/strainAllele';
import {
  Exclude,
  Transform,
  Type,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { type db_Strain } from 'models/db/db_Strain';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
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
import { type ChromosomeName } from 'models/db/filter/db_ChromosomeName';
import {
  type ChromosomeOption,
  ChromosomePair,
} from 'models/frontend/ChromosomePair/ChromosomePair';
import { chromosomes } from 'models/frontend/Chromosome';

export interface StrainOption {
  strain: Strain;
  prob: number;
}

export interface GameteOption {
  chromosomes: Allele[][];
  prob: number;
}

interface IStrain {
  name?: string;
  allelePairs: AllelePair[];
  genotype?: string;
  description?: string;
}

/**
 * A genetic profile consisting of an ordered sequence allele pairs.
 */
export class Strain {
  public name?: string;
  public description?: string;

  // Make sure that chromosome pairs in map are correctly deserialized
  @Transform(
    ({ value }) =>
      new Map(
        [...value.entries()].map(([chromName, chromPair]) => [
          chromName,
          ChromosomePair.fromJSON(JSON.stringify(chromPair)),
        ])
      ),
    { toClassOnly: true }
  )
  @Type(() => Map<ChromosomeName | undefined, ChromosomePair>)
  public chromPairMap = new Map<ChromosomeName | undefined, ChromosomePair>();

  public genotype: string = '.';

  constructor(params: IStrain) {
    // Serialization issue
    if (params === undefined || params === null) return;

    this.name = params.name;
    this.description = params.description;
    this.addPairsToStrain(params.allelePairs);
    this.genotype =
      params.genotype ?? this.toString({ simplify: true, excludeEca: false });
    this.name = params.name;
  }

  // Constructs new object, along with fetching name
  public static async buildFromChromPairs(
    chromPairs: ChromosomePair[]
  ): Promise<Strain> {
    return await this.build({
      allelePairs: chromPairs
        .filter((chromPair) => !chromPair.isEca() || !chromPair.isWild())
        .flatMap((chromPair) => chromPair.allelePairs),
    });
  }

  // Constructs new object, along with fetching name
  public static async build(params: IStrain): Promise<Strain> {
    const strain = new Strain(params);
    await strain.syncFromDb();
    return strain;
  }

  public isEmptyWild(): boolean {
    const isEmpty = this.chromPairMap.size === 0;
    const isOnlyWildEcas =
      this.chromPairMap.size === 1 &&
      (this.chromPairMap.get('Ex')?.isWild() ?? false);
    return isEmpty || isOnlyWildEcas;
  }

  /** Returns clone with leading het alleles on to and no wild chromosome pairs */
  public simplify(): Strain {
    const clone = this.clone();
    this.chromPairMap.forEach((chromPair, chromName) =>
      clone.chromPairMap.set(chromName, chromPair.simplify())
    );
    return clone;
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

  public getSortedChromPairs(): ChromosomePair[] {
    return Array.from(this.chromPairMap.entries())
      .sort((a, b) => cmpChromName(a[0], b[0]))
      .map(([_, chromPair]) => chromPair);
  }

  /**
   * Update genotype string to reflect current genetic contents
   */
  public toString(
    options = {
      simplify: true,
      excludeEca: false,
    }
  ): string {
    return (
      this.getSortedChromPairs()
        .filter(
          (chromPair) =>
            !(
              (options.simplify && chromPair.isWild()) ||
              (options.excludeEca && chromPair.isEca())
            )
        )
        .map((chromPair) => chromPair.toString(true))
        .join('; ') + '.'
    );
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
          top: strainAllele.is_on_top ? allele : allele.toWild(),
          bot: strainAllele.is_on_bot ? allele : allele.toWild(),
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
    const simplified = this.simplify();
    simplified.getAllelePairs().forEach((pair) => {
      if (pair.isHomo()) {
        insertStrainAllele(
          new StrainAllele({
            strainName: this.name ?? '',
            alleleName: pair.top.name,
            isOnTop: true,
            isOnBot: true,
          })
        ).catch(console.error);
      } else {
        if (!pair.top.isWild()) {
          insertStrainAllele(
            new StrainAllele({
              strainName: this.name ?? '',
              alleleName: pair.top.name,
              isOnTop: true,
              isOnBot: false,
            })
          ).catch(console.error);
        }
        if (!pair.bot.isWild()) {
          insertStrainAllele(
            new StrainAllele({
              strainName: this.name ?? '',
              alleleName: pair.bot.name,
              isOnTop: false,
              isOnBot: true,
            })
          ).catch(console.error);
        }
      }
    });
  }

  public toMaleModel(): StrainNodeModel {
    return new StrainNodeModel({ sex: Sex.Male, strain: this });
  }

  public toHermModel(): StrainNodeModel {
    return new StrainNodeModel({ sex: Sex.Hermaphrodite, strain: this });
  }

  public getHomoAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => !allelePair.isEca() && allelePair.isHomo())
      .map((allelePair) => allelePair.top);
  }

  public getHetAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => !allelePair.isEca() && !allelePair.isHomo())
      .map((allelePair) =>
        allelePair.top.isWild() ? allelePair.top : allelePair.bot
      );
  }

  public getExAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => allelePair.isEca())
      .map((allelePair) => allelePair.top);
  }

  /**
   * Checks if both strains represent the same genetic profile (ignoring explicitly represented wilds)
   * @param other strain to compare against
   */
  public equals(other: Strain, excludeEca = false): boolean {
    const nonWildChromNames = Array.from(this.chromPairMap.entries())
      .filter(
        ([_, chromPair]) =>
          !(chromPair.isWild() || (excludeEca && chromPair.isEca()))
      )
      .map(([chromName, _]) => chromName);
    const otherNonWildChromNames = Array.from(other.chromPairMap.entries())
      .filter(
        ([_, chromPair]) =>
          !(chromPair.isWild() || (excludeEca && chromPair.isEca()))
      )
      .map(([chromName, _]) => chromName);
    if (nonWildChromNames.length !== otherNonWildChromNames.length)
      return false;

    let allPairsMatch = true;
    nonWildChromNames.forEach((chromName) => {
      const chromPair = this.chromPairMap.get(chromName);
      const otherChromPair = other.chromPairMap.get(chromName);

      if (chromPair === undefined || otherChromPair === undefined) {
        allPairsMatch = false;
      } else if (!chromPair.equals(otherChromPair)) allPairsMatch = false;
    });

    return allPairsMatch;
  }

  /**
   * Returns a new strain with identical data to this
   */
  public clone(): Strain {
    const clone = new Strain({
      name: this.name,
      description: this.description,
      genotype: this.genotype,
      allelePairs: [],
    });
    clone.chromPairMap = new Map(this.chromPairMap);
    return clone;
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
    this.fillWildsFrom(other);
    other.fillWildsFrom(this);

    const gameteOpts1 = this.meiosis();
    const gameteOpts2 = other.meiosis();
    return await Strain.fertilize(gameteOpts1, gameteOpts2);
  }

  public getAllelePairs(): AllelePair[] {
    return [...this.chromPairMap.values()]
      .map((pair) => pair.allelePairs)
      .flat();
  }

  public static async fertilize(
    gameteOpts1: GameteOption[],
    gameteOpts2: GameteOption[] = gameteOpts1
  ): Promise<StrainOption[]> {
    const strainOpts = await Promise.all(
      gameteOpts1.flatMap((gameteOpt1) =>
        gameteOpts2.map(async (gameteOpt2) => {
          const chromPairs = gameteOpt1.chromosomes.map((chrom, idx) =>
            ChromosomePair.buildFromChroms(chrom, gameteOpt2.chromosomes[idx])
          );
          return {
            strain: await Strain.buildFromChromPairs(chromPairs),
            prob: gameteOpt1.prob * gameteOpt2.prob,
          };
        })
      )
    );
    Strain.reduceStrainOptions(strainOpts);
    Strain.normalizeEcaOptions(strainOpts);
    strainOpts.sort((a, b) => b.prob - a.prob);
    return strainOpts;
  }

  /** Strain options differing only by extrachromosomal array contents should have same probability
   * (for simplicity, not necessarily biologically accurate) */
  private static normalizeEcaOptions(strainOpts: StrainOption[]): void {
    // Partition options according to non-ECA equality
    const partition = new Map<string, StrainOption[]>();
    strainOpts.forEach((option) => {
      const genotype = option.strain.toString({
        simplify: false,
        excludeEca: true,
      });
      partition.has(genotype)
        ? partition.get(genotype)?.push(option)
        : partition.set(genotype, [option]);
    });

    // Normalize each set
    [...partition.values()].forEach((optionSet) => {
      const totalProb = optionSet.reduce<number>(
        (totalProb, currOpt) => totalProb + currOpt.prob,
        0
      );
      optionSet.forEach(
        (option) => (option.prob = totalProb / optionSet.length)
      );
    });
  }

  /** Produce all distinct "gametes", meaning top-heterozygous strains representing eggs/sperm */
  public meiosis(): GameteOption[] {
    return this.getSortedChromPairs()
      .map((pair) => pair.meiosis())
      .reduce<ChromosomeOption[][]>(
        // Cartesian product
        (a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())),
        [[]]
      )
      .map((gameteChromOpts) => {
        return {
          chromosomes: gameteChromOpts.map(
            (gameteChromOpt) => gameteChromOpt.chromosome
          ),
          prob: gameteChromOpts.reduce(
            (prob, gameteChromOpt) => prob * gameteChromOpt.prob,
            1
          ),
        };
      });
  }

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
   * Populates {this} with any missing alleles from {other} (represented as wild strains)
   * @param other Strain to compare against and look for any missing alleles
   */
  public fillWildsFrom(other: Strain): void {
    other.chromPairMap.forEach((otherChromPair, chromName) => {
      const chromPair =
        this.chromPairMap.get(chromName) ?? new ChromosomePair([]);

      // Add chromosome to strain, if missing
      if (!this.chromPairMap.has(chromName)) {
        this.chromPairMap.set(chromName, chromPair);
      }

      chromPair.fillWildsFrom(otherChromPair);
    });
  }

  /**
   * Adds a provided AllelePair to this strain. Throws an error if this fails (pair already exists).
   */
  private addPairToStrain(allelePair: AllelePair): void {
    // Clear name and description, since these follow from strain identity
    this.name = undefined;
    this.description = undefined;

    const chromName = allelePair.top.getChromName();
    let chromPair = this.chromPairMap.get(chromName);
    if (chromPair === undefined) {
      chromPair = new ChromosomePair([]);
      this.chromPairMap.set(chromName, chromPair);
    }

    // Doesn't allow duplicated genes
    if (chromPair.containsSameGeneOrVariationAs(allelePair)) {
      throw new Error(
        `Bad pair: ${allelePair}\nCannot add multiple allele pairs of the same gene or variation.`
      );
    }

    chromPair.insertPair(allelePair);
  }

  /**
   * Combines probabilities of duplicate StrainOptions such that the resulting list has unique strains
   */
  private static reduceStrainOptions(strains: StrainOption[]): void {
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

  private addPairsToStrain(pairs: AllelePair[]): void {
    pairs.forEach((pair) => {
      this.addPairToStrain(pair);
    });
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): Strain {
    return plainToInstance(Strain, JSON.parse(json) as Record<string, unknown>);
  }

  @Exclude()
  generateRecord(): db_Strain {
    if (this.name === undefined || this.genotype === undefined) {
      throw Error(
        'Attempted to generate a record for a strain without a name and genotype'
      );
    }
    return {
      name: this.name,
      genotype: this.genotype,
      description: this.description ?? null,
    };
  }
}

export function cmpChromName(
  chromA?: ChromosomeName,
  chromB?: ChromosomeName
): number {
  if (chromA === undefined) {
    return 1;
  } else if (chromB === undefined) {
    return -1;
  } else {
    const posA = chromosomes.indexOf(chromA);
    const posB = chromosomes.indexOf(chromB);
    return posA - posB;
  }
}
