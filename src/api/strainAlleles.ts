import { invoke } from '@tauri-apps/api/tauri';
import { db_StrainAllele } from 'models/db/db_StrainAllele';
import { StrainAlleleFieldName } from 'models/db/filter/db_StrainAlleleFieldName';
import {
  FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { StrainAllele } from 'models/frontend/StrainAllele/StrainAllele';

export const getStrainAlleles = async (): Promise<db_StrainAllele[]> => {
  return await invoke('get_strain_alleles');
};

export const getFilteredStrainAlleles = async (
  filter: FilterGroup<StrainAlleleFieldName>
): Promise<db_StrainAllele[]> => {
  return await invoke('get_filtered_strain_alleles', {
    filter,
  });
};

export const getCountFilteredStrainAlleles = async (
  filter: FilterGroup<StrainAlleleFieldName>
): Promise<number> => {
  return await invoke('get_filtered_strain_alleles', {
    filter,
  });
};

export const getStrainAllele = async (
  strain: string
): Promise<db_StrainAllele> => {
  const filter: FilterGroup<StrainAlleleFieldName> = {
    filters: [[['StrainName', { Equal: strain }]]],
    orderBy: [],
  };
  const res = await getFilteredStrainAlleles(filter);
  return getSingleRecordOrThrow(res, 'Unable to get specified strain allele');
};

export const insertStrainAllele = async (
  strainAllele: StrainAllele
): Promise<void> => {
  await insertDbStrainAllele(strainAllele.generateRecord());
};

export const insertDbStrainAllele = async (
  record: db_StrainAllele
): Promise<void> => {
  return await invoke('insert_strain_allele', { strainAllele: record });
};

export const insertStrainAllelesFromFile = async (
  path: string
): Promise<void> => {
  await invoke('insert_strain_alleles_from_file', { path });
};

export const deleteFilteredStrainAlleles = async (
  filter: FilterGroup<StrainAlleleFieldName>
): Promise<void> => {
  await invoke('delete_filtered_strain_alleles', { filter });
};

export const deleteStrainAllele = async (
  strainAllele: db_StrainAllele
): Promise<void> => {
  const filter: FilterGroup<StrainAlleleFieldName> = {
    filters: [[['StrainName', { Equal: strainAllele.strain_name }]]],
    orderBy: [],
  };

  await deleteFilteredStrainAlleles(filter);
};
