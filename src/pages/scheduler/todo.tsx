import { getFilteredTasks, updateDbTask } from 'api/task';
import { TaskView } from 'components/TaskView/TaskView';
import { Task } from 'models/frontend/Task/Task';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
      <TaskView tasks={tasks} updateTask={updateTask} />
    </div>
  );
};

export default SchedulePage;
