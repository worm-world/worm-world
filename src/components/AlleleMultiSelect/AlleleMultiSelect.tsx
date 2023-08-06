import { getFilteredAllelesWithGeneFilter } from 'api/allele';
import { getSelectedPills } from 'components/SelectedPill/SelectedPill';
import { type db_Allele } from 'models/db/db_Allele';
import { type db_Gene } from 'models/db/db_Gene';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { type AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { type GeneFieldName } from 'models/db/filter/db_GeneFieldName';
import React, { useState } from 'react';

export interface AlleleMultiSelectProps {
  /** provide the api call that will fetch filtered db records */
  selectedRecords: Set<db_Allele>;
  setSelectedRecords: (newSelected: Set<db_Allele>) => void;
  /** Frontend relationships (e.g. gene-allele) may warrant conditional inclusion */
  shouldInclude?: (option: db_Allele) => boolean;
  /** Mandatory for testing */
  placeholder?: string;

  label?: string;
}

export const AlleleMultiSelect = (
  props: AlleleMultiSelectProps
): React.JSX.Element => {
  const [searchRes, setSearchRes] = useState(new Array<[db_Allele, db_Gene]>());
  const [userInput, setUserInput] = useState('');

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInput(event.target.value);
    if (event.target.value === '') {
      // Keep select option menu empty if nothing is typed
      setSearchRes([]);
      return;
    }
    const alleleFilter: FilterGroup<AlleleFieldName> = {
      filters: [[['Name', { Like: event.target.value }]]],
      orderBy: [],
    };
    const geneFilter: FilterGroup<GeneFieldName> = {
      filters: [[['DescName', { Like: event.target.value }]]],
      orderBy: [],
    };

    // Query from DB and do final filtering on frontend
    const shouldInclude = props.shouldInclude ?? (() => true);
    getFilteredAllelesWithGeneFilter(alleleFilter, geneFilter)
      .then((results) => {
        const includedResults = results.filter((res) => shouldInclude(res[0]));
        setSearchRes(includedResults);
      })
      .catch(console.error);
  };

  const removeFromSelected = (value: db_Allele): void => {
    const newSelectedRecords = new Set<db_Allele>(props.selectedRecords);
    newSelectedRecords.delete(value);
    props.setSelectedRecords(newSelectedRecords);
  };

  return (
    <div>
      {props.label !== undefined && (
        <label htmlFor={`AlleleMultiSelect-${props.label}`} className='label'>
          <span className='label-text'>{props.label}</span>
        </label>
      )}
      <div className='dropdown w-full'>
        <input
          id={`AlleleMultiSelect-${props.label}`}
          type='text'
          placeholder={props.placeholder}
          className='input input-bordered w-full max-w-xs'
          onChange={onInputChange}
          value={userInput}
        />
        {searchRes.length === 0 ? (
          <></> // Don't show list if no results
        ) : (
          <ul className='menu dropdown-content rounded-box z-50 my-2 w-52 overflow-auto bg-base-100 p-2 shadow'>
            {searchRes.map((record, idx) => {
              const [allele, gene] = record;
              const optionText =
                gene.descName !== null
                  ? `${gene.descName}(${allele.name})`
                  : allele.name;
              return (
                <li
                  key={`${record}-${idx}`}
                  tabIndex={0}
                  onClick={() => {
                    setUserInput('');
                    props.setSelectedRecords(
                      new Set(props.selectedRecords).add(allele)
                    );
                    setSearchRes([]);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setUserInput('');
                      props.setSelectedRecords(
                        new Set(props.selectedRecords).add(allele)
                      );
                      setSearchRes([]);
                    }
                  }}
                >
                  <a>{optionText}</a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div
        data-testid='selected-pill-group'
        className='flex max-w-xs flex-wrap'
      >
        {getSelectedPills(props.selectedRecords, removeFromSelected, ['name'])}
      </div>
    </div>
  );
};
