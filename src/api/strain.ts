import { invoke } from '@tauri-apps/api/tauri';
import { type db_Strain } from 'models/db/db_Strain';
import { type StrainFieldName } from 'models/db/filter/db_StrainFieldName';
import {
  type FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { type Strain } from 'models/frontend/Strain/Strain';

export const getStrains = async (): Promise<db_Strain[]> => {
  return await invoke('get_strains');
};

export const getFilteredStrains = async (
  filter: FilterGroup<StrainFieldName>
): Promise<db_Strain[]> => {
  return await invoke('get_filtered_strains', {
    filter,
  });
};

export const getCountFilteredStrains = async (
  filter: FilterGroup<StrainFieldName>
): Promise<number> => {
  return await invoke('get_count_filtered_strains', {
    filter,
  });
};

export const getStrain = async (name: string): Promise<db_Strain> => {
  const filter: FilterGroup<StrainFieldName> = {
    filters: [[['Name', { Equal: name }]]],
    orderBy: [],
  };
  const res = await getFilteredStrains(filter);
  return getSingleRecordOrThrow(res, 'Unable to get specified strain');
};

export const insertStrain = async (strain: Strain): Promise<void> => {
  await insertDbStrain(strain.generateRecord());
};

export const insertDbStrain = async (record: db_Strain): Promise<void> => {
  await invoke('insert_strain', { strain: record });
};

export const insertStrainsFromFile = async (path: string): Promise<void> => {
  await invoke('insert_strains_from_file', { path });
};

export const updateStrain = async (
  name: string,
  newStrain: db_Strain
): Promise<void> => {
  await invoke('update_strain', { name, newStrain });
};

export const deleteFilteredStrains = async (
  filter: FilterGroup<StrainFieldName>
): Promise<void> => {
  await invoke('delete_filtered_strains', { filter });
};

export const deleteStrain = async (strain: db_Strain): Promise<void> => {
  const filter: FilterGroup<StrainFieldName> = {
    filters: [[['Name', { Equal: strain.name }]]],
    orderBy: [],
  };

  await deleteFilteredStrains(filter);
};
