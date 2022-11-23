import { invoke } from '@tauri-apps/api/tauri';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';

export const getAllAlleleExpressionsFromDB = (): db_AlleleExpression[] => {
  invoke('get_allele_exprs')
    .then((res) => {
      return res as db_AlleleExpression[];
    })
    .catch((res) => console.error('Unable to get AlleleExpressions from db'));
  return [];
};

export const getFilteredAlleleExpressionsFromDB = (
  alleleName: String
): db_AlleleExpression[] => {
  return getAllAlleleExpressionsFromDB().filter(
    (expression) => expression.alleleName === alleleName
  );
};
