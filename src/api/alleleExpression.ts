import { invoke } from '@tauri-apps/api/tauri';
import { type db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { type AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import {
  type FilterGroup,
  getDbBoolean,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { type AlleleExpression } from 'models/frontend/AlleleExpression/AlleleExpression';

export const getAlleleExpressions = async (): Promise<
  db_AlleleExpression[]
> => {
  return await invoke('get_allele_exprs');
};

export const getFilteredAlleleExpressions = async (
  filter: FilterGroup<AlleleExpressionFieldName>
): Promise<db_AlleleExpression[]> => {
  return await invoke('get_filtered_allele_exprs', { filter });
};

export const getCountFilteredAlleleExpressions = async (
  filter: FilterGroup<AlleleExpressionFieldName>
): Promise<number> => {
  return await invoke('get_count_filtered_allele_exprs', { filter });
};

export const getAlleleExpression = async (
  alleleName: string,
  expressingPhenotypeName: string,
  expressingPhenotypeWild: boolean
): Promise<db_AlleleExpression> => {
  const filter: FilterGroup<AlleleExpressionFieldName> = {
    filters: [
      [['AlleleName', { Equal: alleleName }]],
      [['ExpressingPhenotypeName', { Equal: expressingPhenotypeName }]],
      [['ExpressingPhenotypeWild', getDbBoolean(expressingPhenotypeWild)]],
    ],
    orderBy: [],
  };

  const res = await getFilteredAlleleExpressions(filter);
  return getSingleRecordOrThrow(res, 'Unable to find the allele expression');
};

export const insertAlleleExpression = async (
  alleleExpr: AlleleExpression
): Promise<void> => {
  await insertDbAlleleExpression(alleleExpr.generateRecord());
};

export const insertDbAlleleExpression = async (
  record: db_AlleleExpression
): Promise<void> => {
  await invoke('insert_allele_expr', { alleleExpr: record });
};

export const insertAlleleExpressionsFromFile = async (
  path: string
): Promise<void> => {
  await invoke('insert_allele_exprs_from_file', { path });
};

export const deleteFilteredAlleleExpressions = async (
  filter: FilterGroup<AlleleExpressionFieldName>
): Promise<void> => {
  await invoke('delete_filtered_allele_exprs', { filter });
};

export const deleteAlleleExpression = async (
  alleleExpr: db_AlleleExpression
): Promise<void> => {
  // filter based on all primary keys
  const filter: FilterGroup<AlleleExpressionFieldName> = {
    filters: [
      [['AlleleName', { Equal: alleleExpr.alleleName }]],
      [
        [
          'ExpressingPhenotypeName',
          { Equal: alleleExpr.expressingPhenotypeName },
        ],
      ],
      [
        [
          'ExpressingPhenotypeWild',
          getDbBoolean(alleleExpr.expressingPhenotypeWild),
        ],
      ],
    ],
    orderBy: [],
  };

  await deleteFilteredAlleleExpressions(filter);
};
