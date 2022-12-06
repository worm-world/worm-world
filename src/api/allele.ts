import { invoke } from '@tauri-apps/api/tauri';
import { db_Allele } from 'models/db/db_Allele';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { Filter } from 'models/db/filter/filter';

export const getAlleles = async (): Promise<db_Allele[]> => {
  try {
    const res = await invoke('get_alleles');
    return res as db_Allele[];
  } catch (err) {
    console.error('Unable to get alleles from db', err);
    return [];
  }
};

export const getFilteredAlleles = async (
  filter: Filter<AlleleFieldName>
): Promise<db_Allele[]> => {
  try {
    const res = await invoke('get_filtered_alleles', {
      filter,
    });
    return res as db_Allele[];
  } catch (err) {
    console.error('Unable to get filtered alleles from db', err);
    return [];
  }
};

export const getAllele = async (
  name: string
): Promise<db_Allele | undefined> => {
  const filter: Filter<AlleleFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  return (await getFilteredAlleles(filter))[0];
};
