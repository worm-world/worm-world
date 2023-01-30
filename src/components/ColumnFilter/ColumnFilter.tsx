import { BiX as CloseIcon, BiPlus as PlusIcon } from 'react-icons/bi';
import { ChangeEvent, HTMLInputTypeAttribute, useState } from 'react';
import { Filter } from 'models/db/filter/Filter';
import {
  FilterType,
  getFilterType,
  FormValueType,
  createNewFilter,
  filterValuesLengthForFilterType,
  getValuesForFilterType,
} from 'models/db/filter/FilterGroup';

type FieldType = 'text' | 'number' | 'boolean' | 'select';

export interface Field<T> {
  name: keyof T;
  title: string;
  type: FieldType;
  selectOptions?: string[];
}

/**
 * fieldTypeToFilterTypes maps a field type to the filter types that can be applied to that field type.
 * This is used to determine which filter types are available for a given column.
 */
const fieldTypeToFilterTypes: {
  [key in FieldType]: FilterType[];
} = {
  text: ['Equal', 'NotEqual', 'Null', 'NotNull', 'Like'],
  number: [
    'Equal',
    'NotEqual',
    'Null',
    'NotNull',
    'Range',
    'GreaterThan',
    'LessThan',
  ],
  boolean: ['True', 'False', 'Null', 'NotNull'],
  select: ['Equal', 'NotEqual', 'Null', 'NotNull'],
};

interface iFilterTextInputProps {
  setFilterValues: (filterValues: FormValueType[]) => void;
  filterValues: FormValueType[];
  type: HTMLInputTypeAttribute;
  className?: string;
  label?: string;
  placeholder?: string;
  index: number;
}

/**
 * FilterTextInput is a generic input component that can be used for text-input filter types.
 * It calls a parent component's stateful function to update the filter value at the given index.
 */
const FilterTextInput = (props: iFilterTextInputProps): JSX.Element => {
  return (
    <>
      {props.label !== undefined && (
        <label className='label'>{props.label}</label>
      )}
      <input
        className='input-bordered input'
        type={props.type}
        placeholder={props.placeholder}
        value={props.filterValues[props.index].toString()}
        onChange={(e) => {
          // copy filter values and update the value at the index,
          const newFilterValues = [...props.filterValues];
          newFilterValues[props.index] = e.target.value;
          // then update it in the stateful parent component
          props.setFilterValues(newFilterValues);
        }}
      />
    </>
  );
};

interface iFilterInputProps<T> {
  filter: Filter;
  filterValues: FormValueType[];
  setFilterValues: (filterValues: FormValueType[]) => void;
  field: Field<T> | undefined;
}

/**
 * FilterInput is a generic component that renders the correct input component for a given filter type.
 * Most filter types are rendered by FilterTextInput, but Range and Boolean filters are rendered by their own components.
 */
