import { invoke } from '@tauri-apps/api/tauri';
import { db_Error } from 'models/db/db_Error';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import { Filter, getSingleRecordOrError } from 'models/db/filter/Filter';
import { isDbError } from 'models/error';
import { VariationInfo } from 'models/frontend/VariationInfo';

export const getVariations = async (): Promise<
  db_VariationInfo[] | db_Error
> => {
  return await invoke('get_variation_info');
};

export const getFilteredVariations = async (
  filter: Filter<VariationFieldName>
): Promise<db_VariationInfo[] | db_Error> => {
  return await invoke('get_filtered_variation_info', {
    filter,
  });
};

export const getVariation = async (
  alleleName: string
): Promise<db_VariationInfo | db_Error> => {
  const filter: Filter<VariationFieldName> = {
    filters: [[['AlleleName', { Equal: alleleName }]]],
    orderBy: [],
  };
  const res = await getFilteredVariations(filter);
  return getSingleRecordOrError(res, 'Unable to get specified variation');
};

export const insertVariationInfo = async (
  variation: VariationInfo
): Promise<undefined | db_Error> => {
  const res = await insertDbPhenotype(variation.generateRecord());
  if (isDbError(res)) return res;
};

export const insertDbPhenotype = async (
  record: db_VariationInfo
): Promise<undefined | db_Error> => {
  const res = await invoke('insert_variation_info', { variation_info: record });
  if (isDbError(res)) return res;
};
