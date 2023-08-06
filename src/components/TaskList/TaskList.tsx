import { Task } from 'models/frontend/Task/Task';
import moment from 'moment';
import TaskItem, { TaskStatement } from 'components/TaskItem/TaskItem';
import { useState } from 'react';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
interface TaskListProps {
  tasks: Task[];
  updateTask: (task: Task) => void;
  refresh: () => Promise<void>;
  onTaskChecked: (task: Task) => void;
}

const getDateSections = (tasks: Task[]): Map<string, Set<Task>> => {
  const dates = new Map<string, Set<Task>>();
  tasks.forEach((task) => {
    if (task.dueDate !== undefined) {
      const dueDate = task.dueDate.toDateString();
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
  const [task, setTask] = useState<Task>(new Task());

  return (
    <>
      <TaskRescheduleModal
        task={task}
        updateTask={props.updateTask}
        tasks={props.tasks}
      />
      <div className='flex flex-col gap-2'>
        {sections.map(([date, section]) => (
          <div key={date} className='collapse'>
            <input type='checkbox' defaultChecked />
            <div className='collapse-title border-b-2 text-xl'>{date}</div>
            <div className='collapse-content mt-2'>
              {[...section].map((task, idx) => (
                <div key={idx}>
                  {idx !== 0 && <div className='divider m-0' />}
                  <TaskItem
                    refresh={props.refresh}
                    task={task}
                    updateTask={props.updateTask}
                    onTaskChecked={props.onTaskChecked}
                    setTaskToReschedule={setTask}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const TaskRescheduleModal = (props: {
  task: Task;
  updateTask: (task: Task) => void;
  tasks: Task[];
}): React.JSX.Element => {
  const [preview, setPreview] = useState(false);
  const [date, setDate] = useState<Date>(props.task.dueDate ?? new Date());
  const delta =
    props.task.dueDate === undefined
      ? undefined
      : (date.getTime() -
          (date.getTime() % MS_PER_DAY) -
          (props.task.dueDate.getTime() -
            (props.task.dueDate.getTime() % MS_PER_DAY))) /
        MS_PER_DAY;
  const dateValue = date.toISOString().split('T')[0];
  return (
    <div>
      <input
        type='checkbox'
        id={`task-reschedule-modal`}
        className='modal-toggle'
      />
      <div className='modal'>
        <div className='modal-box'>
          {preview ? (
            <div>
              <h2 className='text-xl font-bold'>
                Preview Reschedule Task:{' '}
                <span className='text-primary'>
                  {delta !== undefined
                    ? `${delta >= 0 ? '+' : '-'} ${Math.abs(delta)} ${
                        Math.abs(delta) === 1 ? 'Day' : 'Days'
                      }`
                    : date.toDateString()}
                </span>
              </h2>
              <div className='divider' />
              <TaskDelayPreview
                tasks={props.task.getDescendents(props.tasks)}
                updateTask={function (task: Task): void {
                  throw new Error('Function not implemented.');
                }}
                proposedDelay={delta}
              />
              <div className='modal-action'>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    setPreview(false);
                  }}
                >
                  Back
                </button>
                <button className='btn btn-primary'>Reschedule</button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className='text-xl font-bold'>Reschedule Task</h2>
              <h3>
                <TaskStatement task={props.task ?? new Task()} />
              </h3>
              <div className='divider' />
              <div>
                Current date:{' '}
                {props.task?.dueDate?.toLocaleDateString('en', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </div>
              <div>
                <span>Reschedule to </span>
                <input
                  type='date'
                  value={dateValue}
                  className='border-2 bg-base-100'
                  onChange={(e) => {
                    setDate(new Date(e.target.value));
                  }}
                />
              </div>
              <div className='modal-action'>
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    setPreview(true);
                  }}
                >
                  Preview
                </button>
              </div>
            </div>
          )}
        </div>
        <label className='modal-backdrop' htmlFor='task-reschedule-modal' />
      </div>
    </div>
  );
};

const TaskDelayPreview = (props: {
  updateTask: (task: Task) => void;
  tasks: Task[];
  proposedDelay?: number;
}): React.JSX.Element => {
  const sections = Array.from(getDateSections(props.tasks)).sort(
    ([date1], [date2]) => (moment(date1).isAfter(moment(date2)) ? 1 : -1)
  );
  console.log(props.tasks);
  const getNewDate = (date: string): string => {
    return new Date(
      new Date(date).getTime() + (props.proposedDelay ?? 0) * MS_PER_DAY
    ).toDateString();
  };
  return (
    <>
      <div className='flex flex-col gap-2'>
        {sections.map(([date, section]) => (
          <div key={date}>
            <div className='text-l border-b-2'>
              {date}
              {' \u2192 '}
              <span className='font-bold text-primary'>{getNewDate(date)}</span>
            </div>
            <ul className='list-disc'>
              {[...section].map((task, i) => (
                <li key={i} className='ml-6'>
                  <TaskStatement task={task} />
                  {i !== 0 && <div className='divider m-0' />}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};
