import { getFilteredTasks, updateDbTask } from 'api/task';
import { TaskView } from 'components/TaskView/TaskView';
import { Task } from 'models/frontend/Task/Task';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GiCheckboxTree as TreeIcon } from 'react-icons/gi';

export const SchedulePage = (): JSX.Element => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const refreshTasks = async (): Promise<void> => {
    const tasks = await getFilteredTasks({
      filters: [],
      orderBy: [],
    });
    setTasks(tasks.map((task) => new Task(task)));
  };

  const updateTask = (task: Task): void => {
    updateDbTask(task.generateRecord())
      .then(refreshTasks)
      .catch((e) => toast.error('Unable to update task: ' + JSON.stringify(e)));
  };

  useEffect(() => {
    refreshTasks().catch((e) =>
      toast.error('Unable to get data: ' + JSON.stringify(e))
    );
  }, []);

  return (
    <div>
      {tasks.length === 0 && (
        <div className='m-14 flex flex-col items-center justify-center'>
          <h2 className='text-2xl'>No scheduled tasks yet.</h2>
          <h3 className='my-4 text-xl'>
            Use the Cross Designer to send cross tasks to the scheduler.
          </h3>
          <TreeIcon className='my-4 text-9xl text-base-300' />
        </div>
      )}
      <TaskView refresh={refreshTasks} tasks={tasks} updateTask={updateTask} />
    </div>
  );
};

export default SchedulePage;
