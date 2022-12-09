import { useEffect, useState } from 'react';
import { getFilteredAlleleExpressions } from 'api/alleleExpressions';
import { toast } from 'react-toastify';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { Table, ColumnDefinitionType } from 'components/Table/Table';

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
        toast.error('Unable to get allele expressions: ' + e.message, {
          toastId: 'allele-expressions',
        })
      );
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Allele Expressions</h1>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;
