import { invoke } from '@tauri-apps/api';
import { type db_CrossDesign } from 'models/db/db_CrossDesign';
import {
  type FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { type CrossDesignFieldName } from 'models/db/filter/db_CrossDesignFieldName';

export const getCrossDesigns = async (): Promise<db_CrossDesign[]> => {
  return await invoke('get_cross_designs');
};

export const getFilteredCrossDesigns = async (
  filter: FilterGroup<CrossDesignFieldName>
): Promise<db_CrossDesign[]> => {
  return await invoke('get_filtered_cross_designs', {
    filter,
  });
};

export const getCrossDesign = async (id: string): Promise<db_CrossDesign> => {
  const filter: FilterGroup<CrossDesignFieldName> = {
    filters: [[['Id', { Equal: id }]]],
    orderBy: [],
  };
  const res = await getFilteredCrossDesigns(filter);
  return getSingleRecordOrThrow(
    res,
    `Unable to find any cross design with the id: ${id}`
  );
};

export const insertCrossDesign = async (
  record: db_CrossDesign
): Promise<void> => {
  await invoke('insert_cross_design', { crossDesign: record });
};

export const updateCrossDesign = async (
  record: db_CrossDesign
): Promise<void> => {
  await invoke('update_cross_design', { crossDesign: record });
};

export const deleteCrossDesign = async (
  id: string
): Promise<db_CrossDesign[]> => {
  return await invoke('delete_cross_design', { id });
};
