import { useEffect, useState } from 'react';
import { getFilteredGenes } from 'api/gene';
import { toast } from 'react-toastify';
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
      .catch((e: Error) =>
        toast.error('Unable to get genes: ' + e.message, { toastId: 'genes' })
      );
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Gene</h1>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;
