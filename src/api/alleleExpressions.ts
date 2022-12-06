import { invoke } from '@tauri-apps/api/tauri';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { Filter, getDbBoolean } from 'models/db/filter/filter';

export const getAlleleExpressions = async (): Promise<
  db_AlleleExpression[]
> => {
  try {
    const res = await invoke('get_allele_exprs');
    return res as db_AlleleExpression[];
  } catch (err) {
    console.error('Unable to get allele expressions from db', err);
    return [];
  }
};

export const getFilteredAlleleExpressions = async (
  filter: Filter<AlleleExpressionFieldName>
): Promise<db_AlleleExpression[]> => {
  try {
    const res = await invoke('get_filtered_allele_exprs', { filter });
    return res as db_AlleleExpression[];
  } catch (err) {
    console.error('Unable to get filtered genes from db', err);
    return [];
  }
};

export const getAlleleExpression = async (
  alleleName: string,
  expressingPhenotypeName: string,
  expressingPhenotypeWild: boolean
): Promise<db_AlleleExpression | undefined> => {
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

  return (await getFilteredAlleleExpressions(filter))[0];
};
