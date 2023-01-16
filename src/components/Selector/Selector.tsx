import Select, { MultiValue, SingleValue } from 'react-select';

export interface Option<T> {
  value: T;
  label: string;
}

export interface MultiselectorProps<T> {
  label: string;
  options: Array<Option<T>>;
  selectedValues: Array<Option<T>>;
  setSelectedValues: Function;
}

export interface SelectorProps<T> {
  label: string;
  options: Array<Option<T>>;
  selectedValue: Option<T>;
  setSelectedValue: Function;
}

export const Multiselector = <T,>(
  props: MultiselectorProps<T>
): JSX.Element => {
  const handleChange = <T,>(newValues: MultiValue<Option<T>>): void => {
    props.setSelectedValues(newValues);
  };

  return (
    <div key={props.label} className='mt-5'>
      <label>{props.label}</label>
      <Select
        value={props.selectedValues}
        options={props.options}
        isMulti
        onChange={handleChange}
      />
    </div>
  );
};

export const Selector = <T,>(props: SelectorProps<T>): JSX.Element => {
  const handleChange = <T,>(newValue: SingleValue<Option<T>>): void => {
    props.setSelectedValue(newValue);
  };

  return (
    <div>
      <label>{props.label}</label>
      <Select
        value={props.selectedValue}
        options={props.options}
        onChange={handleChange}
      />
    </div>
  );
};
