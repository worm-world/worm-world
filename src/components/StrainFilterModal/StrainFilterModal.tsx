import StrainCard from 'components/StrainCard/StrainCard';
import { type Node } from 'reactflow';
import {
  type IStrainFilter,
  StrainFilter,
  type StrainFilterUpdate,
} from 'models/frontend/StrainFilter/StrainFilter';
import { useEffect, useState } from 'react';
import { type Strain } from 'models/frontend/Strain/Strain';

export interface StrainFilterModalProps {
  filterId: string;
  childNodes: Array<Node<Strain>>;
  filter: StrainFilter;
  updateFilter: (update: StrainFilterUpdate) => void;
}

export const StrainFilterModal = (
  props: StrainFilterModalProps
): React.JSX.Element => {
  const options = StrainFilter.getFilterOptions(props.childNodes);
  return (
    <>
      <input
        type='checkbox'
        id={`strain-filter-modal-${props.filterId}`}
        className='modal-toggle'
      />
      <label
        htmlFor={`strain-filter-modal-${props.filterId}`}
        className='modal cursor-pointer'
      >
        <label className='modal-box' htmlFor=''>
          <FilterList
            title='Filter by alleles'
            filterId={props.filterId}
            options={options.alleleNames}
            field='alleleNames'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by phenotypes'
            filterId={props.filterId}
            options={options.exprPhenotypes}
            field='exprPhenotypes'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by required conditions'
            filterId={props.filterId}
            options={options.reqConditions}
            field='reqConditions'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by suppressing conditions'
            filterId={props.filterId}
            options={options.supConditions}
            field='supConditions'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <div className='divider' />
          <div className='collapse rounded-box border border-base-300 bg-base-200 shadow-md'>
            <input type='checkbox' defaultChecked={true} />
            <h2 className='collapse-title text-xl'>Filtered Strains</h2>
            <div className='collapse-content'>
              <StrainList {...props} filter={props.filter} />
            </div>
          </div>
        </label>
      </label>
    </>
  );
};

const FilterList = (props: {
  title: string;
  options: Set<string>;
  field: keyof IStrainFilter;
  filterId: string;
  filter: StrainFilter;
  updateFilter: (update: StrainFilterUpdate) => void;
}): React.JSX.Element => {
  if (props.options.size === 0) return <></>;

  const filterOptions = [...props.options].map((name, idx) => {
    return (
      <li key={idx} className={'mb-4 flex items-center'}>
        <input
          type='checkbox'
          checked={props.filter[props.field].has(name)}
          className='checkbox mx-4'
          onClick={() => {
            props.updateFilter({
              field: props.field,
              action:
                props.filter[props.field].has(name) ?? false ? 'remove' : 'add',
              name,
              filterId: props.filterId,
            });
          }}
          readOnly
        />
        <span>{name}</span>
      </li>
    );
  });

  return (
    <div className='collapse collapse-arrow rounded-box mb-2 border border-base-300 bg-base-200 shadow-md'>
      <input type='checkbox' />
      <div className='collapse-title text-xl font-medium'>{props.title}</div>
      <div className='collapse-content'>
        <ul className='form-control ml-8'>
          <li className={'mb-4 flex items-center'}>
            <input
              type='checkbox'
              checked={props.filter[props.field].size === 0}
              className='checkbox mx-4'
              onClick={() => {
                props.updateFilter({
                  field: props.field,
                  action: 'clear',
                  name: '',
                  filterId: props.filterId,
                });
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
  filterId: string;
  updateFilter: (update: StrainFilterUpdate) => void;
  childNodes: Array<Node<Strain>>;
  filter: StrainFilter;
}): React.JSX.Element => {
  const filteredList = props.childNodes.filter((node) =>
    node.data.passesFilter(props.filter)
  );
  const [allSelected, setAllSelected] = useState(true);

  const isVisible = (node: Node<Strain>): boolean => !(node.hidden ?? false);

  const onClickSelectAll = (): void => {
    filteredList.forEach((node) => {
      props.updateFilter({
        field: 'hiddenNodes',
        action: allSelected && !node.data.isParent ? 'add' : 'remove',
        name: node.id,
        filterId: props.filterId,
      });
    });
  };

  useEffect(() => {
    setAllSelected(filteredList.every((node) => isVisible(node)));
  }, [props.childNodes.filter((node) => node.hidden).length]);

  const strainList: React.JSX.Element[] = [];
  strainList.push(
    <li key={`strain-filter-modal-${props.filterId}-all}`}>
      <div className='my-2 ml-8 flex flex-row items-center'>
        <input
          type='checkbox'
          className='checkbox mx-4'
          checked={allSelected}
          onClick={onClickSelectAll}
          key={`strain-filter-modal-${props.filterId}-all-checkbox`}
          readOnly
        />
        Select All
      </div>
    </li>
  );
  filteredList.forEach((node, idx) => {
    const candidateStrain = (
      <li key={idx}>
        <div className='my-2 ml-8 flex flex-row items-center'>
          <input
            type='checkbox'
            checked={isVisible(node)}
            className='checkbox mx-4'
            onClick={() => {
              props.updateFilter({
                field: 'hiddenNodes',
                name: node.id,
                action: node.hidden ?? false ? 'remove' : 'add',
                filterId: props.filterId,
              });
            }}
            key={`strain-filter-modal-${props.filterId}-item-${idx++}-checkbox`}
            readOnly
          />
          <StrainCard strain={node.data} id={''} />
        </div>
      </li>
    );
    strainList.push(candidateStrain);
  });

  return (
    <ul
      className='form-control'
      data-testid={`strain-filter-collapse-outputted-strains`}
    >
      {strainList}
    </ul>
  );
};
