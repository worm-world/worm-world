// create a Storybook story for ColumnFilter
import { Meta, StoryFn } from '@storybook/react';
import { db_Allele } from 'models/db/db_Allele';
import { Filter } from 'models/db/filter/Filter';
import { useState } from 'react';
import { ColumnFilter, Field } from 'components/ColumnFilter/ColumnFilter';

interface ColumnFilterWrapperProps<T> {
  field: Field<T>;
}

const ColumnFilterWrapper = <T,>(
  props: ColumnFilterWrapperProps<T>
): JSX.Element => {
  const [filterTypes, setFilterTypes] = useState<Filter[]>(new Array<Filter>());
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

export default {
  title: 'Components/ColumnFilter',
  component: ColumnFilterWrapper,
} as Meta<typeof ColumnFilterWrapper>;

const Template =
  <T,>(): StoryFn<ColumnFilterWrapperProps<T>> =>
  (props) =>
    <ColumnFilterWrapper {...props} />;

const field: Field<db_Allele> = {
  name: 'name',
  title: 'Allele Name',
  type: 'text',
};

export const primary = Template<db_Allele>().bind({});
primary.args = {
  field: field,
};
