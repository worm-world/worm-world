import { useEffect, useState } from 'react';
import { getFilteredExpressionRelations } from 'api/expressionRelation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { Table, ColumnDefinitionType } from 'components/Table/Table';

export const cols: Array<ColumnDefinitionType<db_ExpressionRelation>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'expressingPhenotypeName', header: 'Allele Name' },
  { key: 'expressingPhenotypeWild', header: 'Allele Name' },
  { key: 'alteringPhenotypeName', header: 'Allele Name' },
  { key: 'alteringPhenotypeWild', header: 'Allele Name' },
  { key: 'alteringCondition', header: 'Allele Name' },
  { key: 'isSuppressing', header: 'Is Suppressing' },
];

const DataPage = (): JSX.Element => {
  const [data, setData] = useState<db_ExpressionRelation[]>([]);

  useEffect(() => {
    getFilteredExpressionRelations({
      filters: [],
      orderBy: [],
    })
      .then((ds) => setData(ds))
      .catch((e: Error) =>
        toast('Unable to get Expression Relations: ' + e.message)
      );
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Expression Relations</h1>
      <ToastContainer />
      <div className='px-4'>
        <Table data={data} columns={cols} />
      </div>
    </div>
  );
};

export default DataPage;
