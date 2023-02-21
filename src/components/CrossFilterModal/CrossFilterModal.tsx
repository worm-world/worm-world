import CrossNode from 'components/CrossNode/CrossNode';
import { CrossNodeModel } from 'models/frontend/CrossNode/CrossNode';
import { Node } from 'reactflow';
import { Strain } from 'models/frontend/Strain/Strain';
import { Dominance } from 'models/enums';

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
  public alleleNames: Set<string> = new Set();
  public exprPhenotypes: Set<string> = new Set();
  public reqConditions: Set<string> = new Set();
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
  public static includedInFilter = (
    node: Node<CrossNodeModel>,
    filter?: CrossEditorFilter
  ): boolean => {
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
  };
}

export interface CrossFilterProps {
  childNodes: Array<Node<CrossNodeModel>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;

  filters: Map<string, CrossEditorFilter>;
  updateFilter: (update: CrossEditorFilterUpdate) => void;
}
export const CrossFilterModal = (props: CrossFilterProps): JSX.Element => {
  const strains = props.childNodes.map((node) => node.data.strain);
  const names = CrossEditorFilter.condenseCrossFilterNames(strains);
  if (props.childNodes.length === 0) return <></>;
  const nodeId = props.childNodes[0].parentNode ?? '';
  const filter = props.filters.get(nodeId);
  return (
    <>
      <input type='checkbox' id='cross-filter-modal' className='modal-toggle' />
      <label htmlFor='cross-filter-modal' className='modal cursor-pointer'>
        <label className='modal-box bg-base-300' htmlFor=''>
          <FilterList
            title='Filter by alleles'
            nodeId={nodeId}
            names={names.alleleNames}
            field='alleleNames'
            filter={filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by phenotypes'
            nodeId={nodeId}
            names={names.exprPhenotypes}
            field='exprPhenotypes'
            filter={filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by required conditions'
            nodeId={nodeId}
            names={names.reqConditions}
            field='reqConditions'
            filter={filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by suppressing conditions'
            nodeId={nodeId}
            names={names.supConditions}
            field='supConditions'
            filter={filter}
            updateFilter={props.updateFilter}
          />
          <div className='divider' />
          <div className='collapse-arrow rounded-box collapse border border-base-300 bg-base-200 shadow-md'>
            <input type='checkbox' defaultChecked={true} />
            <div className='collapse-title text-xl font-medium'>
              Outputted strains
            </div>
            <div className='collapse-content'>
              <h3 className='text-2xl font-bold'></h3>
              <StrainList {...props} filter={filter} />
            </div>
          </div>
        </label>
      </label>
    </>
  );
};

const FilterList = (props: {
  title: string;
  names: Set<string>;
  field: keyof iCrossEditorFilter;
  nodeId: string;
  filter?: CrossEditorFilter;
  updateFilter: (update: CrossEditorFilterUpdate) => void;
}): JSX.Element => {
  if (props.names.size === 0) return <></>;

  const noFilter =
    props.filter === undefined || props.filter[props.field].size === 0;
  const noFilterUpdate: CrossEditorFilterUpdate = {
    field: props.field,
    action: 'clear',
    name: '',
    nodeId: props.nodeId,
  };

  const listClassName = 'mb-4 flex items-center';
  const filterOptions = [...props.names].map((name, idx) => {
    const listKey = `cross-filter-modal-${props.field}-${idx}`;
    const checkKey = `cross-filter-modal-phenotype-${idx++}-checkbox`;
    const checked = props.filter?.has(name);
    const update: CrossEditorFilterUpdate = {
      field: props.field,
      action: checked === true ? 'remove' : 'add',
      name,
      nodeId: props.nodeId,
    };
    return (
      <li key={listKey} className={listClassName}>
        <input
          type='checkbox'
          checked={checked}
          className='checkbox mx-4'
          onClick={() => props.updateFilter(update)}
          key={checkKey}
          readOnly
        />
        <span>{name}</span>
      </li>
    );
  });

  return (
    <div className='collapse-arrow rounded-box collapse mb-2 border border-base-300 bg-base-200 shadow-md'>
      <input type='checkbox' />
      <div className='collapse-title text-xl font-medium'>{props.title}</div>
      <div className='collapse-content'>
        <ul
          className='form-control ml-8'
          data-testid={`cross-filter-collapse-${props.field}`}
        >
          <li className={listClassName}>
            <input
              type='checkbox'
              checked={noFilter}
              className='checkbox mx-4'
              onClick={() => {
                if (!noFilter) props.updateFilter(noFilterUpdate);
              }}
              readOnly
            />
            <span>No filters</span>
          </li>
          {filterOptions}
        </ul>
      </div>
    </div>
  );
};

const StrainList = (props: {
  childNodes: Array<Node<CrossNodeModel>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;
  filter?: CrossEditorFilter;
}): JSX.Element => {
  const childNodes = props.childNodes !== undefined ? props.childNodes : [];
  const strainList: JSX.Element[] = [];

  let idx = 0;
  for (const strain of childNodes) {
    if (!CrossEditorFilter.includedInFilter(strain, props.filter)) continue;

    const key = `cross-filter-modal-item-${idx}`;
    const candidateNode = (
      <li key={key}>
        <div className='my-2 ml-8 flex flex-row items-center'>
          <input
            type='checkbox'
            checked={!props.invisibleSet.has(strain.id)}
            className='checkbox mx-4'
            onClick={() => props.toggleVisible(strain.id)}
            key={`cross-filter-modal-item-${idx++}-checkbox`}
            readOnly
          />
          <CrossNode model={strain.data} />
        </div>
      </li>
    );
    strainList.push(candidateNode);
  }

  return (
    <ul
      className='form-control'
      data-testid={`cross-filter-collapse-outputted-strains`}
    >
      {strainList}
    </ul>
  );
};
