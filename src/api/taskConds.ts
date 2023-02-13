import { invoke } from '@tauri-apps/api/tauri';
import { FilterGroup } from 'models/db/filter/FilterGroup';
import { TaskConditionFieldName } from 'models/db/filter/TaskConditionFieldName';
import { iTaskCondition } from 'models/frontend/Task/TaskCondition';

export const getTaskConditions = async (): Promise<iTaskCondition[]> => {
  return await invoke('get_task_conditions');
};

export const getFilteredTaskConditions = async (
  filter: FilterGroup<TaskConditionFieldName>
): Promise<iTaskCondition[]> => {
  return await invoke('get_filtered_task_conditions', { filter });
};

export const insertDbTaskCondition = async (
  record: iTaskCondition
): Promise<void> => {
  await invoke('insert_task_condition', { task: record });
};
