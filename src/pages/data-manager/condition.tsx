import { db_Condition } from 'models/db/db_Condition';
import { ColumnDefinitionType } from 'components/Table/Table';
import { getFilteredConditions, insertDbCondition } from 'api/condition';
import { Field } from 'components/ColumnFilter/ColumnFilter';
import { ConditionFieldName } from 'models/db/filter/db_ConditionFieldName';
import DataPage from 'components/DataPage/DataPage';

export const cols: Array<ColumnDefinitionType<db_Condition>> = [
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'maleMating', header: 'Male Mating' },
  { key: 'lethal', header: 'Lethal' },
  { key: 'femaleSterile', header: 'Female Sterile' },
  { key: 'arrested', header: 'Arrested' },
  { key: 'maturationDays', header: 'Maturation Days' },
];

const fields: Array<Field<db_Condition>> = [
  {
    name: 'name',
    title: 'Condition Name',
    type: 'text',
  },
  {
    name: 'description',
    title: 'Description',
    type: 'text',
  },
  {
    name: 'maleMating',
    title: 'Male Mating',
    type: 'number',
  },
  {
    name: 'lethal',
    title: 'Lethal Condition',
    type: 'boolean',
  },
  {
    name: 'femaleSterile',
    title: 'Female Sterile',
    type: 'boolean',
  },
  {
    name: 'arrested',
    title: 'Arrested',
    type: 'boolean',
  },
  {
    name: 'maturationDays',
    title: 'Maturation Days',
    type: 'number',
  },
];

const nameMapping: { [key in keyof db_Condition]: ConditionFieldName } = {
  name: 'Name',
  description: 'Description',
  maleMating: 'MaleMating',
  maturationDays: 'MaturationDays',
  lethal: 'Lethal',
  femaleSterile: 'FemaleSterile',
  arrested: 'Arrested',
};

export default function ConditionDataPage(): JSX.Element {
  return (
    <DataPage
      title='Conditions'
      dataName='condition'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredData={getFilteredConditions}
      insertDatum={insertDbCondition}
    />
  );
}
