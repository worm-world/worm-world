import { type db_Condition } from 'models/db/db_Condition';
import { type ColumnDefinitionType } from 'components/Table/Table';
import {
  deleteCondition,
  getCountFilteredConditions,
  getFilteredConditions,
  insertConditionsFromFile,
  insertDbCondition,
} from 'api/condition';
import { type Field } from 'components/ColumnFilter/ColumnFilter';
import { type ConditionFieldName } from 'models/db/filter/db_ConditionFieldName';
import DataTablePage from 'components/DataTablePage/DataTablePage';

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

export default function ConditionDataTablePage(): JSX.Element {
  return (
    <DataTablePage
      title='Conditions'
      dataName='condition'
      cols={cols}
      fields={fields}
      nameMapping={nameMapping}
      getFilteredRecords={getFilteredConditions}
      getCountFilteredRecords={getCountFilteredConditions}
      insertRecord={insertDbCondition}
      insertRecordsFromFile={insertConditionsFromFile}
      deleteRecord={deleteCondition}
    />
  );
}
