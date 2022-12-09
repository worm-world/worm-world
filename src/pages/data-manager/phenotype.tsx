import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db_Phenotype } from 'models/db/db_Phenotype';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import { getFilteredPhenotypes, insertDbPhenotype } from 'api/phenotype';
import DataImportForm, {
  FieldType,
} from 'components/DataImportForm/DataImportForm';

export const cols: Array<ColumnDefinitionType<db_Phenotype>> = [
  { key: 'name', header: 'Name' },
  { key: 'wild', header: 'Wild' },
  { key: 'description', header: 'Description' },
  { key: 'maleMating', header: 'Male Mating' },
  { key: 'lethal', header: 'Lethal' },
  { key: 'femaleSterile', header: 'Female Sterile' },
  { key: 'arrested', header: 'Arrested' },
  { key: 'maturationDays', header: 'Maturation Days' },
  { key: 'shortName', header: 'Short Name' },
];

const fields = [
  {
    name: 'name',
    title: 'Phenotype Name',
    type: 'text',
  },
  {
    name: 'shortName',
    title: 'Short-Name',
    type: 'string',
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
    name: 'maturationDays',
    title: 'Maturation Days',
    type: 'number',
  },
  {
    name: 'wild',
    title: 'Is Wild',
    type: 'boolean',
  },
  {
    name: 'lethal',
    title: 'Lethal',
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
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Phenotype[]>([]);
  const onRecordInsertionFormSubmission = (record: db_Phenotype): void => {
    insertDbPhenotype(record)
      .then((resp) => {
        refresh();
      })
      .catch((e: Error) => {
        toast(`An error has occured when inserting data: ${e}`);
      });
  };

  const refresh = (): void => {
    getFilteredPhenotypes({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast.error('Unable to get phenotypes: ' + e.message, {
          toastId: 'phenotypes',
        })
      );
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Phenotypes</h1>
      <DataImportForm
        dataName='Phenotype'
        fields={fields as Array<FieldType<db_Phenotype>>}
        onSubmitCallback={onRecordInsertionFormSubmission}
      ></DataImportForm>
      <br />
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;
