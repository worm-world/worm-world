import { getFilteredTasks, getTasks, updateDbTask } from 'api/task';
import { TaskView } from 'components/TaskView/TaskView';
import { Task } from 'models/frontend/Task/Task';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GiCheckboxTree as TreeIcon } from 'react-icons/gi';
import { getTrees } from 'api/crossTree';

export const SchedulePage = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [treeNames, setTreeNames] = useState(new Map<string, string>());
  const [filteredTreeId, setFilteredTreeId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    refreshTasks()
      .then(() => setHasLoadedOnce(true)) // prevents text from flashing on screen while loading tasks from db
      .catch((e) => toast.error('Unable to get data: ' + JSON.stringify(e)));

    refreshTreeNames().catch((e) =>
      toast.error('Unable to get treeIds: ' + JSON.stringify(e))
    );
  }, []);

  const refreshTasks = async (): Promise<void> => {
    const tasks = await getTasks();
    setTasks(tasks.map((task) => new Task(task)));
  };

  const refreshTreeNames = async (): Promise<void> => {
    const trees = await getTrees();
    setTreeNames(new Map(trees.map((tree) => [tree.id, tree.name])));
  };

  const updateTask = (task: Task): void => {
    updateDbTask(task.generateRecord())
      .then(refreshTasks)
      .catch((e) => toast.error('Unable to update task: ' + JSON.stringify(e)));
  };

  const noFilterText = 'No filter';
  const treeIds = new Set<string>(tasks.map((task) => task.treeId));
  const filteredTasks = tasks.filter(
    (task) =>
      filteredTreeId === undefined ||
      filteredTreeId === noFilterText ||
      task.treeId === filteredTreeId
  );

  return (
    <div>
      {tasks.length === 0 && hasLoadedOnce && (
        <div className='m-14 flex flex-col items-center justify-center'>
          <h2 className='text-2xl'>No scheduled tasks yet.</h2>
          <h3 className='my-4 text-xl'>
            Use the Cross Designer to send cross tasks to the scheduler.
          </h3>
          <TreeIcon className='my-4 text-9xl text-base-300' />
        </div>
      )}
      <label className='label'>
        <span className='label-text'>Filter Tasks By Cross Tree</span>
      </label>
      <select
        onChange={(e) => setFilteredTreeId(e.target.value)}
        className='select-primary select w-full max-w-xs'
      >
        <option>{noFilterText}</option>
        {Array.from(treeIds).map((id: string) => {
          return (
            <option key={id} value={id}>
              {treeNames.get(id)}
            </option>
          );
        })}
      </select>
      <TaskView
        refresh={refreshTasks}
        tasks={filteredTasks}
        updateTask={updateTask}
      />
    </div>
  );
};

export default SchedulePage;
