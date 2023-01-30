import { invoke } from '@tauri-apps/api/tauri';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import {
  FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { VariationInfo } from 'models/frontend/VariationInfo/VariationInfo';

export const getVariations = async (): Promise<db_VariationInfo[]> => {
  return await invoke('get_variation_info');
};

export const getFilteredVariations = async (
  filter: FilterGroup<VariationFieldName>
): Promise<db_VariationInfo[]> => {
  return await invoke('get_filtered_variation_info', {
    filter,
  });
};

export const getVariation = async (
  alleleName: string
): Promise<db_VariationInfo> => {
  const filter: FilterGroup<VariationFieldName> = {
    filters: [[['AlleleName', { Equal: alleleName }]]],
    orderBy: [],
  };
  const res = await getFilteredVariations(filter);
  return getSingleRecordOrThrow(res, 'Unable to get specified variation');
};

export const insertVariation = async (
  variation: VariationInfo
): Promise<void> => {
  await insertDbVariation(variation.generateRecord());
};

export const insertDbVariation = async (
  record: db_VariationInfo
): Promise<void> => {
  return await invoke('insert_variation_info', { variationInfo: record });
};
