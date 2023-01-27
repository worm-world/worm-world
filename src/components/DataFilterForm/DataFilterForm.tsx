import { BiX as CloseIcon } from 'react-icons/bi';
import { useState } from 'react';
import { filterTypeNames, FilterTypeName } from 'models/db/filter/FilterType';


type FieldType = 'text' | 'number' | 'boolean' | 'select';


export interface Field<T> {
  name: keyof T;
  title: string;
  type: FieldType;
  selectOptions?: string[];
}

export interface iFilterCaseProps<T> {
  className?: string;
  fields: Array<Field<T>>;
}

const fieldTypeToFilterType: {
  [key in FieldType]: FilterTypeName[]
} = {
  "text": ['Equal', 'NotEqual', 'Null', 'NotNull', 'Like'],
  "number": ['Equal', 'NotEqual', 'Null', 'NotNull', 'Range', 'GreaterThan', 'LessThan'],
  boolean: ['Equal', 'NotEqual', 'Null', 'NotNull', 'True', 'False'],
  select: ['Equal', 'NotEqual', 'Null', 'NotNull'],
};

const NonselectFormControl = (filterName: FilterTypeName): JSX.Element => {
  switch (filterName) {
    case 'Range': {
      return <div className='flex flex-col form-control'>
        <label className='label'>Lower</label>
        <input className="input input-bordered" type="number" placeholder='0' />
        <label className='label'>Upper</label>
        <input className="input input-bordered" type="number" placeholder='0' />
      </div>;
    }
    case 'GreaterThan':
    case 'LessThan': {
      return <div className='flex flex-col form-control'>
        <label className='label'>Value</label>
        <input className="input input-bordered" type="number" placeholder='0' />
      </div>
    }
    case 'NotEqual':
    case 'Like':
    case 'Equal': {
      return <div className='flex flex-col form-control'>
        <label className='label'>Value</label>
        <input className="input input-bordered" type="text" />
      </div>
    }
  }
  return <div></div>;
};

const SelectFormControl = <T,>(filterName: FilterTypeName, filterField: Field<T>): JSX.Element => {
  switch (filterName) {
    case 'Equal':
    case 'NotEqual': {
      return <div className='flex flex-col form-control'>
        <label className='label'>Value</label>
        <select className='select input input-bordered'>
          {filterField.selectOptions?.map((option, i) => <option key={i} value={option}>{option}</option>)}
        </select>
      </div>
    }
  }
  return <div></div>;
};

const FilterCase = <T,>(props: iFilterCaseProps<T>): JSX.Element => {


  const [filterField, setFilterField] = useState<Field<T>>(props.fields[0]);
  const [filterTypeName, setFilterTypeName] = useState<FilterTypeName>('Equal');

  return <div className='card rounded-box shadow bg-base-200 p-4'>
    <div className='input-group'>
      <select className='select bg-primary text-primary-content' onChange={(event) => {
        const field = props.fields.find((field) => field.name.toString() == event.target.value)!;
        if (!fieldTypeToFilterType[field.type].includes(filterTypeName)) {
          setFilterTypeName(fieldTypeToFilterType[field.type][0]);
        }
        setFilterField(field);
      }}>
        {props.fields.map((field, i) => <option key={i} value={field.name.toString()}>{field.title}</option>)}
      </select>
      <select className='select font-normal' onChange={(event) => {
        setFilterTypeName(
          event.target.value as FilterTypeName
        );
      }}>
        {filterTypeNames
          .filter((name) => {
            return fieldTypeToFilterType[filterField.type ?? 'text'].includes(name);
          })
          .map((name, i) => <option key={i}>{name}</option>)}
      </select>
    </div>

    {filterField.type != 'select' ? NonselectFormControl(filterTypeName) : SelectFormControl(filterTypeName, filterField)}

  </div >;
}

export interface iDataFilterFormProps<T> {
  className?: string;
  fields: Array<Field<T>>;
  onSubmitCallback: (arg0: T, successCallback: () => void) => void;
}

export const DataFilterForm = <T,>(props: iDataFilterFormProps<T>): JSX.Element => {
  const [filters, setFilters] = useState([{ field: '', value: '' }]);
  const addFilter = () => {
    setFilters([...filters, { field: '', value: '' }]);
  };
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };
  return (
    <div>
      {filters.map((filter, index) => (
        <div key={index}>
          <FilterCase fields={props.fields} />
          <button onClick={() => removeFilter(index)}><CloseIcon /></button>
        </div>
      ))}
      <button onClick={addFilter}>Add</button>
    </div>
  );
};