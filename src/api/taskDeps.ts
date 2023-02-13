import { invoke } from '@tauri-apps/api/tauri';
import { FilterGroup } from 'models/db/filter/FilterGroup';
import { TaskDepenencyFieldName } from 'models/db/filter/TaskDepenencyFieldName';
import { iTaskDependency } from 'models/frontend/Task/TaskDependency';

export const getTaskDependencies = async (): Promise<iTaskDependency[]> => {
  return await invoke('get_task_dependancies');
};

export const getFilteredTaskDependencies = async (
  filter: FilterGroup<TaskDepenencyFieldName>
): Promise<iTaskDependency[]> => {
  return await invoke('get_filtered_task_depenency', { filter });
};

export const insertDbTaskDependency = async (
  record: iTaskDependency
): Promise<void> => {
  await invoke('insert_task_depenency', { task: record });
};
