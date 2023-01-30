import { invoke } from '@tauri-apps/api/tauri';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import {
  FilterGroup,
  getDbBoolean,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { AlleleExpression } from 'models/frontend/AlleleExpression';

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
