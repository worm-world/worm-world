import { invoke } from '@tauri-apps/api/tauri';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { Filter, getDbBoolean } from 'models/db/filter/filter';
import { DBError } from 'models/error';

export const getAlleleExpressions = async (): Promise<
  db_AlleleExpression[] | DBError
> => {
  try {
    const res = await invoke('get_allele_exprs');
    return res as db_AlleleExpression[];
  } catch (err) {
    return new DBError('Unable to get allele expressions from db');
  }
};

export const getFilteredAlleleExpressions = async (
  filter: Filter<AlleleExpressionFieldName>
): Promise<db_AlleleExpression[] | DBError> => {
  try {
    const res = await invoke('get_filtered_allele_exprs', { filter });
    return res as db_AlleleExpression[];
  } catch (err) {
    return new DBError('Unable to get filtered genes from db');
  }
};

export const getAlleleExpression = async (
  alleleName: string,
  expressingPhenotypeName: string,
  expressingPhenotypeWild: boolean
): Promise<db_AlleleExpression | DBError> => {
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
  const canUseRes = !(res instanceof DBError) && res.length > 0;
  return canUseRes
    ? res[0]
    : new DBError('Unable to get specified allele expression');
};
