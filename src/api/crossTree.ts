import { invoke } from '@tauri-apps/api';
import { db_Tree } from 'models/db/db_Tree';
import {
  FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';
import { TreeFieldName } from 'models/db/filter/db_TreeFieldName';

export const getTrees = async (): Promise<db_Tree[]> => {
  return await invoke('get_trees');
};

export const getFilteredTrees = async (
  filter: FilterGroup<TreeFieldName>
): Promise<db_Tree[]> => {
  return await invoke('get_filtered_trees', {
    filter,
  });
};

export const getTree = async (id: string): Promise<db_Tree> => {
  const filter: FilterGroup<TreeFieldName> = {
    filters: [[['Id', { Equal: id }]]],
    orderBy: [],
  };
  const res = await getFilteredTrees(filter);
  return getSingleRecordOrThrow(
    res,
    `Unable to find any tree with the id: ${id}`
  );
};

export const insertTree = async (record: db_Tree): Promise<void> => {
  await invoke('insert_tree', { tree: record });
};

export const updateTree = async (record: db_Tree): Promise<void> => {
  await invoke('update_tree', { tree: record });
};

export const deleteTree = async (id: string): Promise<db_Tree[]> => {
  return await invoke('delete_tree', { id });
};
