import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { db_Condition } from 'models/db/db_Condition';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import { getFilteredConditions } from 'api/condition';

export const cols: Array<ColumnDefinitionType<db_Condition>> = [
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'maleMating', header: 'Male Mating' },
  { key: 'lethal', header: 'Lethal' },
  { key: 'femaleSterile', header: 'Female Sterile' },
  { key: 'arrested', header: 'Arrested' },
  { key: 'maturationDays', header: 'Maturation Days' },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Condition[]>([]);

  useEffect(() => {
    getFilteredConditions({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast.error('Unable to get conditions: ' + e.message, {
          toastId: 'conditions',
        })
      );
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Conditions</h1>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;
