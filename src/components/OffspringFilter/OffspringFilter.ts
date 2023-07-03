import { instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { Dominance } from 'models/enums';
import { type StrainNodeModel } from 'models/frontend/StrainNodeModel/StrainNodeModel';
import { type Strain } from 'models/frontend/Strain/Strain';
import { type Node } from 'reactflow';

export interface OffspringFilterUpdate {
  field: keyof OffspringFilterProps;
  action: 'add' | 'remove' | 'clear';
  name: string;
  nodeId: string;
}
export interface OffspringFilterProps {
  alleleNames: Set<string>;
  exprPhenotypes: Set<string>;
  reqConditions: Set<string>;
  supConditions: Set<string>;
}

export class OffspringFilter {
  @Transform((data: any) => new Set(data?.obj?.alleleNames))
  public alleleNames = new Set<string>();

  @Transform((data: any) => new Set(data?.obj?.exprPhenotypes))
  public exprPhenotypes = new Set<string>();

  @Transform((data: any) => new Set(data?.obj?.reqConditions))
  public reqConditions = new Set<string>();

  @Transform((data: any) => new Set(data?.obj?.supConditions))
  public supConditions = new Set<string>();

  constructor(props: OffspringFilterProps) {
    Object.assign(this, props);
  }

  public clone(): OffspringFilter {
    return new OffspringFilter({
      alleleNames: new Set(this.alleleNames),
      exprPhenotypes: new Set(this.exprPhenotypes),
      reqConditions: new Set(this.reqConditions),
      supConditions: new Set(this.supConditions),
    });
  }

  /** checks if ANY of the sets contains the value */
  public has(value: string): boolean {
    return (
      this.alleleNames.has(value) ||
      this.exprPhenotypes.has(value) ||
      this.reqConditions.has(value) ||
      this.supConditions.has(value)
    );
  }

  public isEmpty(): boolean {
    return (
      this.alleleNames.size === 0 &&
      this.exprPhenotypes.size === 0 &&
      this.reqConditions.size === 0 &&
      this.supConditions.size === 0
    );
  }

  /** Given a strain, extracts all information that a cross filter might use */
  public static extractOffspringFilterNames(
    strain: Strain
  ): OffspringFilterProps {
    return {
      alleleNames: new Set(strain.getAlleles().map((allele) => allele.name)),
      exprPhenotypes: new Set(
        strain.getExprPhenotypes().map((phen) => phen.getUniqueName())
      ),
      reqConditions: new Set(
        strain.getReqConditions().map((cond) => cond.name)
      ),
      supConditions: new Set(
        strain.getSupConditions().map((cond) => cond.name)
      ),
    };
  }

  /** Combines the possible names from multiple strains into a cross filter sets */
  public static condenseOffspringFilterNames(
    strains: Strain[]
  ): OffspringFilterProps {
    let alleleNames = new Set<string>();
    let exprPhenotypes = new Set<string>();
    let reqConditions = new Set<string>();
    let supConditions = new Set<string>();
    strains.forEach((strain) => {
      const names = this.extractOffspringFilterNames(strain);
      alleleNames = new Set([...alleleNames, ...names.alleleNames]);
      exprPhenotypes = new Set([...exprPhenotypes, ...names.exprPhenotypes]);
      reqConditions = new Set([...reqConditions, ...names.reqConditions]);
      supConditions = new Set([...supConditions, ...names.supConditions]);
    });

    return { alleleNames, exprPhenotypes, reqConditions, supConditions };
  }

  /** Checks if a node can be displayed given current filter values */
  public static includedInFilter(
    node: Node<StrainNodeModel>,
    filter?: OffspringFilter
  ): boolean {
    if (filter === undefined) return true;
    const strain = node.data.strain;

    const alleles = strain.getAlleles();
    const alleleNames = new Set(alleles.map((a) => a.name));
    const reqConds = new Set(strain.getReqConditions().map((c) => c.name));
    const supConds = new Set(strain.getSupConditions().map((c) => c.name));

    const namesToFilter: Array<{
      key: keyof OffspringFilterProps;
      names: Set<string>;
    }> = [
      { key: 'alleleNames', names: alleleNames },
      { key: 'reqConditions', names: reqConds },
      { key: 'supConditions', names: supConds },
    ];

    let hasAllFilterValues = true;
    namesToFilter.forEach(({ key, names }) => {
      if (!hasAllFilterValues) return;
      if (filter[key].size > 0) {
        filter[key].forEach((filterName) => {
          if (!names.has(filterName)) hasAllFilterValues = false;
        });
      }
    });

    const phenotypes = new Map(
      strain
        .getAlleleExpressions()
        .map((expr) => [expr.expressingPhenotype.getUniqueName(), expr])
    );
    const pairs = new Map(
      strain.getAllelePairs().map((pair) => [pair.top.name, pair])
    );
    filter.exprPhenotypes.forEach((phenName: string) => {
      const phenotype = phenotypes.get(phenName);
      const pair = pairs.get(phenotype?.alleleName ?? '');
      if (phenotype === undefined || pair === undefined) {
        hasAllFilterValues = false;
        return;
      }
      // Verify strain has correct number of alleles to exhibit phenotype
      if (
        phenotype.dominance === undefined ||
        (phenotype.dominance === Dominance.Recessive && !pair.isHomo()) ||
        (phenotype.dominance === Dominance.SemiDominant && pair.isHomo())
      )
        hasAllFilterValues = false;
    });

    return hasAllFilterValues;
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): OffspringFilter {
    return plainToInstance(
      OffspringFilter,
      JSON.parse(json) as Record<string, unknown>
    );
  }
}
