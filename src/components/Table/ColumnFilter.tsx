import { BiX as CloseIcon, BiPlus } from 'react-icons/bi';
import { HTMLInputTypeAttribute, useState } from 'react';
import {
    filterTypeNames as allFilterTypeNames,
    FilterTypeName,
    FilterType,
    getFilterTypeName, ValueType, createFilterFromNameAndValues, valuesLengthForFilterTypeName, filterTypeNames, getValuesForFilterType
} from 'models/db/filter/FilterType';

type FieldType = 'text' | 'number' | 'boolean' | 'select';

export interface Field<T> {
    name: keyof T;
    title: string;
    type: FieldType;
    selectOptions?: string[];
}

const fieldTypeToFilterType: {
    [key in FieldType]: FilterTypeName[]
} = {
    text: ['Equal', 'NotEqual', 'Null', 'NotNull', 'Like'],
    number: ['Equal', 'NotEqual', 'Null', 'NotNull', 'Range', 'GreaterThan', 'LessThan'],
    boolean: ['Equal', 'NotEqual', 'Null', 'NotNull', 'True', 'False'],
    select: ['Equal', 'NotEqual', 'Null', 'NotNull'],
};


interface iFormControlProps<T> {
    filterType: FilterType;
    values: ValueType[];
    setValues: (values: ValueType[]) => void;
    field: Field<T> | undefined;
}

interface iFilterInputProps {
    setValues: (values: ValueType[]) => void;
    values: ValueType[];
    type: HTMLInputTypeAttribute;
    className?: string;
    label?: string;
    placeholder?: string;
    index: number;
}

const FilterInput = (props: iFilterInputProps): JSX.Element => {
    return <>
        {props.label && <label className='label'>Lower</label>}
        <input className="input input-bordered" type={props.type} placeholder={props.placeholder} value={props.values[props.index].toString()}
        onChange={(e) => {
            const newValues = [...props.values];
            newValues[props.index] = e.target.value;
            props.setValues(newValues);
        }} />
    </>;
}

const FormControl = <T,>(props: iFormControlProps<T>): JSX.Element => {
    const filterTypeName = getFilterTypeName(props.filterType);
    switch (filterTypeName) {
        case 'Range': {
            return <div className='flex flex-col form-control ml-5'>
                <FilterInput setValues={props.setValues} values={props.values} index={0} type='number' label='Lower' />
                <FilterInput setValues={props.setValues} values={props.values} index={1} type='number' label='Upper' />
            </div>;
        }
        case 'GreaterThan':
        case 'LessThan': return <FilterInput setValues={props.setValues} values={props.values} index={0} type='number' />

        case 'NotEqual':
        case 'Like':
        case 'Equal': return props.field?.type === 'select' ? <div className='flex flex-col form-control'>
            <select className='select input input-bordered'>
                {props.field?.selectOptions?.map((option, i) => <option key={i} value={option}>{option}</option>)}
            </select>
        </div>
            : <FilterInput setValues={props.setValues} values={props.values} index={0} type='text' />
    }
    return <div></div>;
};

export interface iColumnFilterProps<T> {
    className?: string;
    field?: Field<T>;
    filterTypes: Array<FilterType>;
    setFilterTypes: (filterTypes: Array<FilterType>) => void;
}

export const ColumnFilter = <T,>(props: iColumnFilterProps<T>): JSX.Element => {
    return <>{props.field !== undefined ?
        <div className='p-3 mb-4'>
            <div className='w-full flex justify-between text-3xl mb-4'>
                {props.field!.title}
            </div>
            {props.filterTypes.map((filterType, i) => {
                if (props.field) {
                    return <FilterEntry key={i} index={i} filterType={filterType} field={props.field} setFilterType={(filterType) => {
                        const newFilterTypes = [...props.filterTypes];
                        if (filterType === null) {
                            newFilterTypes.splice(i, 1);
                        } else {
                            newFilterTypes[i] = filterType;
                        }
                        props.setFilterTypes(newFilterTypes);
                    }} />
                } else {
                    return <></>
                }
            })}
            <div className='w-full flex justify-center pt-4 text-2xl' onClick={() => {
                props.setFilterTypes([...props.filterTypes, 'NotNull']);
            }}><BiPlus /></div>
        </div >
        : <div></div>}
    </>;
}

interface iFilterEntryProps<T> {
    index: number;
    filterType: FilterType;
    field: Field<T>;
    setFilterType: (filterType: FilterType | null) => void;
}

const FilterEntry = <T,>(props: iFilterEntryProps<T>): JSX.Element => {
    const [values, setLocalValues] = useState<ValueType[]>(getValuesForFilterType(props.filterType));
    const setValues = (filterType: FilterType, values: ValueType[]) => {
        const name = getFilterTypeName(filterType);
        const newFilterType = createFilterFromNameAndValues(
            name,
            values
        );
        setLocalValues(values);
        props.setFilterType(newFilterType);
    }
    return <div className='flex flex-row my-1' key={props.index}>
        <div className='input-group w-full'>
            <select className='select bg-accent text-accent-content' onChange={(e) => {
                const valueLen = valuesLengthForFilterTypeName[e.target.value as FilterTypeName];
                const newValues = [];
                while (newValues.length < valueLen) {
                    newValues.push("");
                }
                const newFilterType = createFilterFromNameAndValues(
                    e.target.value as FilterTypeName,
                    newValues
                );
                setLocalValues(newValues);
                props.setFilterType(newFilterType);
            }}
                value={getFilterTypeName(props.filterType)}
            >
                {fieldTypeToFilterType[props.field.type].map((name, i) => <option key={i} value={name}>{name}</option>)}
            </select>
            <FormControl filterType={props.filterType} field={props.field} values={values} setValues={(values) => {setValues(props.filterType, values)}} />
        </div>
        <div className='pt-4 pl-2' onClick={() => {
            props.setFilterType(null);
        }}><CloseIcon /></div>
    </div>;
}