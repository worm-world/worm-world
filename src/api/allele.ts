import { invoke } from '@tauri-apps/api/tauri';
import { db_Allele } from 'models/db/db_Allele';
import { db_Error } from 'models/db/db_Error';
import { AlleleFieldName } from 'models/db/filter/db_AlleleFieldName';
import { Filter, getSingleRecordOrError } from 'models/db/Filter';
import { isDbError } from 'models/error';
import { Allele } from 'models/frontend/Allele';

export const getAlleles = async (): Promise<db_Allele[] | db_Error> => {
  return await invoke('get_alleles');
};

export const getFilteredAlleles = async (
  filter: Filter<AlleleFieldName>
): Promise<db_Allele[] | db_Error> => {
  return await invoke('get_filtered_alleles', { filter });
};

export const getAllele = async (
  name: string
): Promise<db_Allele | db_Error> => {
  const filter: Filter<AlleleFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  const res = await getFilteredAlleles(filter);
  return getSingleRecordOrError(
    res,
    `Unable to find any alleles with the name: ${name}`
  );
};

export const insertAllele = async (
  allele: Allele
): Promise<undefined | db_Error> => {
  const res = await insertDbAllele(allele.generateRecord());
  if (isDbError(res)) return res;
};

export const insertDbAllele = async (
  record: db_Allele
): Promise<undefined | db_Error> => {
  const res = await invoke('insert_allele', { allele: record });
  if (isDbError(res)) return res;
};
