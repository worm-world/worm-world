import { invoke } from '@tauri-apps/api/tauri';
import { db_VariationInfo } from 'models/db/db_VariationInfo';
import { VariationFieldName } from 'models/db/filter/db_VariationFieldName';
import { Filter } from 'models/db/filter/filter';
import { DBError } from 'models/error';

export const getVariations = async (): Promise<
  db_VariationInfo[] | DBError
> => {
  try {
    const res = await invoke('get_variation_info');
    return res as db_VariationInfo[];
  } catch (err) {
    return new DBError('Unable to get variation records from db');
  }
};

export const getFilteredVariations = async (
  filter: Filter<VariationFieldName>
): Promise<db_VariationInfo[] | DBError> => {
  try {
    const res = await invoke('get_filtered_variation_info', {
      filter,
    });
    return res as db_VariationInfo[];
  } catch (err) {
    return new DBError('Unable to get filtered variation records from db');
  }
};

export const getVariation = async (
  alleleName: string
): Promise<db_VariationInfo | DBError> => {
  const filter: Filter<VariationFieldName> = {
    filters: [[['AlleleName', { Equal: alleleName }]]],
    orderBy: [],
  };
  const res = await getFilteredVariations(filter);
  const canUseRes = !(res instanceof DBError) && res.length > 0;
  return canUseRes ? res[0] : new DBError('Unable to get specified variation');
};
