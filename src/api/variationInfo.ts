import { invoke } from '@tauri-apps/api/tauri';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { SpecialFilter } from 'models/db/filter/db_SpecialFilter';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import { Filter, prepareFilter } from '../models/db/filter/filter';

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
      filter: prepareFilter(filter),
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
  const fieldFilters = new Map<VariationFieldName, string[]>();
  fieldFilters.set('AlleleName', [alleleName]);
  const fieldSpecialFilters = new Map<VariationFieldName, SpecialFilter[]>();
  const filter: Filter<VariationFieldName> = {
    fieldFilters,
    fieldSpecialFilters,
    orderBy: [],
  };
  return (await getFilteredVariations(filter))[0];
};
