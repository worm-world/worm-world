import { getAllele } from 'api/allele';
import {
  getFilteredStrainAlleles,
  insertDbStrainAllele,
} from 'api/strainAllele';
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
import { getStrain, insertStrain } from 'api/strain';
import { type ChromosomeName } from 'models/db/filter/db_ChromosomeName';
import {
  type ChromosomeOption,
  ChromosomePair,
} from 'models/frontend/ChromosomePair/ChromosomePair';
import { chromosomes } from 'models/frontend/Chromosome';
import type StrainFilter from 'models/frontend/StrainFilter/StrainFilter';

export interface Gamete {
  chromosomes: Allele[][];
  prob: number;
}

interface IStrain {
  name?: string;
  chromPairMap?: Map<ChromosomeName | undefined, ChromosomePair>; // Has priority over allelePairs
  allelePairs?: AllelePair[];
  genotype?: string;
  description?: string;
  sex?: Sex;
  isParent?: boolean;
  isChild?: boolean;
  probability?: number;
}

/**
 * A genetic profile consisting of an ordered sequence allele pairs.
 */
export class Strain {
  public name = '';
  public sex = Sex.Hermaphrodite;
  public isParent = false;
  public isChild = false;
  public genotype: string = '.';

  public description?: string;
  public probability: number = 1;

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

  constructor(params?: IStrain) {
    // Serialization issue
    if (params === undefined || params === null) return;

    this.name = params.name ?? '';
    this.sex = params.sex ?? Sex.Hermaphrodite;
    this.isParent = params.isParent ?? false;
    this.isChild = params.isChild ?? false;
    this.chromPairMap =
      params.chromPairMap ??
      new Map<ChromosomeName | undefined, ChromosomePair>();

    this.description = params.description;
    this.probability = params.probability ?? 1;

    if (params.allelePairs !== undefined && params.chromPairMap === undefined)
      this.addPairsToStrain(params.allelePairs);
    this.genotype =
      params.genotype ?? this.toString({ simplify: true, excludeEca: false });
  }

  public static async build(params: IStrain): Promise<Strain> {
    const strain = new Strain(params);
    await strain.syncFromDb(); // Dynamically query for name
    return strain;
  }

  public static async buildFromChromPairs(
    chromPairs: ChromosomePair[]
  ): Promise<Strain> {
    return await this.build({
      allelePairs: chromPairs
        .filter((chromPair) => !chromPair.isEca() || !chromPair.isWild())
        .flatMap((chromPair) => chromPair.allelePairs),
    });
  }

  public passesFilter(filter: StrainFilter): boolean {
    const passesAlleleNames =
      filter.alleleNames.size === 0 ||
      [...filter.alleleNames].every((alleleName) =>
        this.getAlleles()
          .map((allele) => allele.getQualifiedName())
          .includes(alleleName)
      );
    const passesReqConds =
      filter.reqConditions.size === 0 ||
      [...filter.reqConditions].every((reqCondName) =>
        this.getReqConditions()
          .map((reqCond) => reqCond.name)
          .includes(reqCondName)
      );
    const passesSupConds =
      filter.supConditions.size === 0 ||
      [...filter.supConditions].every((supCondName) =>
        this.getReqConditions()
          .map((supCond) => supCond.name)
          .includes(supCondName)
      );
    const passesExprPhens =
      filter.exprPhenotypes.size === 0 ||
      [...filter.exprPhenotypes].every((exprPhenName) =>
        this.getExprPhenotypes()
          .map((exprPhen) => exprPhen.name)
          .includes(exprPhenName)
      );

    return (
      passesAlleleNames && passesReqConds && passesSupConds && passesExprPhens
    );
  }

