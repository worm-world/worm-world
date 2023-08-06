import { instanceToPlain, plainToInstance, Transform } from 'class-transformer';
import { type Strain } from 'models/frontend/Strain/Strain';
import { type Node } from 'reactflow';

export interface StrainFilterUpdate {
  field: keyof IStrainFilter;
  action: 'add' | 'remove' | 'clear';
  name: string;
  filterId: string;
}
export interface IStrainFilter {
  alleleNames: Set<string>;
  exprPhenotypes: Set<string>;
  reqConditions: Set<string>;
  supConditions: Set<string>;
  hidden: Set<string>;
}

export class StrainFilter implements IStrainFilter {
  @Transform((data: any) => new Set(data?.obj?.alleleNames))
  public alleleNames = new Set<string>();

  @Transform((data: any) => new Set(data?.obj?.exprPhenotypes))
  public exprPhenotypes = new Set<string>();

  @Transform((data: any) => new Set(data?.obj?.reqConditions))
  public reqConditions = new Set<string>();

  @Transform((data: any) => new Set(data?.obj?.supConditions))
  public supConditions = new Set<string>();

  @Transform((data: any) => new Set(data?.obj?.hidden))
  public hidden: Set<string> = new Set<string>();

  constructor(props?: IStrainFilter) {
    if (props !== undefined) Object.assign(this, props);
  }

  public clone(): StrainFilter {
    return new StrainFilter({
      alleleNames: new Set(this.alleleNames),
      exprPhenotypes: new Set(this.exprPhenotypes),
      reqConditions: new Set(this.reqConditions),
      supConditions: new Set(this.supConditions),
      hidden: new Set(this.hidden),
    });
  }

  public isEmpty(): boolean {
    return (
      this.alleleNames.size === 0 &&
      this.exprPhenotypes.size === 0 &&
      this.reqConditions.size === 0 &&
      this.supConditions.size === 0 &&
      this.hidden.size === 0
    );
  }

  /** Given a strain, extracts all information that a cross filter might use */
  public static getSingleFilterOptions(
    strainNode: Node<Strain>
  ): IStrainFilter {
    return {
      alleleNames: new Set(
        strainNode.data.getAlleles().map((allele) => allele.getQualifiedName())
      ),
      exprPhenotypes: new Set(
        [...strainNode.data.getExprPhenotypes()].map((phen) =>
          phen.getUniqueName()
        )
      ),
      reqConditions: new Set(
        [...strainNode.data.getReqConditions()].map((cond) => cond.name)
      ),
      supConditions: new Set(
        [...strainNode.data.getSupConditions()].map((cond) => cond.name)
      ),
      hidden: new Set<string>([strainNode.id]),
    };
  }

  /** Combines the possible options from multiple strains into a cross filter options */
  public static getFilterOptions(
    strainNodes: Array<Node<Strain>>
  ): IStrainFilter {
    return strainNodes.reduce<IStrainFilter>(
      (allOptions, strainNode) => {
        const options = this.getSingleFilterOptions(strainNode);
        allOptions.alleleNames = new Set([
          ...allOptions.alleleNames,
          ...options.alleleNames,
        ]);
        allOptions.exprPhenotypes = new Set([
          ...allOptions.exprPhenotypes,
          ...options.exprPhenotypes,
        ]);
        allOptions.reqConditions = new Set([
          ...allOptions.reqConditions,
          ...options.reqConditions,
        ]);
        allOptions.supConditions = new Set([
          ...allOptions.supConditions,
          ...options.supConditions,
        ]);
        allOptions.hidden = new Set([...allOptions.hidden, ...options.hidden]);
        return allOptions;
      },
      {
        alleleNames: new Set(),
        exprPhenotypes: new Set(),
        reqConditions: new Set(),
        supConditions: new Set(),
        hidden: new Set(),
      }
    );
  }

  public update(update: StrainFilterUpdate): void {
    const options = this[update.field];
    if (update.action === 'add') options.add(update.name);
    if (update.action === 'remove') options.delete(update.name);
    if (update.action === 'clear') options.clear();
  }

  public toJSON(): string {
    return JSON.stringify(instanceToPlain(this));
  }

  static fromJSON(json: string): StrainFilter {
    return plainToInstance(
      StrainFilter,
      JSON.parse(json) as Record<string, unknown>
    );
  }
}

export default StrainFilter;
