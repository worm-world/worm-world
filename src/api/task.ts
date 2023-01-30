import { invoke } from '@tauri-apps/api/tauri';
import { db_Task } from 'models/db/db_Task';
import { TaskFieldName } from 'models/db/filter/db_TaskFieldName';
import {
  FilterGroup,
  getSingleRecordOrThrow,
} from 'models/db/filter/FilterGroup';

export const getTasks = async (): Promise<db_Task[]> => {
  return await invoke('get_tasks');
};

export const getFilteredTasks = async (
  filter: FilterGroup<TaskFieldName>
): Promise<db_Task[]> => {
  return await invoke('get_filtered_tasks', { filter });
};

// export const getTask = async (name: string): Promise<db_Task> => {
//   const filter: Filter<TaskFieldName> = {
//     filters: [[['id', { Equal: name }]]],
//     orderBy: [],
//   };
//   const res = await getFilteredTasks(filter);
//   return getSingleRecordOrThrow(
//     res,
//     `Unable to find any tasks with the name: ${name}`
//   );
// };

// export const insertTask = async (task: Task): Promise<void> => {
//   await insertDbTask(task.generateRecord());
// };

export const insertDbTask = async (record: db_Task): Promise<void> => {
  await invoke('insert_task', { task: record });
};
