import { useEffect, useState } from 'react';
import { getFilteredAlleleExpressions } from 'api/alleleExpressions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { Table, ColumnDefinitionType } from 'components/Table/Table';

// alleleName: string;
// expressingPhenotypeName: string;
// expressingPhenotypeWild: boolean;
// dominance: number | null;

export const cols: Array<ColumnDefinitionType<db_AlleleExpression>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'expressingPhenotypeName', header: 'Expressing Phenotype Name' },
  { key: 'expressingPhenotypeWild', header: 'Expressing Phenotype Wild' },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_AlleleExpression[]>([]);

  useEffect(() => {
    getFilteredAlleleExpressions({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast('Unable to get AlleleExpressions: ' + e.message)
      );
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Allele Expressions</h1>
      <ToastContainer />
      <div className='px-4'>
        <Table data={data} columns={cols} />
      </div>
    </div>
  );
};

export default DataPage;
