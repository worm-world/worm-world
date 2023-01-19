import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { db_Allele } from 'models/db/db_Allele';
import { getDbAlleles } from 'components/DynamicSearch/DynamicSearch.mock';
import { Filter } from 'models/db/filter/Filter';
import {
  DynamicSearch,
  iSearchProps,
} from 'components/DynamicSearch/DynamicSearch';

const getAlleleApi = async (
  filter: Filter<AlleleFieldName>
): Promise<db_Allele[]> => {
  return getDbAlleles();
};

describe('DynamicSearch component', () => {
  test('successfully renders', () => {
    const searchProps: iSearchProps<AlleleFieldName, db_Allele> = {
      getFilteredRecordApi: getAlleleApi,
      searchOn: 'Name',
      selectInputOn: 'name',
      displayResultsOn: ['name'],
    };
    render(<DynamicSearch {...searchProps} />);

    const search = screen.getByRole('textbox');
    expect(search).toBeDefined();
  });

  test('displays search results', async () => {
    const user = userEvent.setup();

    const searchProps: iSearchProps<AlleleFieldName, db_Allele> = {
      getFilteredRecordApi: getAlleleApi,
      searchOn: 'Name',
      selectInputOn: 'name',
      displayResultsOn: ['name'],
    };
    render(<DynamicSearch {...searchProps} />);

    const search = screen.getByRole('textbox');
    await user.type(search, 'allele');

    const selectResults = screen.getAllByRole('listitem');
    expect(selectResults.length).toBeGreaterThan(0);
  });

  test('tab / enter selects an option', async () => {
    const user = userEvent.setup();

    const searchProps: iSearchProps<AlleleFieldName, db_Allele> = {
      getFilteredRecordApi: getAlleleApi,
      searchOn: 'Name',
      selectInputOn: 'name',
      displayResultsOn: ['name'],
    };
    render(<DynamicSearch {...searchProps} />);

    const search = screen.getByRole('textbox');
    await user.type(search, 'allele');
    let selectResults = screen.getAllByRole('listitem');
    expect(selectResults).toHaveLength(getDbAlleles().length);

    // should no longer show select options
    await user.keyboard('{Tab}{Enter}');
    selectResults = screen.queryAllByRole('listitem');
    expect(selectResults.length).toEqual(0);

    const searchValue = screen.getByDisplayValue(getDbAlleles()[0].name);
    expect(searchValue).toBeDefined();

    const nonSearchValue = screen.queryByDisplayValue(getDbAlleles()[1].name);
    expect(nonSearchValue).toBeNull();
  });
});
