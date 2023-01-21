import { Filter } from 'models/db/filter/Filter';
import React, { useState } from 'react';
import { getSelectedPills } from 'components/DynamicMultiSelect/SelectedPill';

/**
 * @type T is an autogenerated db_FieldName type
 * @type U is an autogenerated db_Record type
 */
export interface iDynamicMultiSelect<T, U> {
  /** provide the api call that will fetch filtered db records */
  getFilteredRecordApi: (filter: Filter<T>) => Promise<U[]>;
  /** db Field Name you want to search on */
  searchOn: T;
  /** db Record field that corresponds to user input */
  selectInputOn: keyof U;
  /** list of all db Record fields that you want to the result to display as */
  displayResultsOn: Array<keyof U>;
  /** Parent element manages state of selections */
  selectedRecords: Set<U>;
  setSelectedRecords: (newSelected: Set<U>) => void;
  /** Frontend relationships (e.g. gene-allele) may warrant conditional inclusion */
  shouldInclude?: (option: U) => boolean;
  /** Mandatory for testing */
  placeholder?: string;

  label?: string;
}

export const DynamicMultiSelect = <T, U>(
  props: iDynamicMultiSelect<T, U>
): JSX.Element => {
  const [searchRes, setSearchRes] = useState(new Array<U>());
  const [userInput, setUserInput] = useState('');

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInput(event.target.value);
    if (event.target.value === '') {
      // Keep select option menu empty if nothing is typed
      setSearchRes([]);
      return;
    }
    const filter: Filter<T> = {
      filters: [[[props.searchOn, { Like: event.target.value }]]],
      orderBy: [],
    };
    props
      .getFilteredRecordApi(filter)
      .then((results) => {
        const shouldInclude =
          props.shouldInclude != null ? props.shouldInclude : () => true;
        const includedResults: U[] = [];
        results.forEach((result) => {
          if (shouldInclude(result)) {
            includedResults.push(result);
          }
        });
        setSearchRes(includedResults);
      })
      .catch((err) => err);
  };

  const removeFromSelected = (value: U): void => {
    const newSelectedRecords = new Set<U>(props.selectedRecords);
    newSelectedRecords.delete(value);
    props.setSelectedRecords(newSelectedRecords);
  };

  return (
    <>
      {props.label === undefined ? (
        <></> // Don't show label if undefined
      ) : (
        <label className='label'>
          <span className='label-text'>{props.label}</span>
        </label>
      )}
      <div className='dropdown w-full max-w-md'>
        <input
          type='text'
          placeholder={props.placeholder}
          className='input-bordered input w-full max-w-xs'
          onChange={onInputChange}
          value={userInput}
        />
        {searchRes.length === 0 ? (
          <></> // Don't show list if no results
        ) : (
          <ul className='dropdown-content menu rounded-box mt-2 mb-2 w-52  overflow-auto bg-base-100 p-2 shadow'>
            {searchRes.map((record, idx) => {
              return (
                <li
                  key={`${record}-${idx}`}
                  tabIndex={0}
                  onClick={() => {
                    setUserInput('');
                    props.setSelectedRecords(
                      new Set(props.selectedRecords).add(record)
                    );
                    setSearchRes([]);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setUserInput('');
                      props.setSelectedRecords(
                        new Set(props.selectedRecords).add(record)
                      );
                      setSearchRes([]);
                    }
                  }}
                >
                  <a>
                    {props.displayResultsOn
                      .map((field) => record[field] as string)
                      .join(', ')}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className='flex max-w-xs flex-wrap p-2'>
        {getSelectedPills(
          props.selectedRecords,
          removeFromSelected,
          props.displayResultsOn
        )}
      </div>
    </>
  );
};
