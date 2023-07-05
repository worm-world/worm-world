import { type Task } from 'models/frontend/Task/Task';
import moment from 'moment';
import TaskItem from 'components/TaskItem/TaskItem';

interface TaskListProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
  refresh: () => Promise<void>;
}

const getDateSections = (tasks: Task[]): Map<string, Set<Task>> => {
  const dates = new Map<string, Set<Task>>();
  const format = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' });
  tasks.forEach((task) => {
    if (task.dueDate !== undefined) {
      const dueDate = format.format(task.dueDate);
      if (dates.has(dueDate)) dates.get(dueDate)?.add(task);
      else dates.set(dueDate, new Set([task]));
    }
  });
  return dates;
};

export const TaskList = (props: TaskListProps): React.JSX.Element => {
  const sections = Array.from(getDateSections(props.tasks)).sort(
    ([date1], [date2]) => (moment(date1).isAfter(moment(date2)) ? 1 : -1)
  );
  return (
    <div className='pt-4'>
      {sections.map(([date, section]) => (
        <div key={date}>
          <div className='collapse-arrow collapse'>
            <input type='checkbox' defaultChecked />
            <div className='collapse-title text-xl font-medium'>
              <div className='text-3xl'>
                <span>{date}</span>
                <span className=' mx-3 opacity-40'>|</span>
                <span>
                  {section.size} {section.size === 1 ? ' Task' : ' Tasks'}
                </span>
              </div>
            </div>
            <div className='collapse-content'>
              {Array.from(section).map((task, i) => (
                <div key={i} className='mb-2'>
                  <TaskItem
                    refresh={props.refresh}
                    task={task}
                    updateTask={props.updateTask}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className='divider' />
        </div>
      ))}
    </div>
  );
};
