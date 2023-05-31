import { invoke } from '@tauri-apps/api/tauri';
import { type FilterGroup } from 'models/db/filter/FilterGroup';
import { type TaskDependencyFieldName } from 'models/db/filter/db_TaskDependencyFieldName';
import { type iTaskDependency } from 'models/frontend/Task/TaskDependency';

export const getTaskDependencies = async (): Promise<iTaskDependency[]> => {
  return await invoke('get_task_dependencies');
};

export const getFilteredTaskDependencies = async (
  filter: FilterGroup<TaskDependencyFieldName>
): Promise<iTaskDependency[]> => {
  return await invoke('get_filtered_task_dependency', { filter });
};

export const insertDbTaskDependency = async (
  record: iTaskDependency
): Promise<void> => {
  await invoke('insert_task_dependency', { task: record });
};
