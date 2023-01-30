import { ColumnFilter, Field } from './ColumnFilter';
import { Filter } from 'models/db/filter/Filter';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { db_Allele } from 'models/db/db_Allele';
import { useState } from 'react';

interface iColumnFilterWrapperProps<T> {
  field: Field<T>;
  filterTypes?: Filter[];
}

const ColumnFilterWrapper = <T,>(
  props: iColumnFilterWrapperProps<T>
): JSX.Element => {
  const [filterTypes, setFilterTypes] = useState<Filter[]>(
    props.filterTypes ?? new Array<Filter>()
  );
  return (
    <div className='modal-box'>
      <ColumnFilter
        field={props.field}
        columnFilters={filterTypes}
        setColumnFilters={setFilterTypes}
      />
    </div>
  );
};

const field: Field<db_Allele> = {
  name: 'name',
  title: 'Allele Name',
  type: 'text',
};

describe('ColumnFilter', () => {
  it('renders', () => {
    render(<ColumnFilterWrapper field={field} />);
    expect(screen.getByText('Allele Name')).toBeInTheDocument();
  });

  it('renders a text input', () => {
    render(
      <ColumnFilterWrapper field={field} filterTypes={[{ Equal: 'foo' }]} />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a select input', () => {
    const selectField: Field<db_Allele> = {
      ...field,
      type: 'select',
      selectOptions: ['foo', 'bar'],
    };
    render(
      <ColumnFilterWrapper
        field={selectField}
        filterTypes={[{ Equal: 'foo' }]}
      />
    );
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2);
    expect(selects[0].childElementCount).toBeGreaterThan(2); // equal, notEqual, null, notNull
    expect(selects[1].childElementCount).toBe(2); // foo and bar
    for (const child of selects[1].children) {
      expect(child.textContent).toMatch(/foo|bar/);
    }
  });

  it('renders a boolean input', () => {
    const selectField: Field<db_Allele> = { ...field, type: 'boolean' };
    render(<ColumnFilterWrapper field={selectField} filterTypes={['True']} />);
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(1);
    expect(selects[0].childElementCount).toBe(4); // true, false, null, notNull
  });

  it('delete button removes filter', async () => {
    userEvent.setup();
    const filterTypes: Filter[] = [{ Equal: 'foo' }];
    render(<ColumnFilterWrapper field={field} filterTypes={filterTypes} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    await userEvent.click(screen.getByTitle('delete-filter'));
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('add button creates filter', async () => {
    userEvent.setup();
    const filterTypes: Filter[] = [];
    render(<ColumnFilterWrapper field={field} filterTypes={filterTypes} />);
    expect(screen.queryByRole('textbox')).toBeNull();
    await userEvent.click(screen.getByTitle('add-filter'));
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });
});
