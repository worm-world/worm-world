import { useEffect, useState } from 'react';
import { getFilteredGenes } from 'api/gene';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db_Gene } from 'models/db/db_Gene';
import { Table, ColumnDefinitionType } from 'components/Table/Table';

export const cols: Array<ColumnDefinitionType<db_Gene>> = [
  { key: 'name', header: 'Name' },
  { key: 'chromosome', header: 'Chromosome' },
  { key: 'physLoc', header: 'Physical Location' },
  { key: 'geneticLoc', header: 'Genetic Location' },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Gene[]>([]);

  useEffect(() => {
    getFilteredGenes({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) => toast('Unable to get Genes: ' + e.message));
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Gene</h1>
      <ToastContainer />
      <div className='px-4'>
        <Table data={data} columns={cols} />
      </div>
    </div>
  );
};

export default DataPage;
