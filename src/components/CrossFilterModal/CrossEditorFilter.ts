import { instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { Dominance } from 'models/enums';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Strain } from 'models/frontend/Strain/Strain';
import { Node } from 'reactflow';

export interface CrossEditorFilterUpdate {
  field: keyof iCrossEditorFilter;
  action: 'add' | 'remove' | 'clear';
  name: string;
  nodeId: string;
}
export interface iCrossEditorFilter {
  alleleNames: Set<string>;
  exprPhenotypes: Set<string>;
  reqConditions: Set<string>;
  supConditions: Set<string>;
}

export class CrossEditorFilter {
  @Transform((data: any) => new Set(data?.obj?.alleleNames))
  public alleleNames: Set<string> = new Set();

  @Transform((data: any) => new Set(data?.obj?.exprPhenotypes))
  public exprPhenotypes: Set<string> = new Set();

  @Transform((data: any) => new Set(data?.obj?.reqConditions))
  public reqConditions: Set<string> = new Set();

  @Transform((data: any) => new Set(data?.obj?.supConditions))
  public supConditions: Set<string> = new Set();

  constructor(props: iCrossEditorFilter) {
    Object.assign(this, props);
  }

  public clone(): CrossEditorFilter {
    return new CrossEditorFilter({
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
  public static extractCrossFilterNames(strain: Strain): iCrossEditorFilter {
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
  public static condenseCrossFilterNames(
    strains: Strain[]
  ): iCrossEditorFilter {
    let alleleNames = new Set<string>();
    let exprPhenotypes = new Set<string>();
    let reqConditions = new Set<string>();
    let supConditions = new Set<string>();
    strains.forEach((strain) => {
      const names = this.extractCrossFilterNames(strain);
      alleleNames = new Set([...alleleNames, ...names.alleleNames]);
      exprPhenotypes = new Set([...exprPhenotypes, ...names.exprPhenotypes]);
      reqConditions = new Set([...reqConditions, ...names.reqConditions]);
      supConditions = new Set([...supConditions, ...names.supConditions]);
    });

    return { alleleNames, exprPhenotypes, reqConditions, supConditions };
  }

  /** Checks if a node can be displayed given current filter values */
  public static includedInFilter(
    node: Node<CrossNodeModel>,
    filter?: CrossEditorFilter
  ): boolean {
    if (filter === undefined) return true;
    const strain = node.data.strain;

    const alleles = strain.getAlleles();
    const alleleNames = new Set(alleles.map((a) => a.name));
    const reqConds = new Set(strain.getReqConditions().map((c) => c.name));
    const supConds = new Set(strain.getSupConditions().map((c) => c.name));

    const namesToFilter: Array<{
      key: keyof iCrossEditorFilter;
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
      strain.getAllelePairs().map((pair) => [pair.getAllele().name, pair])
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

  static fromJSON(json: string): CrossEditorFilter {
    return [plainToInstance(CrossEditorFilter, JSON.parse(json))].flat()[0];
  }
}
