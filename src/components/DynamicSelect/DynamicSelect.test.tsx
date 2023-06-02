import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { type AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { type db_Allele } from 'models/db/db_Allele';
import { getDbAlleles } from 'components/DynamicSelect/DynamicSelect.mock';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import {
  DynamicSelect,
  type DynamicSelectProps,
} from 'components/DynamicSelect/DynamicSelect';

const getAlleleApi = async (
  filter: FilterGroup<AlleleFieldName>
): Promise<db_Allele[]> => {
  return getDbAlleles();
};

describe('DynamicSelect component', () => {
  test('successfully renders', () => {
    const searchProps: DynamicSelectProps<AlleleFieldName, db_Allele> = {
      getFilteredRecord: getAlleleApi,
      searchOn: 'Name',
      selectInputOn: 'name',
      fieldsToDisplay: ['name'],
      selectedRecord: undefined,
      setSelectedRecord: function (record?: db_Allele): void {},
    };
    render(<DynamicSelect {...searchProps} />);

    const search = screen.getByRole('textbox');
    expect(search).toBeDefined();
  });

  test('displays search results', async () => {
    const user = userEvent.setup();

    const searchProps: DynamicSelectProps<AlleleFieldName, db_Allele> = {
      getFilteredRecord: getAlleleApi,
      searchOn: 'Name',
      selectInputOn: 'name',
      fieldsToDisplay: ['name'],
      selectedRecord: undefined,
      setSelectedRecord: function (record?: db_Allele): void {},
    };
    render(<DynamicSelect {...searchProps} />);

    const search = screen.getByRole('textbox');
    await user.type(search, 'allele');

    const selectResults = screen.getAllByRole('listitem');
    expect(selectResults.length).toBeGreaterThan(0);
  });

  test('tab / enter selects an option', async () => {
    const user = userEvent.setup();

    const searchProps: DynamicSelectProps<AlleleFieldName, db_Allele> = {
      getFilteredRecord: getAlleleApi,
      searchOn: 'Name',
      selectInputOn: 'name',
      fieldsToDisplay: ['name'],
      selectedRecord: undefined,
      setSelectedRecord: function (record?: db_Allele): void {},
    };
    render(<DynamicSelect {...searchProps} />);

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
