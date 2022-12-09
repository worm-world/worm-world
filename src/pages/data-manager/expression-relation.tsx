import { useEffect, useState } from 'react';
import { getFilteredExpressionRelations } from 'api/expressionRelation';
import { toast } from 'react-toastify';
import { db_ExpressionRelation } from 'models/db/db_ExpressionRelation';
import { Table, ColumnDefinitionType } from 'components/Table/Table';

export const cols: Array<ColumnDefinitionType<db_ExpressionRelation>> = [
  { key: 'alleleName', header: 'Allele Name' },
  { key: 'expressingPhenotypeName', header: 'Expressing Phenotype Name' },
  { key: 'expressingPhenotypeWild', header: 'Expressing Phenotype Wild' },
  { key: 'alteringPhenotypeName', header: 'Altering Phenotype Name' },
  { key: 'alteringPhenotypeWild', header: 'Altering Phenotype Wild' },
  { key: 'alteringCondition', header: 'Altering Condition' },
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
        toast.error('Unable to get expression relations: ' + e.message, {
          toastId: 'expression-relations',
        })
      );
  }, []);

  return (
    <div>
      <h1 className='data-table-title'>Expression Relations</h1>
      <Table data={data} columns={cols} />
    </div>
  );
};

export default DataPage;
