import { invoke } from '@tauri-apps/api/tauri';
import { db_Variation } from 'models/db/db_Variation';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import {
  FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { Variation } from 'models/frontend/Variation/Variation';

export const getVariations = async (): Promise<db_Variation[]> => {
  return await invoke('get_variation');
};

export const getFilteredVariations = async (
  filter: FilterGroup<VariationFieldName>
): Promise<db_Variation[]> => {
  return await invoke('get_filtered_variations', {
    filter,
  });
};

export const getCountFilteredVariations = async (
  filter: FilterGroup<VariationFieldName>
): Promise<number> => {
  return await invoke('get_count_filtered_variations', {
    filter,
  });
};

export const getVariation = async (
  alleleName: string
): Promise<db_Variation> => {
  const filter: FilterGroup<VariationFieldName> = {
    filters: [[['AlleleName', { Equal: alleleName }]]],
    orderBy: [],
  };
  const res = await getFilteredVariations(filter);
  return getSingleRecordOrThrow(res, 'Unable to get specified variation');
};

export const insertVariation = async (variation: Variation): Promise<void> => {
  await insertDbVariation(variation.generateRecord());
};

export const insertDbVariation = async (
  record: db_Variation
): Promise<void> => {
  return await invoke('insert_variation', { variation: record });
};

export const insertVariationsFromFile = async (path: string): Promise<void> => {
  await invoke('insert_variations_from_file', { path });
};

export const deleteFilteredVariations = async (
  filter: FilterGroup<VariationFieldName>
): Promise<void> => {
  await invoke('delete_filtered_variations', { filter });
};

export const deleteVariation = async (
  variation: db_Variation
): Promise<void> => {
  const filter: FilterGroup<VariationFieldName> = {
    filters: [[['AlleleName', { Equal: variation.alleleName }]]],
    orderBy: [],
  };

  await deleteFilteredVariations(filter);
};
