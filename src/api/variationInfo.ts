import { invoke } from '@tauri-apps/api/tauri';
import { db_Error } from 'models/db/db_Error';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import { Filter, getSingleRecordOrError } from 'models/db/filter/Filter';

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
