import { invoke } from '@tauri-apps/api/tauri';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import { Filter } from 'models/db/filter/filter';

export const getVariations = async (): Promise<db_VariationInfo[]> => {
  try {
    const res = await invoke('get_variation_info');
    return res as db_VariationInfo[];
  } catch (err) {
    console.error('Unable to get variation records from db', err);
    return [];
  }
};

export const getFilteredVariations = async (
  filter: Filter<VariationFieldName>
): Promise<db_VariationInfo[]> => {
  try {
    const res = await invoke('get_filtered_variation_info', {
      filter,
    });
    return res as db_VariationInfo[];
  } catch (err) {
    console.error('Unable to get filtered variation records from db', err);
    return [];
  }
};

export const getVariation = async (
  alleleName: string
): Promise<db_VariationInfo | undefined> => {
  const filter: Filter<VariationFieldName> = {
    filters: [[['AlleleName', { Equal: alleleName }]]],
    orderBy: [],
  };
  return (await getFilteredVariations(filter))[0];
};
