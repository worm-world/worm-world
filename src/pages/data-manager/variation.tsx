import { useEffect, useState } from 'react';
import { getFilteredVariations } from 'api/variationInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { Table, ColumnDefinitionType } from 'components/Table/Table';

export const cols: Array<ColumnDefinitionType<db_VariationInfo>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'chromosome', header: 'Chromosome' },
  { key: 'physLoc', header: 'Physical Location' },
  { key: 'geneticLoc', header: 'Genetic Location' },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_VariationInfo[]>([]);

  useEffect(() => {
    getFilteredVariations({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) => toast('Unable to get variations: ' + e.message));
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Variations</h1>
      <ToastContainer />
      <div className='px-4'>
        <Table data={data} columns={cols} />
      </div>
    </div>
  );
};

export default DataPage;
