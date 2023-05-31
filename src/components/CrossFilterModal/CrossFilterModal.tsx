import StrainNode from 'components/StrainNode/StrainNode';
import { type StrainNodeModel } from 'models/frontend/StrainNode/StrainNode';
import { type Node } from 'reactflow';
import {
  CrossEditorFilter,
  type CrossEditorFilterUpdate,
  type iCrossEditorFilter,
} from 'components/CrossFilterModal/CrossEditorFilter';
import React, { useEffect, useState } from 'react';
export interface CrossFilterProps {
  nodeId?: string;
  childNodes: Array<Node<StrainNodeModel>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;

  filter?: CrossEditorFilter;
  updateFilter: (update: CrossEditorFilterUpdate) => void;
}

export const CrossFilterModal = (props: CrossFilterProps): JSX.Element => {
  const strains = props.childNodes.map((node) => node.data.strain);
  const names = CrossEditorFilter.condenseCrossFilterNames(strains);
  if (props.childNodes.length === 0) return <></>;
  const nodeId = props.childNodes[0].parentNode ?? '';

  return (
    <>
      <input
        type='checkbox'
        id={`cross-filter-modal-${props.nodeId}`}
        className='modal-toggle'
      />
      <label
        htmlFor={`cross-filter-modal-${props.nodeId}`}
        className='modal cursor-pointer'
      >
        <label className='modal-box' htmlFor=''>
          <FilterList
            title='Filter by alleles'
            nodeId={nodeId}
            names={names.alleleNames}
            field='alleleNames'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by phenotypes'
            nodeId={nodeId}
            names={names.exprPhenotypes}
            field='exprPhenotypes'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by required conditions'
            nodeId={nodeId}
            names={names.reqConditions}
            field='reqConditions'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <FilterList
            title='Filter by suppressing conditions'
            nodeId={nodeId}
            names={names.supConditions}
            field='supConditions'
            filter={props.filter}
            updateFilter={props.updateFilter}
          />
          <div className='divider' />
          <div className='collapse-arrow rounded-box collapse border border-base-300 bg-base-200 shadow-md'>
            <input type='checkbox' defaultChecked={true} />
            <div className='collapse-title text-xl font-medium'>
              Outputted strains
            </div>
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
    const checkKey = `cross-filter-modal-${
      props.nodeId
    }-phenotype-${idx++}-checkbox`;
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
          onClick={() => {
            props.updateFilter(update);
          }}
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
  nodeId?: string;
  childNodes: Array<Node<StrainNodeModel>>;
  invisibleSet: Set<string>;
  toggleVisible: (nodeId: string) => void;
  filter?: CrossEditorFilter;
}): JSX.Element => {
  const filteredList = props.childNodes.filter((node) =>
    CrossEditorFilter.includedInFilter(node, props.filter)
  );
  const [allSelected, setAllSelected] = useState(true);

  const isVisible = (node: Node<StrainNodeModel>): boolean =>
    !props.invisibleSet.has(node.id);

  useEffect(() => {
    setAllSelected(filteredList.every((node) => isVisible(node)));
  }, [props.invisibleSet]);

  const onClickSelectAll = (): void => {
    filteredList
      .filter((node) => (allSelected ? isVisible(node) : !isVisible(node)))
      .forEach((node) => {
        if (!node.data.isParent) props.toggleVisible(node.id);
      });
  };

  const strainList: JSX.Element[] = [];
  strainList.push(
    <li key={`cross-filter-modal-${props.nodeId}-all}`}>
      <div className='my-2 ml-8 flex flex-row items-center'>
        <input
          type='checkbox'
          className='checkbox mx-4'
          checked={allSelected}
          onClick={onClickSelectAll}
          key={`cross-filter-modal-${props.nodeId}-all-checkbox`}
          readOnly
        />
        Select All
      </div>
    </li>
  );
  filteredList.forEach((strain, idx) => {
    const key = `cross-filter-modal-${props.nodeId}-item-${idx}`;
    const candidateNode = (
      <li key={key}>
        <div className='my-2 ml-8 flex flex-row items-center'>
          <input
            type='checkbox'
            checked={isVisible(strain)}
            className='checkbox mx-4'
            onClick={() => {
              props.toggleVisible(strain.id);
            }}
            key={`cross-filter-modal-${props.nodeId}-item-${idx++}-checkbox`}
            readOnly
          />
          <StrainNode model={strain.data} />
        </div>
      </li>
    );
    strainList.push(candidateNode);
  });

  return (
    <ul
      className='form-control'
      data-testid={`cross-filter-collapse-outputted-strains`}
    >
      {strainList}
    </ul>
  );
};
