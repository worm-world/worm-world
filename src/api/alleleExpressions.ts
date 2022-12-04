import { invoke } from '@tauri-apps/api/tauri';
import { db_AlleleExpression } from 'models/db/db_AlleleExpression';
import { AlleleExpressionFieldName } from 'models/db/filter/db_AlleleExpressionFieldName';
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import {
  Filter,
  getDbBoolean,
  prepareFilter,
} from '../models/db/filter/filter';

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
    const res = await invoke('get_filtered_allele_exprs', {
      filter: prepareFilter(filter),
    });
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
  const fieldFilters = new Map<AlleleExpressionFieldName, string[]>();
  fieldFilters.set('AlleleName', [alleleName]);
  fieldFilters.set('ExpressingPhenotypeName', [expressingPhenotypeName]);

  const fieldSpecialFilters = new Map<
    AlleleExpressionFieldName,
    SpecialFilter[]
  >();
  fieldSpecialFilters.set('ExpressingPhenotypeWild', [
    {
      fieldValue: '',
      specialFilterType: getDbBoolean(expressingPhenotypeWild),
    },
  ]);

  const filter: Filter<AlleleExpressionFieldName> = {
    fieldFilters,
    fieldSpecialFilters,
    orderBy: [],
  };
  return (await getFilteredAlleleExpressions(filter))[0];
};
