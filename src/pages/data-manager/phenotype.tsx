import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db_Phenotype } from 'models/db/db_Phenotype';
import { Table, ColumnDefinitionType } from 'components/Table/Table';
import { getFilteredPhenotypes } from 'api/phenotype';

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

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Phenotype[]>([]);

  useEffect(() => {
    getFilteredPhenotypes({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) => toast('Unable to get Phenotypes: ' + e.message));
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Phenotypes</h1>
      <ToastContainer />
      <div className='px-4'>
        <Table data={data} columns={cols} />
      </div>
    </div>
  );
};

export default DataPage;
