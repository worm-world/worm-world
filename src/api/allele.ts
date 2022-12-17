import { invoke } from '@tauri-apps/api/tauri';
import { db_Allele } from 'models/db/db_Allele';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { Filter, getSingleRecordOrThrow } from 'models/db/filter/Filter';
import { Allele } from 'models/frontend/Allele/Allele';

export const getAlleles = async (): Promise<db_Allele[]> => {
  return await invoke('get_alleles');
};

export const getFilteredAlleles = async (
  filter: Filter<AlleleFieldName>
): Promise<db_Allele[]> => {
  return await invoke('get_filtered_alleles', { filter });
};

export const getAllele = async (name: string): Promise<db_Allele> => {
  const filter: Filter<AlleleFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  const res = await getFilteredAlleles(filter);
  return getSingleRecordOrThrow(
    res,
    `Unable to find any alleles with the name: ${name}`
  );
};

export const insertAllele = async (allele: Allele): Promise<void> => {
  await insertDbAllele(allele.generateRecord());
};

export const insertDbAllele = async (record: db_Allele): Promise<void> => {
  await invoke('insert_allele', { allele: record });
};
