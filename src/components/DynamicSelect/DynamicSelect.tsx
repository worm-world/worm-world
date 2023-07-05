import { type FilterGroup } from 'models/db/filter/FilterGroup';
import React, { useState } from 'react';

/**
 * @type T is an autogenerated db_FieldName type
 * @type U is an autogenerated db_Record type
 */
export interface DynamicSelectProps<T, U> {
  userInput: string;
  setUserInput: (input: string) => void;
  selectedRecord?: U;
  setSelectedRecord: (record?: U) => void;
  getFilteredRecord: (filter: FilterGroup<T>) => Promise<U[]>;
  searchOn: T;
  selectInputOn: keyof U;
  fieldsToDisplay: Array<keyof U>;
  placeholder?: string;
  label?: string;
}

export const DynamicSelect = <T, U>(
  props: DynamicSelectProps<T, U>
): React.JSX.Element => {
  const [searchRes, setSearchRes] = useState(new Array<U>());

  const onSelect = (record: U): void => {
    props.setUserInput(record[props.selectInputOn] as string);
    props.setSelectedRecord(record);
    setSearchRes([]);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    props.setUserInput(event.target.value);

    if (event.target.value === '') {
      setSearchRes([]);
      return;
    }

    const filter: FilterGroup<T> = {
      filters: [[[props.searchOn, { Like: event.target.value }]]],
      orderBy: [],
    };

    props.setSelectedRecord(undefined);
    props
      .getFilteredRecord(filter)
      .then((res) => {
        setSearchRes(res);
      })
      .catch((err) => err);
  };

  return (
    <>
      {props.label !== undefined && (
        <label htmlFor={`DynamicSelect-${props.label}`} className='label'>
          <span className='label-text'>{props.label}</span>
        </label>
      )}
      <div className='dropdown w-full max-w-md pb-4'>
        <input
          type='text'
          id={`DynamicSelect-${props.label}`}
          placeholder={props.placeholder}
          className='input-bordered input w-full max-w-xs'
          onChange={onInputChange}
          value={props.userInput}
        />
        {searchRes.length === 0 ? (
          <></> // Don't show list if no results
        ) : (
          <ul className='dropdown-content menu rounded-box z-50 mb-2 mt-2 max-h-80 w-52 overflow-auto bg-base-100 p-2 shadow'>
            {searchRes.map((record, idx) => {
              return (
                <li
                  key={`${record}-${idx}`}
                  tabIndex={0}
                  onClick={() => {
                    onSelect(record);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSelect(record);
                  }}
                >
                  <a>
                    {props.fieldsToDisplay
                      .map((field) => record[field] as string)
                      .join(', ')}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};
