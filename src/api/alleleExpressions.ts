import { invoke } from '@tauri-apps/api/tauri';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { db_Error } from 'models/db/db_Error';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import {
  Filter,
  getDbBoolean,
  getSingleRecordOrError,
} from 'models/db/filter/Filter';
import { isDbError } from 'models/error';
import { AlleleExpression } from 'models/frontend/AlleleExpression';

export const getAlleleExpressions = async (): Promise<
  db_AlleleExpression[] | db_Error
> => {
  return await invoke('get_allele_exprs');
};

export const getFilteredAlleleExpressions = async (
  filter: Filter<AlleleExpressionFieldName>
): Promise<db_AlleleExpression[] | db_Error> => {
  return await invoke('get_filtered_allele_exprs', { filter });
};

export const getAlleleExpression = async (
  alleleName: string,
  expressingPhenotypeName: string,
  expressingPhenotypeWild: boolean
): Promise<db_AlleleExpression | db_Error> => {
  const filter: Filter<AlleleExpressionFieldName> = {
    filters: [
      [
        ['AlleleName', { Equal: alleleName }],
        ['ExpressingPhenotypeName', { Equal: expressingPhenotypeName }],
        ['ExpressingPhenotypeWild', getDbBoolean(expressingPhenotypeWild)],
      ],
    ],
    orderBy: [],
  };

  const res = await getFilteredAlleleExpressions(filter);
  return getSingleRecordOrError(res, 'Unable to find the allele expression');
};

export const insertAlleleExpression = async (
  alleleExpr: AlleleExpression
): Promise<undefined | db_Error> => {
  const res = await insertDbAlleleExpression(alleleExpr.generateRecord());
  if (isDbError(res)) return res;
};

export const insertDbAlleleExpression = async (
  record: db_AlleleExpression
): Promise<undefined | db_Error> => {
  const res = await invoke('insert_allele_expr', { alleleExpr: record });
  if (isDbError(res)) return res;
};