const FilterInput = <T,>(props: iFilterInputProps<T>): JSX.Element => {
  const filterType = getFilterType(props.filter);
  switch (filterType) {
    case 'Range': {
      return (
        <div className='form-control ml-5 flex flex-col'>
          <FilterTextInput
            setFilterValues={props.setFilterValues}
            filterValues={props.filterValues}
            index={0}
            type='number'
            label='Lower'
          />
          <FilterTextInput
            setFilterValues={props.setFilterValues}
            filterValues={props.filterValues}
            index={1}
            type='number'
            label='Upper'
          />
        </div>
      );
    }
    case 'GreaterThan':
    case 'LessThan':
      return (
        <FilterTextInput
          setFilterValues={props.setFilterValues}
          filterValues={props.filterValues}
          index={0}
          type='number'
        />
      );

    case 'NotEqual':
    case 'Like':
    case 'Equal':
      return props.field?.type === 'select' ? (
        // if select, render a select input
        <div className='form-control flex flex-col'>
          <select
            className='input-bordered input select'
            onChange={(e) => {
              const newFilterValues = [...props.filterValues];
              newFilterValues[0] = e.target.value;
              props.setFilterValues(newFilterValues);
            }}
            value={props.filterValues[0].toString()}
          >
            {props.field?.selectOptions?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : (
        // otherwise render a text input
        <FilterTextInput
          setFilterValues={props.setFilterValues}
          filterValues={props.filterValues}
          index={0}
          type='text'
        />
      );
  }
  return <div></div>;
};

export interface iColumnFilterProps<T> {
  className?: string;
  field: Field<T>;
  columnFilters: Filter[];
  setColumnFilters: (filters: Filter[]) => void;
}

/**
 * ColumnFilter is a component that displays all the filters for a single column.
 *
 * It renders a list of filters (the filter type selector and corresponding data inputs), and a button to add a new filter.
 * The field prop is optional because the parent component may pass in a null field if no column is currently being filtered.
 */
export const ColumnFilter = <T,>(props: iColumnFilterProps<T>): JSX.Element => {
  const addFilter = (): void => {
    if (props.field === undefined) {
      return;
    }
    // get the first filter type for the field type and create a new filter with that type
    const firstFilterType = fieldTypeToFilterTypes[props.field.type][0];
    const filterValuesLen = filterValuesLengthForFilterType[firstFilterType];
    props.setColumnFilters([
      ...props.columnFilters,
      createNewFilter(
        firstFilterType,
        Array<FormValueType>(filterValuesLen).fill('')
      ),
    ]);
  };
  return (
    <>
      {props.field !== undefined ? (
        <div className='mb-4 p-3'>
          <div className='mb-4 flex w-full justify-between text-3xl'>
            {props.field.title}
          </div>
          {props.columnFilters.map((filterType, i) => (
            <FilterEntry
              key={i}
              index={i}
              filter={filterType}
              field={props.field}
              setFilter={(filterType) => {
                const newFilters = [...props.columnFilters];
                if (filterType === null) {
                  newFilters.splice(i, 1);
                } else {
                  newFilters[i] = filterType;
                }
                props.setColumnFilters(newFilters);
              }}
            />
          ))}
          <button
            title='add-filter'
            className='flex w-full justify-center pt-4 text-2xl'
            onClick={addFilter}
          >
            <PlusIcon />
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

interface iFilterEntryProps<T> {
  index: number;
  filter: Filter;
  field: Field<T>;
  setFilter: (filter: Filter | null) => void;
}

/**
 * FilterEntry is a component that renders a single filter entry, which consists of a filter type selector and the corresponding filter value inputs (if any).
 * For example, a filter entry for 'Equal' would render a single text box or select input depending on the field.
 * A filter entry for 'True' would render only render the filter type selector and no filter value inputs.
 *
 * The filter is set by calling the setFilter callback in a stateful parent component.
 * It also renders a button to remove the filter.
 */
const FilterEntry = <T,>(props: iFilterEntryProps<T>): JSX.Element => {
  const [filterValues, setLocalFilterValues] = useState<FormValueType[]>(
    getValuesForFilterType(props.filter)
  );
  const setFilterValues = (
    filterType: Filter,
    values: FormValueType[]
  ): void => {
    const name = getFilterType(filterType);
    const newFilterType = createNewFilter(name, values);
    setLocalFilterValues(values);
    props.setFilter(newFilterType);
  };
  const changeFilterType = (e: ChangeEvent<HTMLSelectElement>): void => {
    const valueLen =
      filterValuesLengthForFilterType[e.target.value as FilterType];
    const newFilterValues = [];
    while (newFilterValues.length < valueLen) {
      newFilterValues.push('');
    }
    const newFilterType = createNewFilter(
      e.target.value as FilterType,
      newFilterValues
    );
    setLocalFilterValues(newFilterValues);
    props.setFilter(newFilterType);
  };
  return (
    <div className='my-1 flex flex-row' key={props.index}>
      <div className='input-group w-full'>
        <select
          className='select bg-accent text-accent-content'
          onChange={changeFilterType}
          value={getFilterType(props.filter)}
        >
          {fieldTypeToFilterTypes[props.field.type].map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>
        <FilterInput
          filter={props.filter}
          field={props.field}
          filterValues={filterValues}
          setFilterValues={(filterValues) => {
            setFilterValues(props.filter, filterValues);
          }}
        />
      </div>
      <button
        title='delete-filter'
        className='pt-4 pl-2 text-xl'
        onClick={() => {
          props.setFilter(null);
        }}
      >
        <CloseIcon />
      </button>
    </div>
  );
};

interface iFilterModalBoxProps<T> {
  field: Field<T> | undefined;
  columnFilters: Filter[];
  setColumnFilters: (filters: Filter[]) => void;
}

/**
 * The ColumnFilterModalBox is a modal box wrapper around ColumnFilter that is rendered when a column filter is focused.
 * This is done by passing in a non-undefined field value.
 * Otherwise, the modal box is not rendered.
 */
export const ColumnFilterModalBox = <T,>(
  props: iFilterModalBoxProps<T>
): JSX.Element => {
  return (
    <>
      {props.field !== undefined && (
        <div className='modal-box bg-base-200' title='filter-modal-box'>
          <ColumnFilter
            field={props.field}
            columnFilters={props.columnFilters}
            setColumnFilters={props.setColumnFilters}
          />
        </div>
      )}
    </>
  );
};
