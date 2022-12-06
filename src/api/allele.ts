import { invoke } from '@tauri-apps/api/tauri';
import { db_Allele } from 'models/db/db_Allele';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { Filter } from 'models/db/filter/filter';
import { DBError } from 'models/error';

export const getAlleles = async (): Promise<db_Allele[] | DBError> => {
  try {
    const res = await invoke('get_alleles');
    return res as db_Allele[];
  } catch (err) {
    return new DBError('Unable to get alleles from db');
  }
};

export const getFilteredAlleles = async (
  filter: Filter<AlleleFieldName>
): Promise<db_Allele[] | DBError> => {
  try {
    const res = await invoke('get_filtered_alleles', {
      filter,
    });
    return res as db_Allele[];
  } catch (err) {
    return new DBError('Unable to get filtered alleles from db');
  }
};

export const getAllele = async (name: string): Promise<db_Allele | DBError> => {
  const filter: Filter<AlleleFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  const res = await getFilteredAlleles(filter);
  const canUseRes = !(res instanceof DBError) && res.length > 0;
  return canUseRes ? res[0] : new DBError('Unable to get specified allele');
};
