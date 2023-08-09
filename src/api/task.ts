import { invoke } from '@tauri-apps/api/tauri';
import { type TaskFieldName } from 'models/db/filter/db_TaskFieldName';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { type db_Task } from 'models/db/task/db_Task';

export const getTasks = async (): Promise<db_Task[]> => {
  return await invoke('get_tasks');
};

export const getFilteredTasks = async (
  filter: FilterGroup<TaskFieldName>
): Promise<db_Task[]> => {
  return await invoke('get_filtered_tasks', { filter });
};

export const insertTasks = async (records: db_Task[]): Promise<void> => {
  await Promise.all(
    records.map(async (record) => {
      await insertTask(record);
    })
  );
};

export const insertTask = async (record: db_Task): Promise<void> => {
  await invoke('insert_task', { task: record });
};

export const updateTask = async (record: db_Task): Promise<void> => {
  await invoke('update_task', { task: record });
};

export const deleteTasks = async (crossDesign: string): Promise<void> => {
  await invoke('delete_tasks', { crossDesign });
};

export const deleteAllTasks = async (): Promise<void> => {
  await invoke('delete_all_tasks');
};