  public toggleSex(): Strain {
    const strain = this.clone();
    strain.sex =
      strain.sex === Sex.Hermaphrodite ? Sex.Male : Sex.Hermaphrodite;
    const xChromPair = strain.chromPairMap.get('X');
    if (xChromPair !== undefined)
      strain.chromPairMap.set(
        'X',
        ChromosomePair.buildFromChroms(
          xChromPair.getTop(),
          strain.sex === Sex.Hermaphrodite ? xChromPair.getTop() : undefined
        )
      );
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
        .map(async (sa) => await getStrain(sa.strainName))
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
    const str = this.getSortedChromPairs()
      .filter(
        (chromPair) =>
          !(
            (options.simplify && chromPair.isWild()) ||
            (options.excludeEca && chromPair.isEca())
          )
      )
      .map((chromPair) => chromPair.toString(true))
      .join('; ');
    return str === '' ? '(Wild)' : str + '.';
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
          await getAllele(strainAllele.alleleName)
        );
        return new AllelePair({
          top: strainAllele.isOnTop ? allele : allele.toWild(),
          bot: strainAllele.isOnBot ? allele : allele.toWild(),
        });
      })
    );

    // Merge co-located het pairs
    const hetPairs: AllelePair[] = [];
    const hetMap = new Map<string, AllelePair[]>();
    allelePairs.forEach((allelePair) => {
      const locus =
        allelePair.top.gene?.sysName ?? allelePair.top.variation?.name ?? '';
      hetMap.get(locus)?.push(allelePair) ?? hetMap.set(locus, [allelePair]);
    });
    hetMap.forEach((allelePairs, locus) => {
      if (allelePairs.length > 2)
        throw new Error(
          `Cannot have more than two heterozygous alleles on one gene or variation: ${locus}`
        );
      else if (allelePairs.length === 2) {
        hetPairs.push(allelePairs[0].merge(allelePairs[1]));
      } else hetPairs.push(allelePairs[0]);
    });

    return new Strain({
      name: record.name,
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
        insertDbStrainAllele({
          strainName: this.name ?? '',
          alleleName: pair.top.name,
          isOnTop: true,
          isOnBot: true,
        }).catch(console.error);
      } else {
        if (!pair.top.isWild()) {
          insertDbStrainAllele({
            strainName: this.name ?? '',
            alleleName: pair.top.name,
            isOnTop: true,
            isOnBot: false,
          }).catch(console.error);
        }
        if (!pair.bot.isWild()) {
          insertDbStrainAllele({
            strainName: this.name ?? '',
            alleleName: pair.bot.name,
            isOnTop: false,
            isOnBot: true,
          }).catch(console.error);
        }
      }
    });
  }

  public toMale(): Strain {
    const male = this.clone();
    male.sex = Sex.Male;
    return male;
  }

  public toHerm(): Strain {
    const herm = this.clone();
    herm.sex = Sex.Hermaphrodite;
    return herm;
  }

  /* "Regular" alleles are homozygous, X chrom in males, or extrachromosomal array */
  public getRegularAlleles(sex: Sex): Allele[] {
    return [
      ...this.getHomoAlleles(),
      ...this.getEcaAlleles(),
      ...this.getHetAlleles().filter(
        (hetAllele) => hetAllele.isX() && sex === Sex.Male
      ),
    ];
  }

  /* "Iregular" alleles heterozygous (not just in our representation, but in biological reality) */
  public getIrregularAlleles(sex: Sex): Allele[] {
    return [
      ...this.getHetAlleles().filter(
        (hetAllele) => !hetAllele.isX() || sex === Sex.Hermaphrodite
      ),
    ];
  }

  public getHomoAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => !allelePair.isEca() && allelePair.isHomo())
      .map((allelePair) => allelePair.top);
  }

  public getHetAlleles(): Allele[] {
    return this.getAllelePairs()
      .filter((allelePair) => !allelePair.isEca() && !allelePair.isHomo())
      .map((allelePair) => [allelePair.top, allelePair.bot])
      .flat()
      .filter((allele) => !allele.isWild());
  }

  public getEcaAlleles(): Allele[] {
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
    return new Strain({
      name: this.name,
      description: this.description,
      genotype: this.genotype,
      sex: this.sex,
      chromPairMap: new Map(this.chromPairMap),
    });
  }

  /**
   * Crosses this strain with itself
   * @returns Permuted list of all possible strains and their respective probabilities
   */
  public async selfCross(): Promise<Strain[]> {
    return await this.crossWith(this);
  }

  /**
   * Crosses this strain with {other}
   * @param other strain to cross against
   * @returns Permuted list of all possible strains and their respective probabilities
   */
  public async crossWith(other: Strain): Promise<Strain[]> {
    this.fillWildsFrom(other);
    other.fillWildsFrom(this);

    const gametes1 = this.meiosis();
    const gametes2 = other.meiosis();
    return await Strain.fertilize(gametes1, gametes2);
  }

  public getAllelePairs(): AllelePair[] {
    return [...this.chromPairMap.values()]
      .map((pair) => pair.allelePairs)
      .flat();
  }

  public static async fertilize(
    gametes1: Gamete[],
    gametes2: Gamete[] = gametes1
  ): Promise<Strain[]> {
    const strains = await Promise.all(
      gametes1.flatMap((gamete1) =>
        gametes2.map(async (gamete2) => {
          const chromPairs = gamete1.chromosomes.map((chrom, idx) =>
            ChromosomePair.buildFromChroms(chrom, gamete2.chromosomes[idx])
          );
          const strain = await Strain.buildFromChromPairs(chromPairs);
          strain.probability = gamete1.prob * gamete2.prob;
          strain.isChild = true;
          return strain;
        })
      )
    );
    Strain.reduceStrains(strains);
    Strain.normalizeEcaOptions(strains);
    strains.sort((a, b) => (b?.probability ?? 0) - (a?.probability ?? 0));
    return strains;
  }

  /**
   * Strain options differing only by extrachromosomal array contents should have same probability
   * (for simplicity, not necessarily biologically accurate)
   */
  private static normalizeEcaOptions(strains: Strain[]): void {
    // Partition options according to non-ECA equality
    const partition = new Map<string, Strain[]>();
    strains.forEach((strain) => {
      const genotype = strain.toString({
        simplify: false,
        excludeEca: true,
      });
      partition.has(genotype)
        ? partition.get(genotype)?.push(strain)
        : partition.set(genotype, [strain]);
    });

    // Normalize each set
    [...partition.values()].forEach((optionSet) => {
      const totalProb = optionSet.reduce<number>(
        (totalProb, currOpt) => totalProb + (currOpt.probability ?? 0),
        0
      );
      optionSet.forEach(
        (option) => (option.probability = totalProb / optionSet.length)
      );
    });
  }

  /** Produce all distinct "gametes", meaning top-heterozygous strains representing eggs/sperm */
  public meiosis(): Gamete[] {
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
    return [
      ...new Set(
        this.getAlleleExpressions().map((expr) => expr.expressingPhenotype)
      ),
    ];
  }

  public getReqConditions(): Condition[] {
    return [
      ...new Set(
        this.getAlleleExpressions().flatMap((expr) => expr.requiredConditions)
      ),
    ];
  }

  public getSupConditions(): Condition[] {
    return [
      ...new Set(
        this.getAlleleExpressions().flatMap(
          (expr) => expr.suppressingConditions
        )
      ),
    ];
  }

  public getMaturationDays(): number {
    const maturationDays = [...this.getExprPhenotypes()].flatMap(
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
    const chromName = allelePair.top.getChromName();
    let chromPair = this.chromPairMap.get(chromName);
    if (chromPair === undefined) {
      chromPair = new ChromosomePair([]);
      this.chromPairMap.set(chromName, chromPair);
    }

    // Prevent homozygous X alleles for males (only one X chromosome)
    if (
      this.sex === Sex.Male &&
      chromPair.isX() &&
      !allelePair.top.isWild() &&
      allelePair.isWildHet()
    ) {
      throw new Error(
        `Cannot add allele pair ${allelePair} because it is on the X chromosome, and males have only one X chromosome`
      );
    }

    // Prevent duplicated genes
    if (chromPair.containsSameGeneOrVariationAs(allelePair)) {
      throw new Error(
        `Cannot add allele pair ${allelePair} because it conflicts with of the same gene or variation.`
      );
    }

    chromPair.insertPair(allelePair);
  }

  /**
   * Combines probabilities of duplicate Strains such that the resulting list has unique strains
   */
  private static reduceStrains(strains: Strain[]): void {
    // Check each strain against every other strain
    for (let i = 0; i < strains.length; i++) {
      const currStrain = strains[i];

      // Check for duplicates and combine probabilities
      for (let j = i + 1; j < strains.length; ) {
        const strain = strains[j];
        const duplicate = currStrain.equals(strain);

        if (duplicate) {
          currStrain.probability =
            (currStrain.probability ?? 0) + strain.probability;
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
    return {
      name: this.name ?? '',
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
