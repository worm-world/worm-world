import { BiX as CloseIcon, BiPlus } from 'react-icons/bi';
import { useState } from 'react';
import { filterTypeNames as allFilterTypeNames, FilterTypeName } from 'models/db/filter/FilterType';


type FieldType = 'text' | 'number' | 'boolean' | 'select';


export interface Field<T> {
  name: keyof T;
  title: string;
  type: FieldType;
  selectOptions?: string[];
}

export interface iColumnFilterProps<T> {
  className?: string;
  fields: Array<Field<T>>;
  setFilter: (filter: string) => void;
}

const fieldTypeToFilterType: {
  [key in FieldType]: FilterTypeName[]
} = {
  text: ['Equal', 'NotEqual', 'Null', 'NotNull', 'Like'],
  number: ['Equal', 'NotEqual', 'Null', 'NotNull', 'Range', 'GreaterThan', 'LessThan'],
  boolean: ['Equal', 'NotEqual', 'Null', 'NotNull', 'True', 'False'],
  select: ['Equal', 'NotEqual', 'Null', 'NotNull'],
};

const NonselectFormControl = (filterName: FilterTypeName): JSX.Element => {
  switch (filterName) {
    case 'Range': {
      return <div className='flex flex-col form-control ml-5'>
        <label className='label'>Lower</label>
        <input className="input input-bordered" type="number" placeholder='0' />
        <label className='label'>Upper</label>
        <input className="input input-bordered" type="number" placeholder='0' />
      </div>;
    }
    case 'GreaterThan':
    case 'LessThan': return <input className="input input-bordered" type="number" placeholder='0' />
    case 'NotEqual':
    case 'Like':
    case 'Equal': return <input className="input input-bordered" type="text" />
  }
  return <div></div>;
};

const SelectFormControl = <T,>(filterName: FilterTypeName, filterField: Field<T>): JSX.Element => {
  switch (filterName) {
    case 'Equal':
    case 'NotEqual': {
      return <div className='flex flex-col form-control'>
        <select className='select input input-bordered'>
          {filterField.selectOptions?.map((option, i) => <option key={i} value={option}>{option}</option>)}
        </select>
      </div>
    }
  }
  return <div></div>;
};

const ColumnFilter = <T,>(props: iColumnFilterProps<T>): JSX.Element => {

  const [filterField, setFilterField] = useState<Field<T>>(props.fields[0]);
  const [filterTypeNames, setFilterTypeNames] = useState<FilterTypeName[]>(['Equal']);

  return <div className='card rounded-box shadow bg-base-200 p-3 mb-4'>
    <div className='w-full flex justify-between mb-2'>
      <select className='select bg-primary text-primary-content text-xl mb-4' onChange={(event) => {
        const field = props.fields.find((field) => field.name.toString() == event.target.value)!;
        setFilterTypeNames(
          filterTypeNames.filter((name) => {
            return fieldTypeToFilterType[field.type].includes(name);
          })
        );
        props.setFilter(field.name.toString());
        setFilterField(field);
      }}>
        {props.fields.map((field, i) => <option key={i} value={field.name.toString()}>{field.title}</option>)}
      </select>
      <CloseIcon className="text-2xl" onClick={props.removeFilterCase} />
    </div>

    {filterTypeNames.map((filterName, i) =>
      <div key={i} className='flex flex-row my-1'>
        <div className={'input-group w-full' + (filterName === 'Range' ? " input-group-vertical" : "")}>
          <select className='select bg-accent text-accent-content' value={filterTypeNames[i]} onChange={(event) => {
            // copy list but replace element at i with event.target.value
            let newFilterTypeNames = [...filterTypeNames];
            newFilterTypeNames[i] = event.target.value as FilterTypeName;
            setFilterTypeNames(newFilterTypeNames);
          }}>
            {allFilterTypeNames
              .filter((name) => {
                return fieldTypeToFilterType[filterField.type].includes(name);
              })
              .map((name, j) => <option key={j} value={name}>{name}</option>)}
          </select>

          {filterField.type != 'select' ? NonselectFormControl(filterName) : SelectFormControl(filterName, filterField)}
        </div>
        <div className='pt-4 pl-2' onClick={() => {
          setFilterTypeNames(filterTypeNames.filter((_, j) => j !== i));
        }}><CloseIcon /></div>
      </div>
    )}
    <div className='w-full flex justify-center' onClick={() => {
      setFilterTypeNames([...filterTypeNames, 'Equal']);
    }}><BiPlus /></div>
  </div >;
}

export interface iDataFilterFormProps<T> {
  className?: string;
  fields: Array<Field<T>>;
  onSubmitCallback: (arg0: T, successCallback: () => void) => void;
}

export const DataFilterForm = <T,>(props: iDataFilterFormProps<T>): JSX.Element => {
  const [filters, setFilters] = useState<string[]>([]);
  const addFilter = () => {
    const remainingFields = props.fields.filter((field) => {
      console.log(field.name);
      console.log(filters);
      return filters.filter((f) => field.name == f).length > 0
    });
    console.log(remainingFields);
    const nextField = (remainingFields.length > 0 ? remainingFields[0].name.toString() : '');
    setFilters([...filters, nextField]);
  };
  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };
  const setFilter = (index: number, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = value;
    setFilters(newFilters);
  };
  return (
    <div>
      {filters.map((filter, index) => (
        <div key={index}>
          <ColumnFilter fields={props.fields} removeFilterCase={() => removeFilter(index)} setFilter={
            (filter) => {setFilter(index, filter)}
          } />
        </div>
      ))}
      <div className='w-full flex justify-between pt-4'>
        <button onClick={addFilter}><BiPlus className='text-xl' /></button>
        <button className='btn btn-secondary text-secondary-content text-xl'><span className='px-2'>Filter</span></button>
        <div></div>
      </div>
    </div>
  );
};