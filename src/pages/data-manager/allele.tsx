import { useEffect, useState } from 'react';
import { getFilteredAlleles } from 'api/allele';
import { toast } from 'react-toastify';
import { db_Allele } from 'models/db/db_Allele';
import { Table, ColumnDefinitionType } from 'components/Table/Table';

export const cols: Array<ColumnDefinitionType<db_Allele>> = [
  { key: 'name', header: 'Name' },
  { key: 'geneName', header: 'Gene Name' },
  { key: 'variationName', header: 'Variation Name' },
  { key: 'contents', header: 'Contents' },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_Allele[]>([]);

  useEffect(() => {
    getFilteredAlleles({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast.error('Unable to get alleles: ' + e.message, {
          toastId: 'alleles',
        })
      );
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Alleles</h1>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;
